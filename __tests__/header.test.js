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
}));

// Mock services
jest.mock("services/city", () => ({
  useCities: () => ({
    selectedCity: { slugName: "berlin", city: "Berlin" },
  }),
}));

jest.mock("services/auth", () => ({
  useAuth: () => ({
    session: null,
    user: null,
  }),
}));

describe("Header", () => {
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
