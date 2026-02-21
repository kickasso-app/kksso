import { cacheLife, cacheTag } from "next/cache";
import { supabase } from "services/supabase";
import { titleCase } from "services/helpers/textFormat";
import { getRegionBySlug } from "services/region.server";
import EventsClient from "./EventsClient";

async function getEvents(regionName) {
  "use cache";
  cacheTag("events");
  cacheLife("hours");

  let supabaseQuery = supabase.from("events").select("*");
  if (regionName) {

    supabaseQuery = supabaseQuery.eq("country", regionName);
  }
  let { data: supaEvents, error } = await supabaseQuery
    .is("isPublished", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }
  return supaEvents || [];
}

export default async function EventsResults({ region }) {

  const regionData = await getRegionBySlug(region);
  const regionName =  regionData?.region || titleCase(region);
  const events = await getEvents(regionName);
  
  return <EventsClient events={events} region={region} />;
}