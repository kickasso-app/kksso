import Link from "next/link";
import Image from "next/image";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";
import { Box } from "grommet";

import NavButton from "./NavButton";
import Button from "./../Button";

// import styles from "./index.module.scss";

const Header = ({ navButtons }) => {
  return (
    <Grid fluid>
      <Col xs={12}>
        <Box margin={{ bottom: "0.5rem", top: "0.625rem" }}>
          <Row center="xs" start="md">
            <Col xs={12} md={2}>
              <Link href="/">
                <img src={`/img/header-logo-sm.png`} alt="kksso" />
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
                <Button btnStyle="outline">
                  <Link href="/join">Join</Link>
                </Button>
              </Row>
            </Col>
          </Row>
        </Box>
      </Col>
    </Grid>
  );
};

export default Header;
