import { useEffect } from "react";

import { useRouter } from "next/router";
import Link from "next/link";

import { useStudios } from "services/studios";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box } from "grommet";
import { ChevronLeft, Disc, Instagram, Globe } from "react-feather";

import VisitForm from "components/forms/VisitForm";
import ImagesCarousel from "components/ImagesCarousel";
import styles from "./index.module.scss";

const Studio = () => {
  const router = useRouter();
  const { id } = router.query;

  const { studio, fetchStudio, loading, error } = useStudios();

  useEffect(() => {
    if (id > 0) {
      fetchStudio({ id });
    }
  }, [id]);

  // console.log(studio);

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
                      <Link href={studio.website}>
                        <Globe
                          className={styles.icon}
                          size={28}
                          strokeWidth="1"
                          color="#4B4B4B"
                          fill="#FFF"
                        />
                      </Link>
                    )}

                    {studio.instagram && (
                      <Link
                        href={
                          studio.instagram?.includes("instagram.com/")
                            ? studio.instagram
                            : `https://instagram.com/${studio.instagram}`
                        }
                      >
                        <Instagram
                          className={styles.icon}
                          size={28}
                          strokeWidth="1"
                          color="#4B4B4B"
                          fill="#FFF"
                        />
                      </Link>
                    )}
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
                {studio?.openDates?.length > 0 ? (
                  <VisitForm
                    openDates={studio.openDates || []}
                    artistEmail={studio.email}
                    artistName={studio.artist}
                  />
                  // <>{studio.openDates}</>
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
