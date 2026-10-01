import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FROM = "Good'Ai <mate@goodai.au>";
const LEAD_TO = process.env.CONTACT_TO_EMAIL || "hello@goodai.au";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

/**
 * Lead alert: emails the enquiry to LEAD_TO via Resend. Never reports success
 * unless Resend accepted the message.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill the hidden field. Pretend nothing happened, send nothing.
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const contact = typeof body.contact === "string" ? body.contact.trim().slice(0, 200) : "";
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 4000) : "";
  const headaches = Array.isArray(body.headaches)
    ? body.headaches.filter((h: unknown): h is string => typeof h === "string").slice(0, 12).map((h: string) => h.slice(0, 80))
    : [];

  if (!contact) {
    return NextResponse.json({ error: "Add a mobile number or email so we can reply." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[Contact API] RESEND_API_KEY is not set; lead not sent.");
    return NextResponse.json({ error: "We couldn't send that just now. Please call us instead." }, { status: 503 });
  }

  const lines = [
    `<p><strong>Contact:</strong> ${escapeHtml(contact)}</p>`,
    `<p><strong>Headaches:</strong> ${headaches.length ? escapeHtml(headaches.join(", ")) : "none selected"}</p>`,
    `<p><strong>Note:</strong><br>${note ? escapeHtml(note).replace(/\n/g, "<br>") : "none"}</p>`,
  ];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [LEAD_TO],
      reply_to: EMAIL_RE.test(contact) ? contact : undefined,
      subject: "New Good'Ai enquiry",
      html: lines.join(""),
    }),
  }).catch(() => null);

  if (!res || !res.ok) {
    console.error("[Contact API] Resend rejected the lead:", res ? await res.text().catch(() => res.status) : "network error");
    return NextResponse.json({ error: "We couldn't send that just now. Please call us instead." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
