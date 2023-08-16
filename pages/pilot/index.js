import { useContext } from "react";


import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import Link from "next/link";

import ProgressiveImage from "react-progressive-image";
import Image from "next/image";



import styles from "./index.module.scss";

import { Box, Heading, Text, ResponsiveContext } from "grommet";
import SearchBar from "components/SearchBar";
import StudiosFeatured from "components/StudiosFeatured";

import Button from "components/Button";

import FEATURED_STUDIO from "config/featured";

const Pilot = () => {
  const margin = "medium";
  const sectionMargin = { vertical: "20em" };

  const size = useContext(ResponsiveContext);

  // import { useMediaQuery, maxWidths } from "hooks/useMediaQuery";
  // const isTablet = useMediaQuery(`(max-width: ${maxWidths.tablet}px)`);
  // replaced by https://v2.grommet.io/responsivecontext


  return (
    <Grid fluid id={styles.pilot} align="center">
      <section>
        <Row id={styles.intro}>
          <Col xs={12} md={12}>
            <Box margin={{ bottom: "1rem" }}>
              {size === "small" ?
                <Image
                  src={`/img/intro/banner-pilot-vertical.jpg`}
                  alt="banner"
                  layout="responsive"
                  width="100%"
                  height="120%"
                /> :
                <Image
                  src={`/img/intro/banner-pilot.jpg`}
                  alt="banner"
                  layout="responsive"
                  width="100%"
                  height="45%"
                />}

            </Box>
            <Box margin={{ vertical: "3rem" }} align="center">
              <Heading level={2} className="first">
                Something
              </Heading>
              <Text> more about event here</Text>
            </Box>

            <Box margin={{ vertical: "0rem", bottom: "12rem" }} align="center">
              <SearchBar isBarFullWidth />
            </Box>

            {/* <Box margin={sectionMargin} align="center">
              <Heading level={2} margin={margin}>
                For artists
              </Heading>
              <Text size="medium">
                Show your work in your studio when and how you like.
              </Text>
            </Box>
            <Box margin={margin} align="center">
              <Heading level={2} margin={margin}>
                For art lovers and collectors
              </Heading>
              <Text size="medium">
                Explore new artists and visit their studios or show your own
                collection.
              </Text>
            </Box> */}

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
                    <Text size="medium">1. Add your studio or space</Text>
                  </Col>
                  <Col md={4}>
                    <Text size="medium">2. Confirm a visit</Text>
                  </Col>
                  <Col md={4}>
                    <Text size="medium">3. Host someone in your studio</Text>
                  </Col>
                </Row>
              </Box>
            </Box>

            {/* <Box margin={sectionMargin} align="center">
              <Heading level={2} margin={margin}>
                What we are preparing in our studio
              </Heading>
              <Text size="medium" margin={margin}>
                As you are reading this, we are working on adding more core
                features.
              </Text>
              <ul>
                <li>Host a one-time mini event in your space</li>
                <li>Review your visit experience</li>
                <li>
                  Buy art in the app with a certficate of authencity and arrange
                  professional shipping
                </li>
                <li>Organize your art collection</li>
              </ul>
            </Box> */}
          </Col>
        </Row>
        {/* <Box margin={margin} align="center">
          <Row>
            <Heading level={2} margin={{ vertical: "1rem" }}>
              Ready to give it a try?
            </Heading>
          </Row>
          <Row>
            <Col xs={12} md={6}>
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
                <br />
                <Text size="medium" margin="medium">
                  Discover artists by location or medium and plan a visit to
                  their studios
                </Text>
                <Text size="small">
                  We will help you get in touch with them.
                </Text>
              </Box>
            </Col>

            <Col xs={12} md={6}>
              <Box
                align="center"
                pad={{ vertical: "small" }}
                margin={{ vertical: "xlarge" }}
              >
                <Button btnStyle="outline">
                  <Box margin={{ vertical: "1rem", horizontal: "1rem" }}>
                    <Link href="/join">Add Your Space</Link>
                  </Box>
                </Button>
                <br />
                <Text size="medium" margin="medium">
                  Have a studio or a space where you are creative and want to
                  share your finished work?
                </Text>

                <Text size="small">Tell us about it and we will add it.</Text>
              </Box>
            </Col>
          </Row>
        </Box> */}
      </section>
    </Grid>
  );
};

export default Pilot;
