import * as React from "react";
import { emailStyles } from "./emailStyles";

export const MagicLinkTemplate = ({ magic }) => (
  <html>
    <head>
      <style>{emailStyles.toString()}</style>
    </head>
    <body>
      <div id="emailstyles">
        <h1>Hello,</h1>
        <p> Follow this link to login to your Arti account</p>

        <p>
          <br /> <br />
          <a class="pinkbutton" href={magic}>
            Log In
          </a>
          <br /> <br />
        </p>

        <p>If you didn't request a magic link, please delete this email.</p>

        <p>
          Best wishes,
          <br />
          Arti team
          <br />
          <a href="https://arti.my"> https://www.arti.my</a>.
        </p>
        <img src="https://arti.my/img/logo-name-web.png"></img>
      </div>
    </body>
  </html>
);
