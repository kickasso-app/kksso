import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import EventsClient from "app/events/[city]/EventsClient";
import EventsIndex from "app/events/page";
import DEFAULT_CITY from "config/default-city";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("components/SelectLocation", () => () => <div data-testid="select-location">SelectLocation</div>);
jest.mock("components/EventCard", () => ({ event }) => <div data-testid="event-card">{event.title}</div>);
jest.mock("react-masonry-css", () => ({ children }) => <div data-testid="masonry-grid">{children}</div>);

describe("Events Route", () => {
  describe("Index Page", () => {
    it("redirects /events to /events/DEFAULT_CITY", () => {
      EventsIndex();
      expect(redirect).toHaveBeenCalledWith(`/events/${DEFAULT_CITY}`);
    });
  });

  describe("EventsClient", () => {
    it("renders events list when data is present", () => {
      const mockEvents = [{ id: 1, title: "Event A" }];
      const city = "paris";

      render(
          <EventsClient events={mockEvents} city={city} />
      );

      expect(screen.getByTestId("masonry-grid")).toBeInTheDocument();
      expect(screen.getByText("Event A")).toBeInTheDocument();
      expect(screen.getByTestId("select-location")).toBeInTheDocument();
    });

    it("renders empty state when no events", () => {
      const city = "paris";
      render(
          <EventsClient events={[]} city={city} />
      );

      expect(
        screen.getByText(/There are no events in the city/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/"Paris"/i)).toBeInTheDocument();
      expect(screen.getByTestId("select-location")).toBeInTheDocument();
    });
  });
});
