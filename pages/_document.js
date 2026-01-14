import { Html, Head, Main, NextScript } from "next/document";
// import { Metadata } from "next";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Arti</title>
        <meta
          name="description"
          content="A platform to connect artists, art lovers, and collectors via studio visits and events."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:site_name" content="Arti" />
        <meta property="og:title" content="Arti" />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="A platform to connect artists, art lovers, and collectors via studio visits and events."
        />
        <meta property="og:url" content="https://arti.my/" />
        <link rel="canonical" href="https://arti.my/" />
        <meta
          property="og:image"
          content="https://arti.my/img/opengraph-image.png"
        />
        <meta
          property="og:image:secure_url"
          content="https://arti.my/img/opengraph-image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="twitter:card" content="summary_large_image" />
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

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
// This also doesn't work!
// export const metadata = {
//   title: "Arti",
//   description:
//     "A platform to connect artists, art lovers, and collectors via studio visits and events.",
//   metadataBase: new URL("https://arti.my"),
//   openGraph: {
//     title: "Arti",
//     description:
//       "A platform to connect artists, art lovers, and collectors via studio visits and events.",
//     url: "https://arti.my",
//     siteName: "Arti",
//     images: "/img/opengraph-image.png",
//     locale: "en_US",
//     type: "website",
//   },
// };
