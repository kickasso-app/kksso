import { supabase } from 'services/supabase';
import EventsClient from './EventsClient';
import { titleCase } from "services/helpers/textFormat";

export async function generateMetadata({ params }) {
  const { city } = await params;
  return {
    title: `Arti - Events in ${titleCase(city)}`,
    description: `Discover art events in ${titleCase(city)}.`,
  };
}

async function getEvents(city) {
    let supabaseQuery = supabase.from("events").select("*");
    if (city) {
      supabaseQuery = supabaseQuery.contains("cityLocation", [city]);
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

export default async function EventsCityPage({ params }) {
    const { city } = await params;
    const events = await getEvents(city);
    
    return <EventsClient events={events} city={city} />;
}
