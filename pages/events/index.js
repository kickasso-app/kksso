import { useEffect } from "react";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box } from "grommet";
import { useEvents } from "services/events";
import EventCard from "components/EventCard";
import Masonry from "react-masonry-css";
// Optionally reuse masonry styles from StudiosFilter or create your own
import styles from "components/StudiosFilter/index.module.scss";

export default function Events() {
  const { events, fetchPublishedEvents, loading, error } = useEvents();

  useEffect(() => {
    if (!events.length && !error) {
      fetchPublishedEvents();
    }
  }, [events, error]);

  return (
    <Grid fluid align="center">
      <section>
        <Row>
          <Col xs={12} md={12}>
            {loading || !events.length ? (
              <Box align="center" pad="large">
                <img src={`/img/loader.svg`} alt="Loading" />
              </Box>
            ) : (
              <Box pad="small">
                {error && <p>Error: {JSON.stringify(error)}</p>}
                <Masonry
                  breakpointCols={{
                    default: 3,
                    960: 3,
                    768: 2,
                    600: 1,
                  }}
                  className={styles.masonryGrid}
                  columnClassName={styles.masonryGridColumn}
                >
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </Masonry>
              </Box>
            )}
          </Col>
        </Row>
      </section>
    </Grid>
  );
}
