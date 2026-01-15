import Head from "next/head";

export default function CustomHead({
  title,
  pageSlug,
  description = "A platform to connect artists, art lovers, and collectors via studio visits and events.",
  pageType = "website",
  ogImage = "https://arti.my/img/opengraph-image.png",
}) {
  const pageURL = `https://www.arti.my/${pageSlug}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" key="description" content={description} />
      <link rel="canonical" href={pageURL} />
      <meta property="og:type" key="type" content={pageType} />
      <meta property="og:title" key="ogtitle" content={title} />
      <meta
        property="og:description"
        key="ogdescription"
        content={description}
      />
      <meta property="og:url" key="ogurl" content={pageURL} />
      <meta property="og:image" key="ogimage" content={ogImage} />
    </Head>
  );
}
