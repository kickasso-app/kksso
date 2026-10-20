"use client";

import { useContext } from "react";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import Link from "next/link";
import Image from "next/image";

import { Box, Heading, Text, ResponsiveContext } from "grommet";

import Button from "components/Button";
import FeaturedSection from "components/FeaturedSection";

import Footer from "layouts/Footer";
import styles from "./page.module.scss";

const LandingClient = () => {
  const margin = "medium";
  const sectionMargin = { vertical: "xlarge" };

  const size = useContext(ResponsiveContext);

  return (
    <>
      <Grid fluid id={styles.landing} align="center">
        <section>
          <Row id={styles.intro}>
            <Col xs={12} md={12}>
              <Box margin={{ bottom: "1rem" }}>
                <div className={styles.mobileBanner}>
                  <Image
                    src={`/img/intro/MobileBanner.png`}
                    alt="banner"
                    width={400}
                    height={400}
                    style={{ width: "100%", height: "auto" }}
                    priority
                  />
                </div>
                <div className={styles.desktopBanner}>
                  <Image
                    src={`/img/intro/Banner.png`}
                    alt="banner"
                    width={1200}
                    height={540}
                    style={{ width: "100%", height: "auto" }}
                    priority
                  />
                </div>
              </Box>
              {/* <Box margin={{ vertical: "2.5rem" }} align="center">
                <Heading level={2}>Discover Your Local Art Scene</Heading>
              </Box>*/}

              <Box pad="medium">
                <Row>
                  <Col md={6}>
                    <Box margin="medium">
                      <Text size="large" margin="medium" weight={600}>
                        Connecting artists, art lovers, and collectors
                      </Text>
                      <Text
                        size="medium"
                        alignSelf="end"
                        textAlign="start"
                        margin={{ vertical: "medium" }}
                      >
                        We believe studios are a great place to share art.
                        That’s why we built a platform to connect the art world
                        by studio visits.
                        <br />
                        <br />
                        Artists offer to open their studios and host events,
                        while art lovers and collectors explore the creative
                        process more intimately and buy artworks directly.
                      </Text>
                    </Box>
                  </Col>
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
                </Row>
              </Box>

              <Box
                margin={sectionMargin}
                pad={{ horizontal: "small", vertical: "small" }}
                align="center"
                direction="column"
              >
                <Heading level={3} margin={{ bottom: "xlarge" }}>
                  How It Works
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
                      <Link
                        href={"/how-it-works/artists"}
                        style={{ textDecoration: "none" }}
                      >
                        <Button btnStyle="outline" as="div">
                          <Box margin={"small"}>For Artists and Curators</Box>
                        </Button>
                      </Link>
                      <Text
                        size="medium"
                        alignSelf="center"
                        margin={{ vertical: "large" }}
                      >
                        Find out how our platform works and how to host
                        visits, workshops, and other art community events in
                        your studio.
                      </Text>
                      <Text
                        size="medium"
                        alignSelf="center"
                        color="#4b4b4b"
                        margin={{ top: "medium" }}
                      >
                        Curious about hosting your first {` `}
                        <Link
                          href={"/night"}
                          // style={{ textDecoration: "none" }}
                        >
                          Arti Night
                        </Link>
                        ?
                      </Text>
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
                      <Link
                        href={"/how-it-works/"}
                        style={{ textDecoration: "none" }}
                      >
                        <Button btnStyle="outline" as="div">
                          <Box margin={"small"}>
                            For Art Lovers and Collectors
                          </Box>
                        </Button>
                      </Link>
                      <Text
                        margin={{ vertical: "large" }}
                        size="medium"
                        alignSelf="center"
                      >
                        Know more about our vision for a new art world, and how
                        you can be part of it.
                      </Text>
                    </Box>
                  </Col>
                </Row>
              </Box>

              <FeaturedSection />

              <Box
                margin={sectionMargin}
                pad={{ horizontal: "small", vertical: "small" }}
                align="center"
              >
                <Text
                  size="medium"
                  margin={{ horizontal: size === "small" ? "medium" : "xlarge" }}
                >
                  We’ve had the privilege of working with artists and curators across
                  Germany especially in Berlin and in Cairo, Egypt. They’ve opened
                  their studio doors, shared their process, and welcomed
                  collectors into their world. This is where Arti’s
                  community lives today, with more places on the way.
                </Text>
              </Box>

              <Box
                margin={sectionMargin}
                pad={{ horizontal: "small", vertical: "small" }}
                align="center"
                direction="column"
              >
                <Row>
                  <Col md={6}>
                    <Box
                      align="center"
                      pad={{ vertical: "small" }}
                      margin={{ vertical: "medium" }}
                      fill
                      direction="column"
                    >
                      <Link
                        href={`/studios/`}
                        style={{ textDecoration: "none" }}
                      >
                        <Button btnStyle="outline" as="div">
                          <Box
                            margin={"small"}
                          >
                            Explore Studios
                          </Box>
                        </Button>
                      </Link>
                      <Text
                        size="medium"
                        alignSelf="center"
                        margin={{ vertical: "large" }}
                      >
                        Connect with artists in your city and book a visit to learn more
                        about their practice and process.
                      </Text>
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
                      <Link
                        href={`/events/`}
                        style={{ textDecoration: "none" }}
                      >
                        <Button btnStyle="outline" as="div">
                          <Box
                            margin={"small"}
                          >
                            Join Events
                          </Box>
                        </Button>
                      </Link>
                      <Text
                        margin={{ vertical: "large" }}
                        size="medium"
                        alignSelf="center"
                      >
                        Take part in studio tours, workshops, and other art
                        community events in your city
                      </Text>
                    </Box>
                  </Col>
                </Row>
              </Box>
            </Col>
          </Row>
        </section>
      </Grid>
      <Footer />
    </>
  );
};

export default LandingClient;
