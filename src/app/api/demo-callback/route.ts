import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const GWS_PATH = 'D:\\packages\\npm-global\\node_modules\\@googleworkspace\\cli\\run.js';

/** AU mobile: 04xx xxx xxx or +61 4xx. */
const AU_MOBILE = /^(?:\+?61|0)4\d{8}$/;

function digits(phone: string) {
  return phone.replace(/[\s()-]/g, '');
}

async function logToGmail(phone: string) {
  const timestamp = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Perth' });
  const rawEmail =
    `To: me\r\n` +
    `Subject: Good'ai callback request\r\n` +
    `Content-Type: text/plain; charset="utf-8"\r\n` +
    `\r\n` +
    `They left a number on the homepage.\r\n` +
    `- Phone: ${phone}\r\n` +
    `- When: ${timestamp}\r\n\r\n` +
    `Not auto-dialled. Ring them when you can.\r\n`;

  const raw = Buffer.from(rawEmail)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const fullArgs = [
    GWS_PATH,
    'gmail',
    'users',
    'messages',
    'send',
    '--params',
    JSON.stringify({ userId: 'me' }),
    '--format',
    'json',
    '--json',
    JSON.stringify({ raw }),
  ];
  await execFileAsync('node', fullArgs, { timeout: 15000 });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { phone?: string };
    const phone = digits(body.phone ?? '');
    if (!AU_MOBILE.test(phone)) {
      return NextResponse.json({ ok: false, error: 'Need an Aussie mobile (04…).' }, { status: 400 });
    }

    let queued = false;
    try {
      await logToGmail(phone);
      queued = true;
    } catch {
      queued = false;
    }

    const n8nUrl = process.env.N8N_CALL_WEBHOOK_URL;
    let dialled = false;
    if (n8nUrl) {
      try {
        const n8nRes = await fetch(n8nUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'voice_callback_requested',
            phone,
            timestamp: new Date().toISOString(),
          }),
          signal: AbortSignal.timeout(3500),
        });
        dialled = n8nRes.ok;
      } catch {
        dialled = false;
      }
    }

    if (!queued && !dialled) {
      return NextResponse.json(
        { ok: false, error: "Couldn't file the number from this machine." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      dialled,
      queued,
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Could not file the request.' }, { status: 502 });
  }
}
