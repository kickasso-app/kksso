import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import EventsClient from "app/events/[region]/EventsClient";
import EventsIndex from "app/events/page";
import DEFAULT_REGION from "config/default-region";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("components/SelectRegion", () => () => <div data-testid="select-region">SelectRegion</div>);
jest.mock("components/EventCard", () => ({ event }) => <div data-testid="event-card">{event.title}</div>);
jest.mock("react-masonry-css", () => ({ children }) => <div data-testid="masonry-grid">{children}</div>);

describe("Events Route", () => {
  describe("Index Page", () => {
    it("redirects /events to /events/DEFAULT_REGION", () => {
      EventsIndex();
      expect(redirect).toHaveBeenCalledWith(`/events/${DEFAULT_REGION}`);
    });
  });

  describe("EventsClient", () => {
    it("renders events list when data is present", () => {
      const mockEvents = [{ id: 1, title: "Event A" }];
      const region = "portugal";

      render(
        <EventsClient events={mockEvents} region={region} />
      );

      expect(screen.getByTestId("masonry-grid")).toBeInTheDocument();
      expect(screen.getByText("Event A")).toBeInTheDocument();
      expect(screen.getByTestId("select-region")).toBeInTheDocument();
    });

    it("renders empty state when no events", () => {
      const region = "portugal";
      render(
        <EventsClient events={[]} region={region} />
      );

      expect(
        screen.getByText(/There are no events in/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/"Portugal"/i)).toBeInTheDocument();
      expect(screen.getByTestId("select-region")).toBeInTheDocument();
    });
  });
});