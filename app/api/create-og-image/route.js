import { ImageResponse } from "next/og";

const BASE_OG_IMG_URL = "https://www.arti.my/img/opengraph-image.png";

async function isImageUrl(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const contentType = response.headers.get("Content-Type");
    return contentType ? contentType.startsWith("image/") : false;
  } catch (error) {
    return false;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imgurl = searchParams.get("imgurl");

  const isImgUrlOk = imgurl ? await isImageUrl(imgurl) : false;

  return new ImageResponse(
    <div
      style={{
        fontSize: 60,
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        src={isImgUrlOk ? imgurl : BASE_OG_IMG_URL}
      />
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
