import * as React from "react";
import { emailStyles } from "./emailStyles";

export const VisitRequestConfirmation = ({
  from_name,
  to_name,
  request_date,
  studio_link,
  visit_reason,
}) => (
  <html>
    <head>
      <style>{emailStyles.toString()}</style>
    </head>
    <body>
      <div id="emailstyles">
        <h1>Hello, {from_name}!</h1>
        <p>
          We sent your studio visit request to {to_name}'s studio on{" "}
          {request_date}.
        </p>
        <p>
          Studio link:{" "}
          <a href={studio_link} target="_blank">
            {studio_link}
          </a>
          <br />
          Reason of visit: {visit_reason}
        </p>
        <p>Please wait when the artist confirms or replies to you.</p>
        <p>
          Best wishes,
          <br />
          Arti team
        </p>
        <img src="https://arti.my/img/logo-name-web.png"></img>
      </div>
    </body>
  </html>
);
