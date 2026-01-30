import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "app/page";

// Mock the useCities hook
jest.mock("services/city", () => ({
  useCities: () => ({
    selectedCity: { slugName: "berlin" },
  }),
}));

// Mock next/image since it is used in LandingClient
// Although next/jest mocks it, explicit mocks can sometimes be safer if we want to control behavior,
// but for now let's rely on next/jest's auto-mocking or a simple override if needed.
// Actually, next/jest should handle it.

describe("Landing Page", () => {
  it("renders the main heading", () => {
    render(<Page />);

    // LandingClient has <Heading level={2}>Discover Your Local Art Scene</Heading>
    const heading = screen.getByRole("heading", {
      level: 2,
      name: /Discover Your Local Art Scene/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
