import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { render, pretty } from "@react-email/render";

import { MagicLinkTemplate } from "services/emails/magicLinkTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    let data = { dataisok: true };
    let error = false;

    // Basic validation
    if (!oldUser?.email) {
      return res.status(500).json({
        message: "Email is required",
      });
    }

    const { data: magicData, error: magicError } =
      await supabaseSrv.auth.admin.generateLink({
        type: "magiclink",
        email: oldUser.email,
      });

    //console.log(magicData);

    // Handle potential Supabase errors
    if (magicError) {
      console.error("Error creating magic link:", magicError);
      return res.status(500).json({
        message: "Failed to create magic link",
        error: magicError.message,
      });
    }
    // Making sure user already exists, otherwise delete new auth entry
    if (!magicData?.user?.last_sign_in_at) {
      //console.log("deleting new user");
      //console.log(magicData.user.id);

      await supabaseSrv.auth.admin.deleteUser(magicData.user.id);

      return res.status(400).json({
        message: "Email does not belong to an Arti user",
      });
    } else {
      // Successful magic link
      const magicLink = magicData.properties.action_link + "/profile";

      // console.log(magicLink);

      const emailHtml = await pretty(
        await render(<MagicLinkTemplate magic={magicLink} />)
      );
      // console.log(emailHtml);

      const { data, error } = await resend.emails.send({
        from: "Arti <hello@arti.my>",
        to: oldUser.email,
        subject: "Your Magic Link for Arti",
        html: emailHtml,
      });

      if (error) {
        console.log("Error details:", error);
        return res.status(400).json(error);
      }

      return res.status(200).json(data);
    }
  } catch (err) {
    // Catch any unexpected errors
    console.error("Unexpected error:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message || "Unknown error",
    });
  }
};
