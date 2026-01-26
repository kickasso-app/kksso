import { fetchMagazinePosts } from "services/editorial";
import { getCityBySlug } from "services/city.server";
import EditorialCityClient from "./EditorialCityClient";

export default async function EditorialResults({ city }) {
  const cityData = await getCityBySlug(city);
  let magPosts = [];

  if (cityData) {
    magPosts = await fetchMagazinePosts({ selectedCity: cityData });
  }

  // fetchMagazinePosts returns false on error, or array.
  if (!magPosts) magPosts = [];

  return <EditorialCityClient magPosts={magPosts} city={city} />;
}
