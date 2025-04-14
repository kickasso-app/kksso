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
  if (!text) return;
  else return text.trim().toLowerCase().replaceAll(" ", "-");
};

const undoSlug = (text) => {
  return text.trim().replaceAll("-", " ");
};

export { titleCase, untitleCase, createSlug, undoSlug };
