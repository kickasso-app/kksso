import Head from "next/head";

import { Grommet } from "grommet";

import Header from "../Header";
import Footer from "../Footer";

import navButtons from "../../config/buttons";

import grommetTheme from "styles/grommetTheme";
// import { grommet, base } from "grommet";

const Layout = (props) => {
  // console.log(grommetTheme);
  // console.log(base.button);
  // console.log(grommet.button);
  return (
    <>
      <Head>
        <title>kksso</title>
        <meta
          name="description"
          content="kksso is a web platform to connect artists, art lovers, and collectors in the studio"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>
      <Grommet theme={grommetTheme}>
        <div className="layout">
          <Header navButtons={navButtons} />
          <div className="content">{props.children}</div>
          <Footer />
        </div>
      </Grommet>
    </>
  );
};

export default Layout;
