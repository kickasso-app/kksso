import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import EditorialClient from "app/editorial/EditorialClient";
import EditorialPage from "app/editorial/page";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("services/editorial.server", () => ({
  getMagazinePosts: jest.fn(() => Promise.resolve([])),
}));

// Mock the async server component to be a simple synchronous component
jest.mock("app/editorial/EditorialResults", () => {
  return function DummyEditorialResults() {
    return <div data-testid="editorial-results">EditorialResults</div>;
  };
});

jest.mock("components/SelectRegion", () => () => <div data-testid="select-region">SelectRegion</div>);
jest.mock("components/MagazineCard", () => ({ magPost }) => <div data-testid="mag-post-card">{magPost.title}</div>);
jest.mock("layouts/WithFooter", () => ({ children }) => <div data-testid="with-footer">{children}</div>);

describe("Editorial Route", () => {
  describe("Index Page", () => {
    it("renders without crashing", () => {
      render(<EditorialPage />);
      // Since EditorialResults is async server component, testing it directly in unit test might be tricky without mocking.
      // But EditorialPage is synchronous wrapper. 
      // However, EditorialResults is async.
      // Let's just check if it renders without error or mock EditorialResults if needed.
      // For now, simple render check.
    });
  });

  describe("EditorialClient", () => {
    it("renders magazine posts when data is present", () => {
      const mockPosts = [{ id: 1, title: "Article A" }];

      render(
          <EditorialClient magPosts={mockPosts} />
      );

      expect(screen.getByTestId("with-footer")).toBeInTheDocument();
      expect(screen.getByText("Article A")).toBeInTheDocument();
    });

    it("renders empty state when no posts", () => {
      render(
          <EditorialClient magPosts={[]} />
      );

      expect(
        screen.getByText(/There are no articles at the moment/i)
      ).toBeInTheDocument();
    });
  });
});