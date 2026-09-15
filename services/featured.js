"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";

const FeaturedContext = createContext(null);

const FeaturedProvider = ({ children }) => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const fetchFeaturedItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/featured");
      if (!response.ok) throw new Error("Failed to fetch featured items");
      const items = await response.json();
      setFeaturedItems(items || []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, []);

  const contextObj = useMemo(
    () => ({
      featuredItems,
      loading,
      error,
      fetchFeaturedItems,
    }),
    [featuredItems, loading, error, fetchFeaturedItems],
  );

  return (
    <FeaturedContext.Provider value={contextObj}>
      {children}
    </FeaturedContext.Provider>
  );
};

const useFeatured = () => useContext(FeaturedContext);

export { useFeatured, FeaturedContext, FeaturedProvider };
