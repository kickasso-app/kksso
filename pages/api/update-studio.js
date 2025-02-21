// import { createClient } from "@supabase/supabase-js";

// // Validate environment variables
// if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
//   throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
// }

// if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
//   throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined");
// }

// // Create Supabase client
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// );

// export default async (req, res) => {
//   // Only allow POST requests
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   try {
//     // Destructure and validate incoming data
//     const { updates, userId } = req.body;

//     // console.log(updates);
//     // console.log(userId);

//     // Basic validation
//     if (!updates || !userId) {
//       return res.status(400).json({
//         message: "Updates and ID are required",
//       });
//     }

//     // Perform insert operation
//     const { data, error } = await supabase
//       .from("studios")
//       .update(updates)
//       .eq("uuid", userId)
//       .select();

//     // Handle potential Supabase errors
//     if (error) {
//       console.error("Supabase update error:", error);
//       return res.status(500).json({
//         message: "Failed to update studio",
//         error: error.message,
//       });
//     }

//     // Successful response
//     return res.status(201).json({
//       message: "Studio updated successfully",
//       user: data,
//     });
//   } catch (err) {
//     // Catch any unexpected errors
//     console.error("Unexpected error:", err);
//     return res.status(500).json({
//       message: "Internal server error",
//       error: err.message || "Unknown error",
//     });
//   }
// };
