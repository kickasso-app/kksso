import { createClient } from "@supabase/supabase-js";
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { newContact } = await request.json();

    if (!newContact?.email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const { error } = await supabase.from("contacts").insert([newContact]);

    if (error) {
      console.error("Supabase insertion error:", error);
      return NextResponse.json({
        message: "Failed to create contact",
        error: error.message,
      }, { status: 500 });
    }

    return NextResponse.json({ message: "Contact created successfully" }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({
      message: "Internal server error",
      error: err.message || "Unknown error",
    }, { status: 500 });
  }
}
