export const FROM = "Good'Ai <mate@goodai.au>";
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

  return {
    contact,
    note,
    headaches,
    isSpam,
    replyTo: EMAIL_RE.test(contact) ? contact : undefined,
    html: lines.join(""),
    webhookPayload: {
      contact,
      note,
      headaches,
      submittedAt: new Date().toISOString(),
      source: "goodai-contact-form",
    },
  };
}
