import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { Box, Heading, Paragraph, ResponsiveContext } from "grommet";
import Link from "next/link";
import moment from "moment";
import ProgressiveImage from "react-progressive-image";

import { downloadMagazineThumbnail } from "services/magazine";
import styles from "./index.module.scss";

const readableDate = (date) => moment(date, "YYYY-MM-DD").format("D MMM 'YY");

export default function MagPostCard({ magPost }) {
  const router = useRouter();
  const [imgUrl, setImgUrl] = useState(false);
  const magPostMargin = { vertical: "1rem" };
  const detailsMargin = { vertical: "0.5rem" };
  const size = useContext(ResponsiveContext);

  const magPostLink = "/magazine/article/" + magPost.slug;
  const openMagPost = () => {
    router.push(magPostLink);
  };

  useEffect(() => {
    downloadMagazineThumbnail({ slug: magPost.slug }).then((url) =>
      setImgUrl(url)
    );
  }, [magPost]);

  return (
    <>
      <Box
        direction={size === "small" ? "column" : "row"}
        gap="medium"
        fill="horizontal"
        className={styles.row}
      >
        <Box basis="33%" flex={false} className={styles.imgBox}>
          {/* <Image src="path-to-your-image.jpg" fit="cover" /> */}
          <div className={styles.imgContainer}>
            <Link href={magPostLink}>
              <a onClick={() => openMagPost()}>
                <ProgressiveImage src={imgUrl} placeholder={`/img/loader.svg`}>
                  {(src, loading) => (
                    <img
                      className={styles.cardImg}
                      src={src}
                      alt={magPost.title}
                    />
                  )}
                </ProgressiveImage>
              </a>
            </Link>
          </div>
        </Box>
        <Box basis="67%" flex className={styles.contentBox}>
          <Box>
            <Heading level="3" margin={magPostMargin}>
              {magPost.title}
            </Heading>
            {/* <Paragraph margin={detailsMargin}>
           on {readableDate(magPost.date)}{" "}
        </Paragraph> */}
            <Paragraph margin={detailsMargin}>{magPost.description}</Paragraph>
          </Box>
        </Box>
      </Box>
    </>
  );
}
