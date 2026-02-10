import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import StudiosClient from "app/studios/[region]/StudiosClient";
import StudiosIndex from "app/studios/page";
import DEFAULT_REGION from "config/default-region";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("components/StudiosFilter", () => () => <div data-testid="studios-filter">StudiosFilter</div>);
jest.mock("components/SelectRegion", () => () => <div data-testid="select-region">SelectRegion</div>);

describe("Studios Route", () => {
  describe("Index Page", () => {
    it("redirects /studios to /studios/DEFAULT_REGION", () => {
      StudiosIndex();
      expect(redirect).toHaveBeenCalledWith(`/studios/${DEFAULT_REGION}`);
    });
  });

  describe("StudiosClient", () => {
    it("renders studios list when data is present", () => {
      const mockStudios = [{ id: 1, name: "Studio A" }];
      const region = "germany";

      render(
        <StudiosClient studios={mockStudios} region={region} />
      );

      expect(screen.getByTestId("studios-filter")).toBeInTheDocument();
      expect(screen.queryByText(/There are no studios/i)).not.toBeInTheDocument();
    });

    it("renders empty state when no studios", () => {
      const region = "germany";
      render(
        <StudiosClient studios={[]} region={region} />
      );

      expect(
        screen.getByText(/There are no studios in/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/"Germany"/i)).toBeInTheDocument();
      expect(screen.getByTestId("select-region")).toBeInTheDocument();
    });
  });
});