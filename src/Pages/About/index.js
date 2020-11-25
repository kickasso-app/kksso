import React from "react";
import { Grid, Row, Col } from "react-flexbox-grid";

import "./about.scss";

const About = () => {
  return (
    <section className="about">
      <Grid fluid>
        <Row>
          <Col xs={12} md={10} mdOffset={1}>
            {/* <h2>
              Our Story / ?
              <br />
            </h2>*/}

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

            <h3>Kickasso is free and open</h3>

            <p>
              Our platform is free to join for all.
              <br />
              Kickasso is open to all artists. Establihed and upcoming artists
              are welcome to add their space.
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
              Kickasso makes it easier for artists to show their work and make
              new connections in the way they prefer and in the place where they
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
                {" "}
                We notify the artist of the visit request to the artist and
                connect her to the guest.
              </li>
              <li>
                {" "}
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
              {" "}
              Kickasso is now taking its first steps and we want to make sure
              that we set clear principles right at the start so that you may
              know what to expect from us in the long term.
            </p>
            <ul>
              <li> We will not spam you.</li>
              <li>
                {" "}
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
              contact@kksso.co
              <br />
              {/* +49 30 279 79 442 */}
            </p>
            {/* <h2> Interface </h2>
            <p>
              Artists would create a hosting profile with a description and
              photos of their artwork and studio space. They would also include
              the times they are available for visits as well as other details
              like the number of guests and any specific studio rules or time
              limits they prefer. When the studio is open for a special showing
              or one-time performance, they may also mark the date with an event
              tag. The location of the studio would be not public until the
              artist approves a visit request.
            </p>
            <p>
              Art lovers and collectors would use the app to search and filter
              artists’ studios in a specific city, using a specific technique,
              and/or offering visits during a specific period. When the artist
              receives the request, they can review the art lover or collector’s
              profile and when they approve the visit request, both are notified
              and the visit details are confirmed.
            </p>
            <p>
              During the visit, if the artist has some works for sale and the
              collector is interested in buying it, the transaction can be made
              using the app and once a photo and the artwork details are quickly
              filled out, a contract and a certificate of authenticity is
              automatically delivered to both. Shipping is an optional addition
              to the contract. The artwork is then marked as sold and is
              optionally added to the collector’s profile. After the visit, both
              host and guest may write a review and rate the visit experience.
              This helps artists and visitors decide on future visits.
            </p>

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
export default About;
