"use client";

import { useEffect } from "react";
import { useCities } from "services/city";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import Masonry from "react-masonry-css";
import { Box, Heading, Text } from "grommet";
import SelectLocation from "components/SelectLocation";
import EventCard from "components/EventCard";
import { titleCase } from "services/helpers/textFormat";
import styles from "components/StudiosFilter/index.module.scss";

const EventsClient = ({ events, city }) => {
  const { selectedCity, selectCity } = useCities();

  useEffect(() => {
    if (city && city !== selectedCity?.slugName) {
      selectCity(city);
    }
  }, [city, selectedCity, selectCity]);

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

            {!events || events.length === 0 ? (
              <>
                <Box pad={{ horizontal: "medium", vertical: "large" }}>
                  <Text size="medium">
                    There are no events in the city <b>"{titleCase(city)}"</b>
                    <br />
                    <br />
                    Please try to check the URL or choose another city from
                    below
                  </Text>
                </Box>
                <SelectLocation isBarFullWidth />
              </>
            ) : (
              <Box pad="small">
                <Box align="center" margin={{ vertical: "medium" }}>
                  <SelectLocation isBarFullWidth />
                </Box>

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
};

export default EventsClient;
