import { useContext } from "react";
import { Search, Calendar, Users } from "react-feather";

import { useCities } from "services/city";
import { useRouter } from "next/router";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import Link from "next/link";
import Image from "next/image";

import { featureFlags } from "config/feature-flags";

import { Box, Heading, Text, ResponsiveContext } from "grommet";

import SearchBar from "components/SearchBar";
import SelectLocation from "components/SelectLocation";
import StudiosFeatured from "components/StudiosFeatured";
import Button from "components/Button";

import { createSlug } from "services/helpers/textFormat";

import styles from "./index.module.scss";

const Pilot = () => {
  const margin = "medium";
  const sectionMargin = { vertical: "xlarge" };

  const size = useContext(ResponsiveContext);

  const router = useRouter();

  const { selectedCity } = useCities();

  return (
    <Grid fluid id={styles.pilot} align="center">
      <section>
        <Row id={styles.intro}>
          <Col xs={12} md={12}>
            <Box margin={{ bottom: "1rem" }}>
              {size === "small" ? (
                <Image
                  src={`/img/intro/MobileBanner.png`}
                  alt="banner"
                  layout="responsive"
                  width="100%"
                  height="100%"
                />
              ) : (
                <Image
                  src={`/img/intro/Banner.png`}
                  alt="banner"
                  layout="responsive"
                  width="100%"
                  height="45%"
                />
              )}
            </Box>
            <Box margin={{ vertical: "2.5rem" }} align="center">
              <Heading level={2}>
                Discover art studios and events near you
              </Heading>
            </Box>
            {/*<Box margin={{ vertical: "1rem", bottom: "12rem" }} align="center">
              {featureFlags.studiosByCities === false ? (
                <SearchBar isBarFullWidth />
              ) : (
                <SelectLocation isBarFullWidth />
              )}
            </Box>{" "}
            */}
            <Box
              margin={sectionMargin}
              // margin={{ vertical: "xlarge" }}
              pad={{ horizontal: "small", vertical: "small" }}
              align="center"
              direction="column"
            >
              {/* <Heading level={2} margin={"xs"}>
                    Featured Studios
                    </Heading>
                    <Box fill pad="small">
                    <StudiosFeatured />
                    </Box> */}

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
                      <Box margin={{ vertical: "1rem", horizontal: "1rem" }}>
                        <Link
                          href={
                            "/studios/" + createSlug(selectedCity ?? "Berlin")
                          }
                          onClick={async () => {
                            {
                              if (!selectedCity) {
                                await selectCity("Berlin");
                              }
                              router.push(
                                "/studios/" + createSlug(selectedCity)
                              );
                            }
                          }}
                        >
                          Explore Studios
                        </Link>
                      </Box>
                    </Button>
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
                    <Button btnStyle="outline">
                      <Box margin={{ vertical: "1rem", horizontal: "1rem" }}>
                        <Link
                          href={
                            "/events/" + createSlug(selectedCity ?? "Berlin")
                          }
                          onClick={async () => {
                            {
                              if (!selectedCity) {
                                await selectCity("Berlin");
                              }
                              router.push(
                                "/events/" + createSlug(selectedCity)
                              );
                            }
                          }}
                        >
                          Join Events
                        </Link>
                      </Box>
                    </Button>
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
              // background="light-1"
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
                      why we built a platform to connect the art world by studio
                      visits.
                      <br />
                      <br />
                      Artists offer to open their studios and host events, while
                      art lovers and collectors explore the creative process
                      more intimately and buy artworks directly.
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
            <Box
              margin={sectionMargin}
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
                    <Text
                      size="medium"
                      alignSelf="center"
                      margin={{ vertical: "large" }}
                    >
                      Find out how our platform works and how to offer to host
                      visits, workshops, and other art community events in your
                      studio.
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
                    <Button btnStyle="outline">
                      <Box margin={"xsmall"}>
                        <Link href={"/how-it-works/"}>
                          For Art Lovers and Collectors
                        </Link>
                      </Box>
                    </Button>
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
  );
};

export default Pilot;
