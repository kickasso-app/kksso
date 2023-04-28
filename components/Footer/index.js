import Link from "next/link";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

// import { SimpleGrid } from "@chakra-ui/react";
import { Box, Image, Text } from "grommet";
import { Instagram } from "react-feather";
// import { Facebook, Instagram } from "react-feather";

import styles from "./index.module.scss";

const Footer = () => {
  return (
    <footer>
      <Grid fluid className={styles.footer}>
        <Row>
          <Col xs={12} sm={12} md={8} lg={6} mdOffset={2} lgOffset={3}>
            <center>
              {/* <p>kickasso</p> */}
              {/* <a href="https://www.facebook.com/">
                <Ello size={24} fill="#4b4b4b" strokeWidth={0} />
              </a>
              &nbsp;&nbsp;&nbsp; */}
              <a href="https://www.instagram.com/">
                <Instagram
                  size={40}
                  fill="#4b4b4b"
                  color="#fff"
                // strokeWidth={2}
                />
              </a>
              <p>
                <b>contact</b>@arti.co
              </p>
              <Row>
                {" "}
                <Box height="50px" margin="medium">
                  <Image fit="contain" src="/img/logo-only.png" />{" "}
                </Box>
              </Row>
              <Text size="small">Arti, 2023</Text>
            </center>
          </Col>
        </Row>
      </Grid>
    </footer>
  );
};

export default Footer;
