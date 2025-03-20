import { useRouter } from "next/router";
import { useState } from "react";
import { Box, Heading, Text } from "grommet";
import Link from "next/link";
import ProgressiveImage from "react-progressive-image";
import useEventImage from "hooks/useEventImage";
import styles from "./index.module.scss";

export default function EventCard({ event }) {
  const router = useRouter();
  const [imgUrl] = useEventImage(event, "small");
  const eventMargin = { vertical: "1rem" };

  const eventLink = "/event/" + event.id;
  const openEvent = () => {
    router.push(eventLink);
  };

  return (
    <div className={styles.EventCard}>
      <div className={styles.imgContainer}>
        <Link href={eventLink}>
          <a onClick={openEvent}>
            {imgUrl && (
              <Box pad="medium">
                <ProgressiveImage src={imgUrl} placeholder={`/img/loader.svg`}>
                  {(src, loading) => (
                    <img
                      className={styles.cardImg}
                      src={src}
                      alt={event.title}
                      style={{ opacity: loading ? 0.5 : 1 }}
                    />
                  )}
                </ProgressiveImage>
              </Box>
            )}
          </a>
        </Link>
      </div>
      <Box pad="small">
        <Heading level="3" margin={eventMargin}>
          {event.title}
        </Heading>
        <Text>{event.miniDescription}</Text>
      </Box>
    </div>
  );
}
