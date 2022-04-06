import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "services/auth";

import Auth from "components/Auth";

export default function Join() {
  const router = useRouter();
  const { session, user } = useAuth();
  if (session) {
    router.push("/profile");
  }

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      <Auth />
    </div>
  );
}
