import Link from "next/link";

import { Grid, Row, Col } from "react-flexbox-grid/dist/react-flexbox-grid";

// import { SimpleGrid } from "@chakra-ui/react";
import { Box, Image, Text } from "grommet";
import { Instagram, Rss, Radio, Zap, Mail } from "react-feather";
// import { Facebook, Instagram } from "react-feather";

import styles from "./index.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Box pad={{ vertical: "large", horizontal: "xlarge" }}>

        <Row>
          <Col md={4}>
            <Box margin={{ vertical: "small" }} align="center">
              <a target="_blank" href="https://arti.crd.co/#register">
                <Zap
                  size={30}
                  color="#4b4b4b"
                  strokeWidth={1.5}
                />
              </a>

              <Text size="medium" margin="medium">
                Get our updates
              </Text>
            </Box>
          </Col>

          <Col md={4}>
            <Box margin={{ vertical: "small" }} align="center">
              <a target="_blank" href="https://www.instagram.com/studios.arti">
                <Instagram
                  size={30}
                  color="#4b4b4b"
                  strokeWidth={1.5}
                />
              </a>
              <Text size="medium" margin="medium">
                Follow us
              </Text>
            </Box>
          </Col>
          <Col md={4}>
            <Box margin={{ vertical: "small" }} align="center">
              <Mail
                size={30}
                color="#4b4b4b"
                strokeWidth={1.5}
              />
              <Text size="medium" margin="medium" >
                So you don't want either? <br /><b>arti.studiosapp</b>@gmail.com
              </Text>
            </Box>
          </Col>
        </Row>

        <Row>

          <Col xs={12}>
            <Box margin={"small"} align="center">
              <Box height="50px" margin="small">
                <Image fit="contain" src="/img/logo-only.png" />{" "}
              </Box>
              <Text size="small">arti, 2023</Text>
            </Box>
          </Col>
        </Row>
      </Box>
    </footer >
  );
};

export default Footer;
