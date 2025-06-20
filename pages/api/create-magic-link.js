// import { createClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined");
}

// Create Supabase client
const supabaseSrv = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

export default async (req, res) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Destructure and validate incoming data
    const { oldUser } = req.body;

    console.log(oldUser);
    // Basic validation
    if (!oldUser?.email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Perform insert operation
    const { data, error } = await supabaseSrv.auth.admin.generateLink({
      type: "magiclink",
      email: oldUser.email,
    });

    // Handle potential Supabase errors
    if (error) {
      console.error("Error creating magic link:", error);
      return res.status(500).json({
        message: "Failed to create magic link",
        error: error.message,
      });
    }

    // Successful response
    let responseData = { doesUserExist: false, link: "" };

    if (
      data?.properties?.verification_type === "magiclink" &&
      data?.user?.last_sign_in_at?.length > 0
    ) {
      responseData = {
        doesUserExist: true,
        link: data.properties.action_link + "/profile",
      };
    }

    return res.status(201).json({
      message: "Magic link created successfully",
      data: responseData,
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
