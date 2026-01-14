import React, { useContext } from "react";
import CustomHead from "layouts/CustomHead";

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

const How = () => {
  const size = useContext(ResponsiveContext);

  return (
    <>
      <CustomHead
        pageSlug="how-it-works"
        title="How It Works for Art Lovers and Collectors"
        description="How It Works for Art Lovers and Collectors - Arti is a platform to connect artists, art lovers, and collectors via studio visits and events."
      />

      <Box pad={size === "small" ? "medium" : "large"}>
        <Grid fluid>
          <Row>
            <Col xs={12}>
              <Box align="center" margin={{ top: "medium", bottom: "xlarge" }}>
                <Heading level={3} margin="none" textAlign="center">
                  How It Works <br />
                  <br />
                  for Art Lovers and Collectors
                </Heading>
              </Box>

              <Box margin={{ vertical: "large" }} gap="small">
                <Heading level={2} margin={{ bottom: "medium" }}>
                  Why the Studio?
                </Heading>
                <Paragraph fill>
                  We believe studios are a great place to share art, and that
                  original art stands outs. We are committed to helping art
                  communities thrive.
                </Paragraph>
                <Paragraph fill>
                  A studio visit is a unique opportunity to experience art in
                  the making . Whether it's a spacious workshop or an intimate
                  home studio, you'll get to see artworks in progress, learn
                  about the artist's process and practice, and connect with them
                  personally.
                </Paragraph>
              </Box>

              <Box margin={{ vertical: "medium" }}>
                <Heading level={2} margin={{ bottom: "medium" }}>
                  Philosophy
                </Heading>

                <Box gap="medium">
                  <Paragraph fill>
                    We believe that collecting art is an art form in itself.
                    It's about more than just acquiring objects. It's about
                    forging a personal connection with the artist's vision. Each
                    piece becomes a part of the collector's story, reflecting
                    their values, passions, and unique perspective on the world.
                  </Paragraph>
                  <Paragraph fill>
                    A for-profit model is the best way to ensure that Arti
                    remains sustainable and can continue to support artists and
                    the art community. We are committed to transparency and
                    fairness. We will always be open about how we operate and
                    how we make money. We tried as much as possible to embody
                    our goals and values directly in the platform's
                    functionalities.
                  </Paragraph>
                </Box>

                <Box margin={{ vertical: "large" }}>
                  <Heading level={2} margin={{ bottom: "medium" }}>
                    In Brief
                  </Heading>

                  <ul>
                    <Box
                      margin={{ top: "large", horizontal: "medium" }}
                      gap="small"
                    >
                      <li>
                        <Text>
                          You don't need to create an account to request a
                          private studio visit or join an event.
                        </Text>
                      </li>
                      <li>
                        <Text>
                          We ask for a 15% comission fee for artworks sold via
                          studio studios.
                        </Text>
                      </li>
                      <li>
                        <Text>
                          We will give back a percentage of our yearly net
                          profit to the art community.
                        </Text>
                      </li>
                      <li>
                        <Text>We will not spam you.</Text>
                      </li>
                      <li>
                        <Text>
                          Your data is private. We will not use it without your
                          consent.
                        </Text>
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
                  for inviting artists and organizing events such as studio
                  tours.
                </Paragraph>
              </Box>

              <Box margin={{ vertical: "large" }} gap="small">
                <Heading level={2} margin={{ bottom: "medium" }}>
                  The Future
                </Heading>

                <Box gap="medium">
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

                  <CirclePoint>Resources</CirclePoint>
                  <Paragraph fill>
                    We will work on creating a healthy network of art lovers and
                    collectors who are interested in discovering emerging
                    artists and supporting them. We will offer educational
                    resources especially to young and beginner collectors to
                    help guide them to develop in their journey and practice and
                    in making informed decisions.
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

export default How;
