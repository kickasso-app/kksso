import { SupabaseContextProvider } from "use-supabase";
import { supabase } from "../services/supabase";
// import { ChakraProvider, extendTheme } from "@chakra-ui/react";
// import { FirebaseProvider } from "../services/firebase.js";

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

import Layout from "../components/Layout";

export default function MyApp({ Component, pageProps }) {
  return (
    <SupabaseContextProvider client={supabase}>
      {/* <FirebaseProvider> */}
      {/* <ChakraProvider theme={theme}> */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {/* </ChakraProvider> */}
      {/* </FirebaseProvider> */}
    </SupabaseContextProvider>
  );
}
