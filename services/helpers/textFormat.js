import { Paragraph } from "grommet";

const titleCase = (text) => {
  return text
    .trim()
    .split(" ")
    .map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
    .join(" ");
};

const untitleCase = (text) => {
  return text.trim().toLowerCase();
};

const capitalizeFirstLetter = (text) => {
  return text.trim().charAt(0).toUpperCase() + text.trim().slice(1);
};

const createSlug = (text) => {
  if (!text) return;
  else return text.trim().toLowerCase().replaceAll(" ", "-");
};

const undoSlug = (text) => {
  return text.trim().replaceAll("-", " ");
};

const paragraphSeperator = /\r\n|\n|\r/;

const makeParagraphs = (
  paragraphString,
  pSeparator = paragraphSeperator,
  paragraphMargin = { top: "small", bottom: "small" }
) => {
  if (!paragraphString) return [];
  return paragraphString.split(pSeparator).map((paragraph, index) => {
    const formattedParagraph =
      paragraph.trim().charAt(0).toUpperCase() + paragraph.trim().slice(1);
    return (
      <Paragraph key={index} size="medium" margin={paragraphMargin} fill>
        {formattedParagraph}
      </Paragraph>
    );
  });
};

export {
  titleCase,
  untitleCase,
  createSlug,
  undoSlug,
  makeParagraphs,
  capitalizeFirstLetter,
};
