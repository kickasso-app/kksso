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
    const { newRequest } = req.body;

    // console.log(newProfile);
    // Basic validation
    if (
      !newRequest?.request_id ||
      !newRequest?.studio_uuid ||
      !newRequest?.requestor_email
    ) {
      return res.status(400).json({
        message: "Email and IDs are required",
      });
    }

    // Perform insert operation
    const { error } = await supabase
      .from("requests")
      .insert([newRequest], { returning: "minimal" });

    // Handle potential Supabase errors
    if (error) {
      console.error("Supabase insertion error:", error);
      return res.status(500).json({
        message: "Failed to create request",
        error: error.message,
      });
    }

    // Successful response
    return res.status(201).json({
      message: "Request created successfully",
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
