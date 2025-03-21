import * as React from "react";
import { emailStyles } from "./emailStyles";

export const CollectorReferralTemplate = ({
  name,
  referredBy,
  studioName,
  joinLink,
}) => (
  <html>
    <head>
      <style>{emailStyles.toString()}</style>
    </head>
    <body>
      <div>
        <h1>Hello {name}!</h1>
        <p>{referredBy} invited you to check out their studio page on Arti!</p>
        <p>
          <blockquote>
            Arti is a digital platform to connect artists, collectors, and art
            lovers.
          </blockquote>
        </p>
        <p>
          Visit {studioName}'s studio page to explore their artworks and learn
          more about their creative process.
        </p>

        <p>
          <a class="pinkbutton" href={joinLink}>
            Visit Studio
          </a>
          <br />
        </p>
        <p>
          If you're interested in discovering more artists and artworks, sign up
          on Arti to connect with artists and explore their studios.
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
