"use client";

import { useEffect, useRef } from "react";
import { useRegions } from "services/region";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import Masonry from "react-masonry-css";
import { Box, Heading, Text } from "grommet";
import SelectRegion from "components/SelectRegion";
import EventCard from "components/EventCard";
import { titleCase } from "services/helpers/textFormat";
import styles from "components/StudiosFilter/index.module.scss";

const EventsClient = ({ events, region }) => {
  const { selectedRegion, selectRegion } = useRegions();
  const attemptedRegion = useRef(null);

  useEffect(() => {
    if (region && region !== selectedRegion?.slugName && attemptedRegion.current !== region) {
      attemptedRegion.current = region;
      selectRegion(region);
    }
  }, [region, selectedRegion, selectRegion]);

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
                    There are no events in the region <b>"{titleCase(region)}"</b>
                    <br />
                    <br />
                    Please try to check the URL or choose another region from
                    below
                  </Text>
                </Box>
                <SelectRegion isBarFullWidth />
              </>
            ) : (
              <Box pad="small">
                <Box align="center" margin={{ vertical: "medium" }}>
                  <SelectRegion isBarFullWidth />
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