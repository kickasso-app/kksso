import { supabase } from "services/supabase";

const fetchMagazinePosts = async ({ selectedCity }) => {
  let supabaseQuery = supabase.from("magazine").select("*");
  if (selectedCity?.city) {
    const cityName = selectedCity.city;
    supabaseQuery = supabaseQuery.contains("cityLocation", [cityName]);
  }

  try {
    const { data: supaMagPosts, error } = await supabaseQuery
      .is("isPublished", true)
      .order("created_at", { ascending: false });

    await supabaseQuery
      .is("isPublished", true)
      .order("created_at", { ascending: false });

    if (supaMagPosts?.length) {
      //console.log(supaMagPosts);
      return supaMagPosts;
    }
  } catch (error) {
    console.log(error?.message || "No articles were fetched");
    return false;
  }
};

const fetchMagazinePost = async ({ magpost_slug }) => {
  // console.log("fetching Post " + magpost_slug);
  try {
    let { data: supaMagPost, error } = await supabase
      .from("magazine")
      .select("*")
      .eq("slug", magpost_slug)
      .single();
    if (supaMagPost) {
      // console.log(supaMagPost);
      return supaMagPost;
    }
  } catch (error) {
    console.error(error.message ?? "No Editorial Post were fetched");
  }
};

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

async function downloadMagazineImage({ imgPath, postDownload }) {
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

async function downloadMagazineThumbnail({ slug }) {
  const imgPath = slug + "/thumbnail.jpg";
  let url = await downloadMagazineImage({
    imgPath: imgPath,
    postDownload: null,
  });

  return url ?? false;
}

export {
  fetchMagazinePosts,
  fetchMagazinePost,
  downloadMagazineImage,
  downloadMagazineThumbnail,
};
