import { Suspense } from "react";
import { titleCase } from "services/helpers/textFormat";
import EditorialResults from "./EditorialResults";
import Loading from "components/Loading";

export async function generateMetadata({ params }) {
  const { city } = await params;
  return {
    title: `Arti - Editorial in ${titleCase(city)}`,
    description: `Read interviews and articles about art in ${titleCase(city)}.`,
  };
}

export default async function EditorialCityPage({ params }) {
  const { city } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <EditorialResults city={city} />
    </Suspense>
  );
}
