'use client';

import { useEffect } from "react";
import { useCities } from "services/city";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Text } from "grommet";
import SelectLocation from "components/SelectLocation";
import MagPostCard from "components/MagazineCard";
import WithFooter from "layouts/WithFooter";
import { titleCase } from "services/helpers/textFormat";

export default function EditorialCityClient({ magPosts, city }) {
  const { selectedCity, selectCity } = useCities();

  useEffect(() => {
    if (city && city !== selectedCity?.slugName) {
      selectCity(city);
    }
  }, [city, selectedCity, selectCity]);

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
                  A series of studio interviews and articles covering local art
                  topics and events
                </Text>
              </Box>
              
              {(!magPosts || magPosts.length === 0) ? (
                <>
                  <Box pad={{ horizontal: "medium", vertical: "large" }}>
                    <Text size="medium">
                      There are no articles in the city{" "}
                      <b>"{titleCase(city)}"</b>. <br />
                      <br />
                      Please try to check the URL or choose another city from
                      below
                    </Text>
                  </Box>
                  <SelectLocation isBarFullWidth />
                </>
              ) : (
                  <>
                  <SelectLocation isBarFullWidth />
                  <Box pad="small">
                    {magPosts.map((magPost) => (
                        <MagPostCard key={magPost.id} magPost={magPost} />
                    ))}
                    </Box>
                  </>
              )}
            </Col>
          </Row>
        </section>
      </Grid>
    </WithFooter>
  );
}
