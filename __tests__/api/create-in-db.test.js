import { POST as createContact } from "app/api/create-contact/route";
import { POST as createRequest } from "app/api/create-request/route";
import { POST as createStudio } from "app/api/create-studio/route";
import { POST as createEvent } from "app/api/create-event/route";

// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
    })),
  },
}));

// Mock Supabase client with exposed spies
jest.mock("@supabase/supabase-js", () => {
  const mockInsert = jest.fn();
  const mockSelect = jest.fn();
  const mockFrom = jest.fn(() => ({
    insert: mockInsert,
    select: mockSelect,
  }));

  return {
    createClient: jest.fn(() => ({
      from: mockFrom,
    })),
    // Expose spies for test files to use
    __mocks: {
      mockInsert,
      mockSelect,
      mockFrom,
    },
  };
});

import { createSupabaseMock } from "../utils/supabaseMock";

describe("Database Creation APIs", () => {
  let mockInsert;
  let mockSelect;
  let mockFrom;

  // Standardized payload naming
  const contactPayload = {
    newContact: { email: "test@test.com", name: "Test" },
  };
  const requestPayload = {
    newRequest: {
      request_id: "123",
      studio_uuid: "abc",
      requestor_email: "test@test.com",
    },
  };
  const studioPayload = {
    newProfile: { email: "studio@test.com", studio_id: "std_123" },
  };
  const eventPayload = { newEvent: { title: "Art Show" } };

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Retrieve the exposed spies from the mocked module
    const mockedModule = require("@supabase/supabase-js");
    mockInsert = mockedModule.__mocks.mockInsert;
    mockSelect = mockedModule.__mocks.mockSelect;
    mockFrom = mockedModule.__mocks.mockFrom;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockInsert.mockResolvedValue({ data: [], error: null });
    mockSelect.mockResolvedValue({ data: [], error: null });

    // Ensure the chaining works for createStudio
    mockInsert.mockReturnValue({ select: mockSelect });
  });

  describe("POST /api/create-contact", () => {
    test("creates contact successfully", async () => {
      mockInsert.mockImplementation(() =>
        createSupabaseMock({ data: [], error: null }, mockSelect)
      );

      const req = { json: async () => contactPayload };

      const res = await createContact(req);
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(mockFrom).toHaveBeenCalledWith("contacts");
      expect(mockInsert).toHaveBeenCalledWith([contactPayload.newContact]);
      expect(data.message).toBe("Contact created successfully");
    });

    test("returns 400 if email is missing", async () => {
      const invalidPayload = { newContact: { name: "Test" } };
      const req = { json: async () => invalidPayload };

      const res = await createContact(req);

      expect(res.status).toBe(400);
      expect(mockInsert).not.toHaveBeenCalled();
    });

    test("handles database error", async () => {
      const errorResult = { error: { message: "DB Error" } };
      mockInsert.mockImplementation(() => createSupabaseMock(errorResult, mockSelect));

      const req = { json: async () => contactPayload };

      const res = await createContact(req);
      const data = await res.json();

      expect(res.status).toBe(500);
      expect(data.error).toBe("DB Error");
    });
  });

  describe("POST /api/create-request", () => {
    test("creates request successfully", async () => {
      mockInsert.mockImplementation(() => createSupabaseMock({ error: null }, mockSelect));

      const req = { json: async () => requestPayload };

      const res = await createRequest(req);

      expect(res.status).toBe(201);
      expect(mockFrom).toHaveBeenCalledWith("requests");
      expect(mockInsert).toHaveBeenCalledWith([requestPayload.newRequest]);
    });

    test("returns 400 if required fields are missing", async () => {
      const invalidPayload = { newRequest: { request_id: "123" } }; // Missing others
      const req = { json: async () => invalidPayload };

      const res = await createRequest(req);

      expect(res.status).toBe(400);
      expect(mockInsert).not.toHaveBeenCalled();
    });
  });

  describe("POST /api/create-studio", () => {
    test("creates studio successfully", async () => {
      const mockUser = { id: 1, email: "studio@test.com" };

      // For createStudio: insert().select()
      mockInsert.mockReturnValue({
        select: mockSelect,
      });
      mockSelect.mockResolvedValue({ data: [mockUser], error: null });

      const req = { json: async () => studioPayload };

      const res = await createStudio(req);
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(mockFrom).toHaveBeenCalledWith("studios");
      expect(mockInsert).toHaveBeenCalledWith([studioPayload.newProfile]);
      expect(mockSelect).toHaveBeenCalled();
      expect(data.user).toEqual(mockUser);
    });

    test("returns 400 if email/id missing", async () => {
      const invalidPayload = { newProfile: { email: "studio@test.com" } }; // Missing ID
      const req = { json: async () => invalidPayload };

      const res = await createStudio(req);

      expect(res.status).toBe(400);
      expect(mockInsert).not.toHaveBeenCalled();
    });
  });

  describe("POST /api/create-event", () => {
    test("creates event successfully", async () => {
      mockInsert.mockImplementation(() => createSupabaseMock({ error: null }, mockSelect));

      const req = { json: async () => eventPayload };

      const res = await createEvent(req);

      expect(res.status).toBe(201);
      expect(mockFrom).toHaveBeenCalledWith("events");
      expect(mockInsert).toHaveBeenCalledWith([eventPayload.newEvent]);
    });

    test("handles database error", async () => {
      mockInsert.mockImplementation(() =>
        createSupabaseMock({ error: { message: "DB Error" } }, mockSelect)
      );

      const req = { json: async () => eventPayload };

      const res = await createEvent(req);

      expect(res.status).toBe(500);
    });
  });
});
