import * as React from "react";
import { emailStyles } from "./emailStyles";

export const ReferralTemplate = ({ name, referredBy, joinLink }) => (
  <html>
    <head>
      <style>{emailStyles.toString()}</style>
    </head>
    <body>
      <div id="emailstyles">
        <h1>Hello {name}!</h1>
        <p> You were invited to join Arti by {referredBy}.</p>

        <div class="blockquote">
          Arti is a digital platform to connect artists, collectors, and art
          lovers.
        </div>
        <p>
          The idea started with the understanding that studios are a great place
          to share art and creativity. Studio visits help as well fill the gap
          of having a direct channel between artists and collectors. This way
          artists can show their work how they prefer and host events such as
          workshops. Collectors get to explore the creative process more
          intimately and buy artworks directly from local artists. Find out more
          about our philosophy and{" "}
          <a href="https://www.arti.my/how-it-works/artists">
            how it works for artists and curators
          </a>
          .
        </p>

        <p>
          If you want to try out our concept, please sign up using the link
          below to create your studio profile.
          <br />
        </p>

        <p>
          <br /> <br />
          <a class="pinkbutton" href={joinLink}>
            Join Arti
          </a>
          <br /> <br />
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
