'use client';

import { useContext, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Box, Grid, ResponsiveContext } from "grommet";
import { Menu as MenuIcon, X as CloseIcon } from "react-feather";

import { useAuth } from "services/auth";
import { useRegions } from "services/region";

import NavButton from "./NavButton";
import ProfileButton from "./ProfileButton";

import MENU_LINKS from "config/menuLinks";

import styles from "./index.module.scss";

const Header = () => {
  const { session } = useAuth();
  const params = useParams();
  const regionSlug = params?.region;

  const size = useContext(ResponsiveContext);
  const [menuOpen, setMenuOpen] = useState(false);

  // Helper to construct paths
  const createPath = (label, path) => {
    // Only append region slug for Studios and Events
    const isRegionBased = ["Studios", "Events"].includes(label);
    
    if (isRegionBased && regionSlug) {
      return `${path}/${regionSlug}`;
    }
    
    // Editorial and others are location-free or static
    return path;
  };

  const navButtons = MENU_LINKS.map((button) => (
    <NavButton
      key={button.path}
      path={createPath(button.label, button.path)}
      label={button.label}
      onClick={() => setMenuOpen(false)}
    />
  ));


  return (
    <div className={styles.header}>
      <Box margin={{ vertical: "small", horizontal: "small" }} pad="xsmall">
        {/* Mobile Header */}
        <div className={styles.mobileHeader}>
          <Box direction="row" align="center" justify="between" fill>
            <Box width="xsmall">
              <Link href="/">
                <img
                  src={`/img/logo-name-web-high.png`}
                  height="36px"
                  alt="arti"
                />
              </Link>
            </Box>

            <Box direction="row" align="center">
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className={styles.menuIcon}
              >
                <MenuIcon
                  size={28}
                  strokeWidth="1"
                  color="#4b4b4b"
                  fill="#fff"
                />
              </button>
              {session && <ProfileButton />}
            </Box>

            {menuOpen && (
              <Box
                className={styles.mobileMenu}
                animation={{ type: "fadeIn", duration: 300 }}
              >
                <button
                  onClick={() => setMenuOpen(false)}
                  className={styles.menuIconClose}
                  aria-label="Close menu"
                >
                  <CloseIcon
                    size={28}
                    strokeWidth="1"
                    color="#4b4b4b"
                    fill="#fff"
                  />
                </button>
                <Box
                  direction="column"
                  gap="large"
                  align="center"
                  justify="center"
                >
                  <NavButton
                    path={"/"}
                    label={"Home"}
                    onClick={() => setMenuOpen(false)}
                  />
                  {navButtons}
                  {!session && (
                    <NavButton
                      path={"/join"}
                      label={<u>Join</u>}
                      onClick={() => setMenuOpen(false)}
                    />
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </div>

        {/* Desktop Header */}
        <div className={styles.desktopHeader}>
          <Grid
            columns={["auto", "flex"]}
            rows={["auto"]}
            areas={[
              { name: "logo", start: [0, 0], end: [0, 0] },
              { name: "nav", start: [1, 0], end: [1, 0] },
            ]}
            gap="small"
          >
            <Box gridArea="logo" width="xsmall">
              <Link href="/">
                <img
                  src={`/img/logo-name-web-high.png`}
                  height="40px"
                  alt="arti"
                />
              </Link>
            </Box>
            <Box
              gridArea="nav"
              align="center"
              direction="row"
              justify="end"
              gap="small"
              fill
            >
              {MENU_LINKS.map((button) => (
                <NavButton
                  key={button.path}
                  path={createPath(button.label, button.path)}
                  label={button.label}
                />
              ))}
              {session ? (
                <ProfileButton />
              ) : (
                <NavButton path={"/join"} label={<u>Join</u>} />
              )}
            </Box>
          </Grid>
        </div>
      </Box>
    </div>
  );
};

export default Header;