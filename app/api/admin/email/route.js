import { NextResponse } from "next/server";
import { requireManager } from "services/admin.server";
import { sendMarkdownEmail } from "services/opencall.server";

const MAX_RECIPIENTS = 50;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Manager-only generic email. The public /api/send-email no longer accepts
// the generic template, so nobody else can send free text as Arti.
export async function POST(request) {
  try {
    const auth = await requireManager(request);
    if (!auth.user) {
      return NextResponse.json({ message: auth.message }, { status: auth.status });
    }

    const { recipients, subject, markdown } = await request.json();

    const list = (Array.isArray(recipients) ? recipients : [recipients])
      .map((r) => (typeof r === "string" ? r.trim() : ""))
      .filter(Boolean);
    if (list.length === 0 || list.length > MAX_RECIPIENTS) {
      return NextResponse.json(
        { message: `Provide 1 to ${MAX_RECIPIENTS} recipients` },
        { status: 400 }
      );
    }
    const invalid = list.filter((r) => !EMAIL_RE.test(r));
    if (invalid.length) {
      return NextResponse.json({ message: `Invalid email: ${invalid[0]}` }, { status: 400 });
    }
    if (typeof subject !== "string" || !subject.trim() || subject.length > 200) {
      return NextResponse.json({ message: "Subject is required (200 characters max)" }, { status: 400 });
    }
    if (typeof markdown !== "string" || !markdown.trim() || markdown.length > 20000) {
      return NextResponse.json({ message: "Body is required (20000 characters max)" }, { status: 400 });
    }

    // One email per recipient so addresses are not exposed to each other.
    const results = await Promise.allSettled(
      list.map((to) => sendMarkdownEmail({ to, subject: subject.trim(), markdown }))
    );
    const failed = list.filter((_, i) => results[i].status === "rejected");
    failed.forEach((to) => console.error("Admin email failed for", to));

    return NextResponse.json({
      message: failed.length ? "Some emails failed" : "Sent",
      sent: list.length - failed.length,
      failed,
    }, { status: failed.length === list.length ? 502 : 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
