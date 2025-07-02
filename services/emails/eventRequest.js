import * as React from "react";
import { emailStyles } from "./emailStyles";

export const EventRequest = ({
  to_name,
  from_name,
  visit_reason,
  requestor_link,
  request_id,
  event_date_time,
  event_link,
}) => (
  <html>
    <head>
      <style>{emailStyles.toString()}</style>
    </head>
    <body>
      <div id="emailstyles">
        <h1>Hello, {to_name}!</h1>
        <p>
          You got a request to join your <a href={event_link}>event</a> on{" "}
          {event_date_time} from <strong>{from_name}</strong>. They want to join
          for this reason:
          <blockquote>{visit_reason}</blockquote>
        </p>
        <p>
          You can know more about {from_name} at their link{" "}
          <a href={requestor_link} target="_blank">
            here
          </a>
          .
        </p>
        <p>Please review and reply to the request in your Arti account.</p>
        <p>
          <br /> <br />
          <a class="pinkbutton" href={`https://arti.my/requests/` + request_id}>
            View Request
          </a>
          <br /> <br />
        </p>
        <p>
          If you want to confirm their request, remember to include any extra
          helpful directions.
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
