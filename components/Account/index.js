import { useState, useEffect } from "react";
import { supabase } from "services/supabase";

import { useRouter } from "next/router";

import { useAuth } from "services/auth";

import Button from "components/Button";

export default function Account() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { signOut, user, session, authLoading } = useAuth();

  useEffect(() => {
    // getProfile();
  }, [session]);

  const handleSignOut = async () => {
    // event.preventDefault();

    try {
      setLoading(true);
      const { error } = await signOut({});
      if (error) throw error;
      else {
        router.push("/");
      }
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <Button onClick={handleSignOut} btnStyle="outline">
          Sign Out
        </Button>
      </div>
    </div>
  );
}
