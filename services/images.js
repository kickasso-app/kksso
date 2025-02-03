import { supabase } from "services/supabase";

async function listImages({ userId }) {
  let imgs, paths;
  try {
    const { data, error } = await supabase.storage
      .from("studios-photos")
      .list(`${userId}`, {
        limit: 10,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      throw error;
    }
    imgs = data.filter((img) => img.metadata?.size > 0);
    paths = imgs.map((image) => `${userId}/${image.name}`);
  } catch (error) {
    console.log("Error listing images: ", error.message);
  }

  return { imgs, paths };
}

async function downloadImage({ imgPath, postDownload }) {
  try {
    const { data, error } = await supabase.storage
      .from("studios-photos")
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

async function downloadProfileImage({ userId }) {
  // REMOVED - might be needed if profile image is not .jpg

  // const { paths } = await listImages({ userId });
  // const imgPath = paths.filter((path) => path.includes("/0."))[0];

  const imgPath = userId + "/0.jpg";

  const url = await downloadImage({
    imgPath,
  });

  return url ?? false;
}

async function downloadImages({ userId, postDownload }) {
  const { paths } = await listImages({ userId });
  // console.log(paths);
  const urls = [];

  for (const path of paths) {
    await downloadImage({
      imgPath: path,
      postDownload: (url) => urls.push(url),
    });
  }

  if (postDownload) {
    postDownload();
  }

  return urls;
}

// NOT NEEDED
// async function getImagesUrls({ userId }) {
//   const { paths } = await listImages({ userId });

//   const urls = [];

//   for (const path of paths) {
//     const { publicURL, error } = supabase.storage
//       .from("studios-photos")
//       .getPublicUrl(path);

//     if (publicURL) {
//       urls.push(publicURL);
//       // console.log(publicURL);
//     } else {
//       console.log(error);
//     }
//   }

//   return urls;
// }

export { listImages, downloadImage, downloadImages, downloadProfileImage };
