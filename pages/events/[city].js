import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useEvents } from "services/events";
import { useCities } from "services/city";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import Masonry from "react-masonry-css";
import { Box, Heading, Text } from "grommet";

import SelectLocation from "components/SelectLocation";

import EventCard from "components/EventCard";
import { titleCase, undoSlug } from "services/helpers/textFormat";

// Optionally reuse masonry styles from StudiosFilter or create your own
import styles from "components/StudiosFilter/index.module.scss";

export default function Events() {
  const router = useRouter();
  const { city } = router.query;

  const { events, fetchEvents, loading, error } = useEvents();
  const { selectedCity, selectCity } = useCities();

  const [isDifferentCity, setIsDifferentCity] = useState(true);

  // First Effect: Handle city selection
  useEffect(() => {
    if (!city) return; // Guard clause

    const cityName = titleCase(undoSlug(city));
    if (cityName !== selectedCity) {
      setIsDifferentCity(true);
      selectCity(cityName);
    }
  }, [city]); // Only depend on URL param changes

  // Second Effect: Fetch studios when city changes
  useEffect(() => {
    if (selectedCity && isDifferentCity) {
      fetchEvents();
      setIsDifferentCity(false);
    }
  }, [selectedCity, isDifferentCity]);

  return (
    <Grid fluid align="start">
      <section>
        <Row>
          <Col xs={12} md={12}>
            <Box pad="xsmall">
              <Heading level={2} margin="small">
                Events
              </Heading>
            </Box>
            {loading && <img src={`/img/loader.svg`} />}
            {error && (
              <>
                <Box pad={{ horizontal: "medium", vertical: "large" }}>
                  <Text size="medium">
                    There are no events in the city{" "}
                    <b>"{titleCase(undoSlug(city))}"</b>
                    <br />
                    <br />
                    Please try to check the URL or choose another city from
                    below
                  </Text>
                </Box>
                {/* <b>Error: {JSON.stringify(error)}</b> */}
              </>
            )}

            <SelectLocation isBarFullWidth />
            {!loading && !error && events && (
              <Box pad="small">
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
