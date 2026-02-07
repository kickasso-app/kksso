'use client';

import React, { useContext } from "react";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Text, Paragraph, ResponsiveContext } from "grommet";
import Footer from "layouts/Footer";
import styles from "./index.module.scss";

const AboutTeamClient = () => {
  const size = useContext(ResponsiveContext);

  return (
    <>
      <Box pad={size === "small" ? "medium" : "large"}>
        <Grid fluid>
          <Row>
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
                        src="/img/team/youssef.jpg"
                        alt="Youssef Faltas"
                      />
                      <Text size="large">Youssef Faltas</Text>
                      <Paragraph>
                        Youssef is a creative technologist, visual artist, and
                        web developer.
                      </Paragraph>
                    </Box>
                  </Col>
                  <Col md={4}>
                    <Box margin="medium" gap="medium">
                      <img
                        className={styles.teamImg}
                        src="/img/team/ivca.jpg"
                        alt="Ivana Benova"
                      />
                      <Text size="large">Ivana Benova</Text>
                      <Paragraph>
                        Ivana is a project manager and a
                        booster in areas connecting tech, art and education.
                      </Paragraph>
                    </Box>
                  </Col>
                  <Col md={4}>
                    <Box margin="medium" gap="medium">
                      <img
                        className={styles.teamImg}
                        src="/img/team/salam.jpg"
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
                        src="/img/team/gabal.jpg"
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
            </Col>
          </Row>
        </Grid>
      </Box>
      <Footer />
    </>
  );
};

export default AboutTeamClient;
