import { createClient } from "@supabase/supabase-js";

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined");
}

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req, res) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Destructure and validate incoming data
    const { newProfile } = req.body;

    // console.log(newProfile);
    // Basic validation
    if (!newProfile?.email || !newProfile?.studio_id) {
      return res.status(400).json({
        message: "Email and ID are required",
      });
    }

    // Perform insert operation
    const { data, error } = await supabase
      .from("studios")
      .insert([newProfile])
      .select();

    // Handle potential Supabase errors
    if (error) {
      console.error("Supabase insertion error:", error);
      return res.status(500).json({
        message: "Failed to create studio",
        error: error.message,
      });
    }

    // Successful response
    return res.status(201).json({
      message: "Studio created successfully",
      user: data?.[0],
    });
  } catch (err) {
    // Catch any unexpected errors
    console.error("Unexpected error:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message || "Unknown error",
    });
  }
};
