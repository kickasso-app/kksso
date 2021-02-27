import { useContext, useState, useEffect } from "react";
import "firebase/firestore";
import "firebase/functions";
import { useCollection } from "react-firebase-hooks/firestore";

import { FirebaseContext } from "../../services/firebase.js";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import Link from "next/link";

import styles from "./index.module.scss";

import StudiosFilter from "../../components/StudiosFilter/index.js";

const Studios = () => {
  const margin = "medium";
  const sectionMargin = { vertical: "12rem" };

  const firebase = useContext(FirebaseContext);

  const [value, loading, error] = useCollection(
    firebase.firestore().collection("studios"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  //   const sayHello = firebase.functions().httpsCallable("sayHelloFunc");
  //   const getProducts = firebase.functions().httpsCallable("getProductsCF");

  const [studiosDB, setStudiosDB] = useState([]);

  useEffect(() => {
    if (value) {
      const data = value.docs.map((doc) => doc.data());
      setStudiosDB(data);
      console.log(data);
    }
    // sayHello({ name: "Shaun" }).then((result) => {
    //   console.log(result.data);
    // });
    // getProducts({}).then((result) => {
    //   console.log(result.data);
    //   setResultfromCF(result.data);
    // });
  }, [value]);

  return (
    <Grid fluid align="center">
      <section>
        <Row id={styles.studio}>
          <Col xs={12} md={12}>
            <br />
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && <img src={`/img/loader.svg`} />}
            {value && (
              <>
                <StudiosFilter studiosDB={studiosDB} />
                <br />
                <br />
                {/* {value.docs.map((doc) => (
                  <StudioCard studio={doc.data()} /> 

                 <p key={doc.id}>{JSON.stringify(doc.data())}, </p>
                ))}*/}
              </>
            )}
          </Col>
        </Row>
      </section>
    </Grid>
  );
};
export default Studios;
