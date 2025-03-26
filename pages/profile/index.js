import { useRouter } from "next/router";
import { useAuth } from "services/auth";
import { useState, useEffect, useContext } from "react";
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

export default function Profile() {
  const router = useRouter();
  const { session, user, event } = useAuth();
  const { profile, fetchProfile, resetNotification, loading, error } =
    useAccount();

  const size = useContext(ResponsiveContext);

  const [index, setIndex] = useState(parseInt(router?.query?.section) || 0);

  const onActive = (nextIndex) => {
    router.push(`/profile/?section=${nextIndex}`, undefined, { shallow: true });
  };

  useEffect(async () => {
    if (user?.role === "authenticated" && !profile) {
      await fetchProfile(user);
    }
    if (profile && router) {
      const routerIndex = parseInt(router?.query?.section) || 0;
      if (routerIndex != index) {
        resetNotification();
      }
      setIndex(routerIndex);
    }
  }, [router, session, profile]);

  if (!session && event !== "SIGNED_OUT") {
    router.push("/join");
  }

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
