import * as React from "react";
import ReactMarkdown from "react-markdown";
import { emailStyles } from "./emailStyles";

export const GenericTemplate = ({
  markdown
}) => (
  <html>
    <head>
      <style>{emailStyles.toString()}</style>
    </head>
    <body>
      <div id="emailstyles">
        <ReactMarkdown>{markdown}</ReactMarkdown>
        <img src="https://arti.my/img/logo-name-web.png"></img>
      </div>
    </body>
  </html>
);
