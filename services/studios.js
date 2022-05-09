import { createContext, useContext, useState } from "react";
import { supabase } from "./supabase";

const StudiosContext = createContext(null);

const emptyQuery = { city: "", mediums: "" };

const StudiosProvider = ({ children }) => {
  const [studios, setStudios] = useState([]);
  const [studio, setStudio] = useState(false);
  const [userStudio, setUserStudio] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [query, setQuery] = useState(emptyQuery);

  const updateStudios = (newStudios) => {
    setStudios(newStudios);
  };

  const updateQuery = (newQuery) => {
    setQuery(newQuery);
  };

  const fetchStudios = async () => {
    setLoading(true);
    let { data: supaStudios, error } = await supabase
      .from("studios")
      .select("*")
      .is("published", true)
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
      setUserStudio(studio[0]);
      // console.log(studio[0]);
    }
    setLoading(false);
  };

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
      setStudio(studio[0]);
      // console.log(studio[0]);
    }
    setLoading(false);
  };

  const contextObj = {
    studios,
    studio,
    userStudio,
    query,
    updateStudios,
    updateQuery,
    fetchStudios,
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
