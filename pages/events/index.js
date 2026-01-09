import { useEffect } from "react";
import { useRouter } from "next/router";

import DEFFAULT_CITY from "config/default-city";

export default function EventsDefault() {
  const router = useRouter();

  useEffect(() => {
    if (router && !router.query?.city) {
      router.push("/events/" + DEFFAULT_CITY);
      return;
    }
  }, [router]);

  return <></>;
}
