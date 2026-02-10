"use client";

import React, { useEffect, useContext, useMemo } from "react";

import { useRouter, usePathname } from "next/navigation";

import { useRegions } from "services/region";

import { Grid, Row } from "react-flexbox-grid/dist/react-flexbox-grid";

import { Box, Button, Text, ResponsiveContext } from "grommet";

export const SelectRegion = ({ isBarFullWidth = false }) => {
  const size = useContext(ResponsiveContext);
  const { regions, fetchRegions, selectRegion, selectedRegion } = useRegions();

  const router = useRouter();
  const pathname = usePathname();

  const baseRedirect = useMemo(() => {
    const section = pathname.split("/")[1];
    // Editorial is now region-free, so selecting a region shouldn't redirect to /editorial/[region]
    // If we are on editorial, maybe we want to redirect to studios or events? 
    // Or just stay on the page but update the context?
    // For now, let's assume if we are on a known region-based section (studios, events), we redirect.
    if (["studios", "events"].includes(section)) {
        return `/${section}/`;
    }
    return null; 
  }, [pathname]);

  useEffect(() => {
    async function fetchData() {
      if (!regions.length) {
        await fetchRegions();
      }
    }
    fetchData();
  }, [regions, fetchRegions]);

  return (
    <Box
      width={isBarFullWidth ? "xlarge" : "large"}
      margin={{ horizontal: "none", vertical: "small" }}
      align="center"
    >
      <Grid fluid>
        <Row middle="xs">
          {regions?.length > 0 &&
            regions
              .filter(({ count }) => count > 0)
              .map((item) => {
                const { published, slugName, region: regionName } = item;
                return (
                  <Box pad={"xsmall"} key={regionName}>
                    <Button
                      label={
                        <Box pad={{ vertical: "xsmall", horizontal: "medium" }}>
                          <Text
                            size={size === "small" ? "small" : "medium"}
                            weight={600}
                            color="#4b4b4b"
                          >
                            {regionName} {published || "(soon)"}
                          </Text>
                        </Box>
                      }
                      active={selectedRegion?.slugName === slugName}
                      disabled={published === false}
                      onClick={async (e) => {
                        e.preventDefault();
                        await selectRegion(slugName);
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

export default SelectRegion;