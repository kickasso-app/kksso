import { POST } from "app/api/send-email/route";
import { Resend } from "resend";
import { NextResponse } from "next/server";

// Mock react-markdown because it is ESM only and causes issues with Jest
jest.mock("react-markdown", () => (props) => {
  return <>{props.children}</>;
});

// Mock @react-email/render
jest.mock("@react-email/render", () => ({
  render: jest.fn((element) => Promise.resolve(JSON.stringify(element.props))),
  pretty: jest.fn((text) => Promise.resolve(text)),
}));

// Mock Resend
jest.mock("resend", () => {
  const mockSend = jest
    .fn()
    .mockResolvedValue({ data: { id: "test-id" }, error: null });
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: mockSend,
      },
    })),
  };
});

// Mock NextResponse to avoid environment issues and simplify assertions
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
    })),
  },
}));

// Mock next/cache
jest.mock("next/cache", () => ({
  cacheTag: jest.fn(),
  cacheLife: jest.fn(),
  revalidateTag: jest.fn(),
}));

// Mock services/studios.server
jest.mock("services/studios.server", () => ({
  getStudioByUuid: jest.fn((id) => Promise.resolve({ email: "studio@example.com" })),
}));

describe("/api/send Email Route", () => {
  let mockSend;
  const { getStudioByUuid } = require("services/studios.server");

  beforeAll(() => {
    // Suppress console logs for expected errors
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Check if Resend was instantiated
    if (Resend.mock.calls.length > 0) {
      // Access the return value of the first call
      const instance = Resend.mock.results[0].value;
      if (instance && instance.emails) {
        mockSend = instance.emails.send;
      }
    }

    if (!mockSend) {
      // Use original console if mock setup fails to ensure visibility
      console.error = console.error.getMockImplementation
        ? console.error.getMockImplementation()
        : console.error;
      console.error(
        "Resend mock failed to capture instance. Calls:",
        Resend.mock.calls.length,
        "Results:",
        Resend.mock.results,
      );
    }
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    // Reset the mock state before each test
    if (mockSend) {
      mockSend.mockClear();
      mockSend.mockResolvedValue({ data: { id: "test-id" }, error: null });
    }
    getStudioByUuid.mockClear();
  });

  // const mockSend = ... (REMOVED)
  // Resend.mockImplementation ... (REMOVED)

  const templates = [
    {
      key: "testTemplate",
      variables: { firstName: "John" },
      expectedContent: "John",
      recipient: { type: "user", email: ["test@example.com"] },
      expectedRecipient: ["test@example.com"],
    },
    {
      key: "newsletterTemplate",
      variables: { city: "Berlin" },
      expectedContent: "Berlin",
      recipient: { type: "user", email: ["test@example.com"] },
      expectedRecipient: ["test@example.com"],
    },
    {
      key: "referralTemplate",
      variables: {
        name: "Alice",
        referredBy: "Bob",
        joinLink: "https://arti.my/join",
      },
      expectedContent: "Alice",
      recipient: { type: "user", email: ["test@example.com"] },
      expectedRecipient: ["test@example.com"],
    },
    {
      key: "visitRequest",
      variables: {
        to_name: "Artist",
        from_name: "Fan",
        request_date: "2023-01-01",
        visit_reason: "Love art",
        requestor_link: "http://link",
        request_id: "123",
      },
      expectedContent: "Artist",
      recipient: { type: "studio", id: "studio-uuid" },
      expectedRecipient: ["studio@example.com"],
    },
    {
      key: "visitRequestConfirmation",
      variables: {
        from_name: "Fan",
        to_name: "Artist",
        request_date: "2023-01-01",
        studio_link: "http://studio",
        visit_reason: "Love art",
      },
      expectedContent: "Fan",
      recipient: { type: "user", email: ["test@example.com"] },
      expectedRecipient: ["test@example.com"],
    },
    {
      key: "eventRequest",
      variables: {
        to_name: "Host",
        from_name: "Guest",
        visit_reason: "Party",
        requestor_link: "http://link",
        request_id: "456",
        event_date_time: "2023-01-01",
        event_link: "http://event",
        event_title: "Gala",
      },
      expectedContent: "Host",
      recipient: { type: "studio", id: "studio-uuid" },
      expectedRecipient: ["studio@example.com"],
    },
    {
      key: "eventRequestConfirmation",
      variables: {
        from_name: "Guest",
        to_name: "Host",
        visit_reason: "Party",
        event_date_time: "2023-01-01",
        event_link: "http://event",
        event_title: "Gala",
      },
      expectedContent: "Guest",
      recipient: { type: "user", email: ["test@example.com"] },
      expectedRecipient: ["test@example.com"],
    },
    {
      key: "responseVisitRequest",
      variables: {
        name: "Fan",
        request_date: "2023-01-01",
        studio_name: "Studio A",
        message: "Welcome",
        readableResponse: "Approved",
        studio_link: "http://studio",
        studio_email: "artist@test.com",
      },
      expectedContent: "Fan",
      recipient: { type: "user", email: ["test@example.com"] },
      expectedRecipient: ["test@example.com"],
    },
    {
      key: "responseEventRequest",
      variables: {
        name: "Guest",
        studio_name: "Studio A",
        message: "Come in",
        readableResponse: "Approved",
        studio_email: "host@test.com",
        event_uuid: "789",
        request_date: "2023-01-01",
      },
      expectedContent: "Guest",
      recipient: { type: "user", email: ["test@example.com"] },
      expectedRecipient: ["test@example.com"],
    },
    {
      key: "magicLinkTemplate",
      variables: { magic: "http://login-link" },
      expectedContent: "http://login-link",
      recipient: { type: "user", email: ["test@example.com"] },
      expectedRecipient: ["test@example.com"],
    },
    {
      key: "collectorReferralTemplate",
      variables: {
        name: "Charlie",
        referredBy: "Bob",
        studioLink: "http://studio-link",
        includeStudioLink: true,
      },
      expectedContent: "Charlie",
      recipient: { type: "user", email: ["test@example.com"] },
      expectedRecipient: ["test@example.com"],
    },
  ];

  test.each(templates)(
    "renders and sends email template $key correctly",
    async ({
      key,
      variables,
      expectedContent,
      recipient,
      expectedRecipient,
    }) => {
      const requestBody = {
        emailTemplate: key,
        emailDetails: {
          subject: `Test ${key}`,
          fromEmail: "default",
        },
        emailVariables: variables,
        recipient,
      };

      const req = {
        json: async () => requestBody,
      };

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockSend).toHaveBeenCalledTimes(1);

      const sendArgs = mockSend.mock.calls[0][0];
      expect(sendArgs.to).toEqual(expectedRecipient);
      expect(sendArgs.subject).toEqual(`Test ${key}`);
      expect(sendArgs.from).toEqual("Arti <hello@arti.my>");
      expect(sendArgs.html).toContain(expectedContent);
    },
  );

  test("returns 400 for invalid template", async () => {
    const requestBody = {
      emailTemplate: "invalidTemplate",
      recipient: { type: "user", email: ["test@example.com"] },
      emailDetails: {},
      emailVariables: {},
    };

    const req = {
      json: async () => requestBody,
    };

    const response = await POST(req);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Invalid email template");
  });

  test("handles Resend error correctly", async () => {
    mockSend.mockResolvedValueOnce({
      data: null,
      error: { message: "Failed to send" },
    });

    const requestBody = {
      emailTemplate: "testTemplate",
      recipient: { type: "user", email: ["test@example.com"] },
      emailDetails: { subject: "Error Test" },
      emailVariables: { firstName: "John" },
    };

    const req = {
      json: async () => requestBody,
    };

    const response = await POST(req);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.message).toBe("Failed to send");
  });

  test("handles internal server error", async () => {
    mockSend.mockRejectedValueOnce(new Error("Network error"));

    const requestBody = {
      emailTemplate: "testTemplate",
      recipient: { type: "user", email: ["test@example.com"] },
      emailDetails: {},
      emailVariables: { firstName: "John" },
    };

    const req = {
      json: async () => requestBody,
    };

    const response = await POST(req);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("Error sending email");
  });
});

