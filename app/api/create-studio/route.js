import { supabaseAdmin } from "services/supabase-admin";
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request) {
  try {
    const { newProfile } = await request.json();

    if (!newProfile?.email || !newProfile?.studio_id) {
      return NextResponse.json({ message: "Email and ID are required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
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

    // Invalidate the studios list cache
    revalidateTag("studios");

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
