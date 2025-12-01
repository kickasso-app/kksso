import { useState, useEffect } from "react";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { fetchMagazinePosts } from "services/magazine";
import MagPostCard from "components/MagazineCard";
import Masonry from "react-masonry-css";
import { Box, Heading, Text } from "grommet";
// Optionally reuse masonry styles from StudiosFilter or create your own
import styles from "components/StudiosFilter/index.module.scss";

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
        console.log(tempPosts);
        setMagPosts(tempPosts);
      } else {
        setError("Unable to fetch magazine articles");
      }
      setLoading(false);
    }

    fetchMagPosts();
  }, []);

  return (
    <Grid fluid align="center">
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
                    There are no magazine articles
                    <br />
                    <br />
                    Please try to check the URL or choose another city from
                    below
                  </Text>
                </Box>
                {/* <b>Error: {JSON.stringify(error)}</b> */}
              </>
            )}

            {!loading && !error && magPosts && (
              <Box pad="small">
                <Masonry
                  breakpointCols={{
                    default: 3,
                    960: 3,
                    768: 2,
                    600: 1,
                  }}
                  className={styles.masonryGrid}
                  columnClassName={styles.masonryGridColumn}
                >
                  {magPosts.map((magPost) => (
                    <MagPostCard key={magPost.id} magPost={magPost} />
                  ))}
                </Masonry>
              </Box>
            )}
          </Col>
        </Row>
      </section>
    </Grid>
  );
}
