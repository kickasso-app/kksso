import { supabase } from "services/supabase";

const fetchMagazinePosts = async ({ selectedCity }) => {
  // setLoading(true);

  console.log("fetching Magazine Posts from city " + selectedCity);
  let supabaseQuery = supabase.from("magazine").select("*");
  if (selectedCity !== false) {
    supabaseQuery = supabaseQuery.contains("cityLocation", [selectedCity]);
  }

  try {
    const { data: supaMagPosts, error } = await supabaseQuery
      .is("isPublished", true)
      .order("created_at", { ascending: false });

    await supabaseQuery
      .is("isPublished", true)
      .order("created_at", { ascending: false });

    // if (error) throw error;

    if (supaMagPosts?.length) {
      console.log(supaMagPosts);
      return supaMagPosts;
    }
  } catch (error) {
    console.log(error?.message || "No Magazine articles were fetched");
    return false;
  } finally {
    // setLoading(false);
    console.log("done fetching magazine posts");
  }
};

const fetchMagazinePost = async ({ magpost_slug }) => {
  //setLoading(true);

  console.log("fetching Magazine Post " + magpost_slug);
  try {
    let { data: supaMagPost, error } = await supabase
      .from("magazine")
      .select("*")
      .eq("slug", magpost_slug)
      .single();
    if (supaMagPost) {
      console.log(supaMagPost);
      return supaMagPost;
    }
  } catch (error) {
    const returnError = error.message ?? "No Magazine Post were fetched";
    console.error(
      "There was a problem fetch this magazine post:",
      error.message
    );
    //setError(returnError);
  } finally {
    //setLoading(false);
    console.log("done fetching magazine post");
  }
  // setLoading(false);
};

// Images

async function fileExists(bucketName, filePath, fileName, listLarge = false) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(filePath, {
      limit: listLarge ? 10 : 4,
      // offset: 0,
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
}

async function downloadMagazineThumbnail({ slug }) {
  const doesThumbnailImgExist = await fileExists(
    "magazine",
    slug,
    "small.jpg",
    true
  );

  const imgPath = `${slug}${doesThumbnailImgExist ? "/small.jpg" : "/0.jpg"}`;

  let url = await downloadMagazineImage({
    imgPath,
  });

  return url ?? false;
}

// async function downloadEventImage({ imgPath, postDownload }) {
//   // console.log("downloadEventImage", imgPath);
//   try {
//     const { data, error } = await supabase.storage
//       .from("events")
//       .download(imgPath);
//     if (error) {
//       throw error;
//     }

//     const url = URL.createObjectURL(data);
//     if (postDownload) {
//       postDownload(url);
//     }
//     return url;
//   } catch (error) {
//     console.log("Error downloading image: ", error.message);
//   }
//   return false;
// }

export {
  fetchMagazinePosts,
  fetchMagazinePost,
  fileExists,
  downloadMagazineImage,
  downloadMagazineThumbnail,
};
