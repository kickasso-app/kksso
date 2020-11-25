import React from "react";
import { Grid, Row, Col } from "react-flexbox-grid";

import { Box, Image, Text } from "grommet";
import { Instagram } from "react-feather";
// import { Facebook, Instagram } from "react-feather";

import "./footer.scss";

const Footer = () => {
  return (
    <footer>
      <Grid fluid>
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
                  size={24}
                  fill="#4b4b4b"
                  color="#fff"
                  // strokeWidth={2}
                />
              </a>
              <p>
                <b>contact</b>@kksso.co
              </p>
              <Row>
                {" "}
                <Box height="22px" margin="medium">
                  <Image fit="contain" src="/img/logo-zoom.png" />{" "}
                </Box>
              </Row>
              <Text size="small">Kickasso, 2020</Text>
            </center>
          </Col>
        </Row>
      </Grid>
    </footer>
  );
};

export default Footer;
