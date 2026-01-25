'use client';

import React, { useContext } from "react";
import Link from "next/link";
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

const HowArtistsClient = () => {
  const size = useContext(ResponsiveContext);

  return (
    <>
      <Box pad={size === "small" ? "medium" : "large"}>
        <Grid fluid>
          <Row>
            <Col xs={12}>
              <Box align="center" margin={{ top: "medium", bottom: "xlarge" }}>
                <Heading level={3} margin="none" textAlign="center">
                  How It Works
                  <br />
                  <br />
                  for Artists and Curators
                </Heading>
              </Box>

              <Box margin={{ vertical: "large" }} gap="small">
                <Heading level={2} margin={{ bottom: "medium" }}>
                  What is a Studio?
                </Heading>
                <Paragraph fill>
                  Our definition of a studio is quite flexible. It can be a
                  large studio workshop, or a private space in an artist's home,
                  or a small exhibition or art community center. The key is that
                  it is a place where art is created and shared.
                </Paragraph>
              </Box>
              <Box margin={{ vertical: "medium" }}>
                <Heading level={2} margin={{ bottom: "medium" }}>
                  Philosophy
                </Heading>

                <Box gap="medium">
                  <Paragraph fill>
                    We put the artists first. We believe that artists should be
                    able to focus on their work and not worry about marketing
                    and sales. We provide a platform where artists can showcase
                    their work, connect with art lovers, and sell their art. We
                    are committed to helping artists succeed and thrive.
                  </Paragraph>

                  <Paragraph fill>
                    We believe that a for-profit model is the best way to ensure
                    that Arti remains sustainable and can continue to support
                    artists and the art community. We are committed to
                    transparency and fairness. We will always be open about how
                    we operate and how we make money. We tried as much as
                    possible to embody our goals and values directly in the
                    platform's functionalities.
                  </Paragraph>
                </Box>

                <Box margin={{ vertical: "large" }}>
                  <Heading level={2} margin={{ bottom: "medium" }}>
                    In Brief
                  </Heading>

                  <Paragraph fill></Paragraph>

                  <ul>
                    <Box
                      margin={{ top: "large", horizontal: "medium" }}
                      gap="small"
                    >
                      <li>
                        <Text> All accounts are and will always be free.</Text>
                      </li>
                      <li>
                        <Text>
                          We ask for a 15% comission fee for artworks sold via
                          private studio studios.
                        </Text>
                      </li>
                      <li>
                        <Text>
                          We ask for a 7.5% comission fee for paid events.
                          {/* // There is no comission fee for events.  */}
                        </Text>
                      </li>
                      <li>
                        <Text>
                          We will give back a percentage of our yearly net
                          profit to the art community.
                        </Text>
                      </li>
                      <li>
                        <Text>
                          Your data is private. We will not use it without your
                          consent.
                        </Text>
                      </li>
                      <li>
                        <Text>We will not spam you.</Text>
                      </li>
                      <li>
                        <Text>
                          We do not tolerate any kind of sexism, racism and
                          other forms of discrimination.
                        </Text>
                      </li>
                    </Box>
                  </ul>
                </Box>
              </Box>

              <Box margin={{ vertical: "large" }} gap="small">
                <Heading level={2} margin={{ bottom: "medium" }}>
                  Curation
                </Heading>

                <Paragraph fill>
                  We believe that curation is an essential part of the art
                  world, and we support an open model where artists and curators
                  can help create their own art communities.
                </Paragraph>

                <Paragraph fill>
                  For each art community, we will work with local curators or
                  managers to ensure that the selected studios and events
                  represent the local art scene. The curator will be responsible
                  for inviting artists and organizing events. If you are
                  interested in playing this role, please write us an email at{" "}
                  <b>join@arti.my</b> {"  "} and we will be happy to schedule a
                  call with you.
                </Paragraph>

                <Paragraph fill>
                  Artists and curators with an Arti account are able to send
                  invitation links to a limited number of other artists and
                  curators. This way, we ensure that the platform grows in a
                  sustainable way and that the community grows organically.
                </Paragraph>
                <Paragraph fill>
                  Artists and curators without an account can request to{" "}
                  <a href="/join">
                    <b>join Arti</b>
                  </a>
                  . We will review their portfolio and once accepted, they can
                  create a profile and start showcasing their work.
                </Paragraph>
              </Box>

              <Box margin={{ vertical: "large" }} gap="small">
                <Heading level={2} margin={{ bottom: "medium" }}>
                  Giving Back
                </Heading>

                <Paragraph fill>
                  We will give back a percentage of our yearly net profit to the
                  art community. Which projects and organizations we support
                  will be open to recommendations. We will also provide grants
                  to artists and curators to help them create new work and
                  exhibitions.
                </Paragraph>
              </Box>

              <Box margin={{ vertical: "large" }} gap="small">
                <Heading level={2} margin={{ bottom: "medium" }}>
                  The Future
                </Heading>

                <Box gap="medium">
                  <CirclePoint>Promotion and Outreach</CirclePoint>
                  <Paragraph fill>
                    In the immediate future, We will focus our efforts on
                    promoting artists and studios on the platform and on social
                    media. More importantly, we will work on creating a healthy
                    network of art lovers and collectors who are interested in
                    discovering emerging artists and supporting them. We will
                    offer educational resources especially to young and beginner
                    collectors to help guide them to develop in their journey
                    and practice and in making informed decisions.
                  </Paragraph>
                  <CirclePoint>
                    Support with Logisitics and Certificates
                  </CirclePoint>
                  <Paragraph fill>
                    We will work to help artists and collectors with the
                    logistics of shipping and delivering artworks securely. We
                    also plan on building a system to create decentralized
                    Certificates of Authenticity for artworks. The system may be
                    based on blockchain technology where each artwork will have
                    a unique digital signature, and when it is sold a second
                    time, the artist will receive an agreed upon percentage of
                    the sale.
                  </Paragraph>

                  <CirclePoint> Artists as Decision Makers</CirclePoint>
                  <Paragraph fill>
                    To protect Arti's core mission of supporting independent
                    artists and fostering a more accessible art world, we
                    propose a voting system where artists and curators can veto
                    major changes. This system would prevent future schemes and
                    policies that prioritize profit over the community's
                    interests. By giving creators a direct say in Arti's
                    development, we can avoid the pitfalls of other platforms
                    that, after gaining popularity, exploit their users for
                    financial gain.
                  </Paragraph>
                  <Paragraph fill>
                    The proposed voting system ensures that Arti remains true to
                    its original vision.
                  </Paragraph>
                </Box>
              </Box>
            </Col>
          </Row>
        </Grid>
      </Box>
    </>
  );
};

export default HowArtistsClient;
