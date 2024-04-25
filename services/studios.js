import { createContext, useContext, useState } from "react";
import { supabase } from "./supabase";

const StudiosContext = createContext(null);

const emptyQuery = "";

const StudiosProvider = ({ children }) => {
  const [studios, setStudios] = useState([]);
  const [featuredStudios, setFeaturedStudios] = useState([]);

  const [query, setQuery] = useState(emptyQuery);
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
    let { data: supaStudios, error } = await supabase
      .from("studios")
      .select("*")
      .is("published", true)
      .is("displayed", true)
      .order("studio_id", true);
    if (error) {
      setError(error);
      console.log(error);
    } else {
      setStudios(supaStudios);
      // console.log(supaStudios);
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
    } else {
      fetchSearchStudios(newQuery);
    }
  };

  const fetchSearchStudios = async (newQuery) => {
    setLoading(true);
    let { data: resultStudios, error } = await supabase
      .from("studios")
      .select()
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
      .select("*")
      .eq("studio_id", id);
    if (error) {
      setError(error);
      console.log(error);
    } else {
      const tempStudio = {
        ...studio[0],
        hasOpenDates: studio[0]?.openDates?.length ? true : false,
      };
      setStudio(tempStudio);
      // console.log(tempStudio);
    }
    setLoading(false);
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
      .select("*")
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

  const contextObj = {
    studios,
    searchStudios,
    featuredStudios,
    studio,
    userStudio,
    query,
    updateQuery,
    fetchStudios,
    fetchFeaturedStudios,
    fetchStudio,
    fetchUserStudio,
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
