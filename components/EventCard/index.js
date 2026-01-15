import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Heading, Paragraph } from "grommet";
import Link from "next/link";
import moment from "moment";
import ProgressiveImage from "react-progressive-image";

import { downloadEventImage } from "services/images";
import styles from "./index.module.scss";

const readableDate = (date) => moment(date, "YYYY-MM-DD").format("D MMM 'YY");

export default function EventCard({ event, inStudio = false }) {
  const router = useRouter();
  const [imgUrl, setImgUrl] = useState(false);
  const eventMargin = { vertical: "1rem" };
  const detailsMargin = { vertical: "0.5rem" };

  const eventLink = "/event/" + event.id;
  const openEvent = () => {
    router.push(eventLink);
  };

  useEffect(() => {
    const imgPath = `${event.studio_uuid}/${event.id}/event-small.jpg`;
    downloadEventImage({ imgPath }).then((url) => setImgUrl(url));
  }, [event]);

  return (
    <div className={styles.eventCard}>
      <div className={styles.imgContainer}>
        <Link href={eventLink} onClick={() => openEvent()}>
          <ProgressiveImage src={imgUrl} placeholder={`/img/loader.svg`}>
            {(src, loading) => (
              <img className={styles.cardImg} src={src} alt={event.title} />
            )}
          </ProgressiveImage>
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
