import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "app/page";

// Mock the useCities hook
jest.mock("services/city", () => ({
  useCities: () => ({
    selectedCity: { slugName: "berlin" },
  }),
}));

// Mock next/image to inspect props for CLS tests
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ priority, ...props }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} data-priority={priority ? "true" : "false"} />;
  },
}));

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

  describe("Hero Banner - CLS Optimization ", () => {
    it("renders both mobile and desktop banners to prevent hydration mismatch", () => {
      render(<Page />);

      const images = screen.getAllByRole("img", { name: /banner/i });
      expect(images).toHaveLength(2);

      const mobileBannerImg = images[0];
      const desktopBannerImg = images[1];

      const mobileParent = mobileBannerImg.closest("div");
      const desktopParent = desktopBannerImg.closest("div");

      expect(mobileParent).toBeInTheDocument();
      expect(desktopParent).toBeInTheDocument();
      expect(mobileParent).not.toBe(desktopParent);
    });

    it("uses priority loading for LCP images", () => {
      render(<Page />);
      const images = screen.getAllByRole("img", { name: /banner/i });

      images.forEach((img) => {
        expect(img).toHaveAttribute("data-priority", "true");
      });
    });
  });
});
