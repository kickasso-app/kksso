import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Heading, Paragraph } from "grommet";
import Link from "next/link";
import moment from "moment";
import ProgressiveImage from "react-progressive-image";

import { useEvents } from "services/events";
import { downloadEventImage } from "services/images";
import styles from "./index.module.scss";

const readableDate = (date) => moment(date, "YYYY-MM-DD").format("D MMM 'YY");

export default function EventCard({ event, inStudio = false }) {
  const router = useRouter();
  const { getEventImage, updateEventImageCache } = useEvents();
  const [imgUrl, setImgUrl] = useState(false);
  const eventMargin = { vertical: "1rem" };
  const detailsMargin = { vertical: "0.5rem" };

  const eventLink = "/event/" + event.id;
  const openEvent = () => {
    router.push(eventLink);
  };

  useEffect(() => {
    const imgPath = `${event.studio_uuid}/${event.id}/event-small.jpg`;
    const cachedUrl = getEventImage(imgPath);

    if (cachedUrl) {
      setImgUrl(cachedUrl);
    } else {
      downloadEventImage({ imgPath }).then((url) => {
        if (url) {
          setImgUrl(url);
          updateEventImageCache(imgPath, url);
        }
      });
    }
  }, [event.studio_uuid, event.id, getEventImage, updateEventImageCache]);

  return (
    <div className={styles.eventCard}>
      <div className={styles.imgContainer}>
        <Link href={eventLink} onClick={(e) => {
          e.preventDefault();
          openEvent();
        }}>
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
