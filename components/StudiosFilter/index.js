import { useState, useEffect } from "react";
import { useStudios } from "services/studios";

import { Box, Text } from "grommet";
import Masonry from "react-masonry-css";

import SearchBar from "components/SearchBar";
import StudioCard from "../StudioCard";
import filterStudios from "./filterStudios";
import styles from "./index.module.scss";

const StudiosFilter = ({ studios }) => {

  const { query, searchStudios } = useStudios();

  const [visibleStudios, setVisibleStudios] =
    useState(query ? searchStudios : studios);

  useEffect(() => {
    setVisibleStudios(query ? searchStudios : studios);
  }, [searchStudios, query]);

  return (
    <div className={styles.studios}>
      <Box align="center" margin="none">
        <SearchBar />
      </Box>
      <Box margin={{ vertical: "large" }}>
        {visibleStudios.length > 0 ? (
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
              return <StudioCard studio={studio} key={studio.uuid.slice(0, 3)} />;
            })}
          </Masonry>
        ) : (
          <Text>No matching studios.</Text>
        )}
      </Box>
    </div>
  );
};

export default StudiosFilter;
