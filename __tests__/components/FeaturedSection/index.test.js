import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FeaturedSection from "components/FeaturedSection";
import { useFeatured } from "services/featured";

jest.mock("next/link", () => ({ children, href }) => <a href={href}>{children}</a>);
jest.mock("next/image", () => (props) => <img {...props} />);

jest.mock("services/featured", () => ({
  useFeatured: jest.fn(),
}));

describe("FeaturedSection", () => {
  const mockFetchFeaturedItems = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when there are no items", () => {
    useFeatured.mockReturnValue({
      featuredItems: [],
      fetchFeaturedItems: mockFetchFeaturedItems,
    });

    const { container } = render(<FeaturedSection />);
    expect(container).toBeEmptyDOMElement();
    expect(mockFetchFeaturedItems).toHaveBeenCalled();
  });

  it("renders a card per item, linking to the right href", () => {
    useFeatured.mockReturnValue({
      featuredItems: [
        {
          key: "studio-1",
          type: "studio",
          href: "/studio/1",
          title: "Jane Doe",
          subtitle: "Berlin",
          photoUrl: "https://chsbkuvxttsertgkuwhy.supabase.co/storage/v1/object/public/photo.jpg",
        },
      ],
      fetchFeaturedItems: mockFetchFeaturedItems,
    });

    render(<FeaturedSection />);

    expect(screen.getByText("Jane Doe, Berlin")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/studio/1");
  });
});
