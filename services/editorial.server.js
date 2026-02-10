import { cacheLife, cacheTag } from "next/cache";
import { supabase } from "./supabase";

/**
 * Fetches magazine posts with caching enabled.
 */
export const getMagazinePosts = async () => {
  "use cache";
  cacheTag("editorial");
  cacheLife("hours");

  let supabaseQuery = supabase.from("magazine").select("*");

  try {
    const { data: supaMagPosts, error } = await supabaseQuery
      .is("isPublished", true)
      .order("created_at", { ascending: false });

    return supaMagPosts || [];
  } catch (error) {
    console.error(error?.message || "No articles were fetched");
    return [];
  }
};

/**
 * Fetches a single magazine post with caching enabled.
 */
export const getMagazinePost = async ({ slug }) => {
  "use cache";
  cacheTag("editorial");
  cacheLife("hours");

  try {
    let { data: supaMagPost, error } = await supabase
      .from("magazine")
      .select("*")
      .eq("slug", slug)
      .single();
    
    return supaMagPost || null;
  } catch (error) {
    console.error(error.message ?? "No Editorial Post were fetched");
    return null;
  }
};