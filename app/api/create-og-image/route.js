import { ImageResponse } from "next/og";

async function isImageUrl(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const contentType = response.headers.get("Content-Type");
    return contentType ? contentType.startsWith("image/") : false;
  } catch (error) {
    return false;
  }
}

const BASE_OG_IMG_URL = "https://www.arti.my/img/opengraph-image.png";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imgurl = searchParams.get("imgurl");

  if (!imgurl) {
    return new ImageResponse(
      <div style={{ display: "flex", fontSize: 40 }}>
        <img
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          src={BASE_OG_IMG_URL}
        />
      </div>,
      { width: 1200, height: 630 },
    );
  }

  const isimgUrlOk = await isImageUrl(imgurl);

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
        src={isimgUrlOk ? imgurl : BASE_OG_IMG_URL}
      />
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
