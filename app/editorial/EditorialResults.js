import { getMagazinePosts } from "services/editorial.server";
import EditorialClient from "./EditorialClient";

export default async function EditorialResults() {

  const magPosts = await getMagazinePosts();

  return <EditorialClient magPosts={magPosts} />;
}