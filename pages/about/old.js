import React from "react";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

import styles from "./index.module.scss";

const Old = () => {
  return (
    <section className={styles.about}>
      <Grid fluid>
        <Row>
          <Col xs={12} md={10} mdOffset={1}>
            <h2>What</h2>
            <h3>
              A web platform to connect artists, art lovers, and collectors
            </h3>

            <p>
              We want to enable the art world to use studios as complementary to
              the standard public art spaces.
            </p>
            <p>
              Opening up the studio space promotes a more intimate experience of
              presentation and reception and a better chance for sharing and
              exploring artistic practices in the creative environment itself.
              The new direct interface between artists and collectors also leads
              to an opportunity to design a smoother sales process for both.
            </p>
            <h3>We want to make art more accessible</h3>

            <p>
              The art market is exclusive and galleries take a large percentage
              off the artwork price from artists.
            </p>

            <p>
              The studio as an alternative space to experience and buy artworks
              helps redefine the value-making power centers that control the art
              market. We want to overcome the value-making crisis the art world
              is facing which results in few leaders and many followers
              situation and the low changes of visibility for a lot of artists.
            </p>

            <h3>arti is free and open</h3>

            <p>
              Our platform is free to join for all.
              <br />
              arti is open to all artists. Established and upcoming artists are
              welcome to add their space.
            </p>

            <h3>Art at a distance</h3>
            <p>
              With current lockdown and social distancing measures, art events
              are drastically reduced and many artists are affected.
            </p>
            <p>
              We believe that using the studio would help recover the near
              absence of physical presence in the art world. The in-person
              meetings between art and art lovers would help artists to make new
              social ties and collectors to evaluate and appreciate artworks
              more closely.
            </p>

            <h2> Why the Studio</h2>

            <p>
              The gallery space is too small for the number of artists out
              there. And online viewing of artwork and buying them is
              impersonal. It feels like buying an ikea.
            </p>
            <p>
              We can connect with artworks more intimately when we are
              face-to-face with it and its maker. The studio is the space that
              can bring artists and collectors closer together. It can help both
              find inspiration and expand their immediate networks.
            </p>

            <p>
              arti makes it easier for artists to show their work and make new
              connections in the way they prefer and in the place where they
              develop the creative concepts. Where they define their art.
            </p>

            <h2>How</h2>

            <ul>
              <li>
                Artists create their profiles and add the dates when they want
                to open their studios for visits.
              </li>
              <li>
                Art lovers and collectors explore artists and review studio
                spaces and request a visit.
              </li>
              <li>
                We notify the artist of the visit request to the artist and
                connect her to the guest.
              </li>
              <li>
                When the artist accepts the request, the guests confirm the
                visit details.
              </li>
              <li>
                In the future, we will add the option of visitors being able to
                buy directly from the artist via the app (and choose a shipping
                option if needed). When a collector chooses to purchase using
                our platform, we will take 15% off the price.
              </li>
            </ul>
            <h2>What to Expect</h2>
            <p>
              arti is now taking its first steps and we want to make sure that
              we set clear principles right at the start so that you may know
              what to expect from us in the long term.
            </p>
            <ul>
              <li> We will not spam you.</li>
              <li>
                Your data is private. We will not sell it or use it without your
                consent.
              </li>
              <li> All accounts are and will always be free.</li>
              <li>
                We do not tolerate any kind of sexism, racism and other forms of
                discrimination.
              </li>
            </ul>

            <h2>
              Contact Us
              <br />
            </h2>
            <p>
              contact@arti.co
              <br />
            </p>
            {/* 

            <p class="highlighted">
              * +++++++ We do not tolerate any kind of sexism, racism and other
              forms of discrimination ++++++
            </p> */}





            <br />
            <br />
          </Col>
        </Row>
      </Grid>
    </section>
  );
};
export default Old;