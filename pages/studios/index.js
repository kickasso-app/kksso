import { useState, useEffect } from "react";
import { useSupabase } from "use-supabase";
import { supabase } from "../../services/supabase";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import Link from "next/link";

import styles from "./index.module.scss";

import StudiosFilter from "../../components/StudiosFilter/index.js";

const Studios = () => {
  const margin = "medium";
  const sectionMargin = { vertical: "12rem" };

  const { auth, from } = useSupabase();

  const [studiosDB, setStudiosDB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const fetchStudios = async () => {
    let { data: supaStudios, error } = await supabase
      .from("studios")
      .select("*")
      .order("id", true);
    if (error) setError(error);
    else {
      setStudiosDB(supaStudios);
      console.log(supaStudios);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!studiosDB.length) {
      fetchStudios();
    }
  }, [studiosDB]);

  return (
    <Grid fluid align="center">
      <section>
        <Row id={styles.studio}>
          <Col xs={12} md={12}>
            <br />
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading ? (
              <img src={`/img/loader.svg`} />
            ) : (
              <StudiosFilter studiosDB={studiosDB} />
            )}
            <br />
            <br />
          </Col>
        </Row>
      </section>
    </Grid>
  );
};
export default Studios;
