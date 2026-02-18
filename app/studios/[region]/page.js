import { Suspense } from "react";
import { titleCase } from "services/helpers/textFormat";
import StudiosResults from "./StudiosResults";
import Loading from "components/Loading";

export async function generateMetadata({ params }) {
  const { region } = await params;
  return {
    title: `Arti - Studios in ${titleCase(region)}`,
    description: `Discover art studios in ${titleCase(region)}.`,
  };
}

export default async function StudiosRegionPage({ params }) {
  const { region } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <StudiosResults region={region} />
    </Suspense>
  );
}