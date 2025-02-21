import { useEffect } from "react";

// import { RequestsProvider } from "services/requests";
import { useRequests } from "services/requests";
import { useAuth } from "services/auth";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Heading, Box } from "grommet";
import Link from "next/link";

import RequestCard from "components/RequestCard";

// import RequestsFilter from "components/RequestsFilter/index.js";

const Requests = () => {
  const { requests, fetchRequests, loading, error } = useRequests();

  const { session, user } = useAuth();

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
        <Row>
          <Col xs={12} md={12}>
            <Box align="start" margin="medium">
              {" "}
              <Heading level={2} margin={{ vertical: "small" }}>
                Requests
              </Heading>
            </Box>
            {loading || !requests.length ? (
              <img src={`/img/loader.svg`} />
            ) : (
              <div>
                {/* {requests.map((r) => JSON.stringify(r)).join("<br /><br />")} */}
                {requests.map((r) => (
                  <RequestCard request={r} key={r.request_id} />
                ))}
              </div>
            )}
          </Col>
        </Row>
      </section>
    </Grid>
  );
};
export default Requests;
