import { supabase } from "services/supabase";
import { STUDIO_PREVIEW_COLUMNS } from "config/constants/studioPreviewColumns";
import StudiosClient from "./StudiosClient";
import { titleCase } from "services/helpers/textFormat";
import { getCityBySlug } from "services/city.server";

export async function generateMetadata({ params }) {
  const { city } = await params;
  return {
    title: `Arti - Studios in ${titleCase(city)}`,
    description: `Discover art studios in ${titleCase(city)}.`,
  };
}

async function getStudios(cityName) {
  let supabaseQuery = supabase.from("studios").select(STUDIO_PREVIEW_COLUMNS);
  if (cityName) {
    supabaseQuery = supabaseQuery.contains("location", [cityName]);
  }
  let { data: supaStudios, error } = await supabaseQuery
    .is("published", true)
    .is("displayed", true)
    .order("studio_id", { ascending: true });

  if (error) {
    console.error("Error fetching studios:", error);
    return [];
  }

  // console.log(`Studios found for ${cityName}:`, supaStudios?.length);
  return supaStudios || [];
}

export default async function StudiosCityPage({ params }) {
  const { city } = await params;
  const cityData = await getCityBySlug(city);
  const cityName = cityData?.city || titleCase(city);

  const studios = await getStudios(cityName);

  return <StudiosClient studios={studios} city={city} />;
}
