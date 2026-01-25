'use client';

import { useEffect } from "react";
import { useCities } from "services/city";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Text } from "grommet";
import StudiosFilter from "components/StudiosFilter";
import SelectLocation from "components/SelectLocation";
import { titleCase } from "services/helpers/textFormat";

const StudiosClient = ({ studios, city }) => {
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
                Studios
              </Heading>
            </Box>
            
            {/* We assume data is loaded on server, so no loading state needed here normally.
                However, if studios is empty, we show error/empty state. */}
            
            {(!studios || studios.length === 0) ? (
              <>
                <Box pad={{ horizontal: "medium", vertical: "large" }}>
                  <Text size="medium">
                    There are no studios in the city{" "}
                    <b>"{titleCase(city)}"</b>
                    <br />
                    <br />
                    Please try to check the URL or choose another city from
                    below
                  </Text>
                </Box>
                <SelectLocation isBarFullWidth />
              </>
            ) : (
              <StudiosFilter studios={studios} />
            )}
          </Col>
        </Row>
      </section>
    </Grid>
  );
};

export default StudiosClient;
