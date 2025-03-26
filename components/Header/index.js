import { useContext } from "react";
import Link from "next/link";
import { Box, Grid, ResponsiveContext } from "grommet";

import { useAuth } from "services/auth";
import { useCities } from "services/city";

import NavButton from "./NavButton";
// import Button from "components/Button"; // No longer used
import ProfileButton from "./ProfileButton";

import MENU_LINKS from "config/menuLinks";

import { createSlug } from "services/helpers/textFormat";
// import styles from "./index.module.scss";

const Header = () => {
  const { session } = useAuth();
  const { selectedCity } = useCities();
  const size = useContext(ResponsiveContext);

  const createPath = (label, path) => {
    if (!(label === "Studios" || label === "Events")) return path;
    else {
      const pathCity = selectedCity
        ? `${path}/${createSlug(selectedCity)}`
        : `${path}/berlin`;
      return pathCity;
    }
  };

  return (
    <Box margin={{ vertical: "0.5rem", horizontal: "small" }} pad="xsmall">
      <Grid
        columns={size !== "small" ? ["auto", "flex"] : ["100%"]}
        rows={size !== "small" ? ["auto"] : ["auto", "auto"]}
        areas={
          size !== "small"
            ? [
                { name: "logo", start: [0, 0], end: [0, 0] },
                { name: "nav", start: [1, 0], end: [1, 0] },
              ]
            : [
                { name: "logo", start: [0, 0], end: [0, 0] },
                { name: "nav", start: [0, 1], end: [0, 1] },
              ]
        }
        gap="small"
      >
        <Box gridArea="logo" width="xsmall">
          <Link href="/">
            <img src={`/img/logo-name-web.png`} alt="arti" />
          </Link>
        </Box>

        <Box
          gridArea="nav"
          justify={size !== "small" ? "end" : "center"}
          align="center"
          direction="row"
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
    </Box>
  );
};

export default Header;
