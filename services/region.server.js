import { supabase } from "./supabase";

export const getRegionBySlug = async (slug) => {
  const { data, error } = await supabase
    .from("regions")
    .select("*")
    .eq("slugName", slug)
    .single();
  if (error) return null;
  return data;
};