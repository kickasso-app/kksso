import * as React from "react";
import { emailStyles } from "./emailStyles";

export const VisitRequest = ({
  to_name,
  from_name,
  request_date,
  visit_reason,
  requestor_link,
  request_id,
}) => (
  <html>
    <head>
      <style>{emailStyles.toString()}</style>
    </head>
    <body>
      <div id="emailstyles">
        <h1>Hello, {to_name}!</h1>
        <p>
          You got a studio visit request from <strong>{from_name}</strong> on{" "}
          {request_date}. They asked to visit for this reason:
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
          <a class="pinkbutton" href={`https://arti.my/requests/` + request_id}>
            View Request
          </a>
        </p>
        <p>
          If you want to confirm the visit request and would like to host them,
          remember to include your address, and any extra helpful directions of
          how to arrive at your studio.
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
