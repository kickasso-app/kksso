import React from "react";
import { useState, useEffect } from "react";
import Tabletop from "tabletop";
// import Papa from "papaparse";
import StudiosRouter from "./StudiosRouter/index.js";
import { Redirect } from "react-router-dom";

import { artistsLinks } from "../constants";

const sheetID = process.env.REACT_APP_GOOGLESHEET_ID;
// const sheetID_CSV = process.env.REACT_APP_GOOGLESHEET_ID_CSV;

const Studios = ({ match: { params } }) => {
  const [sheet, setSheet] = useState({ data: [] });
  const [dataLoading, setDataLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [shortURL, setShortURL] = useState(false);

  const fetchTabletop = async () => {
    try {
      /* Papa.parse(
        `https://docs.google.com/spreadsheets/d/e/${sheetID_CSV}/pub?output=csv`,
        {
          download: true,
          header: true,
          complete: function (results) {
            var studiosData = results.data;
            console.log(results);
            setSheet({ data: studiosData });
            setDataLoading(false);
          },
          error: function (error) {
            console.log(error);
            setLoadingError(true);
          },
        }
      );
      */

      Tabletop.init({
        key: sheetID,
        callback: (googleData) => {
          // console.table(googleData);
          setSheet({ data: googleData });
          sessionStorage.setItem("savedsheet", JSON.stringify(googleData));
        },
        simpleSheet: true,
      });
      setDataLoading(false);
    } catch (error) {
      console.log(error);
      setLoadingError(true);
    }
  };

  useEffect(() => {
    // const savedsheet = sessionStorage.getItem("savedsheet");
    // if (savedsheet && process.env.REACT_APP_RELOAD_SHEET_ALWAYS !== "true") {
    //   setSheet({ data: JSON.parse(savedsheet) });
    //   setDataLoading(false);
    // } else {
    //   setDataLoading(true);
    //   fetchTabletop();
    // }
    setDataLoading(true);
    fetchTabletop();
  }, []);

  useEffect(() => {
    // console.table(sheet.data);
  }, [sheet]);

  useEffect(() => {
    if (
      params.shortName &&
      Object.keys(artistsLinks).includes(params.shortName.toLowerCase())
    )
      setShortURL("/studio/" + artistsLinks[params.shortName.toLowerCase()]);
  }, []);

  if (dataLoading) {
    return <div>Loading .. </div>;
  } else if (loadingError) {
    return <div>Something went wrong ...</div>;
  } else if (shortURL) {
    return <Redirect to={shortURL} />;
  }
  return (
    <div>
      <StudiosRouter articles={sheet.data} articleIDRoute={params.id} />
    </div>
  );
};

export default Studios;
