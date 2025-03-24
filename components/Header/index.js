import Link from "next/link";
import Image from "next/image";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box } from "grommet";

import { useAuth } from "services/auth";
import { useCities } from "services/city";

import NavButton from "./NavButton";
import Button from "components/Button";
import ProfileButton from "./ProfileButton";

import MENU_LINKS from "config/menuLinks";
import { MoreVertical } from "react-feather";

import { createSlug } from "services/helpers/textFormat";
// import styles from "./index.module.scss";

const Header = () => {
  const { session } = useAuth();
  const { selectedCity } = useCities();

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
    <Grid fluid>
      <Col xs={12}>
        <Box margin={{ bottom: "0.5rem", top: "0.625rem" }}>
          <Row center="xs" start="md">
            <Col xs={12} md={2}>
              <Link href="/">
                <img src={`/img/logo-name-web.png`} alt="arti" />
              </Link>
            </Col>
            <Col xs={12} md={10}>
              <Box margin={{ vertical: "xs" }}>
                <Row center="xs" end="md">
                  {MENU_LINKS.map((button) => (
                    <NavButton
                      key={button.path}
                      path={createPath(button.label, button.path)}
                      label={button.label}
                      // icon={button.icon}
                    />
                  ))}

                  {session ? (
                    <ProfileButton />
                  ) : (
                    <Button btnStyle="outline">
                      <Link href="/join">Join</Link>
                    </Button>
                  )}
                </Row>
              </Box>
            </Col>
          </Row>
        </Box>
      </Col>
    </Grid>
  );
};

export default Header;
