import React from "react";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Text, ResponsiveContext } from "grommet";

import styles from "./index.module.scss";
import { MoreHorizontal } from "react-feather";

const About = () => {
  return (
    <section >
      <Grid fluid className={styles.about}>
        <Row>
          <Col xs={12} >
            {/* md={10} mdOffset={1} */}
            <Box margin="large">
              <center><h3>
                Connecting artists, art lovers, and collectors
              </h3>
              </center>
              <h2>Why</h2>



              <p>
                We believe that inspiring art stands out by itself.
                This is one of our core philosophies that inspires to create a direct channel between artists, art lovers, and collectors that can provide a wide inspiring network for all.

              </p>

              <p>
                There are way more artists than there are spaces to show their work. Arti wants to redefine the art centers and to overcome the value-making crisis in the art world which results in few leaders and many followers situation.
              </p>
              {/* <p>Arti is open to all artists creating work at any stage in their practice.</p> */}


              <h3>We want to help create a new art world where
              </h3>
              <center>

                <h3> Art is more accessible to everyone</h3>

              </center>


              <p>There is a lot of art out there and the majority of it gets little chance to be visible and shared with the audience who appreciates it. We see a chance to open up the established gates of exclusivity in the art world and market, and to make it easier for artists and collectors to define their practice in their own way.
              </p>



              <center>

                <h3> The creative process is more visible</h3>

              </center>

              <p>One of the main differences between seeing an artist’s work in a gallery and visiting their studio is the stories they share. The details of how and why they work are a big part of their practice as a whole. We hope to bring this way of sharing and being inspired by art to more collectors and art lovers.
              </p>

              <center>

                <h3> There is a wide spectrum of independent artists</h3>

              </center>
              <p>
                Someone issued the warning once to “Beware of artists. They mix with all classes of society and are therefore most dangerous."
                We agree and want more mixing and a wider spectrum of artists of all backgrounds to thrive. We see the beauty and richness in the diversity, and we believe that the way forward is to have even more independent artists everywhere.
              </p>

              {/* 
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
              </p> */}


            </Box>





          </Col>
          <Col xs={12}>
            <Box margin="medium">
              <Box margin={{ horizontal: "medium" }} ><h2>Our Team</h2></Box>
              <Row>
                {/*  */}
                <Col md={4}>
                  <Box margin={"medium"} align="center">
                    <img className={styles.teamImg} src="img/team/youssef.jpg" />
                    <Text size="medium" margin={{ vertical: "medium" }} weight="600" alignSelf="start">
                      Youssef Faltas
                    </Text>
                    <p>
                      Youssef is a creative technologist and a web developer.
                    </p>
                  </Box>
                </Col>

                <Col md={4}>
                  <Box margin={"medium"} align="center">
                    <img className={styles.teamImg} src="img/team/ivca.jpg" />
                    <Text size="medium" margin={{ vertical: "medium" }} weight="600" alignSelf="start">
                      Ivana Benova
                    </Text>
                    <p>

                      Ivana is a professional bohemian and a project manager and booster in areas connecting tech, art and education.
                      {/* <br /> She realized Tango Nomado projects which hosted several nomadic musicians in Prague, Paris, or Buenos Aires. */}
                    </p>
                  </Box>
                </Col>
                <Col md={4}>
                  <Box margin={"medium"} align="center">
                    <img className={styles.teamImg} src="img/team/salam.jpg" />
                    <Text size="medium" margin={{ vertical: "medium" }} weight="600" alignSelf="start">
                      Salam Shokor
                    </Text>
                    <p >
                      Salam is a UX/UI and visual designer pursuing his M.A. in Design and Computation in Berlin.
                      {/* He supports Arti with UX design and communication. */}
                    </p>
                  </Box>
                </Col>
              </Row>
            </Box>

            {/* <Box margin="large" align="center">
              <Text weight="bold">
                +++  We do not tolerate any kind of sexism, racism and other
                forms of discrimination +++
              </Text>
            </Box> */}
            <Box margin="large">
              <h2>What to Expect</h2>
              <p>
                Arti is now taking its first steps and we want to set clear principles right from the start so you may know
                what to expect from us in the long term.
              </p>
              <ul>
                <li> All accounts are and will always be free.</li>
                <li>
                  Your data is private. We will not  use it without your
                  consent.
                </li>
                <li> We will not spam you.</li>
                <li>
                  <Text weight="600"> We do not tolerate any kind of sexism, racism and other forms of
                    discrimination.</Text>
                </li>
              </ul>
            </Box>

          </Col>
        </Row>


      </Grid >
    </section >
  );
};
export default About;

