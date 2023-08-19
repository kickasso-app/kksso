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
            <Box margin="large">
              <center><h3>
                Connecting artists, art lovers, and collectors
              </h3>
              </center>
              <h2>Why</h2>

              <p>
                We believe that inspiring art stands out by itself.
                This is one of our core philosophies that inspires to create a direct channel between artists, art lovers, and collectors
                that can provide a wide inspiring network for all.
              </p>

              <p>
                There are way more artists than there are spaces to show their work. Arti wants to redefine the art centers and to overcome the value-making crisis in the art world which results in few leaders and many followers situation.
              </p>
              {/* <p>Arti is open to all artists creating work at any stage in their practice.</p> */}


              <h3>We want to help create a new art world where
              </h3>


              <h3> Art is more accessible to everyone</h3>

              <p>There is a lot of art out there and the majority of it gets little chance to be visible and shared with the audience who appreciates it. We see a chance to open up the established gates of exclusivity in the art world and market, and to make it easier for artists and collectors to define their practice in their own way.
              </p>

              <h3> The creative process is more visible</h3>

              <p>One of the main differences between seeing an artist’s work in a gallery and visiting their studio is the stories they share. The details of how and why they work are a big part of their practice as a whole. We hope to bring this way of sharing and being inspired by art to more collectors and art lovers.
              </p>

              <h3> There is a wide spectrum of independent artists</h3>

              <p>
                Someone issued the warning once to “Beware of artists. They mix with all classes of society and are therefore most dangerous."
                We agree and want more mixing and a wider spectrum of artists of all backgrounds to thrive. We see the beauty and richness in the diversity, and we believe that the way forward is to have even more independent artists everywhere.
              </p>

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

