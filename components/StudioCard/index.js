import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

import ProgressiveImage from "react-progressive-image";
// import moment from "moment";
import { Disc, Hash } from "react-feather";

import { downloadProfileImage } from "services/images";

import { capitalizeFirstLetter } from "services/helpers/textFormat";
import styles from "./index.module.scss";

const StudioCard = ({
  studio: { studio_id, uuid, artist, district, styles: artStyles, textMini },
}) => {
  const router = useRouter();

  const articleLink = `/studio/${studio_id}`;

  const openArticle = () => {
    router.push(articleLink);
  };

  const [imgUrl, setImgUrl] = useState(false);

  useEffect(() => {
    downloadProfileImage({ userId: uuid }).then((url) => setImgUrl(url));
  }, [uuid]);

  return (
    <div className={styles.StudioCard}>
      <div className={styles.imgContainer}>
        <Link href={articleLink} onClick={(e) => {
          e.preventDefault();
          openArticle();
        }}>

          <ProgressiveImage src={imgUrl} placeholder={`/img/loader.svg`}>
            {(src, loading) => (
              <img className={styles.cardImg} src={src} alt={artist} />
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
        {capitalizeFirstLetter(district)}
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
          {capitalizeFirstLetter(artStyles)}
        </h4>
      )}
    </div>
  );
};

export default StudioCard;
