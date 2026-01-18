import * as React from "react";
import { emailStyles } from "./emailStyles";

export const EventRequestConfirmation = ({
  from_name,
  to_name,
  visit_reason,
  event_date_time,
  event_link,
  event_title,
}) => (
  <html>
    <head>
      <style>{emailStyles.toString()}</style>
    </head>
    <body>
      <div id="emailstyles">
        <h1>Hello, {from_name}!</h1>
        <p>
          We sent your request to join {to_name}'s event on {event_date_time}.
        </p>
        <p>
          Event link: <a href={event_link}>{event_title}</a>
        </p>
        <p>Reason to join: {visit_reason}</p>
        <p>
          If this is not an open event, please wait for the artist or space to
          reply to you.
        </p>
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
