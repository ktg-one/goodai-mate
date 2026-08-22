import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const GWS_PATH = 'D:\\packages\\npm-global\\node_modules\\@googleworkspace\\cli\\run.js';
=======
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)

interface CallTriggerPayload {
  phone: string;
  agent: string;
}

<<<<<<< HEAD
async function runGwsCommand(args: string[], jsonInput?: unknown): Promise<unknown> {
  const fullArgs = [
    GWS_PATH,
    ...args,
    '--format', 'json'
  ];

  if (jsonInput) {
    fullArgs.push('--json', JSON.stringify(jsonInput));
  }

  try {
    const { stdout } = await execFileAsync('node', fullArgs);
    return JSON.parse(stdout.trim());
  } catch (error: unknown) {
    const err = error as { stdout?: string; stderr?: string; message?: string };
    console.error(`GWS execution failed: node ${fullArgs.map(a => `"${a}"`).join(' ')}`, err);
    let errMsg = err.stdout || err.stderr || err.message || '';
    try {
      if (err.stdout) {
        const jsonErr = JSON.parse(err.stdout.trim());
        if (jsonErr?.error?.message) {
          errMsg = jsonErr.error.message;
        }
      }
    } catch {}
    throw new Error(errMsg || 'GWS CLI execution returned an error');
  }
}

=======
/**
 * Outbound call trigger — Vercel-safe.
 * Posts the callback request to the n8n outbound-dialer webhook
 * (Railway -> n8n -> Trillet AI), which actually rings the client's phone
 * with the selected agent (Darl / Robokev).
 *
 * No child_process / local CLI: those don't exist on Vercel serverless.
 * Any audit/email logging belongs in the n8n workflow downstream.
 */
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
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

<<<<<<< HEAD
    // 1. n8n Outbound Dialer Webhook
    logs.push(`[SYSTEM] Dispatching callback trigger to n8n webhook...`);
    const n8nCallUrl = process.env.N8N_CALL_WEBHOOK_URL || 'http://localhost:5678/webhook/goodai-call';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout

=======
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

>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
      const n8nRes = await fetch(n8nCallUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'voice_callback_requested',
          agent: agentName,
          phone: phone.trim(),
<<<<<<< HEAD
          timestamp: new Date().toISOString()
        }),
        signal: controller.signal
=======
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
      });

      clearTimeout(timeoutId);

      if (n8nRes.ok) {
        logs.push(`[n8n] Trigger accepted by outbound dialing workflow.`);
        results.n8nStatus = 'Triggered';
      } else {
        logs.push(`[n8n] Workflow returned status ${n8nRes.status}.`);
<<<<<<< HEAD
        results.n8nStatus = 'Failed Status';
=======
        results.n8nStatus = `Failed (${n8nRes.status})`;
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
      }
    } catch (err: unknown) {
      const errorObject = err as { name?: string; message?: string };
      if (errorObject.name === 'AbortError') {
<<<<<<< HEAD
        logs.push(`[DIALER] Webhook timeout. (Simulating outbound connection)`);
      } else {
        logs.push(`[DIALER] Webhook offline: ${errorObject.message || 'Unknown'}. (Simulating connection)`);
      }
      results.n8nStatus = 'Simulated / Timed out';
    }

    // 2. Local Google Workspace Logger (Gmail Alert)
    // Send a local email notification of the call request to ensure audit logging
    try {
      logs.push(`[GWS] Logging callback request to Workspace CLI (Gmail Alert)...`);
      const timestamp = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Perth' });

      const rawEmail =
        `To: me\r\n` +
        `Subject: Good'ai Agent Call Requested - ${agentName} dialer\r\n` +
        `Content-Type: text/plain; charset="utf-8"\r\n` +
        `\r\n` +
        `Outbound agent call requested:\r\n` +
        `- Agent: ${agentName}\r\n` +
        `- Target Phone: ${phone}\r\n` +
        `- Scheduled Time: ${timestamp}\r\n\r\n` +
        `Good'ai dialer engine initiated.\r\n`;

      const base64UrlEmail = Buffer.from(rawEmail)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const emailResult = (await runGwsCommand([
        'gmail', 'users', 'messages', 'send',
        '--params', JSON.stringify({ userId: 'me' })
      ], {
        raw: base64UrlEmail
      })) as { id: string };

      logs.push(`[GWS] Callback logged to Workspace Gmail. ID: ${emailResult.id}`);
      results.emailId = emailResult.id;
    } catch (err: unknown) {
      const errorObject = err as { message?: string };
      logs.push(`[GWS] Local logger skipped: CLI not logged in or ${errorObject.message || 'Unknown error'}`);
    }

    logs.push(`[SYSTEM] Call dialer sequence initiated successfully.`);

    return NextResponse.json({
      success: true,
      logs,
      results
    });

=======
        logs.push(`[DIALER] Webhook timeout after 8s — n8n did not respond.`);
        results.n8nStatus = 'Timed out';
      } else {
        logs.push(`[DIALER] Webhook error: ${errorObject.message || 'Unknown'}.`);
        results.n8nStatus = 'Error';
      }
    }

    logs.push(`[SYSTEM] Call dialer sequence initiated.`);

    return NextResponse.json({ success: true, logs, results });
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Call trigger failed';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
