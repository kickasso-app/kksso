import * as React from "react";
import { emailStyles } from "./emailStyles";

export const ReferralTemplate = ({ name, referredBy, joinLink }) => (
  <html>
    <head>
      <style>{emailStyles.toString()}</style>
    </head>
    <body>
      <div>
        <h1>Hello {name}!</h1>
        <p> You were invited to join Arti by {referredBy}.</p>
        <p>
          <blockquote>
            Arti is a digital platform to connect artists, collectors, and art
            lovers.
          </blockquote>
        </p>
        <p>
          The idea started with the understanding that studios are a great place
          to share art and creativity. Studio visits help as well fill the gap
          of having a direct channel between artists and collectors. This way
          artists can show their work how and to whom they prefer. Collectors
          get to explore the creative process more intimately and buy artworks
          directly from local artists. Find out more about our vision and how
          the platform works <a href="https://www.arti.my/about">here</a>.
        </p>

        <p>
          If you want to try out our concept, please sign up using the link
          below to create your studio profile.
          <br />
        </p>

        <p>
          <a class="pinkbutton" href={joinLink}>
            Join Arti
          </a>
          <br />
        </p>
        <p>
          Feel free to reach out to us if you have any questions or comments.
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
