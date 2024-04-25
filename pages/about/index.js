import React from "react";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Text, ResponsiveContext } from "grommet";
import { Circle } from "react-feather";

import styles from "./index.module.scss";
import { MoreHorizontal } from "react-feather";

const About = () => {
  return (
    <section>
      <Grid fluid className={styles.about}>
        <Row>
          <Col xs={12}>
            <Box margin="large">
              <center>
                <h3>Connecting artists, art lovers, and collectors</h3>
              </center>
              <h2>Why</h2>

              <p>
                We believe that original art stands out. This conviction drives
                us to create a direct channel between artists, art lovers, and
                collectors.
              </p>
              <p>
                There are more artists than there are spaces to show their work.
              </p>
              <p>
                The art world is complex but the market is archaic and
                exclusive. Access is rarely easy. Galleries take a large
                percentage off the artwork price. Online experience of viewing
                and buying art is impersonal. It can feel like buying an Ikea.
              </p>
              <p>
                By gaining more space in creativity and freedom in directing the
                journeys of their artworks, artists will make more powerful art.
                Studios are the optimal place to see and experience them.
              </p>

              <h3>We want to help create a new art world where</h3>

              <h3>
                <Box direction="row" align="baseline">
                  <Circle size={11} strokeWidth={2} /> &nbsp; Art is more
                  accessible to everyone
                </Box>
              </h3>

              <p>
                There is a lot of art out there and its majority gets little
                chance to reach the audience who appreciates it. Opening up the
                gates of exclusivity in the art world and market would help
                artists and collectors define their practice in their own ways.
              </p>

              <h3>
                <Box direction="row" align="baseline">
                  <Circle size={11} strokeWidth={2} /> &nbsp; The creative
                  process is more visible
                </Box>
              </h3>

              <p>
                A key difference between seeing an artist's work in a gallery
                and visiting their studio is the stories they share. The details
                of how and why they work are a significant part of their
                practice. We hope to bring the possibility of sharing and
                getting inspired by art to more art lovers.
              </p>

              <h3>
                <Box direction="row" align="baseline">
                  <Circle size={11} strokeWidth={2} /> &nbsp; There are more
                  independent artists
                </Box>
              </h3>
              {/* <h3> There is a wide spectrum of independent artists</h3> */}

              <p>
                Someone once warned “Beware of artists. They mix with all
                classes of society and are therefore most dangerous." We agree
                and want a wider spectrum of artists of all backgrounds to
                thrive. We see the beauty and richness in the diversity, and we
                believe that the way forward is to have even more independent
                artists creating original works everywhere.
              </p>
            </Box>
          </Col>
          <Col xs={12}>
            <Box margin="medium">
              <Box margin={{ horizontal: "medium" }}>
                <h2>Our Team</h2>
              </Box>
              <Row>
                {/*  */}
                <Col md={4}>
                  <Box margin={"medium"} align="center">
                    <img
                      className={styles.teamImg}
                      src="img/team/youssef.jpg"
                    />
                    <Text
                      size="medium"
                      margin={{ vertical: "medium" }}
                      weight={600}
                      alignSelf="start"
                    >
                      Youssef Faltas
                    </Text>
                    <p>
                      Youssef is a creative technologist, a visual artist, and a
                      web developer.
                    </p>
                  </Box>
                </Col>

                <Col md={4}>
                  <Box margin={"medium"} align="center">
                    <img className={styles.teamImg} src="img/team/ivca.jpg" />
                    <Text
                      size="medium"
                      margin={{ vertical: "medium" }}
                      weight={600}
                      alignSelf="start"
                    >
                      Ivana Benova
                    </Text>
                    <p>
                      Ivana is a professional bohemian and a project manager +
                      booster in areas connecting tech, art and education.
                      {/* <br /> She realized Tango Nomado projects which hosted several nomadic musicians in Prague, Paris, or Buenos Aires. */}
                    </p>
                  </Box>
                </Col>
                <Col md={4}>
                  <Box margin={"medium"} align="center">
                    <img className={styles.teamImg} src="img/team/salam.jpg" />
                    <Text
                      size="medium"
                      margin={{ vertical: "medium" }}
                      weight={600}
                      alignSelf="start"
                    >
                      Salam Shokor
                    </Text>
                    <p>
                      Salam is a UX/UI and visual designer pursuing his M.A. in
                      Design and Computation in Berlin.
                      {/* He supports Arti with UX design and communication. */}
                    </p>
                  </Box>
                </Col>
              </Row>
            </Box>

            <Box margin="large">
              <h2>What to Expect</h2>
              <p>
                Arti is now taking its first steps and we want to set clear
                principles right from the start so you may know what to expect
                from us in the long term.
              </p>
              <ul>
                <li> All accounts are and will always be free.</li>
                <li>
                  Your data is private. We will not use it without your consent.
                </li>
                <li> We will not spam you.</li>
                <li>
                  <Text weight="600">
                    {" "}
                    We do not tolerate any kind of sexism, racism and other
                    forms of discrimination.
                  </Text>
                </li>
              </ul>
            </Box>
          </Col>
        </Row>
      </Grid>
    </section>
  );
};
export default About;
