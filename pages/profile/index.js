import { useRouter } from "next/router";
import { useAuth } from "services/auth";
import { useState, useEffect } from "react";
import { supabase } from "services/supabase";
import { useAccount } from "services/account";

import { Box, Tab, Tabs } from "grommet";

import ProfileForm from "components/forms/ProfileForm";
import PhotosForm from "components/forms/PhotosForm";
import VisitsSettingsForm from "components/forms/VisitsSettingsForm";
import AccountSettings from "components/forms/AccountSettings";

export default function Profile() {
  const router = useRouter();
  const { session, user, event } = useAuth();
  const { profile, fetchProfile, loading, error } = useAccount();

  const [index, setIndex] = useState(0);

  const firstIndex = parseInt(router?.query?.section) ?? 0;
  const onActive = (nextIndex) => {
    router.push(`/profile/?section=${nextIndex}`, undefined, { shallow: true });
    setIndex(nextIndex);
  };

  useEffect(() => {
    if (router.query?.section) {
      setIndex(parseInt(router.query.section));
    }
  }, []);

  useEffect(() => {
    if (user?.role === "authenticated" && !profile) {
      fetchProfile(user);
    }
  }, [session, profile]);

  if (!session && event !== "SIGNED_OUT") {
    router.push("/join");
  }

  return (
    <main>
      {loading && (
        <Box align="center">
          <img src={`/img/loader.svg`} />
        </Box>
      )}
      {error && (
        <Box align="center" pad="xlarge">
          <p>There was an error loading your profile</p>
        </Box>
      )}
      {!loading && !error && user && (
        <>
          {user.role === "authenticated" ? (
            <Tabs activeIndex={firstIndex} onActive={onActive}>
              <Tab title="Profile">
                <Box pad="medium">
                  <ProfileForm profile={profile} goToTab={onActive} />
                </Box>
              </Tab>
              <Tab title="Photos">
                <Box pad="medium">
                  <PhotosForm profile={profile} />
                </Box>
              </Tab>
              <Tab title="Visits">
                <Box pad="medium">
                  <VisitsSettingsForm profile={profile} />
                </Box>
              </Tab>
              <Tab title="Settings">
                <Box pad="medium">
                  <AccountSettings profile={profile} />
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
