import { Suspense } from "react";
import EditorialResults from "./EditorialResults";
import Loading from "components/Loading";

export const metadata = {
  title: "Arti - Editorial",
  description: "Read interviews and articles about art.",
};

export default function EditorialPage() {
  return (
    <Suspense fallback={<Loading />}>
      <EditorialResults />
    </Suspense>
  );
}