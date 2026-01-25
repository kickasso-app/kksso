import { supabase } from "./supabase";

export const getCityBySlug = async (slug) => {
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("slugName", slug)
    .single();
  if (error) return null;
  return data;
};
