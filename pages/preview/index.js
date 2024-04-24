import { useState, useEffect, useContext } from "react";

import { useAuth } from "services/auth";
import { useStudios } from "services/studios";

import Link from "next/link";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Paragraph, ResponsiveContext, Text } from "grommet";
import { Disc, Instagram, Globe } from "react-feather";

import VisitForm from "components/forms/VisitForm";
import ImagesCarousel from "components/ImagesCarousel";
import styles from "./index.module.scss";

const Preview = () => {
  const { user } = useAuth();
  const size = useContext(ResponsiveContext);
  const { userStudio, fetchUserStudio, loading, error } = useStudios();

  const [studio, setStudio] = useState();

  useEffect(() => {
    if (!userStudio) {
      fetchUserStudio({ uuid: user.id });
    } else {
      setStudio(userStudio);
    }
  }, [userStudio]);

  const headingMargin = { top: "large", bottom: "small" };
  const paragraphMargin = { top: "xsmall", bottom: "medium" };

  const paragraphSeperator = "\\";
  const eventSeperator = "/";

  const displayEvent = (eventText, eSeperator) => {
    return eventText.split(eSeperator).map((text, index) => (
      <Text
        key={index}
        size="medium"
        margin={{ top: "xsmall", bottom: "small" }}
        fill
        weight={index < 2 ? "600" : ""}
      >
        {text} <br />
      </Text>
    ));
  };
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
                  <>
                    <Heading
                      level="3"
                      size="medium"
                      margin={{ vertical: "medium" }}
                    >
                      Studio events
                    </Heading>

                    {displayEvent(studio.events, eventSeperator)}
                    {studio.eventsContact && (
                      <>
                        <Heading level="4" size="medium" margin={headingMargin}>
                          Contact for event
                        </Heading>

                        {studio.eventsContact.startsWith("http") ? (
                          <a href={studio.eventsContact} target="_blank">
                            {studio.eventsContact}
                          </a>
                        ) : (
                          <p>{studio.eventsContact}</p>
                        )}
                        <br />
                        <hr />
                      </>
                    )}
                  </>
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

export default Preview;
