import { useState, useEffect, useContext } from "react";

import { useRouter } from "next/router";
import Link from "next/link";

import moment from "moment";

import { fetchMagazinePost, downloadMagazineImage } from "services/magazine";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Paragraph, ResponsiveContext, Text } from "grommet";
import { ChevronLeft, Disc, Globe, Hash } from "react-feather";

import MagazinePostMarkdown from "./markdown";

import styles from "./index.module.scss";
import WithFooter from "layouts/WithFooter";

const readableDate = (date) =>
  moment(date, "YYYY-MM-DD").format("MMMM D, YYYY");

const MagazinePost = () => {
  const router = useRouter();
  const size = useContext(ResponsiveContext);
  //   const { fetchStudioBasic } = useStudios();
  const [imgUrl, setImgUrl] = useState(false);
  const { slug } = router.query;

  const [magPost, setMagPost] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const [studioBasic, setStudioBasic] = useState(null);
  // const [studioLink, setStudioLink] = useState(null);

  useEffect(() => {
    async function fetchMagPost() {
      if (slug && (!magPost || magPost?.slug !== slug)) {
        setLoading(true);
        setError(false);
        // console.log("fetching post ", slug);
        let tempMagPost = await fetchMagazinePost({ magpost_slug: slug });
        if (tempMagPost?.id) {
          // console.log(tempMagPost);
          setMagPost(tempMagPost);
          downloadMagazineImage({
            imgPath: tempMagPost.slug + "/main.jpg",
          }).then((url) => setImgUrl(url));
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
    <WithFooter>
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
              {imgUrl && (
                <Box
                  align="center"
                  margin={{ vertical: "medium", horizontal: "xsmall" }}
                >
                  <img
                    src={imgUrl}
                    alt={magPost.title}
                    layout="responsive"
                    width="100%"
                    style={{
                      height: size === "small" ? "100%" : "auto",
                      maxHeight: size !== "small" ? "70vh" : "none",
                    }}
                  />
                </Box>
              )}
              <Row>
                {" "}
                <Box
                  align="center"
                  margin={{ vertical: "large", horizontal: "small" }}
                >
                  <Col xs={12} md={10}>
                    <Heading level="2" margin={sectionMargin}>
                      {magPost.title}
                    </Heading>
                    <Paragraph margin={paragraphMargin}>
                      {readableDate(magPost.date)}{" "}
                    </Paragraph>

                    {magPost?.studio_id && (
                      <Paragraph margin={paragraphMargin}>
                        <Link href={`/studio/${magPost.studio_id}`}>
                          Studio
                        </Link>
                        {" - "}
                        <Link
                          href={magPost.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Website
                        </Link>
                      </Paragraph>
                    )}

                    <Box margin={{ vertical: "large" }}>
                      <hr />
                      <Box margin="medium">
                        <p className={styles.subtitle}>{magPost.subtitle}</p>
                      </Box>
                      <hr />
                    </Box>

                    {/* <Paragraph>{magPost.markdown}</Paragraph> */}
                    <MagazinePostMarkdown markdown={magPost.markdown} />
                    <Box margin={{ vertical: "large" }}>
                      <p className={styles.subtitle}>
                        Learn more about the artist's work and their upcoming
                        studio events at their{" "}
                        <Link href={`/studio/${magPost.studio_id}`}>
                          studio page
                        </Link>
                      </p>
                    </Box>
                  </Col>
                </Box>
              </Row>
            </>
          )}
        </Col>
      </Grid>
    </WithFooter>
  );
};

export default MagazinePost;
