'use client';

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useRequests } from "services/requests";
import { useAuth } from "services/auth";
import { useAccount } from "services/account";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import Link from "next/link";
import { ChevronLeft } from "react-feather";

import RequestForm from "components/RequestForm";
import styles from "./page.module.scss";

export default function RequestDetailClient() {
  const { request, fetchRequest, updateRequest, loading, error } =
    useRequests();
  const params = useParams();
  const id = params.id;
  const { user } = useAuth();
  const { profile, fetchProfile } = useAccount();

  useEffect(() => {
    async function fetchRequestData() {
      if (
        user?.role === "authenticated" &&
        !error &&
        id &&
        (!request || request?.request_id !== id)
      ) {
        await fetchProfile(user);
        await fetchRequest(id, user.id);
      }
    }
    fetchRequestData();
  }, [id, request, error, user, fetchProfile, fetchRequest]);

  if (!user && !loading) {
      return (
          <Box align="center" pad="large">
              <p>Please <Link href="/join">sign in</Link> to view request details.</p>
          </Box>
      )
  }

  return (
    <Grid fluid>
      <Row id={styles.requests}>
        <Col xs={12} md={12}>
          <br />
          <Box direction="row" align="center">
            <ChevronLeft size={16} />{" "}
            <Link href={"/requests/"} className={styles.backlink}>
              BACK
            </Link>
          </Box>
          {error && <div>{error}</div>}
          {loading && <img src={`/img/loader.svg`} alt="Loading" />}
          {request && profile && (
            <RequestForm
              request={request}
              updateRequest={updateRequest}
              studio_id={profile.studio_id}
              studio_email={user.email}
              isEventReq={request.request_type === "event"}
            />
          )}
        </Col>
      </Row>
    </Grid>
  );
}
