import { NextResponse } from "next/server";
import { getFeaturedLandingItems } from "services/featured.server";

export async function GET() {
  try {
    const items = await getFeaturedLandingItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error("API Featured Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
