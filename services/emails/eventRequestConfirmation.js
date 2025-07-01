import * as React from "react";
import { emailStyles } from "./emailStyles";

export const EventRequestConfirmation = ({
  from_name,
  to_name,
  studio_link,
  visit_reason,
  event_date_time,
}) => (
  <html>
    <head>
      <style>{emailStyles.toString()}</style>
    </head>
    <body>
      <div id="emailstyles">
        <h1>Hello, {from_name}!</h1>
        <p>
          We sent your request to join the event at {to_name}'s studio on {event_date_time}.
        </p>
        <p>
          Studio link:{" "}
          <a href={studio_link} target="_blank">
            {studio_link}
          </a>
          <br />
          Reason to join: {visit_reason}
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