import React, { useCallback, useMemo, useRef, useState } from "react";
import { useStudios } from "services/studios";
import { useRouter } from "next/router";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

import { Hash, Disc, Search, X } from "react-feather";
import { Box, Text, TextInput } from "grommet";

import { cities, mediums } from "../../config/filters";

export const SearchBar = ({ isActive = true }) => {
  const {
    query: { city: queryCity, mediums: queryMedium },
    updateQuery,
  } = useStudios();

  const router = useRouter();

  const [isSearchBarActive, setIsSearchBarActive] = useState(isActive);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [suggestionsType, setSuggestionsType] = useState("cities");

  const [city, setCity] = useState(queryCity);
  const [medium, setMedium] = useState(queryMedium);
  //   const [times, setTimes] = useState(visitTimes[0]);

  const [suggestedCities, setSuggestedCities] = useState(cities);
  const [suggestedMediums, setSuggestedMediums] = useState(mediums);

  const boxRef = useRef();

  const onChangeMedium = useCallback((event) => {
    const { value: query } = event.target;
    setMedium(query);
    if (!query.trim()) {
      setSuggestedMediums(mediums);
    } else {
      // simulate an async call to the backend
      setTimeout(
        () =>
          setSuggestedMediums(
            mediums.filter(
              (medium) => medium.toLowerCase().indexOf(query.toLowerCase()) >= 0
            )
          ),
        300
      );
    }
  }, []);

  const onChangeCity = useCallback((event) => {
    const { value: query } = event.target;
    setCity(query);

    if (!query.trim()) {
      setSuggestedCities(cities);
    } else {
      // simulate an async call to the backend
      setTimeout(
        () =>
          setSuggestedCities(
            cities.filter(
              (city) => city.toLowerCase().indexOf(query.toLowerCase()) >= 0
            )
          ),
        300
      );
    }
  }, []);

  const renderCities = useMemo(
    () =>
      suggestedCities.map((city) => (
        <Col md={2} align="start">
          <Text color="#4b4b4b" onClick={() => setCity(city)}>
            <Disc size={20} strokeWidth="1.5" color="#4b4b4b" fill="#fff" />
            {"  "}
            {city}
          </Text>
        </Col>
      )),
    [suggestedCities]
  );

  const renderMediums = useMemo(
    () =>
      suggestedMediums.map((suggestedMedium) => (
        <Col md={2} align="start">
          <Text
            onClick={() => {
              // TO DO: add more tan one medium
              // if (!medium.includes(suggestedMedium)) {
              //   setMedium(medium + " " + suggestedMedium);
              // }
              setMedium(suggestedMedium);
            }}
          >
            <Hash size={18} strokeWidth="1" color="#4b4b4b" fill="#fff" />
            {"  "}
            {suggestedMedium}
          </Text>
        </Col>
      )),
    [suggestedMediums]
  );

  const renderSearchInput = ({
    boxRef,
    title,
    placeholder,
    searchType,
    value,
    onChange,
  }) => {
    return (
      <Box
        ref={boxRef}
        align="start"
        onFocus={() => setSuggestionsType(searchType)}
      >
        {title && (
          <Text margin={{ left: "small", top: "xsmall" }}>{title}</Text>
        )}
        <TextInput
          placeholder={placeholder}
          plain
          value={value}
          onChange={onChange}
        />
      </Box>
    );
  };

  return (
    <Box>
      <Box
        width={isSearchBarActive ? "xlarge" : "large"}
        pad="small"
        border={{
          color: "#222222",
          size: "xsmall",
          style: "solid",
          side: "all",
        }}
        round="large"
        onFocus={() => {
          setIsSearchBarActive(true);
          setSuggestionOpen(true);
        }}
      >
        <Grid fluid>
          <Row between="xs">
            <Col md={3}>
              {renderSearchInput({
                // boxRef: boxRef,
                title: "Location",
                placeholder: "Where to visit?",
                searchType: "cities",
                value: city,
                onChange: onChangeCity,
              })}
            </Col>
            <Col md={3}>
              {renderSearchInput({
                // boxRef: boxRef,
                title: "Medium",
                placeholder: "Which styles to explore?",
                searchType: "mediums",
                value: medium,
                onChange: onChangeMedium,
              })}
            </Col>
            {/* <Col md={3}>
              {searchPart({
                // boxRef: boxRef,
                title: "Time",
                placeholder: "Whhen to visit?",
                value: times,
                onChange: onChangeTimes,
              })}
            </Col> */}
            <Col md={2}>
              <Row
                end="xs"
                onClick={() => {
                  updateQuery({ city: city, mediums: medium });
                  setSuggestionOpen(false);
                  if (!router.pathname.includes("studios")) {
                    router.push("/studios");
                  }
                }}
              >
                <Box
                  width="48px"
                  align="center"
                  pad="small"
                  background="#FFC0CB"
                  round="medium"
                  margin="small"
                >
                  <Search size={24} color="#222222" strokeWidth={1.5} />

                  {/* 
                  {value.length === 0 ? (
                    <Search size={24} color="#222222" strokeWidth={1.5} />
                  ) : (
                    <X
                      onClick={() => {
                        setValue("");
                      }}
                    />
                  )} */}
                </Box>
              </Row>
            </Col>
          </Row>
        </Grid>
      </Box>
      {suggestionOpen && (
        <Box
          width="xlarge"
          margin={{ vertical: "small" }}
          pad={{ vertical: "medium", horizontal: "large" }}
          border={{
            color: "#FFC0CB",
            size: "small",
            style: "solid",
            side: "all",
          }}
          round="large"
        >
          <Row>
            {suggestionsType === "cities" && <>{renderCities}</>}
            {suggestionsType === "mediums" && <>{renderMediums}</>}
            {/* {suggestionsType === "times" && <>{suggestionsTimes}</>} */}
          </Row>
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
