// import React from "react";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
// import { NavLink } from "react-router-dom";
import Link from "next/link";

import ProgressiveImage from "react-progressive-image";
import Image from "next/image";

import styles from "./index.module.scss";

import { Box, Heading, Text } from "grommet";
import SearchBar from "components/SearchBar";
import Button from "components/Button";

const Intro = () => {
  const margin = "medium";
  const sectionMargin = { vertical: "12rem" };

  return (
    <Grid fluid id={styles.intro} align="center">
      <section>
        <Row id={styles.intro}>
          <Col xs={12} md={12}>
            <Box margin={{ bottom: "1rem" }}>
              <Image
                src={`/img/intro/banner-0.jpg`}
                alt="banner"
                layout="responsive"
                width="100%"
                height="45%"
              />
              <Text alignSelf="start">from Hoa Lua's studio</Text>
            </Box>
            <Box margin={{ vertical: "3rem" }} align="center">
              <Heading level={2} className="first">
                Meet the artist
              </Heading>
            </Box>

            <Box margin={{ vertical: "0rem", bottom: "12rem" }} align="center">
              <SearchBar />
            </Box>

            <Box margin={sectionMargin} align="center">
              <Heading level={2} margin={margin}>
                For artists
              </Heading>
              <Text size="medium">
                Show your work in your studio when and how you like.
              </Text>
            </Box>
            <Box margin={sectionMargin} align="center">
              <Heading level={2} margin={margin}>
                For art lovers and collectors
              </Heading>
              <Text size="medium">
                Explore new artists and visit their studios or show your own
                collection.
              </Text>
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
            <Box margin={sectionMargin} align="center">
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
            </Box>
          </Col>
        </Row>
        <Box margin={sectionMargin} align="center">
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
                    <Link href="/studios">Explore Artists</Link>
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
        </Box>
      </section>
    </Grid>
  );
};

export default Intro;
