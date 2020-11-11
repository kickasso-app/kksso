import React from "react";
import { Grid, Row, Col } from "react-flexbox-grid";
import { NavLink } from "react-router-dom";
import ProgressiveImage from "react-progressive-image";

import "./styles/intro.scss";

import { Grommet, Box, Heading, Paragraph, Text } from "grommet";
import { grommet } from "grommet/themes";

const paragraphFiller = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua.
`;

const Intro = () => {
  const margin = "medium";
  const sectionMargin = { vertical: "12rem" };

  return (
    <Grid fluid id="intro" textAlign="center" align="center">
      <section>
        <Row id="intro">
          <Col xs={12} md={12}>
            <ProgressiveImage
              src={`/img/intro/banner-0.jpg`}
              placeholder={`https://drive.google.com/uc?id=1m_AKM-NObKai64_ErCrVm8uQD3009m5z`}
            >
              {(src, loading) => (
                <img
                  style={{
                    margin: loading ? "33.3%" : "0",
                    width: loading ? "33.3%" : "100%",
                  }}
                  src={src}
                  alt="banner"
                />
              )}
            </ProgressiveImage>
          </Col>
          <Col xs={12} md={12}>
            <Box margin={{ vertical: "6rem" }} align="center">
              <Heading level={2} margin="xlarge" className="first">
                expand the art space.
              </Heading>
            </Box>
            <Box margin={sectionMargin} align="center">
              <Heading level={2} margin={margin}>
                For artists
              </Heading>
              <Text size="medium">
                Show your work in you studio when and how you like.
              </Text>
            </Box>
            <Box margin={sectionMargin} align="center">
              <Heading level={2} margin={margin}>
                For art lovers and collectors
              </Heading>
              <Text size="medium">
                You can either explore new artists and visit their studios or
                show your own collection.
              </Text>
            </Box>

            <Box margin={sectionMargin} pad="medium" align="center">
              <Heading level={2} margin={margin}>
                How it works?
              </Heading>
              <Row>
                <Col md={4}>
                  {" "}
                  <Text size="medium">1. Add your studio or space</Text>
                </Col>
                <Col md={4}>
                  <Text size="medium">2. Confirm a visit</Text>
                </Col>
                <Col md={4}>
                  <Text size="medium">3. Host someone in your studio</Text>{" "}
                </Col>
              </Row>{" "}
            </Box>
            <Box margin={sectionMargin} align="center">
              <Heading level={2} margin={margin}>
                What we are preparing in our studio
              </Heading>
              <Text size="medium" margin={margin}>
                As you are reading this, we are working on adding more core
                features.
              </Text>
              <Text size="medium">
                - Host a one-time mini event in your space
                <br />- Review your visit experience
                <br />- Buy art in the app with a certficate of authencity and
                arrange professional shipping
                <br />- Organize your art collection
              </Text>
            </Box>
          </Col>
        </Row>
        <Row margin={sectionMargin} align="center">
          <Col xs={12} md={6}>
            <Box
              align="center"
              pad={{ vertical: "small" }}
              margin={{ vertical: "xlarge" }}
            >
              <button className="button">
                <NavLink exact to="/join">
                  List Your Space
                </NavLink>
              </button>
              <Text size="medium" margin="medium">
                Have a studio or a space where you are creative and want to
                share your finished work?
                {/* {/* Do you have a collection want to share with others */}
              </Text>

              <Text size="small">Tell us about it and we will add it.</Text>
            </Box>
          </Col>
          <Col xs={12} md={6}>
            <Box
              align="center"
              pad={{ vertical: "small" }}
              margin={{ vertical: "xlarge" }}
            >
              <button className="button">
                <NavLink exact to="/studios">
                  Explore Artists
                </NavLink>
              </button>

              <Text size="medium" margin="medium">
                {" "}
                Do you want to get in contact with an artist and plan a visit to
                their studios?
              </Text>
              <Text size="small">Write us about it and we will add it.</Text>
            </Box>
          </Col>
        </Row>
      </section>
      {/* <Paragraph size="small" margin={margin}>
                Paragraph - Small
                {paragraphFiller}
              </Paragraph> */}
    </Grid>
  );
};

export default Intro;
