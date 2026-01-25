'use client';

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import moment from "moment";
import { downloadMagazineImage } from "services/editorial";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Paragraph, ResponsiveContext } from "grommet";
import { ChevronLeft } from "react-feather";
import MagazinePostMarkdown from "./MagazinePostMarkdown";
import styles from "./page.module.scss";
import WithFooter from "layouts/WithFooter";

const readableDate = (date) =>
  moment(date, "YYYY-MM-DD").format("MMMM D, YYYY");

const ArticleClient = ({ magPost, slug }) => {
  const size = useContext(ResponsiveContext);
  const [imgUrl, setImgUrl] = useState(false);

  useEffect(() => {
    async function fetchImage() {
        if (magPost?.slug) {
          downloadMagazineImage({
            imgPath: magPost.slug + "/main.jpg",
          }).then((url) => setImgUrl(url));
        }
    }
    fetchImage();
  }, [magPost]);

  const headingMargin = { top: "large", bottom: "small" };
  const paragraphMargin = { top: "small", bottom: "small" };
  const sectionMargin = { top: "medium", bottom: "medium" };

  return (
    <WithFooter>
      <Grid fluid className={styles.magazineArticle}>
        <Col xs={12}>
          {!magPost || !magPost?.isPublished ? (
            <Box align="center" margin="large">
              There is no published article here {":("}
            </Box>
          ) : (
            <>
              <Box
                margin={{ vertical: "medium", horizontal: "small" }}
                direction="row"
                align="center"
              >
                <ChevronLeft className={styles.icon} size={16} />{" "}
                <Link
                  href={`/editorial/` + (magPost.cityLocation?.[0]?.toLowerCase() || 'munich')}
                  className={styles.backlink}
                >
                  BACK
                </Link>
              </Box>
              {imgUrl && (
                <Box
                  align="center"
                  margin={{ vertical: "medium", horizontal: "xsmall" }}
                >
                  <img
                    src={imgUrl}
                    alt={magPost.title}
                    style={{
                      height: size === "small" ? "100%" : "auto",
                      maxHeight: size !== "small" ? "70vh" : "none",
                      width: "100%",
                      objectFit: "contain"
                    }}
                  />
                </Box>
              )}
              <Row>
                {" "}
                <Box
                  align="center"
                  margin={{ vertical: "large", horizontal: "small" }}
                  width="100%"
                >
                  <Col xs={12} md={8} lg={6}>
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

export default ArticleClient;
