import { useState, useEffect, useContext } from "react";

import { useRouter } from "next/router";

import moment from "moment";

import { useEvents } from "services/events";
import { useStudios } from "services/studios";
import useEventImage from "hooks/useEventImage";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Paragraph, ResponsiveContext, Text } from "grommet";
import { ChevronLeft, Disc, Globe } from "react-feather";

import EventRequestForm from "components/forms/EventRequestForm";

import { makeParagraphs } from "services/helpers/textFormat";

import styles from "../index.module.scss";

const readableDate = (date) =>
  moment(date, "YYYY-MM-DD").format("dddd D MMM, YYYY");

const EventPreview = () => {
  const router = useRouter();
  const size = useContext(ResponsiveContext);
  const { event, fetchEvent, loading, error } = useEvents();
  const { fetchStudioBasic } = useStudios();

  const { id } = router.query;
  const [studioBasic, setStudioBasic] = useState(null);
  const [studioLink, setStudioLink] = useState(null);

  const [imgUrl, isImgLoaded] = useEventImage(event, "large");

  const isPastDate = (date) => new Date(date) < new Date();

  useEffect(() => {
    async function fetchData() {
      if (id && (!event || event?.id !== id)) {
        // console.log("fetching event", id);
        await fetchEvent({ event_id: id });
      }
    }

    async function fetchStudioBasicInfo() {
      if (id && event && event?.id === id) {
        // console.log("fetching studio name and link", event.studio_uuid);
        const studioBasic = await fetchStudioBasic({
          uuid: event.studio_uuid,
        });
        setStudioBasic({
          name: studioBasic?.artist,
          email: studioBasic?.email,
          id: studioBasic?.studio_id,
        });
        if (studioBasic?.published) {
          setStudioLink(`/studio/${studioBasic?.studio_id}`);
        }
      }
    }

    fetchData();
    fetchStudioBasicInfo();
  }, [id, event]);

  const headingMargin = { top: "large", bottom: "small" };
  const paragraphMargin = { top: "small", bottom: "small" };
  const sectionMargin = { top: "medium", bottom: "medium" };

  return (
    <Grid fluid className={styles.event}>
      <Col xs={12}>
        {error && error.code !== "22P02" && (
          <strong>Error: {JSON.stringify(error)}</strong>
        )}
        {loading ? (
          <Box align="center" pad="large">
            <img src={`/img/loader.svg`} />
          </Box>
        ) : !event ? (
          <Box align="center" margin="large">
            There is no event here {":("}
          </Box>
        ) : (
          <>
            <Box
              border
              round="xsmall"
              pad={"small"}
              margin={{ vertical: "small" }}
              width={"small"}
              align="center"
            >
              Preview
            </Box>
            <ChevronLeft className={styles.icon} size={16} />{" "}
            <a onClick={() => router.back()} className={styles.backlink}>
              BACK
            </a>
            {imgUrl && isImgLoaded && (
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
                      <a
                        href={studioLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {studioBasic.name}
                      </a>
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
                      <a
                        href={studioLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {studioBasic.name}
                      </a>
                    </Paragraph>
                  </>
                )}
              </Col>
              <Col xs={12} md={5} mdOffset={1}>
                <Heading level="3" size="medium" margin={headingMargin}>
                  Date and time
                </Heading>
                <Paragraph>
                  {readableDate(event.date)} <br /> {event.time.toLowerCase()}
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
                {event?.participationFee && (
                  <>
                    <Heading level="3" size="medium" margin={headingMargin}>
                      Participation Fee
                    </Heading>
                    <Paragraph>RM {event.participationFee}</Paragraph>
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
                        event_date={event.date}
                        event_date_time={
                          readableDate(event.date) +
                          " at " +
                          event.time.toLowerCase()
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
        )}
      </Col>
    </Grid>
  );
};

export default EventPreview;
