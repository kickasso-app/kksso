import { useRouter } from "next/router";
import { useAuth } from "services/auth";
import { useState, useEffect } from "react";
import { supabase } from "services/supabase";

import { Box, Tab, Tabs } from "grommet";

import ProfileForm from "components/forms/ProfileForm";
import PhotosForm from "components/forms/PhotosForm";
import VisitsSettingsForm from "components/forms/VisitsSettingsForm";
import AccountSettings from "components/forms/AccountSettings";

import { profileFields } from "config/constants/profile";

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const [index, setIndex] = useState(0);

  const onActive = (nextIndex) => {
    router.push(`/profile/?section=${nextIndex}`, undefined, { shallow: true });
    setIndex(nextIndex);
  };

  useEffect(() => {
    if (router?.query?.section) {
      onActive(parseInt(router.query.section));
    }
  }, []);

  const { session, user, event } = useAuth();

  if (!session && event !== "SIGNED_OUT") {
    router.push("/join");
  }

  useEffect(() => {
    if (user?.role === "authenticated") {
      getProfile();
    }
  }, [session]);


  async function createProfile() {
    const randomId = 1 + Math.floor(Math.random() * 10000);
    const newRow = {
      uuid: user.id,
      studio_id: randomId,
      email: user.email,
      city: "",
      artist: "",
      styles: "",
    };

    const { newProfile, error } = await supabase
      .from('studios')
      .insert([newRow])
      .select();

    if (error && status !== 406) {
      throw error;
    }
    return newProfile;
  }

  async function getProfile() {
    try {
      setLoading(true);

      // TO DO: add to services/studios
      let { data, error, status } = await supabase
        .from("studios")
        .select(profileFields.join(", "))
        .eq("uuid", user.id)
        .single();


      if (!data) {
        data = await createProfile();
      }

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setProfile({ ...data });
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      {loading && (
        <Box align="center">
          <img src={`/img/loader.svg`} />
        </Box>
      )}
      {!loading && user && (
        <>
          {user.role === "authenticated" ? (
            <Tabs activeIndex={index} onActive={onActive}>
              <Tab title="Profile">
                <Box pad="medium">
                  <ProfileForm profile={profile} goToTab={setIndex} />
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
