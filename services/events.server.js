import { supabase } from "./supabase";
import { cacheLife, cacheTag } from "next/cache";

export const getEvent = async (id) => {
  "use cache";
  cacheTag("events");
  cacheLife("hours");

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
};
