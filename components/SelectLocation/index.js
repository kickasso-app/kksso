"use client";

import React, { useEffect, useContext, useMemo } from "react";

import { useRouter, usePathname } from "next/navigation";

import { useCities } from "services/city";

import { Grid, Row } from "react-flexbox-grid/dist/react-flexbox-grid";

import { Box, Button, Text, ResponsiveContext } from "grommet";

export const SelectLocation = ({ isBarFullWidth = false }) => {
  const size = useContext(ResponsiveContext);
  const { cities, fetchCities, selectCity, selectedCity } = useCities();

  const router = useRouter();
  const pathname = usePathname();

  const baseRedirect = useMemo(() => {
    const section = pathname.split("/")[1];
    return section ? `/${section}/` : null;
  }, [pathname]);

  useEffect(() => {
    async function fetchData() {
      if (!cities.length) {
        await fetchCities();
        //console.log("Fetched cities inSelectLocation:", cities);
      }
    }
    fetchData();
  }, [cities]);

  return (
    <Box
      width={isBarFullWidth ? "xlarge" : "large"}
      margin={{ horizontal: "none", vertical: "small" }}
      align="center"
    >
      <Grid fluid>
        <Row middle="xs">
          {cities?.length > 0 &&
            cities
              .filter(({ count }) => count > 0)
              .map(({ city, published, slugName }) => {
                return (
                  <Box pad={"xsmall"} key={city}>
                    <Button
                      label={
                        <Box pad={{ vertical: "xsmall", horizontal: "medium" }}>
                          <Text
                            size={size === "small" ? "small" : "medium"}
                            weight={600}
                            color="#4b4b4b"
                          >
                            {city} {published || "(soon)"}
                          </Text>
                        </Box>
                      }
                      active={selectedCity?.slugName === slugName}
                      disabled={published === false}
                      onClick={async (e) => {
                        e.preventDefault();
                        await selectCity(slugName);
                        if (baseRedirect) {
                          router.push(baseRedirect + slugName);
                        }
                      }}
                      align="center"
                      color="#FFC0CB"
                      size={size === "small" ? "medium" : "large"}
                      pad={
                        size === "small"
                          ? { vertical: "xsmall", horizontal: "small" }
                          : "small"
                      }
                      hoverIndicator="#FFC0CB"
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
