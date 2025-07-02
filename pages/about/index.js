import React, { useContext } from "react";
import Link from "next/link";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Text, Paragraph, ResponsiveContext } from "grommet";
import { Circle } from "react-feather";
import Button from "components/Button";

import styles from "./index.module.scss";
import WithFooter from "layouts/WithFooter";

const CirclePoint = ({ children }) => (
  <Box direction="row" align="center" margin={{ vertical: "small" }}>
    <Circle size={8} strokeWidth={2} />
    <Box margin={{ left: "small" }}>
      <Heading level={3} margin="none" color="dark-1">
        {children}
      </Heading>
    </Box>
  </Box>
);

const About = () => {
  const size = useContext(ResponsiveContext);

  return (
    <WithFooter>
      <Box pad={size === "small" ? "medium" : "large"}>
        <Grid fluid>
          <Row>
            <Col xs={12}>
              <Box align="center" margin={{ top: "medium", bottom: "large" }}>
                <Heading level={3} margin="none" textAlign="center">
                  Connecting artists, art lovers, and collectors
                </Heading>
              </Box>

              <Box margin={{ vertical: "medium" }}>
                <Heading level={2} margin={{ bottom: "medium" }}>
                  Why
                </Heading>

                <Box gap="medium">
                  <Paragraph fill>
                    We believe that original art stands out. This conviction
                    drives us to create a direct channel between artists, art
                    lovers, and collectors.
                  </Paragraph>

                  <Paragraph fill>
                    There are more artists than there are spaces to show their
                    work.
                  </Paragraph>

                  <Paragraph fill>
                    The art world is complex but the market is archaic and
                    exclusive. Access is rarely easy. Galleries take a large
                    percentage off the artwork price. Online experience of
                    viewing and buying art is impersonal. It can feel like
                    buying an Ikea.
                  </Paragraph>

                  <Paragraph fill>
                    By gaining more space in creativity and freedom in directing
                    the journeys of their artworks, artists will make more
                    powerful art. Studios are the optimal place to see and
                    experience them.
                  </Paragraph>
                </Box>

                <Heading
                  level={3}
                  margin={{ top: "large", bottom: "medium" }}
                  color="dark-1"
                >
                  We want to help create a new art world where
                </Heading>

                <Box gap="medium">
                  <CirclePoint>Art is more accessible to everyone</CirclePoint>
                  <Paragraph fill>
                    There is a lot of art out there and its majority gets little
                    chance to reach the audience who appreciates it. Opening up
                    the gates of exclusivity in the art world and market would
                    help artists and collectors define their practice in their
                    own ways.
                  </Paragraph>

                  <CirclePoint>
                    The creative process is more visible
                  </CirclePoint>
                  <Paragraph fill>
                    A key difference between seeing an artist's work in a
                    gallery and visiting their studio is the stories they share.
                    The details of how and why they work are a significant part
                    of their practice. We hope to bring the possibility of
                    sharing and getting inspired by art to more art lovers.
                  </Paragraph>

                  <CirclePoint> Independent artists can thrive</CirclePoint>
                  <Paragraph fill>
                    Someone once warned "Beware of artists. They mix with all
                    classes of society and are therefore most dangerous." We
                    agree and want a wider spectrum of artists of all
                    backgrounds to thrive. We see the beauty and richness in the
                    diversity, and we believe that the way forward is to have
                    even more independent artists creating original works
                    everywhere.
                  </Paragraph>
                </Box>
              </Box>
            </Col>

            <Col xs={12}>
              <Box margin={{ vertical: "xlarge" }}>
                <Heading level={2} margin={{ bottom: "medium" }}>
                  Our Team
                </Heading>
                <Row>
                  <Col md={4}>
                    <Box margin="medium" gap="medium">
                      <img
                        className={styles.teamImg}
                        src="img/team/youssef.jpg"
                        alt="Youssef Faltas"
                      />
                      <Text size="large">Youssef Faltas</Text>
                      <Paragraph>
                        Youssef is a creative technologist, a visual artist, and
                        a web developer.
                      </Paragraph>
                    </Box>
                  </Col>
                  <Col md={4}>
                    <Box margin="medium" gap="medium">
                      <img
                        className={styles.teamImg}
                        src="img/team/ivca.jpg"
                        alt="Ivana Benova"
                      />
                      <Text size="large">Ivana Benova</Text>
                      <Paragraph>
                        Ivana is a professional bohemian and a project manager +
                        booster in areas connecting tech, art and education.
                      </Paragraph>
                    </Box>
                  </Col>
                  <Col md={4}>
                    <Box margin="medium" gap="medium">
                      <img
                        className={styles.teamImg}
                        src="img/team/salam.jpg"
                        alt="Salam Shokor"
                      />
                      <Text size="large">Salam Shokor</Text>
                      <Paragraph>
                        Salam is a UX/UI and visual designer pursuing his M.A.
                        in Design and Computation in Berlin.
                      </Paragraph>
                    </Box>
                  </Col>
                  <Col md={4}>
                    <Box margin="medium" gap="medium">
                      <img
                        className={styles.teamImg}
                        src="img/team/gabal.jpg"
                        alt="Mohamed AbouGabal"
                      />
                      <Text size="large">
                        Mohamed AbouGabal <br /> Curator - Cairo
                      </Text>
                      <Paragraph>
                        Mohamed is a visual artist and curator whose
                        multidisciplinary practice explores the intersections of
                        art, science, and social history.
                        <br />
                        <br /> AbouGabal's work merges archival research,
                        conceptual art, and social commentary, reflecting on
                        both personal and collective narratives. He is the
                        founder of the Egyptian Geographical Museum Society and
                        co-founder of the Giza Zoo Collective, engaging with
                        memory, critique, and cultural preservation.
                      </Paragraph>
                    </Box>
                  </Col>
                </Row>
              </Box>

              <Box margin={{ vertical: "xlarge" }}>
                <Heading level={2} margin={{ bottom: "medium" }}>
                  What to Expect
                </Heading>
                <Paragraph fill>
                  Arti is now taking its first steps and we want to set clear
                  principles right from the start so you may know what to expect
                  from us in the long term.
                </Paragraph>
                <ul>
                  <Box
                    margin={{ top: "large", horizontal: "medium" }}
                    gap="small"
                  >
                    <li>
                      <Text> All accounts are and will always be free.</Text>
                    </li>
                    <li>
                      {" "}
                      <Text>
                        Your data is private. We will not use it without your
                        consent.
                      </Text>
                    </li>
                    <li>
                      <Text>We will not spam you.</Text>
                    </li>
                    <li style={{ fontWeight: "bold" }}>
                      <Text>
                        We do not tolerate any kind of sexism, racism and other
                        forms of discrimination.
                      </Text>
                    </li>
                  </Box>
                </ul>
              </Box>

              <Box
                margin={{ vertical: "xlarge" }}
                // margin={{ vertical: "xlarge" }}
                pad={{ horizontal: "small", vertical: "small" }}
                align="center"
                direction="column"
              >
                <Heading level={3} margin={{ bottom: "xlarge" }}>
                  How it works in detail
                </Heading>

                <Row>
                  <Col md={6}>
                    <Box
                      align="center"
                      pad={{ vertical: "small" }}
                      margin={{ vertical: "medium" }}
                      fill
                      direction="column"
                    >
                      <Button btnStyle="outline">
                        <Box margin={"xsmall"}>
                          <Link href={"/how-it-works/artists"}>
                            For Artists and Curators
                          </Link>
                        </Box>
                      </Button>
                      <Paragraph
                        size="medium"
                        alignSelf="center"
                        margin={{ vertical: "large" }}
                      >
                        Find out how our platform works and how to offer to host
                        visits, workshops, and other art community events in
                        your studio.
                      </Paragraph>
                    </Box>
                  </Col>
                  <Col md={6}>
                    <Box
                      align="center"
                      pad={{ vertical: "small", horizontal: "small" }}
                      margin={{ vertical: "medium" }}
                      fill
                      direction="column"
                    >
                      <Button btnStyle="outline">
                        <Box margin={"xsmall"}>
                          <Link href={"/how-it-works/"}>
                            For Art Lovers and Collectors
                          </Link>
                        </Box>
                      </Button>
                      <Paragraph
                        margin={{ vertical: "large" }}
                        size="medium"
                        alignSelf="center"
                      >
                        Know more about our vision for a new art world, and how
                        you can be part of it.
                      </Paragraph>
                    </Box>
                  </Col>
                </Row>
              </Box>
            </Col>
          </Row>
        </Grid>
      </Box>
    </WithFooter>
  );
};

export default About;
