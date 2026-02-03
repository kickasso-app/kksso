import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import StudiosClient from "app/studios/[city]/StudiosClient";
import StudiosIndex from "app/studios/page";
import DEFAULT_CITY from "config/default-city";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("components/StudiosFilter", () => () => <div data-testid="studios-filter">StudiosFilter</div>);
jest.mock("components/SelectLocation", () => () => <div data-testid="select-location">SelectLocation</div>);

describe("Studios Route", () => {
  describe("Index Page", () => {
    it("redirects /studios to /studios/DEFAULT_CITY", () => {
      StudiosIndex();
      expect(redirect).toHaveBeenCalledWith(`/studios/${DEFAULT_CITY}`);
    });
  });

  describe("StudiosClient", () => {
    it("renders studios list when data is present", () => {
      const mockStudios = [{ id: 1, name: "Studio A" }];
      const city = "berlin";

      render(
          <StudiosClient studios={mockStudios} city={city} />
      );

      expect(screen.getByTestId("studios-filter")).toBeInTheDocument();
      expect(screen.queryByText(/There are no studios/i)).not.toBeInTheDocument();
    });

    it("renders empty state when no studios", () => {
      const city = "berlin";
      render(
          <StudiosClient studios={[]} city={city} />
      );

      expect(
        screen.getByText(/There are no studios in the city/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/"Berlin"/i)).toBeInTheDocument();
      expect(screen.getByTestId("select-location")).toBeInTheDocument();
    });
  });
});
