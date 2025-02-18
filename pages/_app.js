import { AuthProvider } from "services/auth";
import { AccountProvider } from "services/account";
import { StudiosProvider } from "services/studios";
import { RequestsProvider } from "services/requests";

// import { SupabaseContextProvider } from "use-supabase";
// import { supabase } from "services/supabase";
// import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import "../styles/base.scss";
import "../styles/colors.scss";
import "react-flexbox-grid/dist/react-flexbox-grid.css";
import "react-image-gallery/styles/scss/image-gallery.scss";

// const theme = extendTheme({
//   colors: {
//     brand: {
//       100: "#f7fafc",
//       // ...
//       900: "#1a202c",
//     },
//   },
// });

import Layout from "components/Layout";

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AccountProvider>
        <RequestsProvider>
          <StudiosProvider>
            {/* <SupabaseContextProvider client={supabase}> 
        <ChakraProvider theme={theme}> */}
            <Layout>
              <Component {...pageProps} />
            </Layout>
            {/* </SupabaseContextProvider> 
        </ChakraProvider> */}
          </StudiosProvider>
        </RequestsProvider>
      </AccountProvider>
    </AuthProvider>
  );
}
