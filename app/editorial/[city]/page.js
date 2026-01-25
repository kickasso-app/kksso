import { getCityBySlug } from "services/city";
import { fetchMagazinePosts } from "services/editorial";
import { titleCase } from "services/helpers/textFormat";
import EditorialCityClient from "./EditorialCityClient";

export async function generateMetadata({ params }) {
  const { city } = await params;
  return {
    title: `Arti - Editorial in ${titleCase(city)}`,
    description: `Read interviews and articles about art in ${titleCase(city)}.`,
  };
}

export default async function EditorialCityPage({ params }) {
  const { city } = await params;
  
  const cityData = await getCityBySlug(city);
  let magPosts = [];

  if (cityData) {
      magPosts = await fetchMagazinePosts({ selectedCity: cityData });
  }

  // fetchMagazinePosts returns false on error, or array.
  if (!magPosts) magPosts = [];

  return <EditorialCityClient magPosts={magPosts} city={city} />;
}
