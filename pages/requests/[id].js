import { useEffect } from "react";

import { useRouter } from "next/router";
import { useRequests } from "services/requests";
import { useAuth } from "services/auth";
import { useAccount } from "services/account";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import Link from "next/link";
import { ChevronLeft } from "react-feather";

import RequestForm from "components/RequestForm";
import styles from "./index.module.scss";

const Request = () => {
  const { request, fetchRequest, updateRequest, loading, error } =
    useRequests();
  const router = useRouter();
  const { id } = router.query;
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
  }, [id, request, error]);

  return (
    <Grid fluid>
      <Row id={styles.requests}>
        <Col xs={12} md={12}>
          <br />
          <ChevronLeft className={styles.icon} size={16} />{" "}
          <Link href={"/requests/"} className={styles.backlink}>
            BACK
          </Link>
          {error && <div>{error}</div>}
          {loading && <img src={`/img/loader.svg`} />}
          {request && (
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
};
export default Request;
