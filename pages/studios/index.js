import { useEffect } from "react";
import { useStudios } from "services/studios";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import Link from "next/link";

import styles from "./index.module.scss";

import StudiosFilter from "components/StudiosFilter/index.js";

const Studios = () => {
  const { studios, fetchAllStudios, loading, error } = useStudios();

  useEffect(() => {
    if (!studios.length && !error) {
      fetchAllStudios();
    }
  }, [studios, error]);

  return (
    <Grid fluid align="center">
      <section>
        <Row id={styles.studio}>
          <Col xs={12} md={12}>
            {loading || !studios.length ? (
              <img src={`/img/loader.svg`} />
            ) : (
              <StudiosFilter studios={studios} />
            )}
          </Col>
        </Row>
      </section>
    </Grid>
  );
};
export default Studios;
