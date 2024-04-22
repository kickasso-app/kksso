import { useState, useEffect } from "react";

import { useAuth } from "services/auth";
import { useStudios } from "services/studios";

import Link from "next/link";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box } from "grommet";
import { Disc, Instagram, Globe } from "react-feather";

import VisitForm from "components/forms/VisitForm";
import ImagesCarousel from "components/ImagesCarousel";
import styles from "./index.module.scss";

const Preview = () => {
  const { user } = useAuth();
  const { userStudio, fetchUserStudio, loading, error } = useStudios();

  const [studio, setStudio] = useState();

  useEffect(() => {
    if (!userStudio) {
      fetchUserStudio({ uuid: user.id });
    } else {
      setStudio(userStudio);
    }
  }, [userStudio]);

  const paragraphSeperator = "\\";
  const eventSeperator = "/";

  const displayEvent = (eventText, eSeperator) => {
    return eventText.split(eSeperator).map((text, index) => (
      <p
        key={index}
        className={index < 2 ? styles.eventParagraph : styles.studioParagraph}
      >
        {text}
      </p>
    ));
  };
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

                {(studio.website || studio.instagram) && (
                  <>
                    <h3 className={styles.sectiontitle}>Links</h3>
                    <br />
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
                  </>
                )}
              </Col>
              <Col xs={12} md={5} mdOffset={1}>
                {studio.events && (
                  <>
                    <h3 className={styles.sectiontitle}>Events in Studio</h3>
                    {displayEvent(studio.events, eventSeperator)}
                    {studio.eventsContact && (
                      <>
                        <h3 className={styles.sectiontitle}>
                          Contact for event details
                        </h3>

                        {studio.eventsContact.startsWith("http") ? (
                          <a href={studio.eventsContact} target="_blank">
                            {studio.eventsContact}
                          </a>
                        ) : (
                          <p>{studio.eventsContact}</p>
                        )}
                      </>
                    )}
                  </>
                )}
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
                <h3 className={styles.sectiontitle}>Private Studio Visits</h3>
                {studio.hasOpenDates === true ? (
                  <VisitForm
                    openDates={studio.openDates}
                    artistEmail={studio.email}
                    artistName={studio.artist}
                    artistUUID={studio.uuid}
                  />
                ) : (
                  <>
                    <h3 className={styles.sectiontitle}>
                      The artist has no upcoming private visit dates right now
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

export default Preview;
