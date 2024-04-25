import { useEffect, useContext } from "react";

import { useRouter } from "next/router";
import Link from "next/link";

import { useStudios } from "services/studios";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Paragraph, ResponsiveContext, Text } from "grommet";
import { ChevronLeft, Disc, Instagram, Globe } from "react-feather";

import EventCard from "components/EventCard";
import VisitForm from "components/forms/VisitForm";
import ImagesCarousel from "components/ImagesCarousel";
import styles from "./index.module.scss";

const Studio = () => {
  const router = useRouter();
  const size = useContext(ResponsiveContext);

  const { id } = router.query;

  const { studio, fetchStudio, loading, error } = useStudios();

  useEffect(() => {
    if (id > 0) {
      fetchStudio({ id });
    }
  }, [id]);

  // console.log(studio);

  const headingMargin = { top: "large", bottom: "small" };
  const paragraphMargin = { top: "xsmall", bottom: "medium" };

  const paragraphSeperator = "\\";

  const makeParagraphs = (paragraphString, pSeparator) => {
    return paragraphString.split(pSeparator).map((paragraph, index) => (
      <Paragraph key={index} size="medium" margin={paragraphMargin} fill>
        {/* // key={index} className={styles.studioParagraph}>*/}
        {paragraph}
      </Paragraph>
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
        {loading ? (
          <Box align="center" pad="large">
            <img src={`/img/loader.svg`} />
          </Box>
        ) : !studio ? (
          <Box align="center" margin="large">
            There is no studio here :(
          </Box>
        ) : (
          <>
            <Box align="center" margin="small">
              <ImagesCarousel userId={studio.uuid} />
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

                <Heading level="3" size="medium" margin={headingMargin}>
                  Mediums
                </Heading>
                {makeParagraphs(studio.styles)}
                <hr />
                <Heading level="3" size="medium" margin={headingMargin}>
                  Studio
                </Heading>

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

                <hr />
                {(studio.website || studio.instagram) && (
                  <>
                    <Heading level="3" size="medium" margin={headingMargin}>
                      Links
                    </Heading>
                    <Paragraph fill margin={{ vertical: "medium" }}>
                      {studio.website && (
                        <a href={studio.website} target="_blank">
                          <Globe
                            className={styles.icon}
                            size={28}
                            strokeWidth="1"
                            color="#4B4B4B"
                            fill="#FFF"
                          />
                        </a>
                      )}
                      {studio.instagram && (
                        <a
                          href={
                            studio.instagram?.includes("instagram.com/")
                              ? studio.instagram
                              : `https://instagram.com/${studio.instagram}`
                          }
                          target="_blank"
                        >
                          <Instagram
                            className={styles.icon}
                            size={28}
                            strokeWidth="1"
                            color="#4B4B4B"
                            fill="#FFF"
                          />
                        </a>
                      )}
                    </Paragraph>
                    {size === "small" && (
                      <>
                        <hr />
                        <br />
                      </>
                    )}
                  </>
                )}
              </Col>
              <Col xs={12} md={5} mdOffset={1}>
                {studio.events && (
                  <EventCard
                    events={studio.events}
                    eventsContact={studio?.eventsContact}
                  />
                )}
                {studio.visitRules && studio.visitRules.length > 0 && (
                  <>
                    <Heading level="4" size="medium" margin={headingMargin}>
                      {studio.artist.split(" ")[0]}'s visit rules
                    </Heading>
                    <ul className={styles.rules}>
                      {studio.visitRules.split(";").map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </>
                )}
                <Heading level="4" size="medium" margin={headingMargin}>
                  General visit tips
                </Heading>
                <ul className={styles.rules}>
                  <li>Show up on time</li>
                  <li>Ask before taking photos of the artist and artworks</li>
                  <li>A gift is almost always a nice touch</li>
                </ul>
                <br />
                <br />
                <hr />
                <Heading level="3" size="medium" margin={headingMargin}>
                  Private studio visits
                </Heading>
                {studio.hasOpenDates === true ? (
                  <VisitForm
                    openDates={studio.openDates}
                    artistEmail={studio.email}
                    artistName={studio.artist}
                    artistUUID={studio.uuid}
                  />
                ) : (
                  <>
                    <Heading level="4" size="medium" margin={headingMargin}>
                      The artist has no upcoming private visit dates right now
                    </Heading>
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
