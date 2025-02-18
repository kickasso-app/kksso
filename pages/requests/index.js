import { useEffect } from "react";

// import { RequestsProvider } from "services/requests";
import { useRequests } from "services/requests";
import { useAuth } from "services/auth";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import Link from "next/link";

import styles from "./index.module.scss";

// import RequestsFilter from "components/RequestsFilter/index.js";

const Requests = () => {
  const { requests, fetchRequests, loading, error } = useRequests();

  const { session, user } = useAuth();
  // const { profile, fetchProfile, loading, error } = useAccount();

  useEffect(() => {
    if (user?.role === "authenticated" && !requests.length && !error) {
      // console.log(user);
      fetchRequests(user.id);
      // console.log(requests);
    }
  }, [session, requests, error]);

  return (
    <Grid fluid align="center">
      <section>
        <Row id={styles.studio}>
          <Col xs={12} md={12}>
            {loading || !requests.length ? (
              <img src={`/img/loader.svg`} />
            ) : (
              <div>
                {requests.map((r) => JSON.stringify(r)).join("<br /><br />")}
              </div>
            )}
          </Col>
        </Row>
      </section>
    </Grid>
  );
};
export default Requests;
