import Head from "next/head";
import { CityProvider } from "services/city";
import { AuthProvider } from "services/auth";
import { AccountProvider } from "services/account";
import { StudiosProvider } from "services/studios";
import { RequestsProvider } from "services/requests";
import { EventsProvider } from "services/events";

import "../styles/base.scss";
import "../styles/colors.scss";
import "react-flexbox-grid/dist/react-flexbox-grid.css";

import Layout from "layouts/Layout";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Arti</title>
      </Head>
      <CityProvider>
        <AuthProvider>
          <AccountProvider>
            <RequestsProvider>
              <EventsProvider>
                <StudiosProvider>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </StudiosProvider>
              </EventsProvider>
            </RequestsProvider>
          </AccountProvider>
        </AuthProvider>
      </CityProvider>
    </>
  );
}
