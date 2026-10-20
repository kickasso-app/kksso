import { GET, PUT } from "app/api/update-opencall/route";
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
  const state = { existing: null };
  const updateEq2 = jest.fn().mockResolvedValue({ error: null });
  const update = jest.fn(() => ({ eq: jest.fn(() => ({ eq: updateEq2 })) }));
  const select = jest.fn(() => {
    const chain = {
      eq: jest.fn(() => chain),
      maybeSingle: jest.fn(async () => ({ data: state.existing, error: null })),
    };
    return chain;
  });
  const createSignedUploadUrl = jest.fn(async (path) => ({
    data: { path, token: "tok" },
    error: null,
  }));
  return {
    supabaseAdmin: {
      from: jest.fn(() => ({ select, update })),
      storage: { from: jest.fn(() => ({ createSignedUploadUrl })) },
      __state: state,
      __update: update,
      __select: select,
      __sign: createSignedUploadUrl,
    },
  };
});

const TOKEN = "3f1b6c52-8a4e-4f0a-9d2e-1c7b5a9e4d10";

const existing = {
  id: "event-id",
  host_email: "sam@example.com",
  isPublished: false,
};

const body = {
  edittoken: TOKEN,
  host_name: "Sam",
  host_email: "attacker@example.com",
  title: "New title",
  type: "Arti Night",
  date: "2026-12-01",
  time: "6-8 pm",
  city: "Berlin",
  country: "Germany",
  location: "Studio",
  link: "@sam",
  miniDescription: "Short",
  longDescription: "Long",
};

let ipCounter = 0;
const req = (json, query = "") => ({
  headers: { get: () => `10.1.0.${++ipCounter}` },
  nextUrl: { searchParams: new URLSearchParams(query) },
  json: async () => json,
});

describe("/api/update-opencall", () => {
  beforeEach(() => {
    supabaseAdmin.__state.existing = existing;
    supabaseAdmin.__update.mockClear();
    supabaseAdmin.__select.mockClear();
    supabaseAdmin.__sign.mockClear();
    revalidateTag.mockClear();
    mockSend.mockClear();
  });

  it("GET returns the event for a valid token", async () => {
    const res = await GET(req(null, `edittoken=${TOKEN}`));
    expect(res.status).toBe(200);
    expect((await res.json()).event.id).toBe("event-id");
  });

  it("GET never queries with a malformed token", async () => {
    const res = await GET(req(null, "edittoken=not-a-uuid"));
    expect(res.status).toBe(404);
    expect(supabaseAdmin.__select).not.toHaveBeenCalled();
  });

  it("GET returns 404 when no event matches", async () => {
    supabaseAdmin.__state.existing = null;
    const res = await GET(req(null, `edittoken=${TOKEN}`));
    expect(res.status).toBe(404);
  });

  it("PUT updates the event and ignores a changed email", async () => {
    const res = await PUT(req(body));
    expect(res.status).toBe(200);

    const updates = supabaseAdmin.__update.mock.calls[0][0];
    expect(updates.title).toBe("New title");
    expect(updates).not.toHaveProperty("isPublished");
    expect(updates).not.toHaveProperty("host_email");
    expect(updates).not.toHaveProperty("studio_uuid");
    expect(updates).not.toHaveProperty("edittoken");

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend.mock.calls[0][0].to).toBe("hello@arti.my");
    expect(mockSend.mock.calls[0][0].reply_to).toBe("sam@example.com");
  });

  it("PUT keeps a published event live and revalidates the cache", async () => {
    supabaseAdmin.__state.existing = { ...existing, isPublished: true };
    const res = await PUT(req(body));
    const data = await res.json();

    expect(supabaseAdmin.__update.mock.calls[0][0]).not.toHaveProperty("isPublished");
    expect(data.wasPublished).toBe(true);
    expect(revalidateTag).toHaveBeenCalledWith("events", { expire: 0 });
  });

  it("PUT returns upsert upload URLs only when replacing the photo", async () => {
    const without = await (await PUT(req(body))).json();
    expect(without.uploads).toBeUndefined();

    const withPhoto = await (await PUT(req({ ...body, replacePhoto: true }))).json();
    expect(Object.keys(withPhoto.uploads)).toEqual(["event-large.jpg", "event-small.jpg"]);
    expect(supabaseAdmin.__sign).toHaveBeenCalledWith(expect.any(String), { upsert: true });
  });

  it("PUT rejects an unknown token and invalid data", async () => {
    supabaseAdmin.__state.existing = null;
    expect((await PUT(req(body))).status).toBe(404);

    supabaseAdmin.__state.existing = existing;
    expect((await PUT(req({ ...body, country: "Atlantis" }))).status).toBe(400);
    expect((await PUT(req({ ...body, date: "2027-01-05" }))).status).toBe(400);
    expect(supabaseAdmin.__update).not.toHaveBeenCalled();
  });
});
