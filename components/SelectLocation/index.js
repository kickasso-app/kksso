import React, { useCallback, useMemo, useRef, useState } from "react";
import { useStudios } from "services/studios";
import { useRouter } from "next/router";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

import { Search, X } from "react-feather";
import { Box, Button, TextInput } from "grommet";

import { LOCATIONS } from "config/locations";

export const SelectLocation = ({ isBarFullWidth = false }) => {
  const router = useRouter();

  const { query, hasQuery, updateQuery } = useStudios();

  const [tempQuery, setTempQuery] = useState(query);

  const onChangeQuery = useCallback((event) => {
    const { value: newQuery } = event.target;
    setTempQuery(newQuery.trim());
  }, []);

  const onSearchEnter = (event) => {
    if (event.key === "Enter") {
      setTempQuery(tempQuery);
      onSearch();
    }
  };

  const onSearch = useCallback(() => {
    updateQuery(tempQuery);
  }, [tempQuery]);

  const onClearSearch = useCallback(() => {
    setTempQuery("");
    updateQuery("");
  }, [tempQuery]);

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
          {LOCATIONS.cities.map((city) => {
            return (
              <Button
                label={city}
                onClick={() => {}}
                align="center"
                gap="small"
                color="#FFC0CB"
                pad="small"
                a11yTitle="X Available Updates"
              />
            );
          })}

          {/* <Col xs={9}>
            <TextInput
              placeholder={"Search artist, style, or kiez"}
              plain
              value={tempQuery}
              onChange={onChangeQuery}
              onKeyDown={onSearchEnter}
            />
          </Col>
          <Col xs={3}>
            <Row end="xs">
              <Box
                width="38px"
                height="38px"
                align="center"
                alignContent="center"
                alignSelf="center"
                background="#FFC0CB"
                round="large"
                pad={{ vertical: "10px" }}
                onClick={() => {
                  onSearch();
                  if (!router.pathname.includes("studios")) {
                    router.push("/studios");
                  }
                }}
              >
                <Search
                  size={18}
                  color="#222222"
                  strokeWidth={1.5}
                  onClick={onSearch}
                />
              </Box>
              {hasQuery && !isBarFullWidth && (
                <Box
                  width="38px"
                  height="38px"
                  align="center"
                  alignContent="center"
                  alignSelf="center"
                  background="#FFF"
                  round="large"
                  pad={{ vertical: "10px" }}
                >
                  <X onClick={onClearSearch} />
                </Box>
              )}
            </Row>
          </Col> */}
        </Row>
      </Grid>
    </Box>
  );
};

export default SelectLocation;
