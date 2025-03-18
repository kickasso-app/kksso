import React, { useState, useEffect } from "react";
import { Heading, Paragraph, Image } from "grommet";
import { Calendar, Clock } from "react-feather";
import { downloadEventImage } from "services/images";
import styles from "./index.module.scss";

export default function EventCard({ event, userId }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const eventMargin = { vertical: "1rem" };

  useEffect(() => {
    async function fetchPhoto() {
      // Download the event photo using the fixed path "event-small.jpg"
      const url = await downloadEventImage({
        imgPath: userId + "/event-small.jpg",
      });
      setPhotoUrl(url);
    }
    fetchPhoto();
  }, [event]);

  return (
    <>
      <Heading level="3" size="medium" margin={{ vertical: "2rem" }}>
        Studio events
      </Heading>

      {photoUrl && (
        <Image
          src={photoUrl}
          fit="cover"
          width="100%"
          height="200px"
          margin={{ bottom: "1rem" }}
        />
      )}

      {event.title && (
        <Paragraph size="medium" margin={eventMargin} fill>
          <Calendar
            className={styles.icon}
            size={18}
            strokeWidth="2"
            color="#FFC0CB"
            fill="#fff"
          />
          <b>{event.title}</b>
        </Paragraph>
      )}

      {event.date && (
        <Paragraph size="medium" margin={eventMargin} fill>
          <Clock
            className={styles.icon}
            size={18}
            strokeWidth="2"
            color="#FFC0CB"
            fill="#fff"
          />
          {event.date}
        </Paragraph>
      )}

      {event.miniDescription && (
        <Paragraph size="medium" margin={eventMargin} fill>
          {event.miniDescription}
        </Paragraph>
      )}

      {event.link && (
        <Paragraph size="medium" margin={eventMargin} fill>
          {event.link}
        </Paragraph>
      )}

      {event.contact && (
        <Paragraph size="medium" margin={eventMargin} fill>
          Contact: {event.contact}
        </Paragraph>
      )}
    </>
  );
}
