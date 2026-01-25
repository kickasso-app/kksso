import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { render, pretty } from "@react-email/render";
import { NextResponse } from 'next/server';

import { MagicLinkTemplate } from "services/emails/magicLinkTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

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

export async function POST(request) {
  try {
    const { oldUser } = await request.json();

    if (!oldUser?.email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const { data: magicData, error: magicError } =
      await supabaseSrv.auth.admin.generateLink({
        type: "magiclink",
        email: oldUser.email,
      });

    if (magicError) {
      console.error("Error creating magic link:", magicError);
      return NextResponse.json({
        message: "Failed to create magic link",
        error: magicError.message,
      }, { status: 500 });
    }

    if (!magicData?.user?.last_sign_in_at) {
      await supabaseSrv.auth.admin.deleteUser(magicData.user.id);
      return NextResponse.json({
        message: "Email does not belong to an Arti user",
      }, { status: 400 });
    } else {
      const magicLink = magicData.properties.action_link + "/profile";

      const emailHtml = await pretty(
        await render(<MagicLinkTemplate magic={magicLink} />)
      );

      const { data, error } = await resend.emails.send({
        from: "Arti <hello@arti.my>",
        to: oldUser.email,
        subject: "Your Magic Link for Arti",
        html: emailHtml,
      });

      if (error) {
        console.log("Error details:", error);
        return NextResponse.json(error, { status: 400 });
      }

      return NextResponse.json(data);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({
      message: "Internal server error",
      error: err.message || "Unknown error",
    }, { status: 500 });
  }
}
