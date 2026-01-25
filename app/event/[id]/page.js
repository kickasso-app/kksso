import { getEvent } from "services/events.server";
import EventClient from "./EventClient";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return {
      title: 'Event Not Found - Arti',
    };
  }

  return {
    title: `${event.title} - Event - Arti`,
    description: event.miniDescription || `Join the art event ${event.title} on Arti.`,
  };
}

export default async function EventPage({ params }) {
  const { id } = await params;
  const event = await getEvent(id);

  return <EventClient initialEvent={event} />;
}
