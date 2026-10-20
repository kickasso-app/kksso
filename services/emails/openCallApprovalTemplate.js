import * as React from "react";
import { emailStyles } from "./emailStyles";

export const OpenCallApproval = ({
  name,
  event_title,
  event_date_time,
  event_link,
  edit_link,
}) => (
  <html>
    <head>
      <style>{emailStyles.toString()}</style>
    </head>
    <body>
      <div id="emailstyles">
        <h1>Hello {name}!</h1>
        <p>
          Good news: your Arti Night <b>{event_title}</b>
          {event_date_time ? ` on ${event_date_time}` : ""} has been approved and
          is now live on Arti.
        </p>
        <p>
          Event page: <a href={event_link}>{event_link}</a>
        </p>
        <p>
          Need to change something, like the date, the description or the
          photo? You can edit your event any time with your private link:
        </p>
        <p>
          <a href={edit_link}>{edit_link}</a>
        </p>
        <p>
          Please keep this link to yourself, since anyone who has it can edit
          your event. Your changes go live as soon as you save them.
        </p>
        <p>
          Looking for ideas to prepare your evening? Read the{" "}
          <a href="https://www.arti.my/night">Arti Night host kit</a>, and
          write to us at hello@arti.my if you have any questions.
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
