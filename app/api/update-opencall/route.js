import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { supabaseAdmin } from "services/supabase-admin";
import { EVENT_COLUMNS } from "config/constants/eventColumns";
import {
  ADMIN_EMAIL,
  SITE_URL,
  UUID_RE,
  isRateLimited,
  validateOpenCall,
  sendMarkdownEmail,
  createPhotoUploads,
} from "services/opencall.server";

// The edittoken is the only credential. It is never returned to the client,
// and lookups are limited to open call events.
async function findByToken(edittoken) {
  if (typeof edittoken !== "string" || !UUID_RE.test(edittoken)) return null;
  const { data, error } = await supabaseAdmin
    .from("events")
    .select(`${EVENT_COLUMNS.ALL},host_email`)
    .eq("edittoken", edittoken)
    .eq("source", "opencall")
    .maybeSingle();
  if (error) {
    console.error("Open call lookup error:", error);
    return null;
  }
  return data;
}

const getIp = (request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";

export async function GET(request) {
  try {
    if (isRateLimited(`lookup:${getIp(request)}`, 30)) {
      return NextResponse.json({ message: "Too many requests, try again later" }, { status: 429 });
    }

    const event = await findByToken(request.nextUrl.searchParams.get("edittoken"));
    if (!event) {
      return NextResponse.json({ message: "Submission not found" }, { status: 404 });
    }
    return NextResponse.json({ event });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    if (isRateLimited(`update:${getIp(request)}`, 20)) {
      return NextResponse.json({ message: "Too many requests, try again later" }, { status: 429 });
    }

    const body = await request.json();

    // Honeypot: real users never see this field.
    if (body?.website) {
      return NextResponse.json({ message: "Updated" });
    }

    const existing = await findByToken(body?.edittoken);
    if (!existing) {
      return NextResponse.json({ message: "Submission not found" }, { status: 404 });
    }

    // The email is the contact the confirmation went to, so it stays as submitted.
    const { values, error: validationError } = validateOpenCall({
      ...body,
      host_email: existing.host_email,
    });
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }
    const { host_email, ...editable } = values;

    // Hosts can edit freely: publishing status is untouched, so no re-review is needed.
    const { error } = await supabaseAdmin
      .from("events")
      .update(editable)
      .eq("id", existing.id)
      .eq("edittoken", body.edittoken);
    if (error) {
      console.error("Open call update error:", error);
      return NextResponse.json({ message: "Failed to update" }, { status: 500 });
    }

    // Also for pending events: the admin preview reads the cached event.
    revalidateTag("events", { expire: 0 });

    let uploads;
    if (body.replacePhoto) {
      try {
        uploads = await createPhotoUploads(existing.id, { upsert: true });
      } catch (signError) {
        console.error("Signed upload error:", signError);
        return NextResponse.json({ message: "Updated, but photo upload failed" }, { status: 500 });
      }
    }

    try {
      await sendMarkdownEmail({
        to: ADMIN_EMAIL,
        replyTo: host_email,
        subject: `Arti Night open call updated: ${editable.title} (${editable.city})`,
        markdown: [
          `An open call submission was edited by its host${existing.isPublished ? " (it is live, no review needed)" : " (still waiting for approval)"}.`,
          [
            `- **Title:** ${editable.title}`,
            `- **When:** ${editable.date}, ${editable.time}`,
            `- **Where:** ${editable.location}, ${editable.city}, ${editable.country}`,
            `- **Host:** ${editable.host_name} (${host_email})`,
          ].join("\n"),
          `See it at ${SITE_URL}/profile/admin/events`,
        ].join("\n\n"),
      });
    } catch (mailError) {
      console.error("Open call admin email failed:", mailError);
    }

    return NextResponse.json({
      message: "Updated",
      uploads,
      wasPublished: !!existing.isPublished,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
