import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { X } from "react-feather";
import Masonry from "react-masonry-css";

import StudioCard from "../StudioCard";
import filterStudios from "./filterStudios";
import styles from "./index.module.scss";

import { cities, mediums } from "../../config/filters";

const dayButtons = ["All", "In A Week", "In A Month", "Later"];
const dayValues = ["All", "week", "month", "later"];

const StudiosFilter = ({ studiosDB: studios }) => {
  const [visibleStudios, setVisibleStudios] = useState(false);
  const [day, setDay] = useState("All");
  const [city, setCity] = useState("All");
  const [medium, setMedium] = useState("All");

  useEffect(() => {
    if (studios) {
      const filters = { day: day, medium: medium, city: city };
      const filtered = filterStudios({ studios, filters });

      setVisibleStudios(
        filtered.map((studio) => {
          return <StudioCard studio={studio} key={studio.id} />;
        })
      );
    }
  }, [studios, day, medium, city]);

  return (
    <div className={styles.program} id="-program">
      <div>
        <div className={styles.filters}>
          <div className={styles.buttons}>
            {dayButtons.map((btn, key) => {
              return (
                <button
                  key={key}
                  className={` ${
                    day === dayValues[key]
                      ? styles.primaryFilterActive
                      : styles.primaryFilter
                  }`}
                  onClick={() => setDay(dayValues[key])}
                >
                  {btn}
                </button>
              );
            })}
            <br />
            {cities.map((btn, key) => {
              return (
                <button
                  key={key}
                  className={`${
                    city === btn
                      ? styles.secondaryFilterActive
                      : styles.secondaryFilter
                  }`}
                  onClick={() => setCity(btn)}
                >
                  {btn}
                </button>
              );
            })}
            <button
              className={styles.secondaryFilter}
              onClick={() => setCity("All")}
            >
              <X size={16} strokeWidth="3" />
            </button>
            <br />
            {mediums.map((btn, key) => {
              return (
                <button
                  key={key}
                  className={`${
                    medium === btn
                      ? styles.secondaryFilterActive
                      : styles.secondaryFilter
                  }`}
                  onClick={() => setMedium(btn)}
                >
                  {btn}
                </button>
              );
            })}
            <button
              className={styles.secondaryFilter}
              onClick={() => setMedium("All")}
            >
              <X size={16} strokeWidth="3" />
            </button>
          </div>
        </div>
        <div className="all-studios">
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
            {visibleStudios}
          </Masonry>
        </div>
      </div>
    </div>
  );
};

StudiosFilter.propTypes = {
  studiosDB: PropTypes.array.isRequired,
};

export default StudiosFilter;
