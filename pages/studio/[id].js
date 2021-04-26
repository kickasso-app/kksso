import { useContext, useState, useEffect } from "react";

import { useSupabase } from "use-supabase";
import { supabase } from "../../services/supabase";
// import PropTypes from "prop-types";

import { useRouter } from "next/router";
import Link from "next/link";

// import ReactMarkdown from "react-markdown";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

import { ChevronLeft, Disc } from "react-feather";

// import EmailForm from "Components/EmailForm";
import ImagesCarousel from "../../components/ImagesCarousel";
import styles from "./index.module.scss";

const Studio = () => {
  const router = useRouter();
  const { id } = router.query;

  const { auth, from } = useSupabase();

  const [studioData, setStudioData] = useState(false);
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
    let { data: supaStudios, error } = await supabase
      .from("studios")
      .select("*")
      .filter("id", "eq", id);
    if (error) setError(error);
    else {
      const studio = supaStudios[0];
      setStudioData(studio);
      setLoading(false);
      setImages(
        prepImagesforCarousel(studio.imagesFiles, studio.imagesCaptions)
      );
    }
  };

  useEffect(() => {
    if (!studioData) {
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
        {/* {error && <strong>Error: {JSON.stringify(error)}</strong>} */}
        {loading ? (
          <img src={`/img/loader.svg`} />
        ) : (
          <Row>
            {images.length && (
              <ImagesCarousel images={images} artist={studioData.artist} />
            )}
            <Col xs={12} md={6}>
              <br />

              {studioData.artist && (
                <h2 className={styles.maintitle}>{studioData.artist}</h2>
              )}
              <br />
              {studioData.textLong &&
                makeParagraphs(studioData.textLong, paragraphSeperator)}

              <h3 className={styles.sectiontitle}>Mediums</h3>
              <p>{studioData.styles}</p>

              <h3 className={styles.sectiontitle}>Studio</h3>

              <h4 className={styles.subsectiontitle}>
                <Disc
                  className={styles.icon}
                  size={18}
                  strokeWidth="2"
                  color="#FFC0CB"
                  fill="#fff"
                />{" "}
                {studioData.city}
              </h4>

              {studioData.textStudio &&
                makeParagraphs(studioData.textStudio, paragraphSeperator)}
            </Col>
            <Col xs={12} md={5} mdOffset={1}>
              <Row>
                {studioData.dates && (
                  <>
                    {studioData.rules && studioData.rules.length > 0 && (
                      <>
                        <h3 className={styles.sectiontitle}>
                          {studioData.artist.split(" ")[0]}'s Visit Rules
                        </h3>
                        <br />
                        <ul className={styles.rules}>
                          {studioData.rules.split(";").map((rule, index) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    <h3 className={styles.sectiontitle}>General Visit Tips</h3>
                    <ul className={styles.rules}>
                      <li>Show up on time</li>
                      <li>
                        Ask before taking photos of the artist and artworks
                      </li>
                      <li>A gift is almost always a nice touch</li>
                    </ul>
                    {/* <EmailForm
                      openVisitDates={dates.split(",")}
                      artistEmail={email}
                      artistName={artist}
                    />  */}
                  </>
                )}
              </Row>
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
