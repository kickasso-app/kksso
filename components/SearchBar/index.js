import React, { useCallback, useMemo, useRef, useState } from "react";
import { useStudios } from "services/studios";
import { useRouter } from "next/router";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

import { Search, X } from "react-feather";
import { Box, TextInput } from "grommet";

export const SearchBar = ({ isBarFullWidth = false }) => {

  const router = useRouter();

  const { query, updateQuery } = useStudios();

  const [tempQuery, setTempQuery] = useState(query);

  const onChangeQuery = useCallback((event) => {
    const { value: newQuery } = event.target;
    setTempQuery(newQuery.trim());
  }, []);

  const onSearchEnter = (event) => {
    if (event.key === 'Enter') {
      setTempQuery(tempQuery);
      onSearch();
    }
  };

  const onSearch = useCallback(() => {
    updateQuery(tempQuery);
  }, [tempQuery]);


  return (
    <Box
      width={isBarFullWidth ? "xlarge" : "large"}
      pad="small"
      border={{
        color: "#222222",
        size: "xsmall",
        style: "solid",
        side: "all",
      }}
      round="large"
      margin={{ horizontal: "none", vertical: "medium" }}
    >
      <Grid fluid>
        <Row middle="xs">
          <Col xs={10}>
            <TextInput
              placeholder={"Search artists, cities, styles"}
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
                  if (!router.pathname.includes("studios")) {
                    router.push("/studios");
                  }
                }}
              >

                <Search size={18} color="#222222" strokeWidth={1.5} onClick={onSearch} />
                {/* 
                  {value.length === 0 ? (
                    <Search size={24} color="#222222" strokeWidth={1.5} />
                  ) : (
                  <X onClick={() => {}}/>
                  )} 
                */}
              </Box>
            </Row>
          </Col>
        </Row>
      </Grid>
    </Box>
  );
};

export default SearchBar;
