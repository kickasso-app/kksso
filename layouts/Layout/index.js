import { Analytics } from "@vercel/analytics/react";

import { Grommet } from "grommet";

import Header from "layouts/Header";

import grommetTheme from "styles/grommetTheme";

const Layout = (props) => {
  // console.log(grommetTheme);
  return (
    <>
      <Grommet theme={grommetTheme}>
        <div className="layout">
          <Header />
          <div className="content">{props.children}</div>
        </div>
        <Analytics />
      </Grommet>
    </>
  );
};

export default Layout;
