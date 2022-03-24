import React, { useState, useEffect } from "react";
import { supabase } from "services/supabase";
import Auth from "components/Auth";
import SignUp from "components/Auth/SignUp";
// import SignIn from "components/Auth/SignIn";
import Account from "components/Account";
import { useAuth } from "services/auth";

export default function Join() {
  const { session } = useAuth();

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!session ? (
        <Auth />
      ) : (
        <Account key={session.user.id} session={session} />
      )}
    </div>
  );
}
