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
  // Only allow POST events
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Destructure and validate incoming data
    const { newEvent } = req.body;

    console.log(newEvent);
    // Basic validation
    // if (!newEvent?.id || !newEvent?.studio_uuid) {
    //   return res.status(400).json({
    //     message: "Event and studio IDs are required",
    //   });
    // }

    // Perform insert operation
    const { error } = await supabase
      .from("events")
      .insert([newEvent], { returning: "minimal" });

    // Handle potential Supabase errors
    if (error) {
      console.error("Supabase insertion error:", error);
      return res.status(500).json({
        message: "Failed to create event",
        error: error.message,
      });
    }

    // Successful response
    return res.status(201).json({
      message: "Event created successfully",
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
