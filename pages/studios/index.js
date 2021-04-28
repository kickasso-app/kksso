import { useEffect, useContext } from "react";
import { StudiosContext } from "../../services/studios";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import Link from "next/link";

import styles from "./index.module.scss";

import StudiosFilter from "../../components/StudiosFilter/index.js";

const Studios = () => {
  const { studios, fetchStudios, loading, error } = useContext(StudiosContext);

  useEffect(() => {
    if (!studios.length) {
      fetchStudios();
    }
  }, [studios]);

  return (
    <Grid fluid align="center">
      <section>
        <Row id={styles.studio}>
          <Col xs={12} md={12}>
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading ? (
              <img src={`/img/loader.svg`} />
            ) : (
              <StudiosFilter studiosDB={studios} />
            )}
          </Col>
        </Row>
      </section>
    </Grid>
  );
};
export default Studios;
