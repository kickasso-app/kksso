import { useState, useEffect } from "react";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { fetchMagazinePosts } from "services/magazine";
import MagPostCard from "components/MagazineCard";
import { Box, Heading, Text } from "grommet";

export default function MagazineAll() {
  const [magPosts, setMagPosts] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMagPosts() {
      setLoading(true);
      setError(false);
      let tempPosts = await fetchMagazinePosts({ selectedCity: false });
      if (tempPosts?.length) {
        // console.log(tempPosts);
        setMagPosts(tempPosts);
      } else {
        setError("Unable to fetch magazine articles");
      }
      setLoading(false);
    }

    fetchMagPosts();
  }, []);

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
                    Please try to check the URL or choose another city from
                    below
                  </Text>
                </Box>
                {/* <b>Error: {JSON.stringify(error)}</b> */}
              </>
            )}

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
  );
}
