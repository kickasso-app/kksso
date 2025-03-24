import React, { useEffect, useContext } from "react";

import { useRouter } from "next/router";

import { useCities } from "services/city";

import { Grid, Row } from "react-flexbox-grid/dist/react-flexbox-grid";

import { Box, Button, Text, ResponsiveContext } from "grommet";

import { createSlug } from "services/helpers/textFormat";

export const SelectLocation = ({ isBarFullWidth = false }) => {
  const size = useContext(ResponsiveContext);
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
      margin={{ horizontal: "none", vertical: "medium" }}
      align="center"
    >
      <Grid fluid>
        <Row middle="xs">
          {cities?.length > 0 &&
            cities.map(({ city, count }) => {
              return (
                <Box pad={size === "small" ? "small" : "small"} key={city}>
                  <Button
                    label={
                      <Box pad={size === "small" ? "xxsmall" : "xxsmall"}>
                        <Text
                          size={size === "small" ? "medium" : "large"}
                          weight={600}
                          color="#4b4b4b"
                        >
                          {city} {count === 0 && "(soon)"}
                        </Text>
                      </Box>
                    }
                    active={selectedCity === city}
                    disabled={count === 0}
                    onClick={async () => {
                      await selectCity(city);
                    }}
                    align="center"
                    gap={size === "small" ? "xsmall" : "small"}
                    color="#FFC0CB"
                    size={size === "small" ? "medium" : "large"}
                    pad={size === "small" ? "small" : "medium"}
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
