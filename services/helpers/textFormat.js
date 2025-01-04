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

const createSlug = (text) => {
  return text.trim().toLowerCase().replaceAll(" ", "-");
};

const undoSlug = (text) => {
  return titleCase(text.trim().replaceAll("-", " "));
};

export { titleCase, untitleCase, createSlug, undoSlug };
