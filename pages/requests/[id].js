import { useEffect } from "react";

import { useRouter } from "next/router";
import { useRequests } from "services/requests";
import { useAuth } from "services/auth";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import Link from "next/link";
import { ChevronLeft } from "react-feather";

import styles from "./index.module.scss";

const Request = () => {
  const { request, fetchRequest, updateRequest, loading, error } =
    useRequests();
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === "authenticated" && !request && !error && id) {
      fetchRequest(id, user.id);
    }
  }, [id, request, error]);

  return (
    <Grid fluid>
      <Row id={styles.requests}>
        <Col xs={12} md={12}>
          <ChevronLeft className={styles.icon} size={16} />{" "}
          <Link href={"/requests/"} className={styles.backlink}>
            BACK
          </Link>
          {error && <div>{error}</div>}
          {loading ? (
            <img src={`/img/loader.svg`} />
          ) : (
            <div>{JSON.stringify(request)}</div>
          )}
        </Col>
      </Row>
    </Grid>
  );
};
export default Request;
