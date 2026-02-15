'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";

import { useRegions } from "services/region";

const StudiosContext = createContext(null);

const emptyQuery = "";

const StudiosProvider = ({ children }) => {
  const { selectedRegion } = useRegions();

  const [studios, setStudios] = useState([]);
  const [featuredStudios, setFeaturedStudios] = useState([]);

  const [query, setQuery] = useState(emptyQuery);
  const [hasQuery, setHasQuery] = useState(false);
  const [searchStudios, setSearchStudios] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  // Cache for studio profile images using useRef to avoid re-renders
  const profileImageCache = useRef({});

  const updateProfileImageCache = useCallback((uuid, url) => {
    profileImageCache.current[uuid] = url;
  }, []);

  const getProfileImage = useCallback((uuid) => {
    return profileImageCache.current[uuid];
  }, []);

  // Clear search query and results when selectedRegion changes
  useEffect(() => {
    setQuery(emptyQuery);
    setHasQuery(false);
    setSearchStudios([]);
  }, [selectedRegion]);

  /**
   * This function fetches published studios from a Supabase database and sets them in state.
   */

  const fetchStudios = async () => {
    setLoading(true);
    const regionName = selectedRegion?.region || "";

    try {
      const response = await fetch(
        `/api/studios?region=${encodeURIComponent(regionName)}`,
      );
      if (!response.ok) throw new Error("Failed to fetch studios");
      const supaStudios = await response.json();

      if (supaStudios?.length) {
        setStudios(supaStudios);
      } else {
        setError("No studios were fetched");
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

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
    const regionName = selectedRegion?.region || "";

    try {
      const response = await fetch(
        `/api/studios?region=${encodeURIComponent(regionName)}&search=${encodeURIComponent(newQuery)}`,
      );
      if (!response.ok) throw new Error("Failed to fetch search results");
      const resultStudios = await response.json();
      setSearchStudios(resultStudios);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const fetchFeaturedStudios = async () => {
    setLoading(true);
    const regionName = selectedRegion?.region || "";
    try {
      const response = await fetch(
        `/api/studios?region=${encodeURIComponent(regionName)}&featured=true`,
      );
      if (!response.ok) throw new Error("Failed to fetch featured studios");
      const featStudios = await response.json();
      setFeaturedStudios(featStudios);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const fetchStudioBasic = async ({ uuid }) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/studios/${uuid}?preview=true`);
      if (!response.ok) throw new Error("Studio not found");
      return await response.json();
    } catch (err) {
      setError(err.message);
    }
  };

  const doesStudioExist = async ({ uuid }) => {
    if (!uuid) return false;
    setLoading(true);
    try {
      const response = await fetch(`/api/studios/${uuid}?preview=true`);
      setLoading(false);
      return response.ok;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  const contextObj = useMemo(
    () => ({
      studios,
      searchStudios,
      featuredStudios,
      query,
      hasQuery,
      updateQuery,
      fetchStudios,
      fetchFeaturedStudios,
      fetchStudioBasic,
      doesStudioExist,
      loading,
      error,
      getProfileImage,
      updateProfileImageCache,
    }),
    [
      studios,
      searchStudios,
      featuredStudios,
      query,
      hasQuery,
      loading,
      error,
      getProfileImage,
      updateProfileImageCache,
      selectedRegion, // Add dependency
    ],
  );

  return (
    <StudiosContext.Provider value={contextObj}>
      {children}
    </StudiosContext.Provider>
  );
};

const useStudios = () => useContext(StudiosContext);

export { useStudios, StudiosContext, StudiosProvider };