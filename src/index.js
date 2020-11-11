import React from "react";
import ReactDOM from "react-dom";

import { Route, HashRouter } from "react-router-dom";
import NavBar from "./NavBar.js";
import Intro from "./Intro.js";
import Studios from "./Studios";
import About from "./About.js";
import Footer from "./Footer.js";
import JoinForm from "./JoinForm";

import "./styles/base.scss";
import { Grommet } from "grommet";
import { theme } from "./styles/grommet/theme";

import { artistsLinks } from "./constants";

const AllURLs = "studios about join";

const routing = (
  <HashRouter>
    <Grommet theme={theme}>
      <div className="container">
        <NavBar />

        <Route exact path="/" component={Intro} />
        <Route
          path="/:shortName"
          render={(props) =>
            Object.keys(artistsLinks).includes(
              props.match.params.shortName.toLowerCase()
            ) ? (
              <Studios {...props} />
            ) : (
              AllURLs.includes(props.match.params.shortName.toLowerCase()) || (
                <Intro />
              )
            )
          }
        />
        <Route path="/studio/:id" component={Studios} />
        <Route exact path="/studios" component={Studios} />
        <Route path="/about" component={About} />
        <Route path="/join" component={JoinForm} />

        <Footer />
      </div>
    </Grommet>
  </HashRouter>
);
ReactDOM.render(routing, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
