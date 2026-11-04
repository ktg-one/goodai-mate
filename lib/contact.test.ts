import test from "node:test";
import assert from "node:assert/strict";
import {
  formatLeadPayload,
  escapeHtml,
  EMAIL_RE,
  LEAD_SUBJECT,
  LEAD_SUBJECT_TAG,
  resolveLeadRecipients,
  sendViaGmailSmtp,
} from "./contact.ts";

test("formatLeadPayload identifies spam when website honeypot is populated", () => {
  const result = formatLeadPayload({
    contact: "spammer@example.com",
    website: "http://bot.com",
  });
  assert.equal(result.isSpam, true);
});

test("formatLeadPayload handles empty inputs cleanly", () => {
  const result = formatLeadPayload({});
  assert.equal(result.contact, "");
  assert.equal(result.note, "");
  assert.deepEqual(result.headaches, []);
  assert.equal(result.isSpam, false);
  assert.equal(result.replyTo, undefined);
  assert.ok(result.html.includes("none selected"));
});

test("formatLeadPayload escapes HTML special characters in note and headaches", () => {
  const result = formatLeadPayload({
    contact: "test@example.com",
    headaches: ["<script>alert('xss')</script>", "Normal Headache"],
    note: "Line 1\nLine 2 & <tag>",
  });

  assert.equal(result.replyTo, "test@example.com");
  assert.ok(result.html.includes("&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"));
  assert.ok(result.html.includes("Line 1<br>Line 2 &amp; &lt;tag&gt;"));
});

test("formatLeadPayload sets replyTo for email contacts and omits for mobile phones", () => {
  const emailRes = formatLeadPayload({ contact: "mate@goodai.au" });
  assert.equal(emailRes.replyTo, "mate@goodai.au");

  const phoneRes = formatLeadPayload({ contact: "(08) 7741 4191" });
  assert.equal(phoneRes.replyTo, undefined);
});

test("formatLeadPayload truncates excessively long strings and arrays", () => {
  const longNote = "a".repeat(5000);
  const longContact = "b".repeat(300);
  const manyHeadaches = Array.from({ length: 20 }, (_, i) => `h_${i}`);

  const result = formatLeadPayload({
    contact: longContact,
    note: longNote,
    headaches: manyHeadaches,
  });

  assert.equal(result.contact.length, 200);
  assert.equal(result.note.length, 4000);
  assert.equal(result.headaches.length, 12);
});

test("escapeHtml safely escapes all HTML trigger characters", () => {
  assert.equal(escapeHtml(`& < > " '`), "&amp; &lt; &gt; &quot; &#39;");
});

test("EMAIL_RE validates email formats accurately", () => {
  assert.equal(EMAIL_RE.test("hello@goodai.au"), true);
  assert.equal(EMAIL_RE.test("0412 345 678"), false);
  assert.equal(EMAIL_RE.test("invalid-email"), false);
});

test("LEAD_SUBJECT includes the [Good'Ai lead] Gmail-watcher tag", () => {
  assert.ok(LEAD_SUBJECT.startsWith(LEAD_SUBJECT_TAG));
});

test("resolveLeadRecipients merges and deduplicates CONTACT_TO_EMAIL, GMAIL_TO_EMAIL, and GMAIL_USER", () => {
  assert.deepEqual(resolveLeadRecipients({}), ["hello@goodai.au"]);
  assert.deepEqual(
    resolveLeadRecipients({
      CONTACT_TO_EMAIL: "hello@goodai.au, kevin@goodai.au",
      GMAIL_TO_EMAIL: "kevin@goodai.au",
      GMAIL_USER: "workspace@goodai.au",
    }),
    ["hello@goodai.au", "kevin@goodai.au", "workspace@goodai.au"],
  );
});

test("sendViaGmailSmtp rejects invalid credentials before opening a socket", async () => {
  const res = await sendViaGmailSmtp({
    user: "not-an-email",
    appPassword: "",
    to: ["hello@goodai.au"],
    subject: LEAD_SUBJECT,
    html: "<p>Test</p>",
  });
  assert.equal(res.ok, false);
});

test("formatLeadPayload sanitizes spreadsheet formula triggers in contact, note, and headaches", () => {
  const result = formatLeadPayload({
    contact: "=1+1@example.com",
    headaches: ["+CMD|' /C calc'!A1", "@SUM(1,2)"],
    note: "-1+1\n\tTAB_FORMULA",
  });

  assert.equal(result.contact, "'=1+1@example.com");
  assert.deepEqual(result.headaches, ["'+CMD|' /C calc'!A1", "'@SUM(1,2)"]);
  assert.equal(result.note, "'-1+1\n'\tTAB_FORMULA");
});
