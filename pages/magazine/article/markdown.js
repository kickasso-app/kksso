import React from "react";
import ReactMarkdown from "react-markdown";
// import ReactDom from "react-dom";

const MagazinePostMarkdown = ({ markdown }) => {
  return <ReactMarkdown children={markdown} />;
};

export default MagazinePostMarkdown;
