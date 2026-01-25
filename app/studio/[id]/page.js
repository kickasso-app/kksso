import { getStudio } from "services/studios.server";
import StudioClient from "./StudioClient";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const studio = await getStudio(id);

  if (!studio) {
    return {
      title: 'Studio Not Found - Arti',
    };
  }

  return {
    title: `${studio.artist} - Studio - Arti`,
    description: studio.textLong?.substring(0, 160) || `Visit ${studio.artist}'s studio on Arti.`,
  };
}

export default async function StudioPage({ params }) {
  const { id } = await params;
  const studio = await getStudio(id);

  return <StudioClient initialStudio={studio} />;
}
