import { useEffect } from "react";
import { useRouter } from "next/router";

import { useStudios } from "services/studios";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import Link from "next/link";

import { Box, Heading, Text, ResponsiveContext } from "grommet";
import styles from "./index.module.scss";

import StudiosFilter from "components/StudiosFilter";
import SelectLocation from "components/SelectLocation";

import { titleCase, undoSlug } from "services/helpers/textFormat";

const Studios = () => {
  const router = useRouter();

  const { city } = router.query;

  const { studios, fetchStudios, loading, error } = useStudios();

  useEffect(() => {
    if (city && !studios.length && !error) {
      fetchStudios(titleCase(city));
    }
  }, [city, studios, error]);

  return (
    <Grid fluid align="center">
      <section>
        <Row id={styles.studio}>
          <Col xs={12} md={12}>
            {loading && <img src={`/img/loader.svg`} />}
            {error && (
              <>
                <Box margin={{ vertical: "5rem" }} align="center">
                  <Heading level={4}>
                    There are no studios for the city <b>"{undoSlug(city)}"</b>
                    <br />
                    <br />
                    <br />
                  </Heading>
                  <Text>
                    Please try to check the spelling or choose another city from
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
