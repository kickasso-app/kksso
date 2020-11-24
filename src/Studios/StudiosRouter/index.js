import React from "react";
import { useState, useEffect } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import moment from "moment";
import { X } from "react-feather";

import Studio from "../Studio";
import StudioOpen from "../StudioOpen";

import Masonry from "react-masonry-css";
import "./../../styles/program.scss";

const dayButtons = ["All", "In A Week", "In A Month", "Later"];
const dayValues = ["All", "week", "month", "later"];
const cityValues = ["Berlin", "Paris", "Brussels"];
const categoryButtons = [
  "Painting",
  "Sculpture",
  "Prints",
  "Mixed Media",
  "Photography",
  "Installation",
  "Video",
  "Sound",
];

const StudiosRouter = ({ articles, articleIDRoute }) => {
  const [visibleArticles, setVisibleArticles] = useState(false);
  const [theDay, setTheDay] = useState("All");
  const [theCity, setTheCity] = useState("All");
  const [theCat, setTheCat] = useState("All");

  const [articleIsOpen, setArticleIsOpen] = useState(false);
  const [articleID, setArticleID] = useState(false);

  const openArticle = (id) => {
    setArticleID(id);
    setArticleIsOpen(true);
  };

  const closeArticle = () => {
    setArticleIsOpen(false);
  };

  const filterArticles = (filter) => {
    let filtered = articles;
    const today = moment();
    const nextWeek = moment().add(7, "days");
    const nextMonth = moment().add(1, "months");
    const nextYear = moment().add(1, "years");

    if (filter.day !== false && filter.day !== "All") {
      filtered = filtered.filter((article) => {
        const datesArray = article.dates.split(",");
        const dates = datesArray.map(d => moment(d, "DD/MM/YYYY hh:mm"));

        const isNextWeek = dates.some(d => d.isBetween(today, nextWeek));
        const isNextMonth = dates.some(d => d.isBetween(today, nextMonth));
        const isLater = dates.some(d => d.isBetween(nextMonth, nextYear));

        let result = isNextWeek ? "week " : ""; 
        result += isNextMonth ? "month " : "";
        result +=  isLater ? "later" : "";

        return result.includes(filter.day);
      
      });
    }
    if (filter.cat !== false && filter.cat !== "All") {
      filtered = filtered.filter((article) => {
        const style = filter.cat.toLowerCase();
        return article.styles.includes(style);
      });
    }
    if (filter.city !== false && filter.city !== "All") {
      filtered = filtered.filter((article) => {
        return article.city.includes(filter.city);
      });
    }

    setVisibleArticles(
      filtered.map((article) => {
        return (
          <Studio
            article={article}
            openArticle={openArticle}
            key={article.id}
          />
        );
      })
    );
    setTheDay(filter.day);
    setTheCat(filter.cat);
    setTheCity(filter.city);
    // sessionStorage.setItem("filters", JSON.stringify(filter));
  };

  useEffect(() => {
    if (articleIDRoute > 0 && articleIDRoute <= articles.length) {
      openArticle(articleIDRoute);
    }

    // let savedfilters = sessionStorage.getItem("filters");
    // if (savedfilters) {
    //   savedfilters = JSON.parse(savedfilters);
    //   setTheDay(savedfilters.day);
    //   setTheCat(savedfilters.cat);
    //   setTheCity(savedfilters.city);
    //   filterArticles(savedfilters);
    // } else {
    //   filterArticles({ day: theDay, cat: theCat, city: theCity });
    // }

    filterArticles({ day: theDay, cat: theCat, city: theCity });

  }, [articles, articleIDRoute]);

  return (
    <div className="program" id="the-program">
      {articleIsOpen ? (
        <StudioOpen
          article={articles.filter(article => article.id === articleID).pop()}
          closeArticle={closeArticle}
        />
      ) : (
        <div>
          <div className="filters">
            <div className="buttons button-group filters-button-group">
              {dayButtons.map((btn, key) => {
                return (
                  <button
                    key={key}
                    className={
                      "button" +
                      (theDay === dayValues[key] ? " is-checked" : "")
                    }
                    onClick={() => {
                      filterArticles({ day: dayValues[key], cat: theCat, city: theCity });
                    }}
                  >
                    {btn}
                  </button>
                );
              })}
               <br />
              {cityValues.map((btn, key) => {
                return (
                  <button
                    key={key}
                    className={
                      "button styles" + (theCity === btn ? " is-checked" : "")
                    }
                    onClick={() => {
                      filterArticles({ day: theDay, cat: theCat, city: btn });
                    }}
                  >
                    {btn}
                  </button>
                );
              })}
              <button
                className="button styles"
                onClick={() => {
                  filterArticles({ day: theDay, cat: theCat, city: "All" });
                }}
              >
                <X size={16} strokeWidth="3" />
              </button>
              <br />
              {categoryButtons.map((btn, key) => {
                return (
                  <button
                    key={key}
                    className={
                      "button styles" + (theCat === btn ? " is-checked" : "")
                    }
                    onClick={() => {
                      filterArticles({ day: theDay, cat: btn, city: theCity });
                    }}
                  >
                    {btn}
                  </button>
                );
              })}
              <button
                className="button styles"
                onClick={() => {
                  filterArticles({ day: theDay, cat: "All", city: theCity });
                }}
              >
                <X size={16} strokeWidth="3" />
              </button>
            </div>
          </div>
          <div className="all-articles">
            <Masonry
              breakpointCols={{
                default: 3,
                960: 3,
                768: 2,
                600: 1,
              }}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {visibleArticles}
            </Masonry>
          </div>
        </div>
      )}
    </div>
  );
};

StudiosRouter.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
  articleIDRoute: PropTypes.string,
};

export default withRouter(StudiosRouter);
