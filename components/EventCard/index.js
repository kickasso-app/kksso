import { useRouter } from "next/router";
import { Box, Heading, Text, Paragraph } from "grommet";
import Link from "next/link";
import moment from "moment";
import ProgressiveImage from "react-progressive-image";

import useEventImage from "hooks/useEventImage";
import styles from "./index.module.scss";
const readableDate = (date) => moment(date, "YYYY-MM-DD").format("D MMM 'YY");

export default function EventCard({ event, inStudio = false }) {
  const router = useRouter();
  const [imgUrl, isImgLoaded] = useEventImage(event, "small");
  const eventMargin = { vertical: "1rem" };
  const detailsMargin = { vertical: "0.5rem" };

  const eventLink = "/event/" + event.id;
  const openEvent = () => {
    router.push(eventLink);
  };

  return (
    <div className={styles.EventCard}>
      <div className={styles.imgContainer}>
        <Link href={eventLink}>
          <a onClick={openEvent}>
            {imgUrl && isImgLoaded && (
              <Box pad="medium">
                <ProgressiveImage src={imgUrl} placeholder={`/img/loader.svg`}>
                  {(src, loading) => (
                    <img
                      className={styles.cardImg}
                      src={src}
                      alt={event.title}
                      style={{
                        opacity: loading ? 0.5 : 1,
                        ...(inStudio && {
                          maxHeight: "325px",
                          objectFit: "contain",
                        }),
                      }}
                    />
                  )}
                </ProgressiveImage>
              </Box>
            )}
          </a>
        </Link>
      </div>
      <Box>
        <Heading level="3" margin={eventMargin}>
          {event.title}
        </Heading>
        <Paragraph margin={detailsMargin}>
          {event.type} on {readableDate(event.date)}{" "}
        </Paragraph>
        <Paragraph margin={detailsMargin}>{event.miniDescription}</Paragraph>
      </Box>
    </div>
  );
}
