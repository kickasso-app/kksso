import { supabaseAdmin } from "services/supabase-admin";
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { newRequest } = await request.json();

    if (
      !newRequest?.request_id ||
      !newRequest?.studio_uuid ||
      !newRequest?.requestor_email
    ) {
      return NextResponse.json({ message: "Email and IDs are required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("requests").insert([newRequest]);

    if (error) {
      console.error("Supabase insertion error:", error);
      return NextResponse.json({
        message: "Failed to create request",
        error: error.message,
      }, { status: 500 });
    }

    return NextResponse.json({ message: "Request created successfully" }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({
      message: "Internal server error",
      error: err.message || "Unknown error",
    }, { status: 500 });
  }
}
