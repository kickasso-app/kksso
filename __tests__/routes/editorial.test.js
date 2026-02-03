import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import EditorialCityClient from "app/editorial/[city]/EditorialCityClient";
import EditorialPage from "app/editorial/page";
import DEFAULT_CITY from "config/default-city";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("components/SelectLocation", () => () => <div data-testid="select-location">SelectLocation</div>);
jest.mock("components/MagazineCard", () => ({ magPost }) => <div data-testid="mag-post-card">{magPost.title}</div>);
jest.mock("layouts/WithFooter", () => ({ children }) => <div data-testid="with-footer">{children}</div>);

describe("Editorial Route", () => {
  describe("Index Page", () => {
    it("redirects /editorial to /editorial/DEFAULT_CITY", () => {
      EditorialPage();
      expect(redirect).toHaveBeenCalledWith(`/editorial/${DEFAULT_CITY}`);
    });
  });

  describe("EditorialCityClient", () => {
    it("renders magazine posts when data is present", () => {
      const mockPosts = [{ id: 1, title: "Article A" }];
      const city = "london";

      render(
          <EditorialCityClient magPosts={mockPosts} city={city} />
      );

      expect(screen.getByTestId("with-footer")).toBeInTheDocument();
      expect(screen.getByText("Article A")).toBeInTheDocument();
      expect(screen.getByTestId("select-location")).toBeInTheDocument();
    });

    it("renders empty state when no posts", () => {
      const city = "london";
      render(
          <EditorialCityClient magPosts={[]} city={city} />
      );

      expect(
        screen.getByText(/There are no articles in the city/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/"London"/i)).toBeInTheDocument();
      expect(screen.getByTestId("select-location")).toBeInTheDocument();
    });
  });
});
