import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "app/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useParams: () => ({ region: "germany" }),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the useRegions hook
jest.mock("services/region", () => ({
  useRegions: () => ({
    regions: [],
    fetchRegions: jest.fn(),
    selectedRegion: { slugName: "germany" },
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

  it("renders links with correct region slug", () => {
    render(<Page />);
    
    // Check for Explore Studios link
    const studiosLink = screen.getByRole("link", { name: /explore studios/i });
    expect(studiosLink).toHaveAttribute("href", "/studios");

    // Check for Join Events link
    const eventsLink = screen.getByRole("link", { name: /join events/i });
    expect(eventsLink).toHaveAttribute("href", "/events");
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
