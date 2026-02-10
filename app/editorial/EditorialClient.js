'use client';

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Text } from "grommet";
import MagPostCard from "components/MagazineCard";
import WithFooter from "layouts/WithFooter";

export default function EditorialClient({ magPosts }) {
  
  return (
    <WithFooter>
      <Grid fluid align="start">
        <section>
          <Row>
            <Col xs={12} md={12}>
              <Box pad="xsmall">
                <Heading level={2} margin="xsmall">
                  Editorial
                </Heading>
                <Text margin="xsmall">
                  A series of studio interviews and articles covering art
                  topics and events
                </Text>
              </Box>
              
              {(!magPosts || magPosts.length === 0) ? (
                <Box pad={{ horizontal: "medium", vertical: "large" }}>
                  <Text size="medium">
                    There are no articles at the moment.
                  </Text>
                </Box>
              ) : (
                  <Box pad="small">
                    {magPosts.map((magPost) => (
                        <MagPostCard key={magPost.id} magPost={magPost} />
                    ))}
                  </Box>
              )}
            </Col>
          </Row>
        </section>
      </Grid>
    </WithFooter>
  );
}