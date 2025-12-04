import { useEffect } from "react";
import { useRouter } from "next/router";

import DEFFAULT_CITY from "config/default-city";

export default function StudiosAll() {
  const router = useRouter();

  useEffect(() => {
    if (router && !router.query?.city) {
      router.push("/studios/" + DEFFAULT_CITY);
      return;
    }
  }, [router]);

  return <></>;
}
