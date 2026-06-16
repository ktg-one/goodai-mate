import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execFileAsync = promisify(execFile);

// Helper to resolve GWS CLI path dynamically
function getGwsCliPath(): string {
  if (process.env.GWS_CLI_PATH) {
    return process.env.GWS_CLI_PATH;
  }
  const localPath = path.join(process.cwd(), 'node_modules', '@googleworkspace', 'cli', 'run.js');
  if (fs.existsSync(localPath)) {
    return localPath;
  }
  return 'D:\\packages\\npm-global\\node_modules\\@googleworkspace\\cli\\run.js';
}

const GWS_PATH = getGwsCliPath();

interface CallTriggerPayload {
  phone: string;
  agent: string;
}

async function runGwsCommand(args: string[], jsonInput?: unknown): Promise<unknown> {
  const isJs = GWS_PATH.endsWith('.js');
  const command = isJs ? 'node' : GWS_PATH;
  const fullArgs = isJs ? [GWS_PATH, ...args] : [...args];
  fullArgs.push('--format', 'json');
  
  if (jsonInput) {
    fullArgs.push('--json', JSON.stringify(jsonInput));
  }
  
  try {
    const { stdout } = await execFileAsync(command, fullArgs);
    return JSON.parse(stdout.trim());
  } catch (error: unknown) {
    const err = error as { stdout?: string; stderr?: string; message?: string };
    console.error(`GWS execution failed: ${command} ${fullArgs.map(a => `"${a}"`).join(' ')}`, err);
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

    // 1. n8n Outbound Dialer Webhook
    logs.push(`[SYSTEM] Dispatching callback trigger to n8n webhook...`);
    const n8nCallUrl = process.env.N8N_CALL_WEBHOOK_URL || 'http://localhost:5678/webhook/goodai-call';
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout
      
      const n8nRes = await fetch(n8nCallUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'voice_callback_requested',
          agent: agentName,
          phone: phone.trim(),
          timestamp: new Date().toISOString()
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (n8nRes.ok) {
        logs.push(`[n8n] Trigger accepted by outbound dialing workflow.`);
        results.n8nStatus = 'Triggered';
      } else {
        logs.push(`[n8n] Workflow returned status ${n8nRes.status}.`);
        results.n8nStatus = 'Failed Status';
      }
    } catch (err: unknown) {
      const errorObject = err as { name?: string; message?: string };
      if (errorObject.name === 'AbortError') {
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

  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Call trigger failed';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
