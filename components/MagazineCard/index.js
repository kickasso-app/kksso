import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { Box, Heading, Paragraph, ResponsiveContext } from "grommet";
import Link from "next/link";
import moment from "moment";
import ProgressiveImage from "react-progressive-image";

import { downloadMagazineThumbnail } from "services/editorial";
import { capitalizeFirstLetter } from "services/helpers/textFormat";

import { Hash } from "react-feather";

import styles from "./index.module.scss";

const readableDate = (date) =>
  moment(date, "YYYY-MM-DD").format("MMMM D, YYYY");

export default function MagPostCard({ magPost }) {
  const router = useRouter();
  const [imgUrl, setImgUrl] = useState(false);
  const magPostMargin = { vertical: "1.5rem" };
  const detailsMargin = { vertical: "0.5rem" };
  const size = useContext(ResponsiveContext);

  const magPostLink = "/editorial/article/" + magPost.slug;
  const openMagPost = () => {
    router.push(magPostLink);
  };

  useEffect(() => {
    downloadMagazineThumbnail({ slug: magPost.slug }).then((url) =>
      setImgUrl(url)
    );
  }, [magPost]);

  return (
    <div className={styles.MagPostCard}>
      <Link href={magPostLink}>
        <Box
          direction={size === "small" ? "column" : "row"}
          gap="medium"
          fill="horizontal" // Ensures the Box takes full width
          margin={{ vertical: "medium" }}
        >
          <Box basis="33%" flex={false} className={styles.imgBox}>
            {/* <Image src="path-to-your-image.jpg" fit="cover" /> */}
            <div className={styles.imgContainer} onClick={(e) => {
              e.preventDefault();
              openMagPost();
            }}>
              <ProgressiveImage src={imgUrl} placeholder={`/img/loader.svg`}>
                {(src, loading) => (
                  <img
                    className={styles.cardImg}
                    src={src}
                    alt={magPost.title}
                  />
                )}
              </ProgressiveImage>
            </div>
          </Box>
          <Box basis="67%" flex fill className={styles.contentBox}>
            <Heading level="2" margin={magPostMargin}>
              {magPost.title}
            </Heading>
            <Heading
              level="4"
              margin={size === "small" ? detailsMargin : magPostMargin}
              fill
            >
              {magPost.subtitle}
            </Heading>
            <Paragraph margin={detailsMargin} size="small">
              {readableDate(magPost.date)}
            </Paragraph>
            {magPost.tags && (
              <Paragraph margin={detailsMargin} size="small">
                <Hash size={18} strokeWidth="2" color="#4b4b4b" fill="#fff" />
                {" " + magPost.tags.map(capitalizeFirstLetter).join(", ")}
              </Paragraph>
            )}
          </Box>
        </Box>
      </Link>
    </div>
  );
}
