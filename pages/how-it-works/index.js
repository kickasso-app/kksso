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

const How = () => {
  const size = useContext(ResponsiveContext);

  return (
    <Box pad={size === "small" ? "medium" : "large"}>
      <Grid fluid>
        <Row>
          <Col xs={12}>
            <Box align="center" margin={{ top: "medium", bottom: "large" }}>
              <Heading level={3} margin="none" textAlign="center">
                For Art Lovers and Collectors
                <br /> Demo Text
              </Heading>
            </Box>

            <Box margin={{ vertical: "large" }} gap="small">
              <Heading level={2} margin={{ bottom: "medium" }}>
                What is a Studio Visit?
              </Heading>
              <Paragraph fill>
                A studio visit is a unique opportunity to experience art in its
                birthplace. Whether it's a spacious workshop or an intimate home
                studio, you'll get to see artworks in progress, learn about the
                artist's process, and connect with creators personally.
              </Paragraph>
            </Box>

            <Box margin={{ vertical: "medium" }}>
              <Heading level={2} margin={{ bottom: "medium" }}>
                Our Approach
              </Heading>

              <Box gap="medium">
                <Paragraph fill>
                  We believe in making art more accessible and personal. By
                  connecting you directly with artists, you can discover unique
                  pieces, understand their stories, and build meaningful
                  relationships with creators.
                </Paragraph>

                <Paragraph fill>
                  Our platform focuses on transparency and authenticity. We
                  carefully select artists and provide you with all the
                  information you need to make informed decisions about your art
                  journey.
                </Paragraph>
              </Box>

              <Box margin={{ vertical: "large" }}>
                <Heading level={2} margin={{ bottom: "medium" }}>
                  What You Get
                </Heading>

                <ul>
                  <Box
                    margin={{ top: "large", horizontal: "medium" }}
                    gap="small"
                  >
                    <li>
                      <Text>
                        Free account with access to all studios and events
                      </Text>
                    </li>
                    <li>
                      <Text>Direct connection with artists</Text>
                    </li>
                    <li>
                      <Text>Unique art experiences through private visits</Text>
                    </li>
                    <li>
                      <Text>Exclusive events and workshops</Text>
                    </li>
                    <li>
                      <Text>Secure art purchasing directly from artists</Text>
                    </li>
                    <li>
                      <Text>Personal data privacy protection</Text>
                    </li>
                    <li>
                      <Text>Inclusive, discrimination-free community</Text>
                    </li>
                  </Box>
                </ul>
              </Box>
            </Box>

            <Box margin={{ vertical: "large" }} gap="small">
              <Heading level={2} margin={{ bottom: "medium" }}>
                Discovering Art
              </Heading>

              <Paragraph fill>
                Browse through our curated selection of local artists and find
                unique pieces that speak to you. Each artist's profile gives you
                insight into their practice, style, and available works.
              </Paragraph>

              <Paragraph fill>
                We work with local art experts to ensure you discover authentic
                and quality artwork. Our platform helps you explore different
                styles and mediums while learning about the local art scene.
              </Paragraph>
            </Box>

            <Box margin={{ vertical: "large" }} gap="small">
              <Heading level={2} margin={{ bottom: "medium" }}>
                Starting Your Collection
              </Heading>

              <Box gap="medium">
                <CirclePoint>Personal Connection</CirclePoint>
                <Paragraph fill>
                  Meet artists in their creative space, understand their
                  inspiration, and build a personal connection with the artwork
                  before adding it to your collection.
                </Paragraph>

                <CirclePoint>Transparent Process</CirclePoint>
                <Paragraph fill>
                  Every artwork comes with clear pricing and authenticity
                  information. Purchase directly from artists with secure
                  payment processing and proper documentation.
                </Paragraph>

                <CirclePoint>Long-term Support</CirclePoint>
                <Paragraph fill>
                  We're developing a system for digital Certificates of
                  Authenticity and secure artwork tracking. This ensures the
                  provenance of your collection and supports artists through
                  future resales.
                </Paragraph>
              </Box>
            </Box>
          </Col>
        </Row>
      </Grid>
    </Box>
  );
};

export default How;
