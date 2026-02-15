import {
  titleCase,
  untitleCase,
  capitalizeFirstLetter,
  createSlug,
  undoSlug,
  makeParagraphs,
} from "../../../services/helpers/textFormat";
import { render, screen } from "@testing-library/react";
import { Paragraph } from "grommet";

// Mock the Grommet Paragraph component to avoid full Grommet rendering issues in unit tests
jest.mock("grommet", () => ({
  Paragraph: ({ children, fill, ...props }) => (
    <p data-testid="mock-paragraph" {...props}>
      {children}
    </p>
  ),
}));

describe("textFormat utility functions", () => {
  describe("titleCase", () => {
    it("should convert a string to title case", () => {
      expect(titleCase("hello world")).toBe("Hello World");
      expect(titleCase("another test string")).toBe("Another Test String");
      expect(titleCase("SINGLE")).toBe("Single");
      expect(titleCase("already Title Case")).toBe("Already Title Case");
      expect(titleCase("  leading and trailing spaces  ")).toBe(
        "Leading And Trailing Spaces"
      );
      expect(titleCase("")).toBe("");
    });
  });

  describe("untitleCase", () => {
    it("should convert a string to lower case", () => {
      expect(untitleCase("Hello World")).toBe("hello world");
      expect(untitleCase("ANOTHER STRING")).toBe("another string");
      expect(untitleCase("single")).toBe("single");
      expect(untitleCase("  Mixed Case String  ")).toBe("mixed case string");
      expect(untitleCase("")).toBe("");
    });
  });

  describe("capitalizeFirstLetter", () => {
    it("should capitalize the first letter of a string", () => {
      expect(capitalizeFirstLetter("hello world")).toBe("Hello world");
      expect(capitalizeFirstLetter("another string")).toBe("Another string");
      expect(capitalizeFirstLetter("SINGLE")).toBe("SINGLE");
      expect(capitalizeFirstLetter("")).toBe("");
      expect(capitalizeFirstLetter("  trimmed string")).toBe("Trimmed string");
    });
  });

  describe("createSlug", () => {
    it("should create a slug from a string", () => {
      expect(createSlug("Hello World")).toBe("hello-world");
      expect(createSlug("Another Test String")).toBe("another-test-string");
      expect(createSlug("Single")).toBe("single");
      expect(createSlug("  spaces and dashes  ")).toBe("spaces-and-dashes");
      expect(createSlug("Special Chars!@#")).toBe("special-chars!@#"); // Assumes special chars are kept
    });

    it("should return undefined for null or empty input", () => {
      expect(createSlug(null)).toBeUndefined();
      expect(createSlug("")).toBeUndefined();
      expect(createSlug(undefined)).toBeUndefined();
    });
  });

  describe("undoSlug", () => {
    it("should convert a slug back to a readable string", () => {
      expect(undoSlug("hello-world")).toBe("hello world");
      expect(undoSlug("another-test-string")).toBe("another test string");
      expect(undoSlug("single")).toBe("single");
      expect(undoSlug("  spaces-and-dashes  ")).toBe("spaces and dashes");
      expect(undoSlug("")).toBe("");
    });
  });

  describe("makeParagraphs", () => {
    it("should return an empty array if paragraphString is null or empty", () => {
      expect(makeParagraphs(null)).toEqual([]);
      expect(makeParagraphs("")).toEqual([]);
      expect(makeParagraphs(undefined)).toEqual([]);
    });

    it("should convert a multi-line string into an array of Paragraph components", () => {
      const multiLineString = "First paragraph.\nSecond paragraph.\r\nThird paragraph.";
      render(<div>{makeParagraphs(multiLineString)}</div>);

      const paragraphs = screen.getAllByTestId("mock-paragraph");
      expect(paragraphs).toHaveLength(3);
      expect(paragraphs[0]).toHaveTextContent("First paragraph.");
      expect(paragraphs[1]).toHaveTextContent("Second paragraph.");
      expect(paragraphs[2]).toHaveTextContent("Third paragraph.");
    });

    it("should capitalize the first letter of each paragraph", () => {
      const multiLineString = "first.\nsecond.";
      render(<div>{makeParagraphs(multiLineString)}</div>);

      const paragraphs = screen.getAllByTestId("mock-paragraph");
      expect(paragraphs[0]).toHaveTextContent("First.");
      expect(paragraphs[1]).toHaveTextContent("Second.");
    });

    it("should apply default margin if none is provided", () => {
      const singleLineString = "Hello.";
      render(<div>{makeParagraphs(singleLineString)}</div>);
      const paragraph = screen.getByTestId("mock-paragraph");
      expect(paragraph).toHaveAttribute("margin", "[object Object]"); // Jest stringifies objects
    });

    it("should apply custom paragraph separator", () => {
      const customSeparatorString = "One--Two--Three";
      const customSeparator = /--/;
      render(<div>{makeParagraphs(customSeparatorString, customSeparator)}</div>);

      const paragraphs = screen.getAllByTestId("mock-paragraph");
      expect(paragraphs).toHaveLength(3);
      expect(paragraphs[0]).toHaveTextContent("One");
      expect(paragraphs[1]).toHaveTextContent("Two");
      expect(paragraphs[2]).toHaveTextContent("Three");
    });
  });
});
