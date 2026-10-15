import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { sendLeadWebhook, type ContactLead } from "./lead-webhook.ts";

const lead: ContactLead = {
  name: "",
  email: "test@example.invalid",
  phone: "",
  message: "Test enquiry",
  source: "contact",
  submittedAt: "2026-10-07T00:00:00.000Z",
};

test("unset webhook URL is a no-op", async () => {
  let calls = 0;
  await sendLeadWebhook(lead, {
    url: "",
    fetch: async () => {
      calls++;
      return new Response();
    },
  });
  assert.equal(calls, 0);
});

test("webhook signs the exact JSON body and posts the lead", async () => {
  let capturedUrl: unknown;
  let capturedInit: RequestInit | undefined;
  await sendLeadWebhook(lead, {
    url: "https://example.invalid/webhook",
    secret: "test-only-secret",
    fetch: async (url, init) => {
      capturedUrl = url;
      capturedInit = init;
      return new Response(null, { status: 204 });
    },
  });
  assert.equal(capturedUrl, "https://example.invalid/webhook");
  assert.equal(capturedInit?.method, "POST");
  assert.equal(capturedInit?.body, JSON.stringify(lead));
  assert.equal(
    new Headers(capturedInit?.headers).get("X-GoodAi-Signature"),
    "sha256=" + createHmac("sha256", "test-only-secret").update(JSON.stringify(lead)).digest("hex"),
  );
});

test("timeout aborts delivery and is swallowed", async () => {
  let signal: AbortSignal | undefined;
  const logs: string[] = [];
  await sendLeadWebhook(lead, {
    url: "https://example.invalid/webhook",
    timeoutMs: 10,
    log: (message) => logs.push(message),
    fetch: async (_url, init) => {
      signal = init?.signal ?? undefined;
      return new Promise<Response>(() => {});
    },
  });
  assert.equal(signal?.aborted, true);
  assert.equal(logs.length, 1);
});

test("HTTP failure and throwing logger never reject", async () => {
  await sendLeadWebhook(lead, {
    url: "https://example.invalid/webhook",
    fetch: async () => new Response(null, { status: 500 }),
    log: () => {
      throw new Error("logger unavailable");
    },
  });
});

test("network failure is swallowed", async () => {
  const logs: string[] = [];
  await sendLeadWebhook(lead, {
    url: "https://example.invalid/webhook",
    fetch: async () => {
      throw new Error("network unavailable");
    },
    log: (message) => logs.push(message),
  });
  assert.equal(logs.length, 1);
});

