import { getMagazinePosts } from "services/editorial.server";
import { getCityBySlug } from "services/city.server";
import EditorialCityClient from "./EditorialCityClient";

export default async function EditorialResults({ city }) {
  const cityData = await getCityBySlug(city);
  let magPosts = [];

  if (cityData) {
    magPosts = await getMagazinePosts({ selectedCity: cityData });
  }

  return <EditorialCityClient magPosts={magPosts} city={city} />;
}
