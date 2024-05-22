import { useContext } from "react";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import Link from "next/link";
import Image from "next/image";

import { Box, Heading, Text, ResponsiveContext } from "grommet";

import SearchBar from "components/SearchBar";
import StudiosFeatured from "components/StudiosFeatured";
import Button from "components/Button";

import styles from "./index.module.scss";

const Pilot = () => {
  const margin = "medium";
  const sectionMargin = { vertical: "4em" };

  const size = useContext(ResponsiveContext);

  return (
    <Grid fluid id={styles.pilot} align="center">
      <section>
        <Row id={styles.intro}>
          <Col xs={12} md={12}>
            {/* <Heading
              level={4}
              margin="small"
              alignSelf="center"
              textAlign="center"
            >
              Summer edition is coming soon. Stay tuned.
            </Heading> */}

            <Box margin={{ bottom: "1rem" }}>
              {size === "small" ? (
                <Image
                  src={`/img/pilot/MobileBanner.png`}
                  alt="banner"
                  layout="responsive"
                  width="100%"
                  height="100%"
                />
              ) : (
                <Image
                  src={`/img/pilot/Banner.png`}
                  alt="banner"
                  layout="responsive"
                  width="100%"
                  height="45%"
                />
              )}
            </Box>
            <Box margin={{ vertical: "2.5rem" }} align="center">
              <Heading level={2}>
                Book a private studio visit
                {/* <br />with artists near you */}
              </Heading>
            </Box>

            <Box margin={{ vertical: "1rem", bottom: "12rem" }} align="center">
              <SearchBar isBarFullWidth />
            </Box>

            <Box margin={sectionMargin} pad="medium" align="center">
              <Heading level={2} margin={"xs"}>
                Featured Studios
              </Heading>
              <Box fill pad="small">
                <StudiosFeatured />
              </Box>

              <Box
                align="center"
                pad={{ vertical: "small" }}
                margin={{ vertical: "small" }}
              >
                <Button btnStyle="outline">
                  <Box margin={{ vertical: "1rem", horizontal: "1rem" }}>
                    <Link href="/studios">Explore All Studios</Link>
                  </Box>
                </Button>
              </Box>
            </Box>

            <Box margin={sectionMargin} pad="medium" align="center">
              <Box margin={{ vertical: "xlarge" }}></Box>

              <Heading level={2} margin={margin}>
                How it works
              </Heading>
              <Box fill pad="large">
                <Row>
                  <Col md={4}>
                    <Text size="xlarge" alignSelf="center">
                      1.
                    </Text>
                    <Box margin={{ top: "medium", bottom: "xlarge" }}>
                      <Text size="medium">Discover artist studios nearby </Text>
                    </Box>
                  </Col>
                  <Col md={4}>
                    <Text size="xlarge" alignSelf="center">
                      2.
                    </Text>
                    <Box margin={{ top: "medium", bottom: "xlarge" }}>
                      <Text size="medium">
                        Find an artwork that you like and request a visit
                      </Text>
                    </Box>
                  </Col>
                  <Col md={4}>
                    <Text size="xlarge" alignSelf="center">
                      3.
                    </Text>
                    <Box margin={{ top: "medium", bottom: "xlarge" }}>
                      <Text size="medium">
                        Once they accept, make a visit and learn what inspires
                        them
                      </Text>
                    </Box>
                  </Col>
                </Row>
              </Box>
            </Box>
            <Box margin={{ vertical: "large" }}></Box>

            <Box pad="medium">
              <Row>
                <Col md={6}>
                  <Box margin={sectionMargin}>
                    <Box
                      margin={
                        size === "small"
                          ? { top: "medium", bottom: "xlarge" }
                          : "none"
                      }
                    >
                      <Heading
                        level={2}
                        margin={
                          size === "small"
                            ? { vertical: "large", horizontal: "medium" }
                            : { horizontal: "large" }
                        }
                      >
                        Art is an experience, <br />
                        not an object.
                      </Heading>
                    </Box>
                  </Box>
                </Col>
                <Col md={6}>
                  <Box margin="medium">
                    <Text size="large" margin="medium" weight="600">
                      A digital platform to connect artists, collectors, and art
                      lovers.
                    </Text>
                    <Text
                      size="medium"
                      alignSelf="end"
                      textAlign="start"
                      margin={{ vertical: "medium" }}
                    >
                      We believe studios are a great place to share art. That’s
                      why we are building a platform to connect the art world by
                      studio visits.
                      <br />
                      <br />
                      Artists offer to open their studios, while art lovers and
                      collectors explore the creative process more intimately
                      and buy artworks directly.
                      {/* 
                      In arti, artists can offer to host studio visits, and collectors and art lovers get to explore the creative process more intimately and buy artworks directly.

                      Studios are a great place to share art and creativity.
                      Studio visits help as well fill the gap of having a direct channel between artists and collectors.
                      This way artists can show their work how and to whom they prefer. */}
                      {/* For collectors, they get to explore the creative process more intimately and buy artworks directly from local artists. */}
                    </Text>
                  </Box>
                </Col>
              </Row>
              <Box margin={{ vertical: "large" }}></Box>
            </Box>
          </Col>
        </Row>
      </section>
    </Grid>
  );
};

export default Pilot;
