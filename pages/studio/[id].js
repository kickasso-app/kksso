import { useContext, useState, useEffect } from "react";
import "firebase/firestore";
import "firebase/functions";
import PropTypes from "prop-types";

import { useRouter } from "next/router";
import Link from "next/link";
import {
  useCollectionOnce,
  useCollection,
} from "react-firebase-hooks/firestore";
import { FirebaseContext } from "../../services/firebase.js";

// import ReactMarkdown from "react-markdown";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

import { ChevronLeft, Disc } from "react-feather";

// import EmailForm from "Components/EmailForm";
import ImagesCarousel from "../../components/ImagesCarousel";
import styles from "./index.module.scss";

const Studio = () => {
  const router = useRouter();
  const { id } = router.query;

  const firebase = useContext(FirebaseContext);

  const [value, loading, error] = useCollectionOnce(
    firebase.firestore().collection("studios"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const [studioData, setStudioData] = useState(false);

  useEffect(() => {
    if (value) {
      const data = value.docs.map((doc) => doc.data());
      const theStudioData = data.filter((studio) => studio.id === id)[0];
      setStudioData(theStudioData);
    }
  }, [value]);

  const paragraphSeperator = "\\";

  const makeParagraphs = (paragraphString, pSeparator) => {
    return paragraphString.split(pSeparator).map((paragraph, index) => (
      <p key={index} className={styles.studioParagraph}>
        {paragraph}
      </p>
      // <ReactMarkdown key={index}>{paragraph}</ReactMarkdown>
    ));
  };

  const makeImagesArray = () => {
    const imgUrls =
      images !== undefined &&
      images.split(",").map((imgId) => "/img/" + artist + "/" + imgId + ".jpg");

    const imgTexts = imagesText !== undefined && imagesText.split(";");

    const imgs = imgUrls.reduce((acc, current, index) => {
      acc.push({ url: imgUrls[index], caption: imgTexts[index] || "" });
      return acc;
    }, []);

    return imgs;
  };

  return (
    <Grid fluid className={styles.studio}>
      <Col xs={12}>
        <ChevronLeft className={styles.icon} size={16} />{" "}
        <Link href="/studios" className={styles.backlink}>
          BACK
          {/* <>
            <ChevronLeft className={styles.icon} size={14} /> <span> BACK </span>
          </> */}
        </Link>
        <br />
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <img src={`/img/loader.svg`} />}
        {value && studioData && (
          // <Row> <ImagesCarousel images={makeImagesArray()} /></Row>
          <Row>
            <ImagesCarousel
              images={studioData.images}
              artist={studioData.artist}
            />
            <Col xs={12} md={6}>
              <br />

              <h2 className={styles.maintitle}>{studioData.artist}</h2>

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
                  color="#7fffd4"
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
Studio.propTypes = {};

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
