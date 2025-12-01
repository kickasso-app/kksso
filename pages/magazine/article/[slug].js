import { useState, useEffect, useContext } from "react";

import { useRouter } from "next/router";
import Link from "next/link";

import moment from "moment";

import { fetchMagazinePost, downloadMagazineImage } from "services/magazine";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Paragraph, ResponsiveContext, Text } from "grommet";
import { ChevronLeft, Disc, Globe } from "react-feather";

import MagazinePostMarkdown from "./markdown";

import styles from "./index.module.scss";

const readableDate = (date) =>
  moment(date, "YYYY-MM-DD").format("dddd D MMM, YYYY");

const MagazinePost = () => {
  const router = useRouter();
  const size = useContext(ResponsiveContext);
  //   const { fetchStudioBasic } = useStudios();
  //   const [imgUrl, isImgLoaded] = useEventImage(event, "large");

  const { slug } = router.query;

  const [magPost, setMagPost] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [studioBasic, setStudioBasic] = useState(null);
  const [studioLink, setStudioLink] = useState(null);

  useEffect(() => {
    async function fetchMagPost() {
      if (slug && (!magPost || magPost?.slug !== slug)) {
        setLoading(true);
        setError(false);
        console.log("fetching post ", slug);
        let tempMagPost = await fetchMagazinePost({ magpost_slug: slug });
        if (tempMagPost?.id) {
          console.log(tempMagPost);
          setMagPost(tempMagPost);
        } else {
          setError("Unable to fetch this magazine article");
        }
        setLoading(false);
      }
    }

    // async function fetchStudioBasicInfo() {
    //   if (id && event && event?.id === id) {
    //     // console.log("fetching studio name and link", event.studio_uuid);
    //     const studioBasic = await fetchStudioBasic({
    //       uuid: event.studio_uuid,
    //     });
    //     setStudioBasic({
    //       name: studioBasic?.artist,
    //       email: studioBasic?.email,
    //       id: studioBasic?.studio_id,
    //     });
    //     if (studioBasic?.published) {
    //       setStudioLink(`/studio/${studioBasic?.studio_id}`);
    //     }
    //   }
    // }

    fetchMagPost();
  }, [slug, magPost]);

  const headingMargin = { top: "large", bottom: "small" };
  const paragraphMargin = { top: "small", bottom: "small" };
  const sectionMargin = { top: "medium", bottom: "medium" };

  return (
    <Grid fluid className={styles.magazinearticle}>
      <Col xs={12}>
        {error && error.code !== "22P02" && (
          <strong>Error: {JSON.stringify(error)}</strong>
        )}
        {loading ? (
          <Box align="center" pad="large">
            <img src={`/img/loader.svg`} />
          </Box>
        ) : !magPost || !magPost?.isPublished ? (
          <Box align="center" margin="large">
            There is no published magazine article here {":("}
          </Box>
        ) : (
          <>
            <ChevronLeft className={styles.icon} size={16} />{" "}
            <Link
              href={`/magazine/` + magPost.cityLocation[0].toLowerCase()}
              className={styles.backlink}
            >
              BACK
            </Link>
            {/* {imgUrl && isImgLoaded && (
              <Box
                align="center"
                margin={{ vertical: "medium", horizontal: "xsmall" }}
              >
                <Box margin={{ bottom: "1rem" }}>
                  <img
                    key={event.id} // Force remount when event changes
                    src={imgUrl}
                    alt="banner"
                    layout="responsive"
                    width="100%"
                    style={{
                      height: size === "small" ? "100%" : "auto",
                      maxHeight: size !== "small" ? "60vh" : "none",
                    }}
                  />
                </Box>
              </Box>
            )} */}
            <Row>
              {" "}
              <Box align="center" margin="large">
                <Col xs={12} md={10}>
                  <h2 className={styles.maintitle}>{magPost.title}</h2>
                  {/* <Paragraph>{magPost.markdown}</Paragraph> */}
                  <MagazinePostMarkdown markdown={magPost.markdown} />
                  {/* <Row between="xs" middle="xs">
                  <Col>
                    {event.title && (
                      <h2 className={styles.maintitle}>{event.title}</h2>
                    )}
                  </Col>
                  {event.type && (
                    <Box
                      border
                      round="xsmall"
                      pad={{ vertical: "small", horizontal: "medium" }}
                    >
                      {event.type}
                    </Box>
                  )}
                </Row> */}
                </Col>
              </Box>
            </Row>
          </>
        )}
      </Col>
    </Grid>
  );
};

export default MagazinePost;
