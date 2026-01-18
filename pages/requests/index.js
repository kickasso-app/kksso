import { useState, useEffect } from "react";

// import { RequestsProvider } from "services/requests";
import { useRequests } from "services/requests";
import { useAuth } from "services/auth";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Heading, Box, Text } from "grommet";
import Link from "next/link";

import RequestCard from "components/RequestCard";

// import RequestsFilter from "components/RequestsFilter/index.js";

const getStatus = (r) =>
  !r.has_response ? "Pending" : r.response ? "Approved" : "Rejected";

const isPastDate = (date) => new Date(date) < new Date();
const sortByDate = (a, b) => new Date(b.last_update) - new Date(a.last_update);

const filterOptions = [
  { key: "All", title: "All", color: "light-3" },
  { key: "Pending", title: "New", color: "brand" },
  { key: "Approved", title: "Confirmed", color: "accent-1" },
  { key: "Rejected", title: "Denied", color: "dark-3" },
];

const Requests = () => {
  const { requests, fetchRequests, loading, error } = useRequests();
  const { session, user } = useAuth();

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [pastOpen, setPastOpen] = useState(false);

  useEffect(() => {
    if (user?.role === "authenticated" && !requests.length && !error) {
      fetchRequests(user.id);
    }
  }, [session, requests, error]);

  // Filter requests by the selected filter
  const filteredRequests =
    selectedFilter === "All"
      ? requests
      : requests.filter((r) => getStatus(r) === selectedFilter);

  // Further split filtered requests by date
  const upcoming = filteredRequests
    .filter((r) => !isPastDate(r.request_date_tz))
    .sort(sortByDate);
  const past = filteredRequests
    .filter((r) => isPastDate(r.request_date_tz))
    .sort(sortByDate);

  return (
    <Grid fluid align="center">
      <section>
        <Row>
          <Col xs={12} md={12}>
            <Box align="start" margin="medium">
              <Heading level={2} margin={{ vertical: "medium" }}>
                Requests
              </Heading>

              {loading ? (
                <img src={`/img/loader.svg`} />
              ) : !requests.length ? (
                <>
                  <Text size="small" weight="bold">
                    There are currently no requests
                  </Text>
                </>
              ) : (
                <>
                  {/* Filter Buttons */}
                  <Box
                    direction="row"
                    gap="medium"
                    margin={{ top: "large", bottom: "xlarge" }}
                    alignSelf="center"
                  >
                    {filterOptions.map((filter) => (
                      <Box
                        key={filter.key}
                        background={
                          selectedFilter === filter.key
                            ? filter.color
                            : "light-1"
                        }
                        pad={{ horizontal: "medium", vertical: "xsmall" }}
                        round="2px"
                        width="fit-content"
                        onClick={() => setSelectedFilter(filter.key)}
                        style={{ cursor: "pointer" }}
                      >
                        <Text size="small" weight="bold">
                          {filter.title}
                        </Text>
                      </Box>
                    ))}
                  </Box>

                  {/* Upcoming Section */}
                  <Heading level={2} margin={"small"}>
                    Upcoming{" "}
                  </Heading>
                  {upcoming?.length > 0 ? (
                    <>
                      {upcoming.map((r) => (
                        <RequestCard request={r} key={r.request_id} />
                      ))}
                    </>
                  ) : (
                    <Box
                      margin={{
                        top: "medium",
                        bottom: "large",
                        horizontal: "small",
                      }}
                    >
                      There are no upcoming requests
                    </Box>
                  )}

                  {/* Past Section */}
                  <Heading
                    level={2}
                    margin={{
                      top: "large",
                      bottom: "medium",
                      horizontal: "small",
                    }}
                    onClick={() => setPastOpen(!pastOpen)}
                    style={{ cursor: "pointer" }}
                  >
                    Past
                  </Heading>
                  <Box
                    background={"brand"}
                    pad={"medium"}
                    round="4px"
                    width="fit-content"
                    onClick={() => setPastOpen(!pastOpen)}
                    margin="small"
                  >
                    <Text size="medium">
                      {pastOpen ? "Minimize - " : "View +"}
                    </Text>
                  </Box>

                  {pastOpen &&
                    (past?.length > 0 ? (
                      <>
                        {past.map((r) => (
                          <RequestCard request={r} key={r.request_id} />
                        ))}
                      </>
                    ) : (
                      <Box
                        margin={{
                          top: "medium",
                          bottom: "large",
                          horizontal: "small",
                        }}
                      >
                        They were no past requests
                      </Box>
                    ))}
                </>
              )}
            </Box>
          </Col>
        </Row>
      </section>
    </Grid>
  );
};
export default Requests;
