import { NextResponse } from "next/server";
import { supabaseAdmin } from "services/supabase-admin";
import {
  ARTI_STUDIO_UUID,
  ADMIN_EMAIL,
  SITE_URL,
  isRateLimited,
  validateOpenCall,
  sendMarkdownEmail,
  createPhotoUploads,
} from "services/opencall.server";

// Confirmation to the submitter, notification to admin, and a contact row.
// Each is best-effort: the event is already saved, so one failure must not fail the submission.
async function notify(event) {
  const where = `${event.city}, ${event.country}`;

  const [contact, confirmation, admin] = await Promise.allSettled([
    supabaseAdmin.from("contacts").insert([
      {
        contact_id: crypto.randomUUID(),
        source: "opencall",
        name: event.host_name,
        email: event.host_email,
        website: event.link,
      },
    ]).then(({ error }) => {
      if (error) throw new Error(error.message);
    }),
    sendMarkdownEmail({
      to: event.host_email,
      subject: "We received your Arti Night submission",
      markdown: [
        `Hi ${event.host_name},`,
        `Thank you for submitting **${event.title}** (${where}) to the Arti Night open call. We review every submission and will get back to you by email.`,
        `If you have questions, simply reply to this email or write to hello@arti.my.`,
        `The Arti team`,
      ].join("\n\n"),
    }),
    sendMarkdownEmail({
      to: ADMIN_EMAIL,
      replyTo: event.host_email,
      subject: `New Arti Night open call: ${event.title} (${event.city})`,
      markdown: [
        `New open call submission, waiting for approval.`,
        [
          `- **Title:** ${event.title}`,
          `- **Type:** ${event.type}`,
          `- **When:** ${event.date}, ${event.time}`,
          `- **Where:** ${event.location}, ${where}`,
          `- **Host:** ${event.host_name} (${event.host_email})`,
          `- **Link:** ${event.link}`,
        ].join("\n"),
        `Review it at ${SITE_URL}/profile/admin/events`,
      ].join("\n\n"),
    }),
  ]);

  for (const [label, result] of [["contact", contact], ["confirmation email", confirmation], ["admin email", admin]]) {
    if (result.status === "rejected") console.error(`Open call ${label} failed:`, result.reason);
  }

  return { emailSent: confirmation.status === "fulfilled" };
}

export async function POST(request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    if (isRateLimited(`create:${ip}`)) {
      return NextResponse.json({ message: "Too many submissions, try again later" }, { status: 429 });
    }

    const body = await request.json();

    // Honeypot: real users never see this field. Pretend success so bots move on.
    if (body?.website) {
      return NextResponse.json({ message: "Submitted" }, { status: 201 });
    }

    const { values, error: validationError } = validateOpenCall(body);
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    const eventId = crypto.randomUUID();
    const newEvent = {
      ...values,
      id: eventId,
      edittoken: crypto.randomUUID(),
      studio_uuid: ARTI_STUDIO_UUID,
      created_at: new Date().toISOString(),
      isPublished: false,
      isWithoutRegistration: false,
      source: "opencall",
    };

    const { error } = await supabaseAdmin.from("events").insert([newEvent]);
    if (error) {
      console.error("Open call insertion error:", error);
      return NextResponse.json({ message: "Failed to submit" }, { status: 500 });
    }

    let uploads;
    try {
      uploads = await createPhotoUploads(eventId);
    } catch (signError) {
      console.error("Signed upload error:", signError);
      return NextResponse.json({ message: "Submitted, but photo upload failed", eventId }, { status: 500 });
    }

    const { emailSent } = await notify(newEvent);

    return NextResponse.json({ message: "Submitted", eventId, uploads, emailSent }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
