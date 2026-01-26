import { Suspense } from "react";
import { titleCase } from "services/helpers/textFormat";
import EventsResults from "./EventsResults";
import Loading from "components/Loading";

export async function generateMetadata({ params }) {
  const { city } = await params;
  return {
    title: `Arti - Events in ${titleCase(city)}`,
    description: `Discover art events in ${titleCase(city)}.`,
  };
}

export default async function EventsCityPage({ params }) {
  const { city } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <EventsResults city={city} />
    </Suspense>
  );
}
