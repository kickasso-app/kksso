import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Grommet } from "grommet";

import EventsCurateClient from "app/profile/admin/events/EventsCurateClient";

jest.mock("services/auth", () => ({
  useAuth: () => ({
    session: { access_token: "tok" },
    user: { id: "u1", app_metadata: { role: "manager" }, user_metadata: {} },
  }),
}));

const pending = {
  id: "11111111-1111-4111-8111-111111111111",
  title: "Pending Night",
  host_name: "Sam",
  host_email: "sam@example.com",
  link: "@sam",
  country: "Germany",
  date: "2026-12-01",
  created_at: "2026-10-03T10:00:00Z",
  isPublished: false,
  edittoken: "tok-pending",
};
const approved = {
  ...pending,
  id: "22222222-2222-4222-8222-222222222222",
  title: "Approved Night",
  isPublished: true,
  edittoken: "tok-approved",
};

beforeEach(() => {
  global.fetch = jest.fn(async (url, init) => {
    if (init?.method === "PATCH") {
      return { ok: true, json: async () => ({ message: "Approved", emailSent: true }) };
    }
    return { ok: true, json: async () => ({ pending: [pending], approved: [approved] }) };
  });
});

const renderBoard = () =>
  render(
    <Grommet>
      <EventsCurateClient />
    </Grommet>
  );

describe("EventsCurateClient", () => {
  it("lists both sections with compact details", async () => {
    renderBoard();
    await screen.findByText("Pending Night");

    expect(screen.getByText(/Waiting for approval \(1\)/)).toBeInTheDocument();
    expect(screen.getByText(/Approved \(1\)/)).toBeInTheDocument();

    // Row 1: "Event name by Host Name"; row 2: event and submitted dates
    expect(screen.getByText("Pending Night").parentElement.textContent).toBe("Pending Night by Sam");
    expect(screen.getAllByText("Event 1 Dec 2026 · Submitted 3 Oct 2026")).toHaveLength(2);
  });

  it("has website and email icon links in the third row", async () => {
    renderBoard();
    await screen.findByText("Pending Night");

    // "@sam" is an Instagram handle
    const websites = screen.getAllByRole("link", { name: "Website" });
    expect(websites[0].getAttribute("href")).toBe("https://instagram.com/sam");
    const emails = screen.getAllByRole("link", { name: "Email" });
    expect(emails[0].getAttribute("href")).toBe("mailto:sam@example.com");
  });

  it("has icon buttons for preview and edit, and approve only on pending events", async () => {
    renderBoard();
    await screen.findByText("Pending Night");

    const previews = screen.getAllByRole("link", { name: "Preview" });
    const edits = screen.getAllByRole("link", { name: "Edit" });
    expect(previews.map((a) => a.getAttribute("href"))).toEqual([
      `/event/preview/${pending.id}`,
      `/event/preview/${approved.id}`,
    ]);
    expect(edits.map((a) => a.getAttribute("href"))).toEqual([
      "/night/update?edittoken=tok-pending",
      "/night/update?edittoken=tok-approved",
    ]);

    expect(screen.getAllByRole("button", { name: "Approve" })).toHaveLength(1);
    expect(screen.getByText("Approved", { selector: "span" })).toBeInTheDocument();
  });

  it("filters both sections by country, showing all by default", async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        pending: [pending, { ...pending, id: "33333333-3333-4333-8333-333333333333", title: "Cairo Night", country: "Egypt" }],
        approved: [approved],
      }),
    }));
    renderBoard();
    await screen.findByText("Pending Night");

    // All countries by default
    expect(screen.getByText(/Waiting for approval \(2\)/)).toBeInTheDocument();
    expect(screen.getByText(/Approved \(1\)/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Filter by country/ }));
    fireEvent.click(await screen.findByRole("option", { name: "Egypt" }));

    expect(screen.getByText(/Waiting for approval \(1\)/)).toBeInTheDocument();
    expect(screen.getByText("Cairo Night")).toBeInTheDocument();
    expect(screen.queryByText("Pending Night")).toBeNull();
    expect(screen.getByText(/Approved \(0\)/)).toBeInTheDocument();
  });

  it("sends the access token and approves", async () => {
    renderBoard();
    await screen.findByText("Pending Night");

    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    await waitFor(() =>
      expect(screen.getByText(/is approved and Sam was emailed/)).toBeInTheDocument()
    );

    const patch = global.fetch.mock.calls.find(([, init]) => init?.method === "PATCH");
    expect(patch[1].headers.Authorization).toBe("Bearer tok");
    expect(JSON.parse(patch[1].body)).toEqual({ id: pending.id });
  });
});
