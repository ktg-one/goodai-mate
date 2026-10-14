import { NextResponse } from "next/server";
import { limitRequest } from "@/lib/rate-limit";
import { FROM, formatLeadPayload } from "@/lib/contact";

export const dynamic = "force-dynamic";

const LEAD_TO = process.env.CONTACT_TO_EMAIL || "hello@goodai.au";

/**
 * Lead alert: emails the enquiry to LEAD_TO via Resend. Never reports success
 * unless Resend accepted the message.
 */
export async function POST(request: Request) {
  const limited = limitRequest(request, "contact", { limit: 5, globalLimit: 40, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many enquiries just now. Wait a minute, or call us." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { contact, isSpam, replyTo, html, webhookPayload } = formatLeadPayload(body);

  // Honeypot: bots fill the hidden field. Pretend nothing happened, send nothing.
  if (isSpam) {
    return NextResponse.json({ ok: true });
  }

  if (!contact) {
    return NextResponse.json({ error: "Add a mobile number or email so we can reply." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[Contact API] RESEND_API_KEY is not set; lead not sent.");
    return NextResponse.json({ error: "We couldn't send that just now. Please call us instead." }, { status: 503 });
  }

  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookPayload),
    }).catch((err) => {
      console.error("[Contact API] LEAD_WEBHOOK_URL delivery failed:", err);
    });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [LEAD_TO],
      reply_to: replyTo,
      subject: "New Good'Ai enquiry",
      html,
    }),
  }).catch(() => null);

  if (!res || !res.ok) {
    console.error("[Contact API] Resend rejected the lead:", res ? await res.text().catch(() => res.status) : "network error");
    return NextResponse.json({ error: "We couldn't send that just now. Please call us instead." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
