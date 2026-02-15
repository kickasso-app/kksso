import { supabaseAdmin } from "./supabase-admin";
import { STUDIO_COLUMNS } from "config/constants/studioColumns";
import { STUDIO_PREVIEW_COLUMNS } from "config/constants/studioPreviewColumns";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";

export const getStudio = async (id) => {
  "use cache";
  cacheTag("studios", `studio-${id}`);
  cacheLife("hours");

  const { data, error } = await supabaseAdmin
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

export const getStudioByUuid = async (uuid, columns = "*") => {
  "use cache";
  cacheTag("studios", `studio-${uuid}`);
  cacheLife("hours");

  const { data, error } = await supabaseAdmin
    .from("studios")
    .select(columns)
    .eq("uuid", uuid)
    .single();

  if (error) return null;
  return data;
};

export const updateStudio = async (uuid, updates) => {
  const { data, error } = await supabaseAdmin
    .from("studios")
    .update(updates)
    .eq("uuid", uuid)
    .select()
    .single();

  if (error) throw error;

  // Revalidate cache tags to ensure fresh data on next fetch
  revalidateTag(`studio-${uuid}`);
  revalidateTag(`studio-${data.studio_id}`);
  revalidateTag("studios");

  return data;
};

export async function getStudios({ regionName, featured, search } = {}) {
  "use cache";
  cacheTag("studios");
  cacheLife("days");

  let supabaseQuery = supabaseAdmin.from("studios").select(STUDIO_PREVIEW_COLUMNS);

  if (regionName) {
    supabaseQuery = supabaseQuery.contains("location", [regionName]);
  }

  if (featured) {
    supabaseQuery = supabaseQuery.is("featured", true);
  }

  if (search) {
    supabaseQuery = supabaseQuery.textSearch("fts", search, {
      type: "websearch",
      config: "english",
    });
  }

  let { data: supaStudios, error } = await supabaseQuery
    .is("published", true)
    .is("displayed", true)
    .order("rank", { ascending: true });

  if (error) {
    console.error("Error fetching studios:", error);
    return [];
  }

  return supaStudios || [];
}
