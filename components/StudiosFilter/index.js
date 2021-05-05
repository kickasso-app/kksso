import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Box, Text } from "grommet";
import Masonry from "react-masonry-css";

import SearchBar from "./../../components/SearchBar";
import StudioCard from "../StudioCard";
import filterStudios from "./filterStudios";
import styles from "./index.module.scss";

const StudiosFilter = ({ studios, query }) => {
  const [visibleStudios, setVisibleStudios] = useState(studios);

  useEffect(() => {
    if (studios && query) {
      const filteredStudios = filterStudios({ studios, query });
      setVisibleStudios(filteredStudios);
    }
  }, [studios, query]);

  return (
    <div className={styles.studios}>
      <Box margin={"medium"}>
        <SearchBar isActive={false} />
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
  studios: PropTypes.array.isRequired,
};

export default StudiosFilter;
