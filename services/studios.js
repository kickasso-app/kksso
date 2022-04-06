import { createContext, useContext, useState } from "react";
import { supabase } from "./supabase";

const StudiosContext = createContext(null);

const emptyQuery = { city: "", mediums: "" };

const StudiosProvider = ({ children }) => {
  const [studios, setStudios] = useState([]);
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
    let { data: supaStudios, error } = await supabase
      .from("studios")
      .select("*")
      .is("is_published", true)
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

  /* {
  const fetchStudio = async () => {
    // TO DO: grab from local store
    let { data: oneStudio, error } = await supabase
      .from("studios")
      .select("*")
      .match({ id })
      .single();
    if (error) setError(error);
    else {
      setStudio(oneStudio);
      setImages(
        prepImagesforCarousel(oneStudio.imagesFiles, oneStudio.imagesCaptions)
      );
      setLoading(false);
    }
  };
  } */

  const contextObj = {
    studios,
    query,
    updateStudios,
    updateQuery,
    fetchStudios,
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
