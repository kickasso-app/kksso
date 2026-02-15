import { cacheLife, cacheTag } from "next/cache";
import { supabase } from "services/supabase";
import { STUDIO_PREVIEW_COLUMNS } from "config/constants/studioPreviewColumns";
import { titleCase } from "services/helpers/textFormat";
import { getRegionBySlug } from "services/region.server";
import StudiosClient from "./StudiosClient";

async function getStudios(regionName) {
  "use cache";
  cacheTag("studios");
  cacheLife("days");

  let supabaseQuery = supabase.from("studios").select(STUDIO_PREVIEW_COLUMNS);
  if (regionName) {
    supabaseQuery = supabaseQuery.contains("location", [regionName]);
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

export default async function StudiosResults({ region }) {
  const regionData = await getRegionBySlug(region);
  const regionName = regionData?.region || titleCase(region);
  const studios = await getStudios(regionName);

  return <StudiosClient studios={studios} region={region} />;
}
