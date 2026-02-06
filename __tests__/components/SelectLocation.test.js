import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SelectLocation from "components/SelectLocation";

// Mock variables to control mock behavior
let mockPathname = "/studios/berlin";
let mockRouterPush = jest.fn();
let mockSelectCity = jest.fn();
let mockFetchCities = jest.fn();
let mockCities = [
  { city: "Berlin", slugName: "berlin", count: 10, published: true },
  { city: "London", slugName: "london", count: 5, published: true },
  { city: "Paris", slugName: "paris", count: 0, published: true }, // Count 0 should be filtered
  { city: "Tokyo", slugName: "tokyo", count: 2, published: false }, // Published false should be disabled
];

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
  usePathname: () => mockPathname,
}));

// Mock services/city
jest.mock("services/city", () => ({
  useCities: () => ({
    cities: mockCities,
    fetchCities: mockFetchCities,
    selectCity: mockSelectCity,
    selectedCity: { city: "Berlin", slugName: "berlin" },
  }),
}));

// Mock Grommet's ResponsiveContext if needed (though we can probably let it default)
// For now, let's just rely on default rendering of Grommet components (or mock them if they cause issues)
// Grommet components usually render fine in JSDOM if not using complex layout calculations that require real browser layout.

describe("SelectLocation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = "/studios/berlin"; // Reset pathname
    mockCities = [
      { city: "Berlin", slugName: "berlin", count: 10, published: true },
      { city: "London", slugName: "london", count: 5, published: true },
      { city: "Paris", slugName: "paris", count: 0, published: true },
      { city: "Tokyo", slugName: "tokyo", count: 2, published: false },
    ];
  });

  it("renders a list of cities with count > 0", () => {
    render(<SelectLocation />);

    // Berlin and London should be visible
    expect(screen.getByText(/Berlin/i)).toBeInTheDocument();
    expect(screen.getByText(/London/i)).toBeInTheDocument();

    // Paris has count 0, should not be rendered
    expect(screen.queryByText(/Paris/i)).not.toBeInTheDocument();
  });

  it("shows 'soon' for unpublished cities and disables them", () => {
    // Tokyo is unpublished but count > 0 (2).
    // Logic: cities.filter(({ count }) => count > 0).map(...)
    // Tokyo should be rendered.
    // Logic inside map: disabled={published === false}
    // Logic for text: {city} {published || "(soon)"}

    render(<SelectLocation />);

    // Check for Tokyo text. Since published is false, it renders "(soon)"?
    // published || "(soon)" -> false || "(soon)" -> "(soon)"
    const tokyoButton = screen.getByText(/Tokyo \(soon\)/i);
    expect(tokyoButton).toBeInTheDocument();

    // Check if button is disabled.
    const buttonElement = tokyoButton.closest("button");
    expect(buttonElement).toBeDisabled();
  });

  it("calls selectCity and navigates when a city is clicked on a subpage", async () => {
    mockPathname = "/events/berlin"; // We are on events page
    render(<SelectLocation />);

    const londonButton = screen.getByText(/London/i).closest("button");

    fireEvent.click(londonButton);

    await waitFor(() => {
      expect(mockSelectCity).toHaveBeenCalledWith("london");
    });

    // baseRedirect calculation: "/events/berlin".split("/") -> ["", "events", "berlin"]
    // [1] is "events". baseRedirect is "/events/"
    // Expected push: "/events/london"
    expect(mockRouterPush).toHaveBeenCalledWith("/events/london");
  });

  it("calls selectCity but does NOT navigate when on root path", async () => {
    mockPathname = "/"; // Root path
    render(<SelectLocation />);

    const londonButton = screen.getByText(/London/i).closest("button");

    fireEvent.click(londonButton);

    await waitFor(() => {
      expect(mockSelectCity).toHaveBeenCalledWith("london");
    });

    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it("calls fetchCities on mount if cities are empty", async () => {
    mockCities = [];
    render(<SelectLocation />);
    await waitFor(() => {
      expect(mockFetchCities).toHaveBeenCalled();
    });
  });
});
