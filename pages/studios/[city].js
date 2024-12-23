import { useEffect } from "react";
import { useRouter } from "next/router";

import { useStudios } from "services/studios";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import Link from "next/link";

import styles from "./index.module.scss";

import StudiosFilter from "components/StudiosFilter/index.js";

const Studios = () => {
  const router = useRouter();

  const { city } = router.query;

  const { studios, fetchStudios, loading, error } = useStudios();

  useEffect(() => {
    if (city && !studios.length && !error) {
      fetchStudios(city);
    }
  }, [city, studios, error]);

  return (
    <Grid fluid align="center">
      <section>
        <Row id={styles.studio}>
          <Col xs={12} md={12}>
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && <img src={`/img/loader.svg`} />}
            {studios.length && <StudiosFilter studios={studios} />}
          </Col>
        </Row>
      </section>
    </Grid>
  );
};
export default Studios;
