import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { fetchMagazinePosts } from "services/editorial";
import { useCities } from "services/city";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Paragraph, Text } from "grommet";

import SelectLocation from "components/SelectLocation";

import MagPostCard from "components/MagazineCard";
import WithFooter from "layouts/WithFooter";

import { titleCase } from "services/helpers/textFormat";

export default function Editorial() {
  const router = useRouter();
  const { city: citySlug } = router.query;

  const { selectedCity, selectCity } = useCities();

  const [isDifferentCity, setIsDifferentCity] = useState(true);

  const [magPosts, setMagPosts] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // First Effect: Handle city selection
  useEffect(() => {
    if (!citySlug) return; // Guard clause

    if (citySlug !== selectedCity?.slugName) {
      setIsDifferentCity(true);
      selectCity(citySlug);
    }
  }, [citySlug]); // Only depend on URL param changes

  // Second Effect: Fetch studios when city changes
  useEffect(() => {
    async function fetchMagPosts() {
      setLoading(true);
      setError(false);
      let tempPosts = await fetchMagazinePosts({
        selectedCity: selectedCity,
      });
      if (tempPosts?.length) {
        // console.log(tempPosts);
        setMagPosts(tempPosts);
      } else {
        setError("Unable to fetch articles");
      }
      setLoading(false);
    }

    if (selectedCity && isDifferentCity) {
      fetchMagPosts();
      setIsDifferentCity(false);
    }
  }, [selectedCity, isDifferentCity]);

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
                <Text margin="xsmall" fill>
                  A series of studio interviews and articles covering local art
                  topics and events
                </Text>
              </Box>
              {loading && <img src={`/img/loader.svg`} />}
              {error && (
                <>
                  <Box pad={{ horizontal: "medium", vertical: "large" }}>
                    <Text size="medium">
                      There are no articles in the city{" "}
                      <b>"{titleCase(citySlug)}"</b>. <br />
                      <br />
                      Please try to check the URL or choose another city from
                      below
                    </Text>
                  </Box>
                  {/* <b>Error: {JSON.stringify(error)}</b> */}
                </>
              )}

              <SelectLocation isBarFullWidth />
              {!loading && !error && magPosts && (
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
