import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Header from "layouts/Header";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
  useParams: () => ({ region: "germany" }),
}));

// Mock services
jest.mock("services/region", () => ({
  useRegions: () => ({
    regions: [],
    fetchRegions: jest.fn(),
  }),
}));

jest.mock("services/auth", () => ({
  useAuth: () => ({
    session: null,
    user: null,
  }),
}));

describe("Header", () => {
  it("renders navigation links with region slug", () => {
    render(<Header />);

    // Check for Studios link
    const studiosLink = screen.getAllByText(/Studios/i)[0].closest("a");
    expect(studiosLink).toHaveAttribute("href", "/studios/germany");

    // Check for Events link
    const eventsLink = screen.getAllByText(/Events/i)[0].closest("a");
    expect(eventsLink).toHaveAttribute("href", "/events/germany");
  });

  describe("Responsive Navigation - CLS Optimization", () => {
    it("renders both mobile and desktop header structures to prevent hydration mismatch", () => {
      render(<Header />);

      // Check for mobile trigger (menu button)
      const menuButton = screen.getByRole("button", { name: /open menu/i });
      expect(menuButton).toBeInTheDocument();

      // Check for desktop nav links (e.g. "Join")
      // Since menuOpen is false, mobile "Join" is not rendered.
      // So if "Join" exists, it must be desktop.
      const joinLinks = screen.getAllByText(/Join/i);
      expect(joinLinks.length).toBeGreaterThan(0);
    });
  });
});
