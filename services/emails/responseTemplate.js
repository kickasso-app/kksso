import * as React from "react";
import { emailStyles } from "./emailStyles";

export const RequestResponse = ({
  name,
  request_date,
  studio_name,
  message,
  readableResponse,
  studio_link,
  studio_email,
}) => (
  <html>
    <head>
      <style>{emailStyles.toString()}</style>
    </head>
    <body>
      <div>
        <h1>Hello {name}!</h1>
        <p>
          {studio_name} responsed to your studio visit request on {request_date}
          .
        </p>

        <p>
          Response:<b> {readableResponse}</b>
          <br />
          They attached this following message:
          <blockquote>{message}</blockquote>
        </p>

        {readableResponse === "Approved" && (
          <>
            <p>
              Please review their visit rules at their{" "}
              <a href={studio_link} target="_blank">
                studio page
              </a>
            </p>
            <p>
              Please respond back to them by email at <b>{studio_email}</b> and
              have a wonderful and inspiring visit.
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
