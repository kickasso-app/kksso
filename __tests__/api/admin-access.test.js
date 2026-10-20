import { POST as adminEmail } from "app/api/admin/email/route";
import { POST as publicEmail } from "app/api/send-email/route";
import { GET as clearCache } from "app/api/clear-cache/route";
import { supabaseAdmin } from "services/supabase-admin";
import { revalidateTag, revalidatePath } from "next/cache";
import { __send as mockSend } from "resend";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
    })),
  },
}));
jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
  revalidatePath: jest.fn(),
  cacheTag: jest.fn(),
  cacheLife: jest.fn(),
}));
jest.mock("react-markdown", () => (props) => <>{props.children}</>);
jest.mock("@react-email/render", () => ({
  render: jest.fn(() => Promise.resolve("<html />")),
  pretty: jest.fn((text) => Promise.resolve(text)),
}));
jest.mock("services/studios.server", () => ({ getStudioByUuid: jest.fn() }));
jest.mock("resend", () => {
  const mockSend = jest.fn().mockResolvedValue({ data: { id: "id" }, error: null });
  return {
    Resend: jest.fn().mockImplementation(() => ({ emails: { send: mockSend } })),
    __send: mockSend,
  };
});
jest.mock("services/supabase-admin", () => {
  const state = { user: null };
  return {
    supabaseAdmin: {
      auth: {
        getUser: jest.fn(async () =>
          state.user
            ? { data: { user: state.user }, error: null }
            : { data: { user: null }, error: { message: "bad" } }
        ),
      },
      __state: state,
    },
  };
});

const manager = { id: "m", app_metadata: { role: "manager" }, user_metadata: {} };
const selfPromoted = { id: "x", app_metadata: {}, user_metadata: { role: "manager" } };

const bearer = (token = "tok") => ({
  get: (h) => (h.toLowerCase() === "authorization" && token ? `Bearer ${token}` : null),
});
const jsonReq = (body, headers = bearer()) => ({ headers, json: async () => body });
const goodBody = { recipients: ["a@example.com", "b@example.com"], subject: "Hi", markdown: "# Hello" };

beforeEach(() => {
  supabaseAdmin.__state.user = manager;
  mockSend.mockClear();
  revalidateTag.mockClear();
  revalidatePath.mockClear();
  process.env.REVALIDATION_TOKEN = "secret";
});

describe("POST /api/admin/email", () => {
  it("rejects anonymous callers and users who gave themselves the role", async () => {
    expect((await adminEmail(jsonReq(goodBody, bearer(null)))).status).toBe(401);

    supabaseAdmin.__state.user = selfPromoted;
    expect((await adminEmail(jsonReq(goodBody))).status).toBe(403);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("sends one separate email per recipient", async () => {
    const res = await adminEmail(jsonReq(goodBody));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.sent).toBe(2);
    expect(mockSend.mock.calls.map(([m]) => m.to)).toEqual(["a@example.com", "b@example.com"]);
  });

  it("validates recipients, subject and body", async () => {
    expect((await adminEmail(jsonReq({ ...goodBody, recipients: ["nope"] }))).status).toBe(400);
    expect((await adminEmail(jsonReq({ ...goodBody, recipients: [] }))).status).toBe(400);
    expect((await adminEmail(jsonReq({ ...goodBody, subject: " " }))).status).toBe(400);
    expect((await adminEmail(jsonReq({ ...goodBody, markdown: "" }))).status).toBe(400);
    const many = Array.from({ length: 51 }, (_, i) => `u${i}@example.com`);
    expect((await adminEmail(jsonReq({ ...goodBody, recipients: many }))).status).toBe(400);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("reports which recipients failed", async () => {
    mockSend.mockResolvedValueOnce({ data: null, error: { message: "boom" } });
    const res = await adminEmail(jsonReq(goodBody));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.failed).toEqual(["a@example.com"]);
    expect(data.sent).toBe(1);
  });
});

describe("POST /api/send-email (public)", () => {
  it("no longer accepts the generic template", async () => {
    const res = await publicEmail(
      jsonReq({
        emailTemplate: "genericTemplate",
        recipient: { type: "user", email: "victim@example.com" },
        emailDetails: { subject: "Phish", fromEmail: "default" },
        emailVariables: { markdown: "click here" },
      })
    );
    expect(res.status).toBe(400);
    expect(mockSend).not.toHaveBeenCalled();
  });
});

describe("GET /api/clear-cache", () => {
  const cacheReq = (query, headers = { get: () => null }) => ({
    headers,
    nextUrl: { searchParams: new URLSearchParams(query) },
  });

  it("still accepts the secret token", async () => {
    const res = await clearCache(cacheReq("token=secret&tag=events"));
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("events");
  });

  it("accepts a signed-in manager without the token", async () => {
    const res = await clearCache(cacheReq("path=/studios", bearer()));
    expect(res.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith("/studios");
  });

  it("rejects a wrong token, anonymous callers and non-managers", async () => {
    expect((await clearCache(cacheReq("token=wrong&tag=events"))).status).toBe(401);
    expect((await clearCache(cacheReq("tag=events"))).status).toBe(401);

    supabaseAdmin.__state.user = selfPromoted;
    expect((await clearCache(cacheReq("tag=events", bearer()))).status).toBe(403);
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
