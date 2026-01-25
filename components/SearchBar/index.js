import React, { useCallback, useMemo, useRef, useState } from "react";
import { useStudios } from "services/studios";
import { useRouter, usePathname } from "next/navigation";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

import { Search, X } from "react-feather";
import { Box, TextInput } from "grommet";

export const SearchBar = ({ isBarFullWidth = false }) => {
  const router = useRouter();
  const pathname = usePathname();

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
      pad={{ vertical: "xsmall", left: "none", right: "xsmall" }}
      border={{
        color: "#4B4B4B",
        size: "1px",
        style: "solid",
        // side: "all",
      }}
      round="large"
      margin={{ horizontal: "none", vertical: "small" }}
    >
      <Grid fluid>
        <Row middle="xs">
          <Col xs={10}>
            <TextInput
              placeholder={"Search artist, style, or district"}
              plain
              value={tempQuery}
              onChange={onChangeQuery}
              onKeyDown={onSearchEnter}
            />
          </Col>
          <Col xs={2}>
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
                  if (!pathname.includes("studios")) {
                    router.push("/studios");
                  }
                }}
              >
                <Search
                  size={18}
                  color="#4B4B4B"
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
          </Col>
        </Row>
      </Grid>
    </Box>
  );
};

export default SearchBar;
