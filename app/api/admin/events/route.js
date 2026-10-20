import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import moment from "moment";
import { supabaseAdmin } from "services/supabase-admin";
import { requireManager } from "services/admin.server";
import { OpenCallApproval } from "services/emails/openCallApprovalTemplate";
import { SITE_URL, UUID_RE, sendEmail } from "services/opencall.server";

const LIST_COLUMNS =
  "id,title,date,time,host_name,host_email,link,country,created_at,isPublished,edittoken";

const approvalEmailFor = (event, edittoken) => (
  <OpenCallApproval
    name={event.host_name}
    event_title={event.title}
    event_date_time={
      event.date
        ? moment(event.date, "YYYY-MM-DD").format("dddd D MMM YYYY") +
          (event.time ? ` at ${event.time}` : "")
        : ""
    }
    event_link={`${SITE_URL}/event/${event.id}`}
    edit_link={`${SITE_URL}/night/update?edittoken=${edittoken}`}
  />
);

// Admin board: open call submissions only (studio-made events have no host details).
export async function GET(request) {
  try {
    const auth = await requireManager(request);
    if (!auth.user) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    const { data, error } = await supabaseAdmin
      .from("events")
      .select(LIST_COLUMNS)
      .eq("source", "opencall");
    if (error) {
      console.error("Admin events list error:", error);
      return NextResponse.json({ message: "Failed to load events" }, { status: 500 });
    }

    const events = data || [];
    // Waiting for approval: oldest submission first.
    const pending = events
      .filter((e) => !e.isPublished)
      .sort((a, b) => (a.created_at || "").localeCompare(b.created_at || ""));
    // Approved: soonest event first, events without a date last.
    const approved = events
      .filter((e) => e.isPublished)
      .sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"));

    return NextResponse.json({ pending, approved });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// Approve = publish the event and email the host their event and private edit links.
export async function PATCH(request) {
  try {
    const auth = await requireManager(request);
    if (!auth.user) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    const { id } = await request.json();
    if (typeof id !== "string" || !UUID_RE.test(id)) {
      return NextResponse.json({ message: "Invalid event id" }, { status: 400 });
    }

    const { data: event, error } = await supabaseAdmin
      .from("events")
      .select(LIST_COLUMNS)
      .eq("id", id)
      .eq("source", "opencall")
      .maybeSingle();
    if (error || !event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }
    if (event.isPublished) {
      return NextResponse.json({ message: "Already approved", alreadyApproved: true });
    }

    // Events created before edit tokens existed get one now.
    const edittoken = event.edittoken || crypto.randomUUID();
    const { error: updateError } = await supabaseAdmin
      .from("events")
      .update({ isPublished: true, edittoken })
      .eq("id", id);
    if (updateError) {
      console.error("Admin approve error:", updateError);
      return NextResponse.json({ message: "Failed to approve" }, { status: 500 });
    }

    revalidateTag("events", { expire: 0 });

    let emailSent = true;
    try {
      await sendEmail({
        to: event.host_email,
        subject: `Your Arti Night is approved: ${event.title}`,
        element: approvalEmailFor(event, edittoken),
      });
    } catch (mailError) {
      emailSent = false;
      console.error("Approval email failed:", mailError);
    }

    return NextResponse.json({ message: "Approved", emailSent });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
