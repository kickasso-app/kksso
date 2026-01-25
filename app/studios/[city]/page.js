import { supabase } from 'services/supabase';
import { STUDIO_PREVIEW_COLUMNS } from 'config/constants/studioPreviewColumns';
import StudiosClient from './StudiosClient';
import { titleCase } from "services/helpers/textFormat";

export async function generateMetadata({ params }) {
  const { city } = await params;
  return {
    title: `Arti - Studios in ${titleCase(city)}`,
    description: `Discover art studios in ${titleCase(city)}.`,
  };
}

async function getStudios(city) {
    let supabaseQuery = supabase.from("studios").select(STUDIO_PREVIEW_COLUMNS);
    if (city) {
      supabaseQuery = supabaseQuery.contains("location", [city]);
    }
    let { data: supaStudios, error } = await supabaseQuery
      .is("published", true)
      .is("displayed", true)
      .order("studio_id", { ascending: true });

    if (error) {
        console.error("Error fetching studios:", error);
        return [];
    }
    return supaStudios || [];
}

export default async function StudiosCityPage({ params }) {
    const { city } = await params;
    const studios = await getStudios(city);
    
    return <StudiosClient studios={studios} city={city} />;
}
