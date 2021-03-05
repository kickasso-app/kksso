import { SupabaseContextProvider } from "use-supabase";
import { supabase } from "../services/supabase";
// import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { FirebaseProvider } from "../services/firebase.js";

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
      <FirebaseProvider>
        {/* <ChakraProvider theme={theme}> */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
        {/* </ChakraProvider> */}
      </FirebaseProvider>
    </SupabaseContextProvider>
  );
}
// {
//   [
//   {caption: " ",
//   filename: "0.jpg"}
//   ],
//   [
//   {caption: "To Live the question, 2020, 30x24cm",
//   filename: "1.jpg"}
//   ],
//   [
//   {caption: "May you have a strong foundation when the winds of changes shift, 2020, 24x30cm",
//   filename: "0.jpg"}
//   ]
//   }
