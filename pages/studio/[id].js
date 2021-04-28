import { useContext, useState, useEffect } from "react";

import { useSupabase } from "use-supabase";
import { supabase } from "../../services/supabase";
// import PropTypes from "prop-types";

import { useRouter } from "next/router";
import Link from "next/link";

// import ReactMarkdown from "react-markdown";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Text, Button } from "grommet";
import { ChevronLeft, Disc } from "react-feather";

import VisitForm from "../../components/forms/VisitForm";
import ImagesCarousel from "../../components/ImagesCarousel";
import styles from "./index.module.scss";

const Studio = () => {
  const router = useRouter();
  const { id } = router.query;

  const { auth, from } = useSupabase();

  const [studio, setStudio] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
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

  const fetchStudio = async () => {
    // TO DO: grab from local store
    let { data: oneStudio, error } = await supabase
      .from("studios")
      .select("*")
      .match({ id })
      .single();
    if (error) setError(error);
    else {
      setStudio(oneStudio);
      setImages(
        prepImagesforCarousel(oneStudio.imagesFiles, oneStudio.imagesCaptions)
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!studio) {
      fetchStudio();
    }
  }, [id]);

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
        <br />
        <br />
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
        ) : (
          <Row>
            {images.length && (
              <ImagesCarousel images={images} artist={studio.artist} />
            )}
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
            </Col>
            <Col xs={12} md={5} mdOffset={1}>
              {studio.openDates && (
                <>
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
                  <VisitForm
                    openVisitDates={studio.openDates.split(",")}
                    artistEmail={studio.email}
                    artistName={studio.artist}
                  />
                </>
              )}
            </Col>
          </Row>
        )}
      </Col>
    </Grid>
  );
};
// Studio.propTypes = {};

// export const getServerSideProps = async ({ query }) => {
//   const content = {}

//   const [value, loading, error] = useDocument(
//     firebase.firestore().doc('hooks/nBShXiRGFAhuiPfBaGpt'),
//     {
//       snapshotListenOptions: { includeMetadataChanges: true },
//     }
//   );

//   await fire.firestore()
//     .collection('blog')
//     .doc(query.id)
//     .get()
//     .then(result => {
//       content['title'] = result.data().title;
//       content['content'] = result.data().content;
//     });
// return {
//     props: {
//       title: content.title,
//       content: content.content,
//     }
//   }
// }

export default Studio;
