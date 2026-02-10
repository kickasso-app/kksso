'use client';

import { useEffect, useRef } from "react";
import { useRegions } from "services/region";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box, Heading, Text } from "grommet";
import StudiosFilter from "components/StudiosFilter";
import SelectRegion from "components/SelectRegion";
import { titleCase } from "services/helpers/textFormat";

const StudiosClient = ({ studios, region }) => {
  const { selectedRegion, selectRegion } = useRegions();
  const attemptedRegion = useRef(null);

  useEffect(() => {
    if (region && region !== selectedRegion?.slugName && attemptedRegion.current !== region) {
      attemptedRegion.current = region;
      selectRegion(region);
    }
  }, [region, selectedRegion, selectRegion]);

  return (
    <Grid fluid align="start">
      <section>
        <Row>
          <Col xs={12} md={12}>
            <Box pad="xsmall">
              <Heading level={2} margin="small">
                Studios
              </Heading>
            </Box>
            
            {(!studios || studios.length === 0) ? (
              <>
                <Box pad={{ horizontal: "medium", vertical: "large" }}>
                  <Text size="medium">
                    There are no studios in the region{" "}
                    <b>"{titleCase(region)}"</b>
                    <br />
                    <br />
                    Please try to check the URL or choose another region from
                    below
                  </Text>
                </Box>
                <SelectRegion isBarFullWidth />
              </>
            ) : (
              <StudiosFilter studios={studios} />
            )}
          </Col>
        </Row>
      </section>
    </Grid>
  );
};

export default StudiosClient;