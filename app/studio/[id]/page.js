import { getStudio } from "services/studios.server";
import StudioClient from "./StudioClient";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const studio = await getStudio(id);

  if (!studio) {
    return {
      title: "Studio Not Found - Arti",
    };
  }

  return {
    title: `${studio.artist} - Studio - Arti`,
    description: studio.textMini || `Visit ${studio.artist}'s studio on Arti.`,
    openGraph: {
      images: [
        `/api/create-og-image?imgurl=${encodeURIComponent(`https://chsbkuvxttsertgkuwhy.supabase.co/storage/v1/object/public/studios-photos/${studio.uuid}/profile.jpg`)}`,
      ],
    },
  };
}

export default async function StudioPage({ params }) {
  const { id } = await params;
  const studio = await getStudio(id);

  return <StudioClient initialStudio={studio} />;
}
