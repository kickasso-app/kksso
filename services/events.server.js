import { supabase } from "./supabase";
import { cacheLife, cacheTag } from "next/cache";
import { EVENT_COLUMNS } from "config/constants/eventColumns";

export const getEvent = async (id) => {
  "use cache";
  cacheTag("events");
  cacheLife("hours");

  const { data, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS.ALL)
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
};
