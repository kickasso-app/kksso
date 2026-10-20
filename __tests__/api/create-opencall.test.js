import { POST } from "app/api/create-opencall/route";
import { supabaseAdmin } from "services/supabase-admin";
import { __send as mockSend } from "resend";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
    })),
  },
}));

// react-markdown is ESM only and breaks Jest
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
  const insert = jest.fn().mockResolvedValue({ error: null });
  const contactInsert = jest.fn().mockResolvedValue({ error: null });
  const createSignedUploadUrl = jest.fn(async (path) => ({
    data: { path, token: "tok" },
    error: null,
  }));
  return {
    supabaseAdmin: {
      from: jest.fn((table) =>
        table === "contacts" ? { insert: contactInsert } : { insert }
      ),
      storage: { from: jest.fn(() => ({ createSignedUploadUrl })) },
      __insert: insert,
      __contactInsert: contactInsert,
    },
  };
});

const ARTI_UUID = "a67a18aa-551c-4ecf-9281-8f1f6b596ef2";

const validBody = {
  host_name: "Sam",
  host_email: "sam@example.com",
  title: "Open Studio Night",
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
const makeRequest = (body) => ({
  headers: { get: () => `10.0.0.${++ipCounter}` },
  json: async () => body,
});

describe("POST /api/create-opencall", () => {
  beforeEach(() => {
    supabaseAdmin.__insert.mockClear();
    supabaseAdmin.__contactInsert.mockClear();
    mockSend.mockClear();
  });

  it("creates a contact and sends confirmation and admin emails", async () => {
    const res = await POST(makeRequest(validBody));
    const data = await res.json();

    expect(data.emailSent).toBe(true);
    expect(supabaseAdmin.__contactInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        source: "opencall",
        name: "Sam",
        email: "sam@example.com",
        website: "@sam",
      }),
    ]);
    expect(mockSend).toHaveBeenCalledTimes(2);
    const recipients = mockSend.mock.calls.map(([m]) => m.to);
    expect(recipients).toContain("sam@example.com");
    expect(recipients).toContain("hello@arti.my");
    const adminMail = mockSend.mock.calls.find(([m]) => m.to === "hello@arti.my")[0];
    expect(adminMail.reply_to).toBe("sam@example.com");

    // The token is stored but never returned or emailed at submission time.
    const inserted = supabaseAdmin.__insert.mock.calls[0][0][0];
    expect(inserted.edittoken).toMatch(/^[0-9a-f-]{36}$/);
    expect(data).not.toHaveProperty("edittoken");
    expect(JSON.stringify(mockSend.mock.calls)).not.toContain(inserted.edittoken);
  });

  it("still succeeds when the confirmation email fails", async () => {
    mockSend.mockResolvedValueOnce({ data: null, error: { message: "boom" } });
    const res = await POST(makeRequest(validBody));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.emailSent).toBe(false);
  });

  it("sends nothing for honeypot submissions", async () => {
    await POST(makeRequest({ ...validBody, website: "http://spam" }));
    expect(mockSend).not.toHaveBeenCalled();
    expect(supabaseAdmin.__contactInsert).not.toHaveBeenCalled();
  });

  it("inserts an unpublished Arti-owned event and returns signed uploads", async () => {
    const res = await POST(makeRequest({ ...validBody, isPublished: true, studio_uuid: "evil" }));
    const data = await res.json();

    expect(res.status).toBe(201);
    const inserted = supabaseAdmin.__insert.mock.calls[0][0][0];
    expect(inserted.isPublished).toBe(false);
    expect(inserted.studio_uuid).toBe(ARTI_UUID);
    expect(inserted.source).toBe("opencall");
    expect(inserted.type).toBe("Arti Night");
    expect(Object.keys(data.uploads)).toEqual(["event-large.jpg", "event-small.jpg"]);
  });

  it("silently ignores honeypot submissions", async () => {
    const res = await POST(makeRequest({ ...validBody, website: "http://spam" }));
    expect(res.status).toBe(201);
    expect(supabaseAdmin.__insert).not.toHaveBeenCalled();
  });

  it("rejects an invalid country", async () => {
    const res = await POST(makeRequest({ ...validBody, country: "Atlantis" }));
    expect(res.status).toBe(400);
    expect(supabaseAdmin.__insert).not.toHaveBeenCalled();
  });

  it("only accepts dates within the open call range, boundaries included", async () => {
    for (const date of ["2026-11-14", "2026-12-16", "2027-01-01"]) {
      const res = await POST(makeRequest({ ...validBody, date }));
      expect(res.status).toBe(400);
    }
    for (const date of ["2026-11-15", "2026-12-15"]) {
      const res = await POST(makeRequest({ ...validBody, date }));
      expect(res.status).toBe(201);
    }
  });

  it("rejects a missing email", async () => {
    const res = await POST(makeRequest({ ...validBody, host_email: "nope" }));
    expect(res.status).toBe(400);
  });

  it("rate limits repeated submissions from one IP", async () => {
    const req = () => ({ headers: { get: () => "9.9.9.9" }, json: async () => validBody });
    let last;
    for (let i = 0; i < 6; i++) last = await POST(req());
    expect(last.status).toBe(429);
  });
});
