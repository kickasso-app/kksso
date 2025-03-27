import * as React from "react";
import { emailStyles } from "./emailStyles";

export const NewsletterTemplate = ({ city }) => (
  <html>
    <head>
      <style>{emailStyles.toString()}</style>
    </head>
    <body>
      <div id="emailstyles">
        <h1>Hello,</h1>
        <p> Thanks for subscribing to the Arti newsletter!</p>

        <p>
          We will keep you updated with our news{" "}
          {city && `in ${city} and elsewhere`}. Meanwhile please check our How
          It Works pages for{" "}
          <a href="https://www.arti.my/how-it-works/artists">
            artists and curators
          </a>{" "}
          and for{" "}
          <a href="https://www.arti.my/how-it-works">
            art lovers and collectors
          </a>
          .
        </p>

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
