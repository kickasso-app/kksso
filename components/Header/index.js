import Link from "next/link";
import Image from "next/image";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box } from "grommet";

import NavButton from "./NavButton";

import styles from "./index.module.scss";

const Header = ({ navButtons }) => {
  return (
    <Grid fluid>
      <Col xs={12}>
        <Box margin={{ vertical: "0.5rem" }}>
          <Row start="md" center="xs">
            <Col xs={12} md={2}>
              <Link href="/">
                <img src={`/img/header-logo-sm.png`} alt="Kickasso" />
              </Link>
            </Col>
            <Col xs={12} md={10}>
              <Row center="xs" end="md">
                {navButtons.map((button) => (
                  <NavButton
                    key={button.path}
                    path={button.path}
                    label={button.label}
                    // icon={button.icon}
                  />
                ))}
              </Row>
            </Col>
          </Row>
        </Box>
      </Col>
    </Grid>
  );
};

export default Header;
