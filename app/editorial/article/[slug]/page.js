import { fetchMagazinePost } from "services/editorial";
import ArticleClient from "./ArticleClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const magPost = await fetchMagazinePost({ magpost_slug: slug });

  if (!magPost) {
    return {
      title: 'Article Not Found - Arti',
    };
  }

  return {
    title: `${magPost.title} - Arti`,
    description: magPost.subtitle || `Read ${magPost.title} on Arti.`,
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const magPost = await fetchMagazinePost({ magpost_slug: slug });

  return <ArticleClient magPost={magPost} slug={slug} />;
}
