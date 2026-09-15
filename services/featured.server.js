import { supabase } from "./supabase";
import { getStudio } from "./studios.server";
import { getEvent } from "./events.server";
import { cacheLife, cacheTag } from "next/cache";

export const getFeaturedLandingItems = async () => {
  "use cache";
  cacheTag("featured-landing-items");
  cacheLife("hours");

  const { data, error } = await supabase
    .from("featured_LP")
    .select("studio_id, event_id, uuid, photo_url")
    .eq("isActive", true);

  if (error) {
    console.error("Error fetching featured landing items:", error);
    return [];
  }

  const items = await Promise.all(
    (data || []).map(async (row) => {
      if (row.studio_id) {
        const studio = await getStudio(row.studio_id);
        if (!studio) return null;
        return {
          key: `studio-${row.studio_id}`,
          type: "studio",
          href: `/studio/${row.studio_id}`,
          title: studio.artist,
          subtitle: studio.city,
          photoUrl: row.photo_url,
        };
      }

      if (row.event_id) {
        const event = await getEvent(row.event_id);
        if (!event) return null;
        return {
          key: `event-${row.event_id}`,
          type: "event",
          href: `/event/${row.event_id}`,
          title: event.title,
          subtitle: event.city,
          photoUrl: row.photo_url,
        };
      }

      return null;
    }),
  );

  return items.filter(Boolean);
};
