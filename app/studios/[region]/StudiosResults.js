import { titleCase } from "services/helpers/textFormat";
import { getRegionBySlug } from "services/region.server";
import { getStudios } from "services/studios.server";
import StudiosClient from "./StudiosClient";

export default async function StudiosResults({ region }) {
  const regionData = await getRegionBySlug(region);
  const regionName = regionData?.region || titleCase(region);
  const studios = await getStudios({ regionName });

  return <StudiosClient studios={studios} region={region} />;
}
