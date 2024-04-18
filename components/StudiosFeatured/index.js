import { useState, useEffect } from "react";
import { useStudios } from "services/studios";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

import { Box, Text } from "grommet";

import StudioCard from "../StudioCard";
import styles from "./index.module.scss";

const StudiosFeatured = () => {
  const { featuredStudios, fetchFeaturedStudios, loading, error } =
    useStudios();

  useEffect(() => {
    if (!featuredStudios.length) {
      fetchFeaturedStudios();
    }
  }, [featuredStudios]);

  return (
    <div className={styles.studios}>
      <Box margin={{ vertical: "large" }}>
        {featuredStudios?.length > 0 ? (
          <Row>
            {featuredStudios.map((studio) => {
              return (
                <Col md={4} key={studio.uuid.slice(0, 3)}>
                  <Box fill pad="small">
                    <StudioCard studio={studio} />
                  </Box>
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
