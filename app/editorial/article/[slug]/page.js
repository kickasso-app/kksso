import { getMagazinePost } from "services/editorial.server";
import ArticleClient from "./ArticleClient";
import { cacheLife, cacheTag } from "next/cache";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const magPost = await getMagazinePost({ slug });

  if (!magPost) {
    return {
      title: "Article Not Found - Arti",
    };
  }

  return {
    title: `${magPost.title} | Arti Editorial`,
    description: magPost.subtitle || `Read ${magPost.title} on Arti.`,
    openGraph: {
      images: [
        `/api/create-og-image?imgurl=${encodeURIComponent(`https://chsbkuvxttsertgkuwhy.supabase.co/storage/v1/object/public/magazine/${slug}/thumbnail.jpg`)}`,
      ],
    },
  };
}

export default async function ArticlePage({ params }) {
  "use cache";
  cacheTag("editorial");
  cacheLife("days");

  const { slug } = await params;
  const magPost = await getMagazinePost({ slug });

  return <ArticleClient magPost={magPost} />;
}
