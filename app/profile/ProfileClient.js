'use client';

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "services/auth";
import { useState, useEffect, useContext, Suspense } from "react";
import { useAccount } from "services/account";

import { Box, Tab, Tabs, Select, ResponsiveContext } from "grommet";
import { Settings } from "react-feather";

import ProfileForm from "components/forms/ProfileForm";
import PhotosForm from "components/forms/PhotosForm";
import VisitsSettingsForm from "components/forms/VisitsSettingsForm";
import EventsSettingsForm from "components/forms/EventsSettingsForm";
import AccountSettings from "components/forms/AccountSettings";
import InvitesForm from "components/forms/InvitesForm";

// Define the constant TABS outside the component
const TABS = ["Profile", "Photos", "Visits", "Events", "Settings", "Invites"];

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const { session, user, event } = useAuth();
  const { profile, fetchProfile, resetNotification, loading, error } =
    useAccount();

  const size = useContext(ResponsiveContext);

  const sectionParam = searchParams.get('section');
  const [index, setIndex] = useState(parseInt(sectionParam) || 0);

  const onActive = (nextIndex) => {
    const params = new URLSearchParams(searchParams);
    params.set('section', nextIndex);
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    async function fetchUserProfile() {
      if (user?.role === "authenticated" && !profile) {
        await fetchProfile(user);
      }
      if (profile) {
        const routerIndex = parseInt(sectionParam) || 0;
        if (routerIndex != index) {
          resetNotification();
        }
        setIndex(routerIndex);
      }
    }
    fetchUserProfile();
  }, [sectionParam, session, profile, user]);

  useEffect(() => {
    if (!session && event !== "SIGNED_OUT" && event !== undefined) {
        // Only redirect if we are sure there is no session
        // authLoading might be useful here but useAuth doesn't expose it cleanly in a way that avoids flashes
    }
    // In pages router it was:
    // if (!session && event !== "SIGNED_OUT") {
    //   router.push("/join");
    // }
    // However, event might be undefined initially.
  }, [session, event, router]);

  const MobileSelectMenu = () => {
    return (
      <Box
        pad="small"
        margin={{ horizontal: "medium" }}
        direction="row"
        align="center"
        gap="medium"
      >
        <Settings size={20} color="#4b4b4b" pad="small" />
        <Box fill="horizontal">
          <Select
            size="medium"
            options={TABS}
            value={TABS[index]}
            onChange={({ option }) => {
              const newIndex = TABS.indexOf(option);
              onActive(newIndex);
            }}
          />
        </Box>
      </Box>
    );
  };

  if (!user && !loading) {
      return (
          <Box align="center" pad="large">
              <p>Please <a href="/join">sign in</a> to view your profile.</p>
          </Box>
      )
  }

  return (
    <main>
      {loading && (
        <Box align="center">
          <img src={`/img/loader.svg`} alt="Loading" />
        </Box>
      )}
      {error && (
        <Box align="center" pad="xlarge">
          <p>There was an error loading your profile. Please try again.</p>
        </Box>
      )}
      {!loading &&
        !error &&
        user &&
        (user.role === "authenticated" ? (
          size === "small" ? (
            <>
              <MobileSelectMenu />
              <Box margin="small">
                {index === 0 && (
                  <ProfileForm profile={profile} goToTab={onActive} />
                )}
                {index === 1 && <PhotosForm profile={profile} />}
                {index === 2 && <VisitsSettingsForm profile={profile} />}
                {index === 3 && <EventsSettingsForm profile={profile} />}
                {index === 4 && <AccountSettings profile={profile} />}
                {index === 5 && <InvitesForm profile={profile} />}
              </Box>
              <Box margin={{ top: "large" }}>
                <MobileSelectMenu />
              </Box>
            </>
          ) : (
            <Box margin="medium">
              <Tabs activeIndex={index} onActive={onActive}>
                {TABS.map((tab) => (
                  <Tab title={tab} key={tab}>
                    <Box margin="large" pad="medium">
                      {tab === "Profile" && (
                        <ProfileForm profile={profile} goToTab={onActive} />
                      )}
                      {tab === "Photos" && <PhotosForm profile={profile} />}
                      {tab === "Visits" && (
                        <VisitsSettingsForm profile={profile} />
                      )}
                      {tab === "Events" && (
                        <EventsSettingsForm profile={profile} />
                      )}
                      {tab === "Settings" && (
                        <AccountSettings profile={profile} />
                      )}
                      {tab === "Invites" && <InvitesForm profile={profile} />}
                    </Box>
                  </Tab>
                ))}
              </Tabs>
            </Box>
          )
        ) : (
          <Box align="center" pad="medium">
            <p>You are not authorized to view this page.</p>
          </Box>
        ))}
    </main>
  );
}

export default function ProfileClient() {
    return (
        <Suspense fallback={<Box align="center"><img src={`/img/loader.svg`} alt="Loading" /></Box>}>
            <ProfileContent />
        </Suspense>
    )
}
