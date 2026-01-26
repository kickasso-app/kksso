import { supabase } from "services/supabase";
import { titleCase } from "services/helpers/textFormat";
import { getCityBySlug } from "services/city.server";
import EventsClient from "./EventsClient";

async function getEvents(cityName) {
  let supabaseQuery = supabase.from("events").select("*");
  if (cityName) {
    supabaseQuery = supabaseQuery.contains("cityLocation", [cityName]);
  }
  let { data: supaEvents, error } = await supabaseQuery
    .is("isPublished", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }
  // console.log(`Events found for ${cityName}:`, supaEvents?.length);
  return supaEvents || [];
}

export default async function EventsResults({ city }) {
  const cityData = await getCityBySlug(city);
  const cityName = cityData?.city || titleCase(city);
  const events = await getEvents(cityName);

  return <EventsClient events={events} city={city} />;
}
