import { Suspense } from "react";
import Loading from "components/Loading";
import UpdateClient from "./UpdateClient";

export const metadata = {
  title: "Arti - Edit your Arti Night event",
  description: "Edit your Arti Night event.",
  robots: { index: false, follow: false },
};

export default function UpdatePage() {
  return (
    <Suspense fallback={<Loading />}>
      <UpdateClient />
    </Suspense>
  );
}
