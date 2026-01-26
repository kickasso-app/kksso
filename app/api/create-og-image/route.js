import { ImageResponse } from "next/og";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imgurl = searchParams.get("imgurl");

  if (!imgurl) {
    return new ImageResponse(
      <div style={{ display: "flex", fontSize: 40 }}>
        Visit with "?username=yourusername"
      </div>,
      { width: 1200, height: 630 },
    );
  }

  return new ImageResponse(
    <div
      style={{
        fontSize: 128,
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
        src={imgurl}
      />
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
