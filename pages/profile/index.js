import { useRouter } from "next/router";
import { useAuth } from "services/auth";
import { useState, useEffect } from "react";
import { supabase } from "services/supabase";

import { Box, Tab, Tabs } from "grommet";

import Account from "components/Account";
import ProfileForm from "components/forms/ProfileForm";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const router = useRouter();

  const { session, user, event } = useAuth();

  // console.log(session);

  if (!session && event !== "SIGNED_OUT") {
    router.push("/join");
  }

  useEffect(() => {
    if (user?.role === "authenticated") {
      getProfile();
    }
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("studios")
        .select(`artist, city, styles, textMini, accountType`) // avatar_url
        .eq("uuid", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setProfile({
          // uuid: user.id,
          ...data,
          // types: "1",
        });
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      {user && (
        <>
          {user.role === "authenticated" ? (
            <Tabs>
              <Tab title="Profile">
                <Box pad="medium">
                  <ProfileForm profileLoading={loading} profile={profile} />
                </Box>
              </Tab>
              <Tab title="Account">
                <Box pad="medium">
                  <Account />
                </Box>
              </Tab>
            </Tabs>
          ) : (
            <>
              <p>
                Thank you for signing up. Please check your {user.email} inbox
                to verify your e-mail address!
              </p>
            </>
          )}
        </>
      )}
    </main>
  );
}
