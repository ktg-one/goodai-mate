import { NextResponse } from "next/server";
import { limitRequest } from "@/lib/rate-limit";
import {
  EMAIL_RE,
  FROM,
  FROM_FALLBACK,
  LEAD_SUBJECT,
  formatLeadPayload,
  resolveLeadRecipients,
  sendViaGmailSmtp,
} from "@/lib/contact";
import { sendLeadWebhook } from "@/lib/lead-webhook";

export const dynamic = "force-dynamic";

/**
 * Lead alert: emails the enquiry via Resend and/or direct Google Workspace Gmail SMTP,
 * plus optional signed webhook. Never reports success unless at least one mail transport accepted it.
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

  const { contact, note, headaches, isSpam, replyTo, html, text } = formatLeadPayload(body);

  // Honeypot: bots fill the hidden field. Pretend nothing happened, send nothing.
  if (isSpam) {
    return NextResponse.json({ ok: true });
  }

  if (!contact) {
    return NextResponse.json({ error: "Add a mobile number or email so we can reply." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPass = process.env.GMAIL_APP_PASSWORD?.trim();
  const hasGmailSmtp = Boolean(gmailUser && gmailPass);

  if (!apiKey && !hasGmailSmtp) {
    console.error("[Contact API] Neither RESEND_API_KEY nor GMAIL_USER/GMAIL_APP_PASSWORD is set; lead not sent.");
    return NextResponse.json({ error: "We couldn't send that just now. Please call us instead." }, { status: 503 });
  }

  const recipients = resolveLeadRecipients();
  let resendOk = false;
  let resendError = "";

  if (apiKey) {
    let res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: recipients,
        reply_to: replyTo,
        subject: LEAD_SUBJECT,
        html,
      }),
    }).catch(() => null);

    // If custom domain is unverified (403), fallback to Resend's default onboarding domain
    if (res && res.status === 403) {
      console.warn("[Contact API] Custom domain rejected (403). Retrying with onboarding@resend.dev fallback.");
      res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM_FALLBACK,
          to: recipients,
          reply_to: replyTo,
          subject: `${LEAD_SUBJECT} (Fallback)`,
          html,
        }),
      }).catch(() => null);
    }

    if (res && res.ok) {
      resendOk = true;
    } else {
      resendError = res ? await res.text().catch(() => String(res.status)) : "network error";
    }
  }

  let gmailOk = false;
  let gmailError = "";
  if (hasGmailSmtp && gmailUser && gmailPass) {
    const smtpRes = await sendViaGmailSmtp({
      user: gmailUser,
      appPassword: gmailPass,
      to: recipients,
      replyTo,
      subject: LEAD_SUBJECT,
      html,
      text,
    });
    gmailOk = smtpRes.ok;
    if (!smtpRes.ok) {
      gmailError = smtpRes.error ?? "Gmail SMTP error";
    }
  }

  if (!resendOk && !gmailOk) {
    console.error("[Contact API] CRITICAL_LEAD_LOSS_PREVENTION - All mail transports rejected the lead:", {
      resendError: resendError || "not configured",
      gmailError: gmailError || "not configured",
      lead: { contact, headaches, note, timestamp: new Date().toISOString() },
    });
    return NextResponse.json({ error: "We couldn't send that just now. Please call us instead." }, { status: 502 });
  }

  await sendLeadWebhook({
    name: "",
    email: EMAIL_RE.test(contact) ? contact : "",
    phone: EMAIL_RE.test(contact) ? "" : contact,
    message: [headaches.length ? `Headaches: ${headaches.join(", ")}` : "", note].filter(Boolean).join("\n"),
    source: "contact",
    submittedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}

