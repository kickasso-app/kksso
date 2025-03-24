import { createContext, useContext, useState, useRef } from "react";
import { supabase } from "./supabase";

const CityContext = createContext(null);

const CityProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const citiesRef = useRef([]); // Cache cities

  const fetchCities = async () => {
    if (citiesRef.current.length) return citiesRef.current; // Return cached

    setLoading(true);
    try {
      const { data: supaCities, error } = await supabase
        .from("cities")
        .select("*")
        .order("count", { ascending: false });

      if (error) throw error;

      if (supaCities?.length) {
        setCities(supaCities);
        citiesRef.current = supaCities; // Cache results
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectCity = async (city) => {
    if (!citiesRef.current.length) {
      await fetchCities();
    }
    if (citiesRef.current.map((c) => c.city).includes(city)) {
      // console.log("selecting city", city);
      setSelectedCity(city);
    } else {
      setError("City not found");
      setSelectedCity(null);
    }
  };

  const contextObj = {
    cities,
    selectedCity,
    loading,
    error,
    fetchCities,
    selectCity,
  };

  return (
    <CityContext.Provider value={contextObj}>{children}</CityContext.Provider>
  );
};

const useCities = () => useContext(CityContext);

export { useCities, CityContext, CityProvider };
