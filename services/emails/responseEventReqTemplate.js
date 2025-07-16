import * as React from "react";
import { emailStyles } from "./emailStyles";

export const ResponseEventRequest = ({
  name,
  studio_name,
  message,
  readableResponse,
  studio_email,
  event_uuid,
  request_date,
}) => (
  <html>
    <head>
      <style>{emailStyles.toString()}</style>
    </head>
    <body>
      <div id="emailstyles">
        <h1>Hello {name}!</h1>
        <p>
          {studio_name} has responded to your request to join their{" "}
          <a href={`https://arti.my/event/${event_uuid}`} target="_blank">
            event
          </a>{" "}
          on {request_date}.
        </p>

        <p>
          Response:<b> {readableResponse}</b>
          <br />
        </p>
        {message && (
          <p>
            They attached this following message:
            <blockquote>{message}</blockquote>
          </p>
        )}

        {readableResponse === "Approved" && (
          <>
            <p>
              If needed, please respond back to them by email at{" "}
              <b>{studio_email}</b>, and have a wonderful and inspiring time at
              the event!
            </p>
          </>
        )}
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
