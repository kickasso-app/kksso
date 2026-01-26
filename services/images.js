import { supabase } from "services/supabase";
import convert from "client-side-image-resize";

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
    imgs = data.filter(
      (img) => img.metadata?.size > 0 && !img.name.includes("profile.jpg")
    );
    paths = imgs.map((image) => `${userId}/${image.name}`);

    // console.log(paths);
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

async function downloadEventImage({ imgPath, postDownload }) {
  // console.log("downloadEventImage", imgPath);
  try {
    const { data, error } = await supabase.storage
      .from("events")
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
  const doesProfileImgExist = await fileExists(
    "studios-photos",
    userId,
    "profile.jpg",
    true
  );

  const imgPath = `${userId}${doesProfileImgExist ? "/profile.jpg" : "/0.jpg"}`;

  let url = await downloadImage({
    imgPath,
  });

  return url ?? false;
}

async function downloadImages({ userId }) {
  // console.time("downloadImages:all");
  const { paths } = await listImages({ userId });
  // console.log(paths);
  const imagePromises = paths.map((path) =>
    downloadImage({
      imgPath: path,
    })
  );
  // console.timeEnd('downloadImages:all');
  return imagePromises;
}

async function resizeImage({ file, returnSmallerImage = false }) {
  const fileLarge = await convert({
    file: file,
    width: 1200,
    // height: 1200 / imgRatio,
    type: "jpg",
  });

  // console.log(fileLarge.size);

  const fileSmall = returnSmallerImage
    ? await convert({
        file: file,
        width: 600,
        //   height: 600 / imgRatio,
        type: "jpg",
      })
    : false;

  // console.log(fileSmall.size);

  return [fileLarge, fileSmall];
}

export {
  fileExists,
  listImages,
  downloadImage,
  downloadImages,
  downloadProfileImage,
  downloadEventImage,
  resizeImage,
};