import React from "react";
import { NavLink } from "react-router-dom";
import { Grid, Row, Col } from "react-flexbox-grid";

import "./nav.scss";

const headerImg = "/img/header-name.png";

const NavBar = () => {
  return (
    <Grid fluid>
      <Col xs={12}>
        <Row start="md" center="xs">
          <Col xs={12} md={6}>
            <NavLink exact to="/">
              <img
                src={headerImg}
                alt="Logo"
                style={{
                  marginTop: "5px",
                  height: "40px",
                }}
              />
            </NavLink>
          </Col>
          <Col xs={12} md={6}>
            <Row center="xs" end="md">
              <div className="nav">
                <ul>
                  <li>
                    <NavLink exact to="/">
                      HOME
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/studios">STUDIOS</NavLink>
                  </li>
                  <li>
                    <NavLink to="/about">ABOUT</NavLink>
                  </li>

                  <li>
                    <NavLink to="/join">JOIN</NavLink>
                  </li>
                </ul>
              </div>
            </Row>
          </Col>
        </Row>
      </Col>
    </Grid>
  );
};

export default NavBar;
