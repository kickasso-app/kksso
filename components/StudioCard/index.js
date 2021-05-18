import { useState, useEffect, useRef } from "react";
// import PropTypes from "prop-types";

import { useRouter } from "next/router";
import Link from "next/link";

import ProgressiveImage from "react-progressive-image";
import moment from "moment";
import { Disc, Hash } from "react-feather";

import styles from "./index.module.scss";

const StudioCard = ({
  studio: { id, artist, city, styles: artStyles, openDates, textMini },
}) => {
  const router = useRouter();

  const articleLink = {
    pathname: "/studio/[id]",
    query: { id: id },
  };

  const openArticle = (id) => {
    router.push(articleLink);
  };

  const [hoverImg, setHoverImg] = useState("0");
  const [hoveredImg, setHoveredImg] = useState(false);

  const teaserSrc = `/img/${artist}/${hoverImg}.jpg`;

  const nextVisit = openDates
    ? moment(openDates.split(",")[0], "DD/MM/YYYY hh:mm").format("D MMM")
    : false;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    console.log(hoveredImg);

    if (hoveredImg) {
      sleep(2000).then(() => {
        setHoverImg((hoverImg + 1) % 3);
        console.log(hoverImg);
        console.log(teaserSrc);
      });
    }
  }, [hoveredImg]);

  return (
    <div className={styles.StudioCard}>
      <div
        className={styles.imgContainer}
        // onMouseEnter={() => {
        //   setHoveredImg(true);
        // }}
        // onMouseLeave={() => {
        //   setHoveredImg(false);
        // }}
      >
        <Link href={articleLink}>
          <ProgressiveImage src={teaserSrc} placeholder={`/img/loader.svg`}>
            {(src, loading) => (
              <img
                className={styles.cardImg}
                onClick={() => openArticle(id)}
                src={src}
                alt={artist}
              />
            )}
          </ProgressiveImage>
        </Link>
      </div>

      <h4 className={styles.primary}>{artist}</h4>

      <h4 className={styles.secondary}>
        <Disc
          className={styles.Icon}
          size={18}
          strokeWidth="2"
          color="#FFC0CB"
          fill="#fff"
        />
        {city.split(",")[0]}
      </h4>

      {openDates && (
        <h4 className={styles.secondary}>
          Next Visit <strong>{nextVisit}</strong>
        </h4>
      )}

      <p className={styles.textMini}>{textMini}</p>

      {artStyles && (
        <h4 className={styles.secondary}>
          <Hash
            className={styles.Icon}
            size={18}
            strokeWidth="2"
            color="#4b4b4b"
            fill="#fff"
          />{" "}
          {artStyles}
        </h4>
      )}
    </div>
  );
};

// StudioCard.propTypes = {
//   studio: PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     artist: PropTypes.string.isRequired,
//     openDates: PropTypes.array.isRequired,
//     city: PropTypes.string.isRequired,
//     mediums: PropTypes.string.isRequired,
//     textMini: PropTypes.string.isRequired,
//   }).isRequired,
// };

export default StudioCard;
