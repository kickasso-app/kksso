import { getEvent } from "services/events.server";
import EventPreviewClient from "./EventPreviewClient";

export const metadata = {
  title: 'Event Preview - Arti',
  description: 'Preview how your art event appears to visitors.',
};

export default async function EventPreviewPage({ params }) {
  const { id } = await params;
  const event = await getEvent(id);

  return <EventPreviewClient initialEvent={event} />;
}
