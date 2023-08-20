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
            <Box margin={{ bottom: "1rem" }}>
              {size === "small" ?
                <Image
                  src={`/img/pilot/MobileBanner.png`}
                  alt="banner"
                  layout="responsive"
                  width="100%"
                  height="100%"
                /> :
                <Image
                  src={`/img/pilot/Banner.png`}
                  alt="banner"
                  layout="responsive"
                  width="100%"
                  height="45%"
                />
              }
            </Box>
            <Box margin={{ vertical: "3rem" }} align="center">
              <Heading level={size === "small" ? 2 : 3}>
                Explore art studios near you
              </Heading>
            </Box>

            <Box margin={{ vertical: "0rem", bottom: "12rem" }} align="center">
              <SearchBar isBarFullWidth />
            </Box>


            <Box margin={sectionMargin} pad="medium" align="center">
              <Heading level={2} margin={"xs"}>
                Featured Studios
              </Heading>
              <Box fill pad="small">
                <StudiosFeatured />
              </Box>
            </Box>
            <Box margin={sectionMargin} pad="medium" align="center">
              <Heading level={2} margin={margin}>
                How it works?
              </Heading>
              <Box fill pad="large">
                <Row>
                  <Col md={4}>
                    <Text size="xlarge" alignSelf="center" >1.</Text>
                    <Box margin={{ top: "medium", bottom: "xlarge" }}>
                      <Text size="medium">Explore studios of artists nearby </Text>
                    </Box>
                  </Col>
                  <Col md={4}>
                    <Text size="xlarge" alignSelf="center">2.</Text>
                    <Box margin={{ top: "medium", bottom: "xlarge" }}>
                      <Text size="medium">Fall in love with some artworks and request a visit</Text>
                    </Box>
                  </Col>
                  <Col md={4}>
                    <Text size="xlarge" alignSelf="center">3.</Text>
                    <Box margin={{ top: "medium", bottom: "xlarge" }}>
                      <Text size="medium">When they accept, go visit them and discover more about what inspires them</Text>
                    </Box>
                  </Col>
                </Row>
              </Box>
            </Box>

            <Box pad="medium">
              <Row>
                <Col md={6}>
                  <Box margin={sectionMargin} >
                    <Box margin={size === "small" ? { top: "medium", bottom: "xlarge" } : "none"}>
                      <Heading level={2} margin={size === "small" ? { vertical: "large", horizontal: "medium" } : { horizontal: "large" }}>
                        Art is an experience, <br />not an object.
                      </Heading>
                    </Box>
                  </Box>
                </Col>
                <Col md={6}>
                  <Box margin="medium">
                    <Text size="large" margin="medium" weight="600">
                      A digital platform to connect artists, collectors, and art lovers.
                    </Text>
                    <Text size="medium" alignSelf="end" textAlign="start" margin={{ vertical: "medium" }}>
                      We believe studios are a great place to share art, and that's why we want to connect the art world by studio visits.
                      <br /><br />
                      In arti, artists can offer to host studio visits, and collectors and art lovers get to explore the creative process more intimately and buy artworks directly.
                      {/* Studios are a great place to share art and creativity.
                      Studio visits help as well fill the gap of having a direct channel between artists and collectors.
                      This way artists can show their work how and to whom they prefer. */}
                      {/* For collectors, they get to explore the creative process more intimately and buy artworks directly from local artists. */}
                    </Text>
                  </Box>
                </Col>

                <Col xs={12}>
                  <Box
                    align="center"
                    pad={{ vertical: "small" }}
                    margin={{ vertical: "xlarge" }}
                  >
                    <Button btnStyle="outline">
                      <Box margin={{ vertical: "1rem", horizontal: "1rem" }}>
                        <Link href="/studios">Explore Studios</Link>
                      </Box>
                    </Button>
                  </Box>
                </Col>

              </Row>
            </Box>
          </Col>
        </Row>


      </section>
    </Grid >
  );
};

export default Pilot;
