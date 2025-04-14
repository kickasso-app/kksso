import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useStudios } from "services/studios";
import { useCities } from "services/city";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

import { Box, Heading, Text } from "grommet";

import StudiosFilter from "components/StudiosFilter";
import SelectLocation from "components/SelectLocation";

import { titleCase, undoSlug } from "services/helpers/textFormat";

const Studios = () => {
  const router = useRouter();

  const { city } = router.query;

  const { studios, fetchStudios, loading, error } = useStudios();
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
      fetchStudios();
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
                Studios
              </Heading>
            </Box>
            {loading && <img src={`/img/loader.svg`} />}
            {error && (
              <>
                <Box pad={{ horizontal: "medium", vertical: "large" }}>
                  <Text size="medium">
                    There are no studios in the city{" "}
                    <b>"{titleCase(undoSlug(city))}"</b>
                    <br />
                    <br />
                    Please try to check the URL or choose another city from
                    below
                  </Text>
                </Box>
                <SelectLocation isBarFullWidth />
                {/* <b>Error: {JSON.stringify(error)}</b> */}
              </>
            )}

            {!loading && !error && studios && (
              <StudiosFilter studios={studios} />
            )}
          </Col>
        </Row>
      </section>
    </Grid>
  );
};
export default Studios;
