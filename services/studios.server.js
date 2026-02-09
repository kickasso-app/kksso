import { supabase } from "./supabase";
import { STUDIO_COLUMNS } from "config/constants/studioColumns";
import { cacheLife, cacheTag } from "next/cache";

export const getStudio = async (id) => {
  "use cache";
  cacheTag("studios");
  cacheLife("hours");

  const { data, error } = await supabase
    .from("studios")
    .select(STUDIO_COLUMNS.join(", "))
    .eq("studio_id", id)
    .single();

  if (error) return null;
  return {
    ...data,
    hasOpenDates: data?.availability?.openTimes?.length ? true : false,
  };
};
