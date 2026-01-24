import * as React from "react";

export const CollectorReferralPreview = ({
  name,
  referredBy,
  studioLink,
  includeStudioLink,
}) => (
  <>
    <h1>Hello {name}!</h1>
    <p>
      We are delighted to send you this exclusive invitation to explore the art
      world with us.
    </p>

    <p>What is Arti? </p>

    <div id="blockquote">
      Arti is a digital platform to connect artists, collectors, and art lovers.
    </div>

    <p>
      Join us today to attend studio visits and events, and create with us a new
      art world where art is more accessible, the creative process is more
      visible, and independent artists thrive.
    </p>

    <p>
      <b>Visit our platform</b> at <a href="https://www.arti.my">www.arti.my</a>
    </p>

    <p>
      Explore each artist's page, discover original artworks, and book private{" "}
      <b> studio visits</b>. See the creative process more intimately, learn the
      stories behind their work and inspiration, and if you are a collector, buy
      artworks directly from them.
    </p>
    <p>
      In addition, join <b>events</b> {""}
      such as workshops and studio tours that allow you to network with other
      art lovers and artists and know more about your local art scene.
    </p>

    {includeStudioLink && (
      <p>
        You were sent this invitation by {referredBy}. Explore their Arti studio
        page <a href={studioLink}>here</a>.
      </p>
    )}

    <p>
      Best wishes,
      <br />
      Arti team
      <br />
    </p>
    <img src="https://arti.my/img/logo-name-web.png"></img>
  </>
);
