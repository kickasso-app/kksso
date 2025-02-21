import * as React from "react";
import { emailStyles } from "./emailStyles";

export const VisitRequest = ({
  to_name,
  from_name,
  request_date,
  visit_reason,
  requestor_link,
  requestor_email,
}) => (
  <html>
    <head>
      <style>{emailStyles.toString()}</style>
    </head>
    <body>
      <div>
        <h1>Hello, {to_name}!</h1>
        <p>
          You got a studio visit request from <strong>{from_name}</strong> on{" "}
          {request_date}. They asked to visit for this reason:
          <blockquote>{visit_reason}</blockquote>
        </p>
        <p>
          You can know more about {from_name}{" "}
          <a href={requestor_link} target="_blank">
            here
          </a>
          .
        </p>
        <p>
          Please write them back at {requestor_email} or in your requests
          section in your Arti account if you need more details about their
          visit request or start with a conversation with them.
        </p>
        <p>
          If you want to confirm the visit request and would like to host them,
          remember to include your address, and any extra helpful directions of
          how to arrive at your studio. Please Cc us in the email as well and we
          will remove the open visit date from your calendar.
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
