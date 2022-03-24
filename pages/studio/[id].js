import { useState, useEffect } from "react";
import { useStudios } from "services/studios";

import { useRouter } from "next/router";
import Link from "next/link";

// import ReactMarkdown from "react-markdown";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Text, Button } from "grommet";
import { ChevronLeft, Disc, Instagram, Globe } from "react-feather";

import VisitForm from "components/forms/VisitForm";
import ImagesCarousel from "components/ImagesCarousel";
import styles from "./index.module.scss";

const Studio = () => {
  const router = useRouter();
  const { id } = router.query;

  const { studios, fetchStudios, loading, error } = useStudios();

  const [studio, setStudio] = useState();
  const [images, setImages] = useState([]);

  const prepImagesforCarousel = (files, captions) => {
    const imgs = files.reduce((acc, current, index) => {
      acc.push({
        filename: files[index].trim(),
        caption: captions[index] || "",
      });
      return acc;
    }, []);

    return imgs;
  };

  useEffect(() => {
    if (!studios.length && loading) {
      fetchStudios();
    }
  }, []);

  useEffect(() => {
    if (studios.length && id && !studio) {
      // const match = studios.filter((s) => {
      //   return s.id === id;
      // });
      // To DO: WTH
      // somehow filter is not working here !!!
      const matchStudio = studios[id - 1];
      setStudio(matchStudio);
      setImages(
        prepImagesforCarousel(
          matchStudio.imagesFiles,
          matchStudio.imagesCaptions
        )
      );
    }
  }, [loading, studios, id]);

  const paragraphSeperator = "\\";

  const makeParagraphs = (paragraphString, pSeparator) => {
    return paragraphString.split(pSeparator).map((paragraph, index) => (
      <p key={index} className={styles.studioParagraph}>
        {paragraph}
      </p>
      // <ReactMarkdown key={index}>{paragraph}</ReactMarkdown>
    ));
  };

  return (
    <Grid fluid className={styles.studio}>
      <Col xs={12}>
        <ChevronLeft className={styles.icon} size={16} />{" "}
        <Link href="/studios" className={styles.backlink}>
          BACK
          {/* 
          <>
            <ChevronLeft className={styles.icon} size={14} /> <span> BACK </span>
          </> 
          */}
        </Link>
        {/* TO DO
         Remove this error
         Error: {"hint":null,"details":null,"code":"22P02",
         "message":"invalid input syntax for type integer: \"NaN\""}
          */}
        {error && error.code !== "22P02" && (
          <strong>Error: {JSON.stringify(error)}</strong>
        )}
        {loading || !studio ? (
          <Box align="center" pad="large">
            <img src={`/img/loader.svg`} />
          </Box>
        ) : (
          <>
            <Box fill="horizontal" pad="medium">
              {images.length && (
                <ImagesCarousel images={images} artist={studio.artist} />
              )}
            </Box>

            <Row>
              <Col xs={12} md={6}>
                <br />

                {studio.artist && (
                  <h2 className={styles.maintitle}>{studio.artist}</h2>
                )}
                <br />
                {studio.textLong &&
                  makeParagraphs(studio.textLong, paragraphSeperator)}

                <h3 className={styles.sectiontitle}>Mediums</h3>
                <p>{studio.styles}</p>

                <h3 className={styles.sectiontitle}>Studio</h3>

                <h4 className={styles.subsectiontitle}>
                  <Disc
                    className={styles.icon}
                    size={18}
                    strokeWidth="2"
                    color="#FFC0CB"
                    fill="#fff"
                  />{" "}
                  {studio.city}
                </h4>

                {studio.textStudio &&
                  makeParagraphs(studio.textStudio, paragraphSeperator)}

                {studio.links && (
                  <>
                    <h3 className={styles.sectiontitle}>Links</h3>
                    <br />
                    {studio.links.split(",").map((link) => {
                      return (
                        <Link href={link.trim()} key={link}>
                          {link.includes("instagram") ? (
                            <Instagram
                              className={styles.icon}
                              size={28}
                              strokeWidth="1"
                              color="#4B4B4B"
                              fill="#FFF"
                            />
                          ) : (
                            <Globe
                              className={styles.icon}
                              size={28}
                              strokeWidth="1"
                              color="#4B4B4B"
                              fill="#FFF"
                            />
                          )}
                        </Link>
                      );
                    })}
                  </>
                )}
              </Col>
              <Col xs={12} md={5} mdOffset={1}>
                {studio.visitRules && studio.visitRules.length > 0 && (
                  <>
                    <h3 className={styles.sectiontitle}>
                      {studio.artist.split(" ")[0]}'s Visit Rules
                    </h3>
                    <ul className={styles.rules}>
                      {studio.visitRules.split(";").map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </>
                )}
                <h3 className={styles.sectiontitle}>General Visit Tips</h3>
                <ul className={styles.rules}>
                  <li>Show up on time</li>
                  <li>Ask before taking photos of the artist and artworks</li>
                  <li>A gift is almost always a nice touch</li>
                </ul>
                {studio.openDates ? (
                  <VisitForm
                    openVisitDates={studio.openDates.split(",")}
                    artistEmail={studio.email}
                    artistName={studio.artist}
                  />
                ) : (
                  <>
                    <h3 className={styles.sectiontitle}>
                      The artist has no upcoming visit dates right now
                    </h3>
                    <h4 className={styles.subsectiontitle}>
                      Please check back again later
                    </h4>
                  </>
                )}
              </Col>
            </Row>
          </>
        )}
      </Col>
    </Grid>
  );
};

export default Studio;

// export async function getStaticPaths() {
//   return {
//     paths: [{ params: { id: "1" } }, { params: { id: "2" } }],
//     fallback: false, // See the "fallback" section below
//   };
// }
