import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";

import { useCities } from "services/city";

import { STUDIO_PREVIEW_COLUMNS } from "config/constants/studioPreviewColumns";
import { STUDIO_COLUMNS } from "config/constants/studioColumns";

const StudiosContext = createContext(null);

const emptyQuery = "";

const StudiosProvider = ({ children }) => {
  const { selectedCity } = useCities();

  const [studios, setStudios] = useState([]);
  const [featuredStudios, setFeaturedStudios] = useState([]);

  const [query, setQuery] = useState(emptyQuery);
  const [hasQuery, setHasQuery] = useState(false);
  const [searchStudios, setSearchStudios] = useState([]);

  const [studio, setStudio] = useState(false);
  const [userStudio, setUserStudio] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  /**
   * This function fetches published studios from a Supabase database and sets them in state.
   */

  const fetchStudios = async () => {
    setLoading(true);
    // console.log("fetching studios");

    // https://markustripp.medium.com/supabase-conditional-queries-with-filter-chaining-1c2bb48b8388

    let supabaseQuery = supabase.from("studios").select(STUDIO_PREVIEW_COLUMNS);

    if (selectedCity) {
      supabaseQuery = supabaseQuery.contains("location", [selectedCity]);
    }
    let { data: supaStudios, error } = await supabaseQuery
      .is("published", true)
      .is("displayed", true)
      .order("studio_id", true);
    if (supaStudios?.length) {
      setStudios(supaStudios);
    } else {
      const returnError = error ?? "No studios were fetched";
      setError(returnError);
    }
    setLoading(false);
  };

  // fetch studios count
  // https://www.restack.io/docs/supabase-knowledge-supabase-get-count-guide

  //REMOVE after feature-flag studiosByCities is activated

  const fetchAllStudios = async () => {
    setLoading(true);
    // console.log("fetching studios");

    // https://markustripp.medium.com/supabase-conditional-queries-with-filter-chaining-1c2bb48b8388

    let { data: supaStudios, error } = await supabase
      .from("studios")
      .select(STUDIO_PREVIEW_COLUMNS)
      .is("published", true)
      .is("displayed", true)
      .order("studio_id", true);
    if (supaStudios?.length) {
      setStudios(supaStudios);
    } else {
      const returnError = error ?? "No studios were fetched";
      setError(returnError);
    }
    setLoading(false);
  };

  /**
   * This function updates the search query and fetches search results from a Supabase database based on
   * the query.
   * @param newQuery - newQuery is a string parameter that represents the user's search query. It is
   * passed to the updateQuery function as an argument and then used to fetch relevant data from the
   * "studios" table in the Supabase database.
   */

  const updateQuery = (newQuery) => {
    setQuery(newQuery);
    if (!newQuery) {
      setSearchStudios(studios);
      setHasQuery(false);
    } else {
      fetchSearchStudios(newQuery);
      setHasQuery(true);
    }
  };

  const fetchSearchStudios = async (newQuery) => {
    setLoading(true);
    let { data: resultStudios, error } = await supabase
      .from("studios")
      .select(STUDIO_PREVIEW_COLUMNS)
      .is("published", true)
      .is("displayed", true)
      .textSearch("fts", newQuery, {
        type: "websearch",
        config: "english",
      })
      .order("studio_id", true);
    if (error) {
      setError(error);
    } else {
      setSearchStudios(resultStudios);
      // console.log("new search"); console.log(resultStudios);
    }
    setLoading(false);
  };

  /**
   * This is an asynchronous function that fetches data from a Supabase database table called "studios"
   * based on a given ID (studio_id) and sets the fetched data to a state variable called "studio".
   */

  const fetchStudio = async ({ id }) => {
    setLoading(true);
    let { data: studio, error } = await supabase
      .from("studios")
      .select(STUDIO_COLUMNS.join(", "))
      .eq("studio_id", id);

    if (studio?.length) {
      const tempStudio = {
        ...studio[0],
        hasOpenDates: studio[0]?.openDates?.length ? true : false,
      };
      setStudio(tempStudio);
      // console.log(tempStudio);
    } else {
      const returnError = error ?? "Some error occurred";
      setError(returnError);
    }
    setLoading(false);
  };

  /**
   * This is an asynchronous function that fetches data from a Supabase database table called "studios"
   * based on a given ID (studio_id) and sets the fetched data to a state variable called "studio".
   */

  const fetchStudioBasic = async ({ uuid }) => {
    setLoading(true);
    let { data: studioBasic, error } = await supabase
      .from("studios")
      .select("artist, studio_id, published, email")
      .eq("uuid", uuid)
      .single();

    if (studioBasic) {
      return studioBasic;
    } else {
      const returnError = error ?? "Some error occurred";
      setError(returnError);
    }
    // setLoading(false);
  };

  /**
   * This is an asynchronous function that fetches a user's studio data from a Supabase database based on
   * their UUID.
   */

  const fetchUserStudio = async ({ uuid }) => {
    setLoading(true);
    let { data: studio, error } = await supabase
      .from("studios")
      .select("*")
      .eq("uuid", uuid);
    if (error) {
      setError(error);
      console.log(error);
    } else {
      const tempStudio = {
        ...studio[0],
        hasOpenDates: studio[0]?.openDates?.length ? true : false,
      };
      setUserStudio(tempStudio);
      // console.log(tempStudio);
    }
    setLoading(false);
  };

  const fetchFeaturedStudios = async () => {
    setLoading(true);
    let { data: featStudios, error } = await supabase
      .from("studios")
      .select(STUDIO_PREVIEW_COLUMNS)
      .is("published", true)
      .is("displayed", true)
      .is("featured", true)
      .order("studio_id", true);
    if (error) {
      setError(error);
    } else {
      setFeaturedStudios(featStudios);
    }
    setLoading(false);
  };

  const doesStudioExist = async ({ uuid }) => {
    let doesExist = false;

    if (uuid) {
      setLoading(true);

      let { data: supaStudios, error } = await supabase
        .from("studios")
        .select("uuid", "referrals")
        .eq("uuid", uuid);
      if (supaStudios?.length) {
        doesExist = true;
      } else {
        const returnError = error ?? "No studios were found";
        setError(returnError);
      }
      setLoading(false);
    }
    return doesExist;
  };

  const contextObj = {
    studios,
    searchStudios,
    featuredStudios,
    studio,
    userStudio,
    query,
    hasQuery,
    updateQuery,
    fetchStudios,
    fetchAllStudios,
    fetchFeaturedStudios,
    fetchStudio,
    fetchUserStudio,
    fetchStudioBasic,
    doesStudioExist,
    loading,
    error,
  };

  return (
    <StudiosContext.Provider value={contextObj}>
      {children}
    </StudiosContext.Provider>
  );
};

const useStudios = () => useContext(StudiosContext);

export { useStudios, StudiosContext, StudiosProvider };
