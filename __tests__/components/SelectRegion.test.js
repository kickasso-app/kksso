import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SelectRegion from "components/SelectRegion";
import { useRouter, usePathname } from "next/navigation";
import { useRegions } from "services/region";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock services/region
jest.mock("services/region", () => ({
  useRegions: jest.fn(),
}));

describe("SelectRegion", () => {
  const mockRouterPush = jest.fn();
  const mockSelectRegion = jest.fn();
  const mockFetchRegions = jest.fn();
  
  let mockRegions = [
    { name: "Germany", slugName: "germany", count: 10, published: true },
    { name: "United Kingdom", slugName: "united-kingdom", count: 5, published: true },
    { name: "France", slugName: "france", count: 0, published: true },
    { name: "Japan", slugName: "japan", count: 2, published: false },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup useRouter mock
    useRouter.mockReturnValue({
      push: mockRouterPush,
    });

    // Setup usePathname mock default
    usePathname.mockReturnValue("/studios/germany");

    // Setup useRegions mock
    useRegions.mockReturnValue({
      regions: mockRegions,
      fetchRegions: mockFetchRegions,
      selectRegion: mockSelectRegion,
      selectedRegion: { name: "Germany", slugName: "germany" },
      loading: false,
      error: null,
    });
  });

  it("renders a list of regions with count > 0", () => {
    render(<SelectRegion />);

    // Berlin and United Kingdom should be visible
    expect(screen.getByText(/Germany/i)).toBeInTheDocument();
    expect(screen.getByText(/United Kingdom/i)).toBeInTheDocument();

    // France has count 0, should not be rendered
    expect(screen.queryByText(/France/i)).not.toBeInTheDocument();
  });

  it("shows 'soon' for unpublished regions and disables them", () => {
    render(<SelectRegion />);

    const japanButton = screen.getByText(/Japan \(soon\)/i);
    expect(japanButton).toBeInTheDocument();
    
    // Check if button is disabled.
    const buttonElement = japanButton.closest("button");
    expect(buttonElement).toBeDisabled();
  });

  it("calls selectRegion and navigates when a region is clicked on a subpage", async () => {
    usePathname.mockReturnValue("/events/germany");
    
    render(<SelectRegion />);

    const ukButton = screen.getByText(/United Kingdom/i).closest("button");

    fireEvent.click(ukButton);

    await waitFor(() => {
      expect(mockSelectRegion).toHaveBeenCalledWith("united-kingdom");
    });

    expect(mockRouterPush).toHaveBeenCalledWith("/events/united-kingdom");
  });

  it("calls selectRegion but does NOT navigate when on root path", async () => {
    usePathname.mockReturnValue("/");
    
    render(<SelectRegion />);

    const ukButton = screen.getByText(/United Kingdom/i).closest("button");

    fireEvent.click(ukButton);

    await waitFor(() => {
      expect(mockSelectRegion).toHaveBeenCalledWith("united-kingdom");
    });

    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it("calls fetchRegions on mount if regions are empty", async () => {
    useRegions.mockReturnValue({
      regions: [],
      fetchRegions: mockFetchRegions,
      selectRegion: mockSelectRegion,
      selectedRegion: null,
      loading: false,
      error: null,
    });

    render(<SelectRegion />);
    await waitFor(() => {
      expect(mockFetchRegions).toHaveBeenCalled();
    });
  });
});