import { Suspense } from "react";
import { titleCase } from "services/helpers/textFormat";
import StudiosResults from "./StudiosResults";
import Loading from "components/Loading";

export async function generateMetadata({ params }) {
  const { city } = await params;
  return {
    title: `Arti - Studios in ${titleCase(city)}`,
    description: `Discover art studios in ${titleCase(city)}.`,
  };
}

export default async function StudiosCityPage({ params }) {
  const { city } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <StudiosResults city={city} />
    </Suspense>
  );
}
