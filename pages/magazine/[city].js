import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { fetchMagazinePosts } from "services/magazine";
import { useCities } from "services/city";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import Masonry from "react-masonry-css";
import { Box, Heading, Text } from "grommet";

import SelectLocation from "components/SelectLocation";

import MagPostCard from "components/MagazineCard";
import { titleCase, undoSlug } from "services/helpers/textFormat";

// Optionally reuse masonry styles from StudiosFilter or create your own
import styles from "components/StudiosFilter/index.module.scss";

export default function Magazine() {
  const router = useRouter();
  const { city } = router.query;

  const { selectedCity, selectCity } = useCities();

  const [isDifferentCity, setIsDifferentCity] = useState(true);

  const [magPosts, setMagPosts] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // First Effect: Handle city selection
  useEffect(() => {
    if (!city) return; // Guard clause

    const cityName = titleCase(undoSlug(city));
    if (cityName !== selectedCity) {
      setIsDifferentCity(true);
      selectCity(cityName);
    }
  }, [city]); // Only depend on URL param changes

  // Second Effect: Fetch studios when city changes
  useEffect(() => {
    async function fetchMagPosts() {
      let tempPosts = await fetchMagazinePosts({ selectedCity: selectedCity });
      if (tempPosts?.length) {
        console.log(tempPosts);
        setMagPosts(tempPosts);
      }
    }

    if (selectedCity && isDifferentCity) {
      fetchMagPosts();
      setIsDifferentCity(false);
    }
  }, [selectedCity, isDifferentCity]);

  return (
    <Grid fluid align="start">
      <section>
        <Row>
          <Col xs={12} md={12}>
            <Box pad="xsmall">
              <Heading level={2} margin="small">
                MagPosts
              </Heading>
            </Box>
            {loading && <img src={`/img/loader.svg`} />}
            {error && (
              <>
                <Box pad={{ horizontal: "medium", vertical: "large" }}>
                  <Text size="medium">
                    There are no articles in the city{" "}
                    <b>"{titleCase(undoSlug(city))}"</b>
                    <br />
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
                {/* <Masonry
                  breakpointCols={{
                    default: 2,
                    960: 2,
                    600: 1,
                  }}
                  className={styles.masonryGrid}
                  columnClassName={styles.masonryGridColumn}
                > */}
                {magPosts.map((magPost) => (
                  <MagPostCard key={magPost.id} magPost={magPost} />
                ))}
                {/* </Masonry> */}
              </Box>
            )}
          </Col>
        </Row>
      </section>
    </Grid>
  );
}
