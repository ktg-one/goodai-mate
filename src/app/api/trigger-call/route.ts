import { NextRequest, NextResponse } from 'next/server';

interface CallTriggerPayload {
  phone: string;
  agent: string;
}

/**
 * Outbound call trigger — Vercel-safe.
 * Posts the callback request to the n8n outbound-dialer webhook
 * (Railway -> n8n -> Trillet AI), which actually rings the client's phone
 * with the selected agent (Darl / Robokev).
 *
 * No child_process / local CLI: those don't exist on Vercel serverless.
 * Any audit/email logging belongs in the n8n workflow downstream.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CallTriggerPayload;
    const { phone, agent } = body;

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const agentName = agent || 'darl';
    const logs: string[] = [`[SYSTEM] Initializing Outbound Call Trigger for Agent: ${agentName}`];
    const results: Record<string, string> = {};

    const n8nCallUrl = process.env.N8N_CALL_WEBHOOK_URL;

    // Mock mode — webhook not configured yet (clearly labelled, never pretends to dial).
    if (!n8nCallUrl) {
      logs.push(`[DIALER] N8N_CALL_WEBHOOK_URL not set — mock mode, no real call placed.`);
      results.n8nStatus = 'Mock (webhook not configured)';
      return NextResponse.json({ success: true, logs, results });
    }

    logs.push(`[SYSTEM] Dispatching callback trigger to n8n outbound dialer...`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const n8nRes = await fetch(n8nCallUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'voice_callback_requested',
          agent: agentName,
          phone: phone.trim(),
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (n8nRes.ok) {
        logs.push(`[n8n] Trigger accepted by outbound dialing workflow.`);
        results.n8nStatus = 'Triggered';
      } else {
        logs.push(`[n8n] Workflow returned status ${n8nRes.status}.`);
        results.n8nStatus = `Failed (${n8nRes.status})`;
      }
    } catch (err: unknown) {
      const errorObject = err as { name?: string; message?: string };
      if (errorObject.name === 'AbortError') {
        logs.push(`[DIALER] Webhook timeout after 8s — n8n did not respond.`);
        results.n8nStatus = 'Timed out';
      } else {
        logs.push(`[DIALER] Webhook error: ${errorObject.message || 'Unknown'}.`);
        results.n8nStatus = 'Error';
      }
    }

    logs.push(`[SYSTEM] Call dialer sequence initiated.`);

    return NextResponse.json({ success: true, logs, results });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Call trigger failed';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
