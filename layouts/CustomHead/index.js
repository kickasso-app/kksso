import Head from "next/head";

export default function CustomHead({
  title,
  description,
  pageSlug,
  pageType = "website",
  ogImage = "https://arti.my/img/opengraph-image.png",
}) {
  const ogTitle = title.replace(" - Alamin Shaikh", "");
  const pageURL = `https://www.arti.my/${pageSlug}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" key={pageSlug} content={description} />
      <link rel="canonical" href={pageURL} />
      <meta property="og:type" key={pageSlug} content={pageType} />
      <meta property="og:title" key={pageSlug} content={ogTitle} />
      <meta property="og:description" key={pageSlug} content={description} />
      <meta property="og:url" key={pageSlug} content={pageURL} />
      <meta property="og:image" key={pageSlug} content={ogImage} />
    </Head>
  );
}
