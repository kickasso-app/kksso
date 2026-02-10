import { Suspense } from "react";
import { titleCase } from "services/helpers/textFormat";
import EventsResults from "./EventsResults";
import Loading from "components/Loading";

export async function generateMetadata({ params }) {
  const { region } = await params;
  return {
    title: `Arti - Events in ${titleCase(region)}`,
    description: `Discover art events in ${titleCase(region)}.`,
  };
}

export default async function EventsRegionPage({ params }) {
  const { region } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <EventsResults region={region} />
    </Suspense>
  );
}