import tls from "node:tls";

export const FROM = "Good'Ai <mate@goodai.au>";
export const FROM_FALLBACK = "Good'Ai <onboarding@resend.dev>";
/** Gmail-watching agents pick leads up by this subject tag (decision 0002). */
export const LEAD_SUBJECT_TAG = "[Good'Ai lead]";
export const LEAD_SUBJECT = `${LEAD_SUBJECT_TAG} New Good'Ai enquiry`;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export interface ProcessLeadInput {
  contact?: unknown;
  note?: unknown;
  headaches?: unknown;
  website?: unknown;
}

export function formatLeadPayload(input: ProcessLeadInput) {
  const contact = typeof input.contact === "string" ? input.contact.trim().slice(0, 200) : "";
  const note = typeof input.note === "string" ? input.note.trim().slice(0, 4000) : "";
  const headaches = Array.isArray(input.headaches)
    ? input.headaches.filter((h: unknown): h is string => typeof h === "string").slice(0, 12).map((h: string) => h.slice(0, 80))
    : [];

  const isSpam = typeof input.website === "string" && Boolean(input.website.trim());

  const lines = [
    `<p><strong>Contact:</strong> ${escapeHtml(contact)}</p>`,
    `<p><strong>Headaches:</strong> ${headaches.length ? escapeHtml(headaches.join(", ")) : "none selected"}</p>`,
    `<p><strong>Note:</strong><br>${note ? escapeHtml(note).replace(/\n/g, "<br>") : "none"}</p>`,
  ];

  const text = [
    `Contact: ${contact}`,
    `Headaches: ${headaches.length ? headaches.join(", ") : "none selected"}`,
    `Note:\n${note || "none"}`,
  ].join("\n\n");

  return {
    contact,
    note,
    headaches,
    isSpam,
    replyTo: EMAIL_RE.test(contact) ? contact : undefined,
    html: lines.join(""),
    text,
  };
}

/**
 * Resolves deduplicated recipient email addresses from CONTACT_TO_EMAIL (comma-separated),
 * GMAIL_TO_EMAIL, and GMAIL_USER, defaulting to hello@goodai.au.
 */
export function resolveLeadRecipients(env: Record<string, string | undefined> = process.env): string[] {
  const rawList = [
    ...(env.CONTACT_TO_EMAIL ? env.CONTACT_TO_EMAIL.split(",") : ["hello@goodai.au"]),
    env.GMAIL_TO_EMAIL,
    env.GMAIL_USER,
  ];
  const unique = new Set<string>();
  for (const item of rawList) {
    const trimmed = item?.trim();
    if (trimmed && EMAIL_RE.test(trimmed)) {
      unique.add(trimmed);
    }
  }
  return unique.size > 0 ? Array.from(unique) : ["hello@goodai.au"];
}

export interface GmailSmtpOptions {
  user: string;
  appPassword: string;
  to: string[];
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
  timeoutMs?: number;
}

/**
 * Zero-dependency Google Workspace / Gmail SMTP sender over implicit TLS (smtp.gmail.com:465).
 */
export async function sendViaGmailSmtp(options: GmailSmtpOptions): Promise<{ ok: boolean; error?: string }> {
  const user = options.user.trim();
  const pass = options.appPassword.replace(/\s+/g, "");
  const recipients = options.to.filter((addr) => EMAIL_RE.test(addr));
  if (!EMAIL_RE.test(user) || !pass || recipients.length === 0) {
    return { ok: false, error: "Invalid Gmail SMTP configuration" };
  }

  const sanitizeHeader = (val: string) => val.replace(/[\r\n]+/g, " ").trim();
  const authBase64 = Buffer.from(`\0${user}\0${pass}`, "utf8").toString("base64");
  const boundary = `goodai_${Date.now().toString(36)}`;

  const mimeLines = [
    `From: "Good'Ai" <${sanitizeHeader(user)}>`,
    `To: ${recipients.map(sanitizeHeader).join(", ")}`,
    ...(options.replyTo && EMAIL_RE.test(options.replyTo) ? [`Reply-To: ${sanitizeHeader(options.replyTo)}`] : []),
    `Subject: ${sanitizeHeader(options.subject)}`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    (options.text ?? options.html.replace(/<[^>]+>/g, " ")).replace(/\r?\n/g, "\r\n"),
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    options.html.replace(/\r?\n/g, "\r\n"),
    "",
    `--${boundary}--`,
  ];

  // Dot-stuffing per RFC 5321 section 4.5.2
  const dataBody = mimeLines
    .join("\r\n")
    .split("\r\n")
    .map((line) => (line.startsWith(".") ? `.${line}` : line))
    .join("\r\n");

  const commands = [
    "EHLO goodai.au",
    `AUTH PLAIN ${authBase64}`,
    `MAIL FROM:<${user}>`,
    ...recipients.map((rcpt) => `RCPT TO:<${rcpt}>`),
    "DATA",
    `${dataBody}\r\n.`,
    "QUIT",
  ];

  return new Promise((resolve) => {
    let settled = false;
    let step = -1; // -1 = waiting for 220 banner
    let buffer = "";

    const finish = (result: { ok: boolean; error?: string }) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.destroy();
      resolve(result);
    };

    const socket = tls.connect({ host: "smtp.gmail.com", port: 465, servername: "smtp.gmail.com" });
    const timer = setTimeout(() => finish({ ok: false, error: "Gmail SMTP timed out" }), options.timeoutMs ?? 8000);

    socket.setEncoding("utf8");
    socket.on("error", (err) => finish({ ok: false, error: err.message }));
    socket.on("close", () => finish({ ok: false, error: "SMTP connection closed prematurely" }));

    socket.on("data", (chunk: string) => {
      buffer += chunk;
      const lines = buffer.split("\r\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.length < 3) continue;
        // Multi-line SMTP response continues until 4th char is space
        if (line[3] === "-") continue;

        const code = Number.parseInt(line.slice(0, 3), 10);
        if ( code >= 400 || Number.isNaN(code)) {
          finish({ ok: false, error: `SMTP ${line}` });
          return;
        }

        step += 1;
        if (step >= commands.length) {
          finish({ ok: true });
          return;
        }

        const nextCmd = commands[step];
        // Before sending message body, require 354 from DATA
        if (step > 0 && commands[step - 1] === "DATA" && code !== 354) {
          finish({ ok: false, error: `Expected 354 for DATA, got ${line}` });
          return;
        }

        socket.write(`${nextCmd}\r\n`);
        if (nextCmd === "QUIT") {
          finish({ ok: true });
          return;
        }
      }
    });
  });
}

