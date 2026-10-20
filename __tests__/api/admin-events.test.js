import { GET, PATCH } from "app/api/admin/events/route";
import { supabaseAdmin } from "services/supabase-admin";
import { revalidateTag } from "next/cache";
import { __send as mockSend } from "resend";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
    })),
  },
}));

jest.mock("next/cache", () => ({ revalidateTag: jest.fn() }));
jest.mock("react-markdown", () => (props) => <>{props.children}</>);
jest.mock("@react-email/render", () => ({
  render: jest.fn(() => Promise.resolve("<html />")),
  pretty: jest.fn((text) => Promise.resolve(text)),
}));
jest.mock("resend", () => {
  const mockSend = jest.fn().mockResolvedValue({ data: { id: "id" }, error: null });
  return {
    Resend: jest.fn().mockImplementation(() => ({ emails: { send: mockSend } })),
    __send: mockSend,
  };
});

jest.mock("services/supabase-admin", () => {
  const state = { user: null, list: [], one: null };
  const updateEq = jest.fn().mockResolvedValue({ error: null });
  const update = jest.fn(() => ({ eq: updateEq }));
  const select = jest.fn(() => {
    const chain = {
      eq: jest.fn(() => chain),
      maybeSingle: jest.fn(async () => ({ data: state.one, error: null })),
      then: (resolve) => resolve({ data: state.list, error: null }),
    };
    return chain;
  });
  return {
    supabaseAdmin: {
      auth: {
        getUser: jest.fn(async () =>
          state.user
            ? { data: { user: state.user }, error: null }
            : { data: { user: null }, error: { message: "bad" } }
        ),
      },
      from: jest.fn(() => ({ select, update })),
      __state: state,
      __update: update,
    },
  };
});

const manager = { id: "u1", app_metadata: { role: "manager" }, user_metadata: {} };
const ID = "3f1b6c52-8a4e-4f0a-9d2e-1c7b5a9e4d10";

const req = (body, token = "tok") => ({
  headers: { get: (h) => (h.toLowerCase() === "authorization" && token ? `Bearer ${token}` : null) },
  json: async () => body,
});

describe("/api/admin/events", () => {
  beforeEach(() => {
    supabaseAdmin.__state.user = manager;
    supabaseAdmin.__state.list = [];
    supabaseAdmin.__state.one = null;
    supabaseAdmin.__update.mockClear();
    revalidateTag.mockClear();
    mockSend.mockClear();
  });

  describe("access", () => {
    it("rejects requests without a token", async () => {
      expect((await GET(req(null, null))).status).toBe(401);
    });

    it("rejects an invalid session", async () => {
      supabaseAdmin.__state.user = null;
      expect((await GET(req())).status).toBe(401);
    });

    it("rejects users who only set role in editable user_metadata", async () => {
      supabaseAdmin.__state.user = { id: "u2", app_metadata: {}, user_metadata: { role: "manager" } };
      expect((await GET(req())).status).toBe(403);
      expect((await PATCH(req({ id: ID }))).status).toBe(403);
      expect(supabaseAdmin.__update).not.toHaveBeenCalled();
    });
  });

  describe("GET", () => {
    it("splits events and sorts each section", async () => {
      supabaseAdmin.__state.list = [
        { id: "a", isPublished: false, created_at: "2026-10-03T00:00:00Z", date: "2026-12-01" },
        { id: "b", isPublished: null, created_at: "2026-10-01T00:00:00Z", date: "2026-12-10" },
        { id: "c", isPublished: true, created_at: "2026-10-01T00:00:00Z", date: "2026-12-09" },
        { id: "d", isPublished: true, created_at: "2026-10-05T00:00:00Z", date: "2026-11-20" },
        { id: "e", isPublished: true, created_at: "2026-10-06T00:00:00Z", date: null },
      ];
      const data = await (await GET(req())).json();

      expect(data.pending.map((e) => e.id)).toEqual(["b", "a"]);
      expect(data.approved.map((e) => e.id)).toEqual(["d", "c", "e"]);
    });
  });

  describe("PATCH (approve)", () => {
    const pendingEvent = {
      id: ID,
      title: "Studio Night",
      date: "2026-12-01",
      time: "6-8 pm",
      host_name: "Sam",
      host_email: "sam@example.com",
      edittoken: "edit-token-1",
      isPublished: false,
    };

    it("publishes, clears the cache and emails the host both links", async () => {
      supabaseAdmin.__state.one = pendingEvent;
      const res = await PATCH(req({ id: ID }));
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.emailSent).toBe(true);
      expect(supabaseAdmin.__update).toHaveBeenCalledWith({ isPublished: true, edittoken: "edit-token-1" });
      expect(revalidateTag).toHaveBeenCalledWith("events", { expire: 0 });

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend.mock.calls[0][0].to).toBe("sam@example.com");
    });

    it("gives older events without a token a new one", async () => {
      supabaseAdmin.__state.one = { ...pendingEvent, edittoken: null };
      await PATCH(req({ id: ID }));
      const updates = supabaseAdmin.__update.mock.calls[0][0];
      expect(updates.edittoken).toMatch(/^[0-9a-f-]{36}$/);
    });

    it("still approves when the email fails and says so", async () => {
      supabaseAdmin.__state.one = pendingEvent;
      mockSend.mockResolvedValueOnce({ data: null, error: { message: "boom" } });
      const data = await (await PATCH(req({ id: ID }))).json();
      expect(data.emailSent).toBe(false);
      expect(supabaseAdmin.__update).toHaveBeenCalled();
    });

    it("does not re-approve or re-email an approved event", async () => {
      supabaseAdmin.__state.one = { ...pendingEvent, isPublished: true };
      const data = await (await PATCH(req({ id: ID }))).json();
      expect(data.alreadyApproved).toBe(true);
      expect(supabaseAdmin.__update).not.toHaveBeenCalled();
      expect(mockSend).not.toHaveBeenCalled();
    });

    it("rejects bad ids and unknown events", async () => {
      expect((await PATCH(req({ id: "nope" }))).status).toBe(400);
      supabaseAdmin.__state.one = null;
      expect((await PATCH(req({ id: ID }))).status).toBe(404);
    });
  });
});
