'use client';

import { useEffect, useContext, useState } from "react";
import Link from "next/link";
import { useEvents } from "services/events";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Paragraph, ResponsiveContext } from "grommet";
import { ChevronLeft, Disc, Instagram, Globe } from "react-feather";

import Button from "components/Button";
import EventCard from "components/EventCard";
import VisitFormWithDates from "components/forms/VisitFormWithDates";
import VisitFormOpen from "components/forms/VisitFormOpen";
import ImagesCarousel from "components/ImagesCarousel";

import { makeParagraphs } from "services/helpers/textFormat";

import styles from "./page.module.scss";

export default function StudioClient({ initialStudio }) {
  const size = useContext(ResponsiveContext);
  const { event, fetchEvent } = useEvents();
  const [studio] = useState(initialStudio);

  useEffect(() => {
    if (studio && studio?.eventId) {
      if (!event || event.id !== studio.eventId) {
        fetchEvent({ event_id: studio.eventId });
      }
    }
  }, [studio, fetchEvent, event]);

  const headingMargin = { top: "large", bottom: "small" };
  const paragraphMargin = { top: "small", bottom: "small" };
  const sectionMargin = { top: "medium", bottom: "medium" };

  if (!studio) {
    return (
      <Box align="center" margin="large">
        There is no studio here {":("}
      </Box>
    );
  }

  return (
    <Grid fluid className={styles.studio}>
      <Col xs={12}>
        <>
          <ChevronLeft className={styles.icon} size={16} />{" "}
          <Link
            href={`/studios/` + (studio.location?.[0]?.toLowerCase() || 'munich')}
            className={styles.backlink}
          >
            BACK
          </Link>
          <Box align="center" margin="small">
            <ImagesCarousel userId={studio.uuid} />
          </Box>
          <Row>
            <Col xs={12} md={6}>
              <br />
              <Row between="xs" middle="xs">
                <Col>
                  {studio.artist && (
                    <h2 className={styles.maintitle}>{studio.artist}</h2>
                  )}
                </Col>
                {studio.hasOpenDates === true && (
                  <Col>
                    <Button btnStyle="outline">
                      <Link href="#private-visits">Visit</Link>
                    </Button>
                  </Col>
                )}
              </Row>
              {/*  Main Text  */}
              {studio.textLong && (
                <div dir={studio?.txtDirection}>
                  {makeParagraphs(studio.textLong)}
                </div>
              )}

              {studio.magazine_article && (
                <Paragraph size="medium" margin={sectionMargin} fill>
                  For a deeper dive into the artist's world, read our
                  interview
                  <br />
                  <Link
                    href={
                      `/editorial/article/` +
                      studio.magazine_article.article_url
                    }
                  >
                    {studio.magazine_article.title}
                  </Link>
                </Paragraph>
              )}
              <Heading level="3" size="medium" margin={headingMargin}>
                Mediums
              </Heading>
              {makeParagraphs(studio.styles)}
              <Box margin={sectionMargin}>
                <hr />
              </Box>
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
                {studio.district}
              </h4>

              <Box margin={sectionMargin}>
                <hr />
              </Box>
              {studio?.languages && (
                <>
                  <Heading level="3" size="medium" margin={headingMargin}>
                    Languages
                  </Heading>
                  {makeParagraphs(studio.languages)}
                  <Box margin={sectionMargin}>
                    <hr />
                  </Box>
                </>
              )}
              {(studio.website || studio.instagram) && (
                <>
                  <Heading level="3" size="medium" margin={headingMargin}>
                    Links
                  </Heading>
                  {studio.website && (
                    <Paragraph fill margin={{ vertical: "medium" }}>
                      <Globe
                        className={styles.icon}
                        size={24}
                        strokeWidth="1"
                        color="#4B4B4B"
                        fill="#FFF"
                      />{" "}
                      <a href={studio.website} target="_blank" rel="noopener noreferrer">
                        {studio.website}
                      </a>
                    </Paragraph>
                  )}
                  {studio.instagram && (
                    <Paragraph fill margin={{ vertical: "medium" }}>
                      <Instagram
                        className={styles.icon}
                        size={24}
                        strokeWidth="1"
                        color="#4B4B4B"
                        fill="#FFF"
                      />{" "}
                      <a
                        href={
                          studio.instagram?.includes("instagram.com/")
                            ? studio.instagram
                            : `https://instagram.com/${studio.instagram}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Instagram
                      </a>
                    </Paragraph>
                  )}
                  {size === "small" && (
                    <>
                      <Box margin={sectionMargin}>
                        <hr />
                        <br />
                      </Box>
                    </>
                  )}
                </>
              )}
            </Col>
            <Col xs={12} md={5} mdOffset={1}>
              {studio.eventId && event?.isPublished && (
                <EventCard event={event} inStudio />
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
                <li>Visits are free</li>
                <li>Show up on time</li>
                <li>Ask before taking photos of the artist and artworks</li>
                {/* <li>A gift is almost always a nice touch</li> */}
              </ul>
              <br />
              <Box margin={sectionMargin}>
                <hr />
              </Box>
              <Heading
                level="3"
                size="medium"
                margin={headingMargin}
                id="private-visits"
              >
                Private studio visits
              </Heading>
              {studio.has_no_visits === true ? (
                <>
                  <Heading level="4" size="medium" margin={headingMargin}>
                    The artist has no upcoming private visit dates right now
                  </Heading>
                  <h4 className={styles.subsectiontitle}>
                    Please check back again later
                  </h4>
                </>
              ) : studio.hasOpenDates === true ? (
                <VisitFormWithDates
                  artistEmail={studio.email}
                  artistName={studio.artist}
                  studioID={studio.studio_id}
                  studio_uuid={studio.uuid}
                  availability={studio.availability}
                />
              ) : (
                <VisitFormOpen
                  artistEmail={studio.email}
                  artistName={studio.artist}
                  studioID={studio.studio_id}
                  studio_uuid={studio.uuid}
                />
              )}
            </Col>
          </Row>
        </>
      </Col>
    </Grid>
  );
}
