import { useEffect } from "react";
import { useRouter } from "next/router";

import DEFFAULT_CITY from "config/default-city";

export default function MagazineDefault() {
  const router = useRouter();

  useEffect(() => {
    console.log("router", router);
    if (router && !router.query?.city) {
      router.push("/editorial/" + DEFFAULT_CITY);
      return;
    }
  }, [router]);

  return <></>;
}
