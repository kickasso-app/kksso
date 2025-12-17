import React from "react";
import ReactMarkdown from "react-markdown";

const MagazinePostMarkdown = ({ markdown }) => {
  return <ReactMarkdown children={markdown} />;
};

export default MagazinePostMarkdown;
