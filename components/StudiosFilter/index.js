import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Text } from "grommet";

import { X } from "react-feather";
import Masonry from "react-masonry-css";

import SearchBar from "./../../components/SearchBar";
import StudioCard from "../StudioCard";
import filterStudios from "./filterStudios";
import styles from "./index.module.scss";

import { cities, mediums } from "../../config/filters";

const dayButtons = ["All", "In A Week", "In A Month", "Later"];
const dayValues = ["All", "week", "month", "later"];

const StudiosFilter = ({ studiosDB: studios }) => {
  const [visibleStudios, setVisibleStudios] = useState(studios);

  useEffect(() => {
    if (studios) {
      // TO DO: fetch filters from local store
      const filters = { day: "All", medium: "All", city: "Berlin" };
      const filteredStudios = filterStudios({ studios, filters });
      setVisibleStudios(filteredStudios);
    }
  }, [studios]);

  const applyFilters = ({ city: selectedCity, medium: selectedMedium }) => {
    const filters = {
      day: "All",
      medium: selectedMedium || "All",
      city: selectedCity || "All",
    };
    const filteredStudios = filterStudios({ studios, filters });
    setVisibleStudios(filteredStudios);
  };

  return (
    <div className={styles.studios}>
      <Box margin={"medium"}>
        <SearchBar
          isActive={false}
          filters={{ selectedCity: "Berlin" }}
          onUpdate={applyFilters}
        />
      </Box>
      <Box margin={{ vertical: "large" }}>
        {visibleStudios.length ? (
          <Masonry
            breakpointCols={{
              default: 3,
              960: 3,
              768: 2,
              600: 1,
            }}
            className={styles.masonryGrid}
            columnClassName={styles.masonryGridColumn}
          >
            {visibleStudios.map((studio) => {
              return <StudioCard studio={studio} key={studio.id} />;
            })}
          </Masonry>
        ) : (
          <Text>No matching studios.</Text>
        )}
      </Box>
    </div>
  );
};

StudiosFilter.propTypes = {
  studiosDB: PropTypes.array.isRequired,
};

export default StudiosFilter;
