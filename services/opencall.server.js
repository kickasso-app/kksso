import { Resend } from "resend";
import { render, pretty } from "@react-email/render";
import { supabaseAdmin } from "services/supabase-admin";
import { GenericTemplate } from "services/emails/genericTemplate";
import { COUNTRIES } from "config/constants/countries";
import { OPENCALL_DATES, isWithinOpenCallDates } from "config/opencalldates";

export const ARTI_STUDIO_UUID = "a67a18aa-551c-4ecf-9281-8f1f6b596ef2";
export const FROM_EMAIL = "Arti <hello@arti.my>";
export const ADMIN_EMAIL = "hello@arti.my";
export const SITE_URL = "https://www.arti.my";

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const resend = new Resend(process.env.RESEND_API_KEY);

// Best-effort limiter: in-memory, so it resets per serverless instance.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const hits = new Map();

export const isRateLimited = (key, limit = RATE_LIMIT) => {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > limit;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const MAX_LENGTHS = {
  host_name: 100,
  host_email: 200,
  title: 150,
  type: 50,
  time: 50,
  city: 100,
  location: 200,
  languages: 100,
  link: 300,
  miniDescription: 300,
  longDescription: 2000,
};

const REQUIRED = [
  "host_name",
  "host_email",
  "title",
  "type",
  "date",
  "time",
  "city",
  "country",
  "location",
  "link",
  "miniDescription",
  "longDescription",
];

const clean = (v) => (typeof v === "string" ? v.trim() : "");

export function validateOpenCall(input) {
  const values = {};
  for (const key of [...REQUIRED, "languages"]) {
    values[key] = clean(input?.[key]);
  }

  for (const key of REQUIRED) {
    if (!values[key]) return { error: `Missing field: ${key}` };
  }
  for (const [key, max] of Object.entries(MAX_LENGTHS)) {
    if (values[key].length > max) return { error: `Field too long: ${key}` };
  }
  if (!EMAIL_RE.test(values.host_email)) return { error: "Invalid email" };
  if (!DATE_RE.test(values.date) || Number.isNaN(Date.parse(values.date))) {
    return { error: "Invalid date, use YYYY-MM-DD" };
  }
  if (!isWithinOpenCallDates(values.date)) {
    return {
      error: `The date must be between ${OPENCALL_DATES.start} and ${OPENCALL_DATES.end}`,
    };
  }
  if (!COUNTRIES.includes(values.country)) return { error: "Invalid country" };

  return { values };
}

export async function sendMarkdownEmail({ to, subject, markdown, replyTo }) {
  return sendEmail({
    to,
    subject,
    replyTo,
    element: <GenericTemplate markdown={markdown} />,
  });
}

export async function sendEmail({ to, subject, element, replyTo }) {
  const html = await pretty(await render(element));
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
    ...(replyTo && { reply_to: replyTo }),
  });
  if (error) throw new Error(error.message);
}

// Signed URLs let the browser upload the photo without a logged-in session.
export async function createPhotoUploads(eventId, { upsert = false } = {}) {
  const dir = `${ARTI_STUDIO_UUID}/${eventId}`;
  const uploads = {};
  for (const name of ["event-large.jpg", "event-small.jpg"]) {
    const { data, error } = await supabaseAdmin.storage
      .from("events")
      .createSignedUploadUrl(`${dir}/${name}`, { upsert });
    if (error) throw new Error(error.message);
    uploads[name] = { path: data.path, token: data.token };
  }
  return uploads;
}
