import { createContext, useState, useEffect } from "react";
import { supabase } from "./supabase";

const StudiosContext = createContext(null);

const StudiosProvider = ({ children }) => {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const updateStudios = (newStudios) => {
    setStudios(newStudios);
  };

  const fetchStudios = async () => {
    let { data: supaStudios, error } = await supabase
      .from("studios")
      .select("*")
      .order("id", true);
    if (error) setError(error);
    else {
      setStudios(supaStudios);
      // console.log(supaStudios);
      setLoading(false);
    }
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

  const contextObj = { studios, fetchStudios, loading, error, updateStudios };

  return (
    <StudiosContext.Provider value={contextObj}>
      {children}
    </StudiosContext.Provider>
  );
};

export { StudiosContext, StudiosProvider };
