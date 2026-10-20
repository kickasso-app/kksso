import React from "react";
import { render, screen } from "@testing-library/react";
import { Grommet } from "grommet";

import AdminGate from "components/AdminGate";
import { useAuth } from "services/auth";

jest.mock("services/auth", () => ({ useAuth: jest.fn() }));

const renderGate = () =>
  render(
    <Grommet>
      <AdminGate title="Secret">content</AdminGate>
    </Grommet>
  );

describe("AdminGate", () => {
  it("shows the page to a manager (app_metadata)", () => {
    useAuth.mockReturnValue({ user: { app_metadata: { role: "manager" } } });
    renderGate();
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("denies a user who only set the role in editable user_metadata", () => {
    useAuth.mockReturnValue({ user: { app_metadata: {}, user_metadata: { role: "manager" } } });
    renderGate();
    expect(screen.queryByText("content")).toBeNull();
    expect(screen.getByText("Access Denied")).toBeInTheDocument();
  });

  it("denies signed-out visitors", () => {
    useAuth.mockReturnValue({ user: null });
    renderGate();
    expect(screen.queryByText("content")).toBeNull();
  });
});
