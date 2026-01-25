'use client';

import { useContext } from "react";
import { Search, Calendar, Users } from "react-feather";

import { useCities } from "services/city";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import Link from "next/link";
import Image from "next/image";

import { Box, Heading, Text, ResponsiveContext } from "grommet";

import Button from "components/Button";

import Footer from "layouts/Footer";
import styles from "./page.module.scss";

// We need to copy styles from pages/landing/index.module.scss to app/page.module.scss
// For now I will assume I will create the style file next.

const LandingClient = () => {
  const margin = "medium";
  const sectionMargin = { vertical: "xlarge" };

  const size = useContext(ResponsiveContext);

  const { selectedCity } = useCities();

  return (
    <>
      <Grid fluid id={styles.landing} align="center">
        <section>
          <Row id={styles.intro}>
            <Col xs={12} md={12}>
              <Box margin={{ bottom: "1rem" }}>
                {size === "small" ? (
                  <Image
                    src={`/img/intro/MobileBanner.png`}
                    alt="banner"
                    width={400}
                    height={400}
                    style={{ width: "100%", height: "auto" }}
                    loading="eager"
                  />
                ) : (
                  <Image
                    src={`/img/intro/Banner.png`}
                    alt="banner"
                    width={1200}
                    height={540}
                    style={{ width: "100%", height: "auto" }}
                    loading="eager"
                  />
                )}
              </Box>
              <Box margin={{ vertical: "2.5rem" }} align="center">
                <Heading level={2}>Discover Your Local Art Scene</Heading>
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
                        href={`/studios/${
                          selectedCity ? selectedCity.slugName : ""
                        }`}
                        style={{ textDecoration: 'none' }}
                      >
                        <Button btnStyle="outline" as="div">
                          <Box margin={{ vertical: "1rem", horizontal: "1rem" }}>
                            Explore Studios
                          </Box>
                        </Button>
                      </Link>
                      <Text
                        size="medium"
                        alignSelf="center"
                        margin={{ vertical: "large" }}
                      >
                        Connect with artists, book a private visit to learn more
                        about their practice and process, and buy artworks
                        directly from them
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
                        href={`/events/${
                          selectedCity ? selectedCity.slugName : ""
                        }`}
                        style={{ textDecoration: 'none' }}
                      >
                        <Button btnStyle="outline" as="div">
                          <Box margin={{ vertical: "1rem", horizontal: "1rem" }}>
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
              <Box
                margin={sectionMargin}
                pad="large"
                align="center"
              >
                <Box fill>
                  <Row center="xs">
                    <Col xs={12} md={4}>
                      <Box align="center" pad="medium" gap="large">
                        <Search size={32} color="#FFC0CB" />
                        <Box
                          margin={{ top: "medium", bottom: "medium" }}
                          height="120px"
                        >
                          <Text size="large" weight="bold" textAlign="center">
                            Discover Art Studios
                          </Text>
                          <Text
                            size="medium"
                            textAlign="center"
                            margin={{ top: "small" }}
                          >
                            Find unique studios and inspiring events in your
                            neighborhood
                          </Text>
                        </Box>
                      </Box>
                    </Col>

                    <Col xs={12} md={4}>
                      <Box align="center" pad="medium" gap="large">
                        <Calendar size={32} color="#FFC0CB" />
                        <Box
                          margin={{ top: "medium", bottom: "medium" }}
                          height="120px"
                        >
                          <Text size="large" weight="bold" textAlign="center">
                            Book Your Visit
                          </Text>
                          <Text
                            size="medium"
                            textAlign="center"
                            margin={{ top: "small" }}
                          >
                            Schedule a private studio visit or join upcoming art
                            events
                          </Text>
                        </Box>
                      </Box>
                    </Col>

                    <Col xs={12} md={4}>
                      <Box align="center" pad="medium" gap="large">
                        <Users size={32} color="#FFC0CB" />
                        <Box
                          margin={{ top: "medium", bottom: "medium" }}
                          height="120px"
                        >
                          <Text size="large" weight="bold" textAlign="center">
                            Meet Local Artists
                          </Text>
                          <Text
                            size="medium"
                            textAlign="center"
                            margin={{ top: "small" }}
                          >
                            Connect and become part of your local art community
                          </Text>
                        </Box>
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
                      <Text size="large" margin="medium" weight={600}>
                        A digital platform to connect artists, collectors, and
                        art lovers.
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
                </Row>
                <Box margin={{ vertical: "large" }}></Box>
              </Box>
              <Box
                margin={sectionMargin}
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
                      <Link href={"/how-it-works/artists"} style={{ textDecoration: 'none' }}>
                        <Button btnStyle="outline" as="div">
                          <Box margin={"xsmall"}>
                            For Artists and Curators
                          </Box>
                        </Button>
                      </Link>
                      <Text
                        size="medium"
                        alignSelf="center"
                        margin={{ vertical: "large" }}
                      >
                        Find out how our platform works and how to offer to host
                        visits, workshops, and other art community events in
                        your studio.
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
                      <Link href={"/how-it-works/"} style={{ textDecoration: 'none' }}>
                        <Button btnStyle="outline" as="div">
                          <Box margin={"xsmall"}>
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
            </Col>
          </Row>
        </section>
      </Grid>
      <Footer />
    </>
  );
};

export default LandingClient;
