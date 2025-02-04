import { useState, useEffect } from "react";
// import PropTypes from "prop-types";

import { useRouter } from "next/router";
import Link from "next/link";

import ProgressiveImage from "react-progressive-image";
// import moment from "moment";
import { Disc, Hash } from "react-feather";

import styles from "./index.module.scss";
import { downloadProfileImage } from "services/images";

const StudioCard = ({
  studio: {
    studio_id,
    uuid,
    artist,
    district,
    styles: artStyles,
    openDates,
    // hasOpenDates,
    textMini,
  },
}) => {
  const router = useRouter();

  const articleLink = {
    pathname: "/studio/[id]",
    query: { id: studio_id },
  };

  const openArticle = () => {
    router.push(articleLink);
  };

  const [imgUrl, setImgUrl] = useState(false);

  // const [hoverImg, setHoverImg] = useState("0");
  // const [hoveredImg, setHoveredImg] = useState(false);

  // const nextVisit = openDates
  //   ? moment(openDates[0], "YYYY-MM-DD hh:mm").format("D MMM")
  //   : false;

  // function sleep(ms) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }

  // const fetchImg = useCallback(async () => {
  //   const url = await downloadProfileImage({ userId: uuid });

  //   if (url) {
  //     // the DB version
  //     setImgUrl(url);
  //   } else {
  //     // the file version
  //     const teaserSrc = `/img/${artist}/0.jpg`;
  //     setImgUrl(teaserSrc);
  //   }
  //   // console.log(url);
  // }, [uuid]);

  useEffect(() => {
    // fetchImg();
    downloadProfileImage({ userId: uuid }).then((url) => setImgUrl(url));
  }, [uuid]);

  return (
    <div className={styles.StudioCard}>
      <div className={styles.imgContainer}>
        <Link href={articleLink}>
          <a onClick={() => openArticle()}>
            <ProgressiveImage src={imgUrl} placeholder={`/img/loader.svg`}>
              {(src, loading) => (
                <img className={styles.cardImg} src={src} alt={artist} />
              )}
            </ProgressiveImage>
          </a>
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
        {district}
      </h4>

      {/* CHANGED FOR PILOT */}
      {/* 
      {nextVisit && (
        <h4 className={styles.secondary}>
          Next Visit <strong>{nextVisit}</strong>
        </h4>
      )} */}

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
//     district: PropTypes.string.isRequired,
//     mediums: PropTypes.string.isRequired,
//     textMini: PropTypes.string.isRequired,
//   }).isRequired,
// };

export default StudioCard;
