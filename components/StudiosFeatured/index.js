import { useState, useEffect } from "react";
import { useStudios } from "services/studios";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

import { Box, Text } from "grommet";

import StudioCard from "../StudioCard";
import styles from "./index.module.scss";

const StudiosFeatured = () => {

  const { studios, fetchStudios, loading, error } = useStudios();

  const [featuredStudios, setFeaturedStudios] = useState([]);

  useEffect(() => {
    if (!studios.length) {
      fetchStudios();
    }
  }, [studios]);

  useEffect(() => {
    if (studios.length > 2) {
      // Pilot To Do 
      // pick three random studios

      setFeaturedStudios(studios.slice(0, 3));
      // console.log(studios.slice(0, 3));
    }

  }, [loading]);




  return (
    <div className={styles.studios}>

      <Box margin={{ vertical: "large" }}>
        {featuredStudios.length > 0 ? (
          <Row>
            {featuredStudios.map((studio) => {
              return (
                <Col md={4} key={studio.uuid.slice(0, 3)}>
                  <StudioCard studio={studio} />
                </Col>
              );
            })}
          </Row>
        ) : (
          <img src={`/img/loader.svg`} />
        )}
      </Box>
    </div>
  );
};

export default StudiosFeatured;
