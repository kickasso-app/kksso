import { Calendar, Clock, Link } from "react-feather";

import { Heading, Paragraph } from "grommet";

import styles from "./index.module.scss";

const EventCard = ({ events, eventsLink, eventsContact }) => {
  const eventSeperator = "/";
  const headingMargin = { top: "large", bottom: "small" };
  const eventMargin = { top: "small", bottom: "small" };

  const [title, date, details, details2] = events.split(eventSeperator);

  return (
    <>
      <Heading level="3" size="medium" margin={{ vertical: "2rem" }}>
        Studio events
      </Heading>

      {title && (
        <Paragraph size="medium" margin={eventMargin} fill>
          <Calendar
            className={styles.icon}
            size={18}
            strokeWidth="2"
            color="#FFC0CB"
            fill="#fff"
          />
          <b>{title}</b>
        </Paragraph>
      )}

      {date && (
        <Paragraph size="medium" margin={eventMargin} fill>
          <Clock
            className={styles.icon}
            size={18}
            strokeWidth="2"
            color="#FFC0CB"
            fill="#fff"
          />
          {date}
        </Paragraph>
      )}
      {details && (
        <Paragraph size="medium" margin={eventMargin} fill>
          {details}
        </Paragraph>
      )}
      {details2 && (
        <Paragraph size="medium" margin={eventMargin} fill>
          {details2}
        </Paragraph>
      )}

      {eventsLink?.startsWith("http") && (
        <>
          <Paragraph size="medium" margin={headingMargin} fill>
            <Link
              className={styles.icon}
              size={18}
              strokeWidth="4"
              color="#C0FFF4"
            />
            <a target="_blank" href={eventsLink}>
              Event link
            </a>
          </Paragraph>
        </>
      )}

      {eventsContact && (
        <>
          <Heading level="4" size="medium" margin={headingMargin}>
            Contact for event
          </Heading>

          {eventsContact.startsWith("http") ? (
            <a href={eventsContact} target="_blank">
              {eventsContact}
            </a>
          ) : (
            <Paragraph size="medium" margin={eventMargin} fill>
              {eventsContact}
            </Paragraph>
          )}
          <br />
          <hr />
        </>
      )}
    </>
  );
};

export default EventCard;
