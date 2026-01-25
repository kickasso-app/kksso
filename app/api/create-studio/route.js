import { createClient } from "@supabase/supabase-js";
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { newProfile } = await request.json();

    if (!newProfile?.email || !newProfile?.studio_id) {
      return NextResponse.json({ message: "Email and ID are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("studios")
      .insert([newProfile])
      .select();

    if (error) {
      console.error("Supabase insertion error:", error);
      return NextResponse.json({
        message: "Failed to create studio",
        error: error.message,
      }, { status: 500 });
    }

    return NextResponse.json({
      message: "Studio created successfully",
      user: data?.[0],
    }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({
      message: "Internal server error",
      error: err.message || "Unknown error",
    }, { status: 500 });
  }
}
