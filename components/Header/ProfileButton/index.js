import { useState } from "react";

import { useRouter } from "next/router";

import { useAuth } from "services/auth";

import Button from "components/Button";
import NavButton from "../NavButton";

import { User } from "react-feather";

import { DropButton, Box } from "grommet";

export default function ProfileButton() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { signOut } = useAuth();

  const handleSignOut = async () => {
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

  const dropAlign = { top: "bottom", right: "right" };

  return (
    <DropButton
      dropContent={
        <Box pad={"small"}>
          <NavButton path={"/profile?section=0"} label={"Profile"} />
          <NavButton path={"/profile?section=3"} label={"Settings"} />
          <Box pad={{ vertical: "small" }}>
            {loading ? (
              <img src={`/img/loader.svg`} />
            ) : (
              <Button onClick={handleSignOut} btnStyle="text">
                Sign Out
              </Button>
            )}
          </Box>
        </Box>
      }
      dropAlign={dropAlign}
    >
      <Box pad={{ horizontal: "medium", vertical: "small" }}>
        <User size={20} color="#222222" strokeWidth={1.5} />
      </Box>
    </DropButton>
  );
}
