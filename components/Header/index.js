import Link from "next/link";
import Image from "next/image";
import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

import NavButton from "./NavButton";

import styles from "./index.module.scss";

const Header = ({ navButtons }) => {
  return (
    <Grid fluid>
      <Col xs={12}>
        <Row start="md" center="xs">
          <Col xs={12} md={2}>
            <Link href="/">
              <Image
                src={`/img/header-name.png`}
                alt="Kickasso"
                layout="responsive"
                width="100%"
                height="24.3%"
              />
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
      </Col>
    </Grid>
  );
};

export default Header;
