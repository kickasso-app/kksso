'use client';

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import moment from "moment";
import { useStudios } from "services/studios";
import useEventImage from "hooks/useEventImage";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Paragraph, ResponsiveContext, Text } from "grommet";
import { ChevronLeft, Disc, Globe } from "react-feather";

import EventRequestForm from "components/forms/EventRequestForm";
import { makeParagraphs } from "services/helpers/textFormat";
import styles from "./page.module.scss";

const readableDate = (date) =>
  moment(date, "YYYY-MM-DD").format("dddd D MMM, YYYY");

export default function EventClient({ initialEvent }) {
  const size = useContext(ResponsiveContext);
  const { fetchStudioBasic } = useStudios();

  const [event] = useState(initialEvent);
  const [studioBasic, setStudioBasic] = useState(null);
  const [studioLink, setStudioLink] = useState(null);

  const [imgUrl, isImgLoaded] = useEventImage(event, "large");

  const isPastDate = (date) => {
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison
    inputDate.setHours(0, 0, 0, 0);

    return inputDate < today;
  };

  useEffect(() => {
    async function fetchStudioBasicInfo() {
      if (event?.studio_uuid) {
        const studioBasicData = await fetchStudioBasic({
          uuid: event.studio_uuid,
        });
        if (studioBasicData) {
            setStudioBasic({
              name: studioBasicData.artist,
              email: studioBasicData.email,
              id: studioBasicData.studio_id,
            });
            if (studioBasicData.published) {
              setStudioLink(`/studio/${studioBasicData.studio_id}`);
            }
        }
      }
    }
    fetchStudioBasicInfo();
  }, [event, fetchStudioBasic]);

  const headingMargin = { top: "large", bottom: "small" };
  const paragraphMargin = { top: "small", bottom: "small" };
  const sectionMargin = { top: "medium", bottom: "medium" };

  if (!event || !event?.isPublished) {
    return (
      <Box align="center" margin="large">
        There is no published event here {":("}
      </Box>
    );
  }

  return (
    <Grid fluid className={styles.event}>
      <Col xs={12}>
        <>
          <ChevronLeft className={styles.icon} size={16} />{" "}
          <Link
            href={`/events/` + (event.cityLocation?.[0]?.toLowerCase() || 'munich')}
            className={styles.backlink}
          >
            BACK
          </Link>
          {imgUrl && isImgLoaded && (
            <Box
              align="center"
              margin={{ vertical: "medium", horizontal: "xsmall" }}
            >
              <Box margin={{ bottom: "1rem" }}>
                <img
                  src={imgUrl}
                  alt="banner"
                  style={{
                    height: size === "small" ? "100%" : "auto",
                    maxHeight: size !== "small" ? "60vh" : "none",
                    width: "100%",
                    objectFit: "contain"
                  }}
                />
              </Box>
            </Box>
          )}
          <Row>
            <Col xs={12} md={6}>
              <Row between="xs" middle="xs">
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
              </Row>

              {studioBasic && (
                <Heading
                  level="4"
                  size="small"
                  margin={{ top: "small", bottom: "small" }}
                >
                  by{" "}
                  {studioLink ? (
                    <Link
                      href={studioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {studioBasic.name}
                    </Link>
                  ) : (
                    studioBasic.name
                  )}
                </Heading>
              )}
              <Heading level="3" size="medium" margin={headingMargin}>
                Details
              </Heading>
              <div dir={event?.txtDirection}>
                {makeParagraphs(event.longDescription)}
              </div>
              <Box margin={sectionMargin}>
                <hr />
              </Box>
              <Heading level="3" size="medium" margin={headingMargin}>
                Location
              </Heading>
              <Paragraph>
                <Disc
                  className={styles.icon}
                  size={18}
                  strokeWidth="2"
                  color="#FFC0CB"
                  fill="#fff"
                />{" "}
                <Text> {event.location}</Text>
              </Paragraph>

              {event?.languages && (
                <>
                  <Box margin={sectionMargin}>
                    <hr />
                  </Box>
                  <Heading level="3" size="medium" margin={headingMargin}>
                    Languages
                  </Heading>
                  {makeParagraphs(event.languages)}
                </>
              )}

              {studioBasic && studioLink && (
                <>
                  <Box margin={sectionMargin}>
                    <hr />
                  </Box>
                  <Heading level="3" size="medium" margin={headingMargin}>
                    Studio
                  </Heading>
                  <Paragraph>
                    <Link
                      href={studioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {studioBasic.name}
                    </Link>
                  </Paragraph>
                </>
              )}
            </Col>
            <Col xs={12} md={5} mdOffset={1}>
              <Heading level="3" size="medium" margin={headingMargin}>
                Date and time
              </Heading>
              <Paragraph>
                {readableDate(event.date)} <br /> {event.time?.toLowerCase()}
              </Paragraph>
              {event?.fee && (
                <Paragraph margin={{ top: "medium" }}>
                  Participation Fee (per person) <br /> <b>{event.fee}</b>
                </Paragraph>
              )}
              <Box margin={sectionMargin}>
                <hr />
              </Box>
              {event?.maxNJoined && (
                <>
                  <Heading level="3" size="medium" margin={headingMargin}>
                    Capacity
                  </Heading>
                  <Paragraph>
                    {event?.currentNJoined
                      ? event.currentNJoined + "/"
                      : "For "}
                    {event.maxNJoined} participants
                  </Paragraph>
                  <Box margin={sectionMargin}>
                    <hr />
                  </Box>
                </>
              )}

              {studioBasic &&
                !isPastDate(event?.date) &&
                (event?.isWithoutRegistration === false ? (
                  <>
                    <Heading level="3" size="medium" margin={headingMargin}>
                      Request to Join
                    </Heading>
                    <EventRequestForm
                      artistEmail={studioBasic.email}
                      artistName={studioBasic.name}
                      studioID={studioBasic.id}
                      studio_uuid={event.studio_uuid}
                      event_uuid={event.id}
                      event_title={event.title}
                      event_date={event.date}
                      event_date_time={
                        readableDate(event.date) +
                        " at " +
                        event.time?.toLowerCase()
                      }
                    />
                  </>
                ) : (
                  <>
                    <Heading level="3" size="medium" margin={headingMargin}>
                      Join the event
                    </Heading>
                    <Paragraph>
                      This is an open event, and there is no registration
                      needed. You can simply show up to take part.
                    </Paragraph>
                    <Box margin={sectionMargin}>
                      <hr />
                    </Box>
                  </>
                ))}

              {event?.contact && (
                <>
                  <Heading level="3" size="medium" margin={headingMargin}>
                    Contact
                  </Heading>
                  <Paragraph>{event.contact}</Paragraph>
                  <Box margin={sectionMargin}>
                    <hr />
                  </Box>
                </>
              )}

              {event.link && (
                <>
                  <Heading level="3" size="medium" margin={headingMargin}>
                    External Link
                  </Heading>
                  <Paragraph fill margin={{ vertical: "medium" }}>
                    <Globe
                      className={styles.icon}
                      size={24}
                      strokeWidth="1"
                      color="#4B4B4B"
                      fill="#FFF"
                    />{" "}
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {event.link}
                    </a>
                  </Paragraph>
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
          </Row>
        </>
      </Col>
    </Grid>
  );
}
