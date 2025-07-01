import { useState, useEffect, useContext } from "react";

import { useRouter } from "next/router";

import moment from "moment";

import { useEvents } from "services/events";
import { useStudios } from "services/studios";
import useEventImage from "hooks/useEventImage";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Paragraph, ResponsiveContext, Text } from "grommet";
import { ChevronLeft, Disc, Instagram, Globe } from "react-feather";

import Button from "components/Button";
import EventRequestForm from "components/forms/EventRequestForm";

import styles from "./index.module.scss";

const readableDate = (date) =>
  moment(date, "YYYY-MM-DD").format("dddd D MMM, YYYY");

const Studio = () => {
  const router = useRouter();
  const size = useContext(ResponsiveContext);
  const { event, fetchEvent, loading, error } = useEvents();
  const { fetchStudioBasic } = useStudios();

  const { id } = router.query;
  const [studioBasic, setStudioBasic] = useState(null);
  const [studioLink, setStudioLink] = useState(null);

  const [imgUrl, isImgLoaded] = useEventImage(event, "large");

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

  const paragraphSeperator = /\r\n|\n|\r/;

  const makeParagraphs = (paragraphString, pSeparator) => {
    // console.log(paragraphString);
    return paragraphString.split(pSeparator).map((paragraph, index) => (
      <Paragraph key={index} size="medium" margin={paragraphMargin} fill>
        {paragraph}
      </Paragraph>
    ));
  };

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
        ) : !event || !event?.isPublished ? (
          <Box align="center" margin="large">
            There is no published event here {":("}
          </Box>
        ) : (
          <>
            {/* TO DO: add back link to events in city
             <ChevronLeft className={styles.icon} size={16} />{" "}
            <Link
              href={`/events/` + event.location[0].toLowerCase()}
              className={styles.backlink}
            >
              BACK
            </Link> */}
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
                {makeParagraphs(event.longDescription, paragraphSeperator)}
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

                {studioBasic && (
                  <>
                    <Heading level="3" size="medium" margin={headingMargin}>
                      Request to Join
                    </Heading>
                    <EventRequestForm
                      artistEmail={studioBasic.email}
                      artistName={studioBasic.name}
                      studioID={studioBasic.id}
                      studio_uuid={event.studio_uuid}
                      event_date_time={
                        readableDate(event.date) +
                        " at " +
                        event.time.toLowerCase()
                      }
                    />
                  </>
                )}
                {event?.contact && (
                  <>
                    <Heading level="3" size="medium" margin={headingMargin}>
                      Contact
                    </Heading>
                    <Paragraph>{event.contact}</Paragraph>
                  </>
                )}
                <Box margin={sectionMargin}>
                  <hr />
                </Box>
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

export default Studio;
