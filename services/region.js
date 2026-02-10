'use client';

import { createContext, useContext, useState, useRef, useCallback, useMemo } from "react";
import { supabase } from "./supabase";

const RegionContext = createContext(null);

const RegionProvider = ({ children }) => {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const regionsRef = useRef([]); // Cache regions

  const fetchRegions = useCallback(async () => {
    // console.log("fetchRegions called");
    if (regionsRef.current.length) {
      // console.log("Returning cached regions", regionsRef.current.length);
      // Ensure state is in sync with ref if it somehow got out of sync (optional, but good for safety)
      if (regions.length === 0) {
          setRegions(regionsRef.current);
      }
      return regionsRef.current; 
    }

    setLoading(true);
    try {
      //console.log("Fetching regions from Supabase...");
      const { data: supaRegions, error } = await supabase
        .from("regions")
        .select("*")
        .order("count", { ascending: false }); ;

      if (error) throw error;

      //console.log("Fetched regions:", supaRegions);

      if (supaRegions?.length) {
        setRegions(supaRegions);
        regionsRef.current = supaRegions; // Cache results
      }
    } catch (error) {
      console.error("Error fetching regions:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [regions.length]);

  const selectRegion = useCallback(async (regionSlug) => {
    if (!regionsRef.current.length) {
      await fetchRegions();
    }

    // We need to access the current selectedRegion, but we can't add it to dependencies 
    // without breaking stability. Ideally check against state updater or use a ref for selectedRegion if needed.
    // But actually, we can just check inside.
    
    // Note: selectedRegion state is not available here if we want stable callback.
    // However, checking if it's already selected is an optimization.
    // Let's rely on React's state setter optimization (it won't re-render if value is same).
    
    const matchingRegion = regionsRef.current.find((r) => r.slugName === regionSlug);
    if (matchingRegion) {
      // console.log(matchingRegion)
      setSelectedRegion(matchingRegion);
    } else {
      setError("Region not found");
      setSelectedRegion(null);
    }
  }, [fetchRegions]);

  const contextObj = useMemo(() => ({
    regions,
    selectedRegion,
    loading,
    error,
    fetchRegions,
    selectRegion,
  }), [regions, selectedRegion, loading, error, fetchRegions, selectRegion]);

  return (
    <RegionContext.Provider value={contextObj}>{children}</RegionContext.Provider>
  );
};

const useRegions = () => useContext(RegionContext);

export { useRegions, RegionContext, RegionProvider };
