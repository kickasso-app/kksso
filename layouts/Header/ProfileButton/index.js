import { useState, useContext } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "services/auth";

import Button from "components/Button";
import NavButton from "../NavButton";

import { User, Gift } from "react-feather";

import { DropButton, Box, ResponsiveContext } from "grommet";

import styles from "../index.module.scss";

export default function ProfileButton({ onMenuItemClick }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { signOut } = useAuth();

  const size = useContext(ResponsiveContext);

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
    <>
      {size === "small" ? (
        <>
          <button
            onClick={() => setOpen(!open)}
            style={{
              alignItems: "center",
              background: "none",
            }}
            aria-label="Open profile menu"
          >
            <Box pad={{ horizontal: "medium", vertical: "small" }}>
              <User size={20} strokeWidth="1" color="#4b4b4b" fill="#fff" />
            </Box>
          </button>

          {open && (
            <Box
              className={styles.mobileMenu}
              animation={{ type: "fadeIn", duration: 300 }}
              onClick={() => setOpen(false)}
            >
              <Box direction="column" gap="small" align="center">
                <NavButton
                  path={"/profile?section=0"}
                  label={"Profile"}
                  onClick={() => {
                    setOpen(false);
                    onMenuItemClick?.();
                  }}
                />
                <NavButton
                  path={"/requests"}
                  label={"Requests"}
                  onClick={() => {
                    setOpen(false);
                    onMenuItemClick?.();
                  }}
                />
                <NavButton
                  path={"/profile?section=5"}
                  label={
                    <Box gap="xsmall" direction="col">
                      <b>Invites</b> <Gift size={18} />
                    </Box>
                  }
                  onClick={() => {
                    setOpen(false);
                    onMenuItemClick?.();
                  }}
                />
                <NavButton
                  path={"/profile?section=4"}
                  label={"Settings"}
                  onClick={() => {
                    setOpen(false);
                    onMenuItemClick?.();
                  }}
                />

                <Box pad={{ vertical: "small" }}>
                  {loading ? (
                    <img src={`/img/loader.svg`} />
                  ) : (
                    <Button
                      onClick={async () => {
                        await handleSignOut();
                        setOpen(false);
                        onMenuItemClick?.();
                      }}
                      btnStyle="text"
                    >
                      Sign Out
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </>
      ) : (
        <>
          <DropButton
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            dropContent={
              <Box
                width={size === "small" ? "large" : "small"}
                pad={"small"}
                onClick={() => setOpen(false)}
              >
                <NavButton path={"/profile?section=0"} label={"Profile"} />
                <NavButton path={"/requests"} label={"Requests"} />
                <NavButton
                  path={"/profile?section=5"}
                  label={
                    <Box gap="xsmall" direction="col">
                      <b>Invites</b> <Gift size={18} />
                    </Box>
                  }
                />

                <NavButton path={"/profile?section=4"} label={"Settings"} />
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
              <User size={20} strokeWidth="1" color="#4b4b4b" fill="#fff" />
            </Box>
          </DropButton>
        </>
      )}
    </>
  );
}
