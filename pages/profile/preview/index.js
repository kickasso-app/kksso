import { useState, useEffect, useContext } from "react";

import { useAuth } from "services/auth";
import { useStudios } from "services/studios";
import { useEvents } from "services/events";

import Link from "next/link";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Paragraph, ResponsiveContext, Text } from "grommet";
import { Disc, Instagram, Globe } from "react-feather";

import Button from "components/Button";
import EventCard from "components/EventCard";
import VisitFormWithDates from "components/forms/VisitFormWithDates";
import VisitFormOpen from "components/forms/VisitFormOpen";
import ImagesCarousel from "components/ImagesCarousel";

import { makeParagraphs } from "services/helpers/textFormat";

import styles from "./index.module.scss";

const Preview = () => {
  const { user } = useAuth();
  const size = useContext(ResponsiveContext);
  const { userStudio, fetchUserStudio, loading, error } = useStudios();
  const { event, fetchEvent } = useEvents();

  const [studio, setStudio] = useState();

  useEffect(() => {
    if (!userStudio) {
      fetchUserStudio({ uuid: user.id });
    } else {
      setStudio(userStudio);
    }
  }, [userStudio]);

  useEffect(() => {
    if (studio && studio?.eventId) {
      fetchEvent({ event_id: studio.eventId });
    }
  }, [studio]);

  const headingMargin = { top: "large", bottom: "small" };
  const paragraphMargin = { top: "small", bottom: "small" };
  const sectionMargin = { top: "medium", bottom: "medium" };

  return (
    <Grid fluid className={styles.studio}>
      <Col xs={12}>
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
            There is no studio here {":("}
          </Box>
        ) : (
          <>
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
                {studio.textLong && makeParagraphs(studio.textLong)}
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
                        <a href={studio.website} target="_blank">
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
                      </>) :
                      studio.hasOpenDates === true ? (
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
                        />)}
              </Col>
            </Row>
          </>
        )}
      </Col>
    </Grid>
  );
};

export default Preview;
