import { supabase } from "./supabase";

export const getMagazinePosts = async () => {
  let supabaseQuery = supabase.from("magazine").select("*");

  const { data: supaMagPosts, error } = await supabaseQuery
    .is("isPublished", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching magazine posts:", error);
    return [];
  }

  return supaMagPosts || [];
};

export const getMagazinePost = async (slug) => {
  const { data: supaMagPost, error } = await supabase
    .from("magazine")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching magazine post:", error);
    return null;
  }
  return supaMagPost;
};

// Compatibility aliases for older code that might import fetch*
export const fetchMagazinePosts = getMagazinePosts;
export const fetchMagazinePost = getMagazinePost;

// Images

async function magazineImageExists(bucketName, filePath, fileName) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(filePath, {
      limit: 15,
      sortBy: { column: "name", order: "asc" },
    });

  if (error) {
    console.error("Error:", error);
    return false;
  }
  // console.log(data);
  const doesItExist = data.filter((img) => img.name === fileName)?.length > 0;
  return doesItExist;
}

export async function downloadMagazineImage({ imgPath, postDownload }) {
  const [slug, fileName] = imgPath.split("/");

  const doesImgExist = await magazineImageExists("magazine", slug, fileName);

  if (doesImgExist) {
    try {
      const { data, error } = await supabase.storage
        .from("magazine")
        .download(imgPath);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      if (postDownload) {
        postDownload(url);
      }
      return url;
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
    return false;
  } else {
    return false;
  }
}

export async function downloadMagazineThumbnail({ slug }) {
  const imgPath = slug + "/thumbnail.jpg";
  let url = await downloadMagazineImage({
    imgPath: imgPath,
    postDownload: null,
  });

  return url ?? false;
}
