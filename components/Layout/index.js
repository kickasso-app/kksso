import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";

import { Grommet } from "grommet";

import Header from "../Header";
import Footer from "../Footer";

import grommetTheme from "styles/grommetTheme";

const Layout = (props) => {
  // console.log(grommetTheme);
  return (
    <>
      <Head>
        <title>Arti</title>
        <meta
          name="description"
          content="Arti is a web platform to connect artists, art lovers, and collectors in the studio space"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Arti" />
        <meta
          property="og:description"
          content="Arti is a web platform to connect artists, art lovers, and collectors in the studio space"
        />
        <meta
          property="og:image"
          content="https://artispring.vercel.app/img/opengraph-image.png"
        />

        <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/img/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/img/favicon-16x16.png"
        />
      </Head>
      <Grommet theme={grommetTheme}>
        <div className="layout">
          <Header />
          <div className="content">{props.children}</div>
          <Footer />
        </div>
        <Analytics />
      </Grommet>
    </>
  );
};

export default Layout;
