import React, { useEffect } from "react";

import { useRouter } from "next/router";

import { useCities } from "services/city";

import { Grid, Row } from "react-flexbox-grid/dist/react-flexbox-grid";

import { Box, Button, Text } from "grommet";

import { createSlug } from "services/helpers/textFormat";

export const SelectLocation = ({ isBarFullWidth = false }) => {
  const { cities, fetchCities, selectCity, selectedCity } = useCities();

  const router = useRouter();

  const isStudiosPage = router.pathname.includes("/studios/");
  const isEventsPage = router.pathname.includes("/events/");

  const baseRedirect = isStudiosPage
    ? "/studios/"
    : isEventsPage
    ? "/events/"
    : null;

  useEffect(() => {
    async function fetchData() {
      if (!cities.length) {
        await fetchCities();
      }
    }
    fetchData();
  }, [cities]);

  return (
    <Box
      width={isBarFullWidth ? "xlarge" : "large"}
      pad="small"
      // border={{
      //   color: "#222222",
      //   size: "xsmall",
      //   style: "solid",
      //   side: "all",
      // }}
      // round="large"
      margin={{ horizontal: "none", vertical: "medium" }}
    >
      <Grid fluid>
        <Row middle="xs">
          {cities?.length > 0 &&
            cities.map(({ city }) => {
              return (
                <Box pad="small" key={city}>
                  <Button
                    label={
                      <Box pad="xsmall">
                        <Text size="large" weight={600} color="#4b4b4b">
                          {city}
                        </Text>
                      </Box>
                    }
                    active={selectedCity === city}
                    onClick={async () => {
                      await selectCity(city);
                    }}
                    align="center"
                    gap="small"
                    color="#FFC0CB"
                    size="large"
                    pad="medium"
                    hoverIndicator="#FFC0CB"
                    a11yTitle="X Available Updates"
                    href={baseRedirect ? baseRedirect + createSlug(city) : null}
                  />
                </Box>
              );
            })}
        </Row>
      </Grid>
    </Box>
  );
};

export default SelectLocation;
