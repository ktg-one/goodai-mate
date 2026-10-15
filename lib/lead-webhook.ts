import { createHmac } from "node:crypto";

export type ContactLead = {
  name: string;
  email: string;
  phone: string;
  message: string;
  source: "contact";
  submittedAt: string;
};

/** Best-effort delivery after email acceptance; never rejects to the visitor. */
export async function sendLeadWebhook(
  lead: ContactLead,
  options: {
    url?: string;
    secret?: string;
    fetch?: typeof fetch;
    timeoutMs?: number;
    log?: (message: string) => void;
  } = {},
): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const log = options.log ?? console.error;
  try {
    const url = options.url ?? process.env.LEAD_WEBHOOK_URL;
    if (!url) return;
    const secret = options.secret ?? process.env.LEAD_WEBHOOK_SECRET;
    const rawBody = JSON.stringify(lead);
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (secret) {
      headers["X-GoodAi-Signature"] = `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`;
    }
    const controller = new AbortController();
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        controller.abort();
        reject(new Error("Lead webhook timed out"));
      }, options.timeoutMs ?? 3000);
    });
    const response = await Promise.race([
      (options.fetch ?? fetch)(url, {
        method: "POST",
        headers,
        body: rawBody,
        signal: controller.signal,
        redirect: "error",
      }),
      timeout,
    ]);
    if (!response.ok) log(`[Lead webhook] Delivery failed (HTTP ${response.status}).`);
  } catch {
    // Do not log URLs, payloads or secrets.
    try {
      log("[Lead webhook] Delivery failed or timed out.");
    } catch {
      /* Logging must not reject either. */
    }
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

