"use client";

import React, { useContext } from "react";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Text, Paragraph, ResponsiveContext } from "grommet";
import { Circle } from "react-feather";

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

const ArtiNightClient = () => {
  const size = useContext(ResponsiveContext);

  return (
    <>
      <Box pad={size === "small" ? "medium" : "large"}>
        <Grid fluid>
          <Row>
            <Col xs={12}>
              <Box align="center" margin={{ top: "medium", bottom: "xlarge" }}>
                <Heading level={3} margin="none" textAlign="center">
                  Hosting an Arti Night
                </Heading>
              </Box>

              <Box margin={{ vertical: "large" }} gap="small">
                <Heading level={2} margin={{ bottom: "medium" }}>
                  What is an Arti Night?
                </Heading>
                <Paragraph fill>
                  An Arti Night is one evening in one studio with a small group
                  of guests. The artist shares a work in progress and part of their process,
                  there is something to drink, and there is a small table of affordable
                  works. It is closer to being invited into
                  a kitchen while someone cooks than to an opening.
                </Paragraph>
                <Paragraph fill>
                  We created this open format because most artists’ work never
                  reaches the people who would love it. An Arti Night brings
                  people into your studio who would not otherwise find it, and
                  makes a first purchase feel normal. Anyone may host one, and
                  we ask for no fee, application, or approval.
                </Paragraph>
              </Box>

              <Box margin={{ vertical: "large" }} gap="small">
                <Heading level={2} margin={{ bottom: "medium" }}>
                  The Three Rules
                </Heading>
                <Paragraph fill>
                  Every Arti Night follows three rules. Everything else is
                  yours to shape.
                </Paragraph>

                <Box gap="medium" margin={{ top: "medium" }}>
                  <CirclePoint>Process</CirclePoint>
                  <Paragraph fill>
                    Show the making, not only the made. Demonstrate a
                    technique, walk through a work in progress, or tell the
                    story of one piece from first idea to final form.
                  </Paragraph>

                  <CirclePoint>Prices</CirclePoint>
                  <Paragraph fill>
                    Display a small selection of works with prices clearly
                    marked in an affordable range. Nobody is ever pressured to buy.
                  </Paragraph>

                  <CirclePoint>Plus-one</CirclePoint>
                  <Paragraph fill>
                    Every guest is asked to bring one person who is curious but has
                    never bought an original artwork.
                  </Paragraph>
                </Box>
              </Box>

              <Box margin={{ vertical: "large" }} gap="small">
                <Heading level={2} margin={{ bottom: "medium" }}>
                  In Brief
                </Heading>
                <ul>
                  <Box margin={{ horizontal: "medium" }} gap="small">
                    <li>
                      <Text>
                        8 to 16 guests, about three hours.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        The host can be the artist, or a curator or friend
                        hosting for an artist. We find the latter often works
                        better, since the artist should not have to perform
                        and pour drinks at the same time.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        You choose the money model and state it upfront: free,
                        ticketed on a sliding scale to cover drinks and pay the
                        artist for the evening, or a workshop where guests make
                        something with the artist’s technique.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        Artwork sales are always 100% between artist and buyer.
                        If you have an Arti profile, you can record the sale
                        there and issue a certificate of authenticity to the
                        buyer.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        Afterwards, we ask for a few photos, your impressions of the event,
                        and two numbers: how many guests attended and works sold.
                      </Text>
                    </li>
                  </Box>
                </ul>
              </Box>

              <Box margin={{ vertical: "large" }} gap="small">
                <Heading level={2} margin={{ bottom: "medium" }}>
                  Getting Started
                </Heading>
                <Paragraph fill>
                  The minimum version is small: one artist, one studio, eight
                  guests of whom four have never bought art, one demonstration,
                  five small works with prices on paper labels, and a sign-up
                  sheet by the door. That is a complete Arti Night.
                </Paragraph>
                <Paragraph fill>
                  If you would like to host one, write to us at{" "}
                  <a href="mailto:hello@arti.my">
                    <b>hello@arti.my</b>
                  </a>
                  . We will add your evening to our shared events and send you
                  the materials.
                </Paragraph>
              </Box>
            </Col>
          </Row>
        </Grid>
      </Box>
    </>
  );
};

export default ArtiNightClient;
