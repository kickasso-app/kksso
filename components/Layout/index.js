import Head from "next/head";

import Header from "../Header";
import Footer from "../Footer";

import navButtons from "../../config/buttons";

const Layout = (props) => {
  return (
    <div className="layout">
      <Head>
        <title>kksso</title>
        <meta
          name="description"
          content="kksso is a web platform to connect artists, art lovers, and collectors in the studio"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>
      <Header navButtons={navButtons} />
      <div className="content">{props.children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
