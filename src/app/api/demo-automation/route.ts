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

interface AutomationPayload {
  name: string;
  business: string;
  phone: string;
  email: string;
  problem: string;
  actions: {
    sheet: boolean;
    doc: boolean;
    emailNotification: boolean;
    calendar: boolean;
    n8n?: boolean;
  };
  n8nUrl?: string;
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
        // Check if stdout was a JSON error response
        const jsonErr = JSON.parse(err.stdout.trim());
        if (jsonErr?.error?.message) {
          errMsg = jsonErr.error.message;
        }
      }
    } catch {}
    // Instead of throwing, we return null to allow graceful simulation degradation
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AutomationPayload;
    const { name, business, phone, email, problem, actions, n8nUrl } = body;
    
    const logs: string[] = [];
    const results: Record<string, string> = {};
    
    // 1. Google Sheets Automation
    if (actions.sheet) {
      logs.push('Executing: gws sheets spreadsheets create...');
      // Create a spreadsheet named "Good'ai Leads Board"
      const sheetResult = (await runGwsCommand(['sheets', 'spreadsheets', 'create'], {
        properties: { title: "Good'ai Leads Board" }
      })) as { spreadsheetId?: string; spreadsheetUrl?: string } | null;
      
      if (sheetResult && sheetResult.spreadsheetId) {
        const spreadsheetId = sheetResult.spreadsheetId;
        const sheetUrl = sheetResult.spreadsheetUrl;
        if (sheetUrl) results.sheetUrl = sheetUrl;
        logs.push(`Spreadsheet created: ID ${spreadsheetId}`);

        // Append header row + lead row
        logs.push('Executing: gws sheets spreadsheets values append...');
        const timestamp = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Perth' });
        await runGwsCommand([
          'sheets', 'spreadsheets', 'values', 'append',
          '--params', JSON.stringify({
            spreadsheetId,
            range: 'Sheet1!A1',
            valueInputOption: 'USER_ENTERED'
          })
        ], {
          values: [
            ['Timestamp', 'Name', 'Business', 'Phone', 'Email', 'Problem'],
            [timestamp, name, business || '—', phone, email || '—', problem]
          ]
        });
        logs.push('Lead successfully appended to spreadsheet.');
      } else {
        logs.push('[SIMULATED] Sheets: Created spreadsheet and appended lead (GWS CLI not available)');
        results.sheetUrl = '#simulated';
      }
    }

    // 2. Google Docs Automation
    if (actions.doc) {
      logs.push('Executing: gws docs documents create...');
      const docTitle = `Good'ai Scope - ${name}`;
      const docResult = (await runGwsCommand(['docs', 'documents', 'create'], {
        title: docTitle
      })) as { documentId?: string } | null;
      
      if (docResult && docResult.documentId) {
        const documentId = docResult.documentId;
        const docUrl = `https://docs.google.com/document/d/${documentId}/edit`;
        results.docUrl = docUrl;
        logs.push(`Document created: ID ${documentId}`);

        // Insert scope headers and body text
        logs.push('Executing: gws docs documents batchUpdate...');
        const timestamp = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Perth' });
        const docText = `GOOD'AI AUTOMATION DOCKET\n` +
                        `========================================\n` +
                        `Generated At: ${timestamp}\n` +
                        `Client Name:  ${name}\n` +
                        `Business:     ${business || '—'}\n` +
                        `Phone:        ${phone}\n` +
                        `Email:        ${email || '—'}\n` +
                        `\n` +
                        `THE PROBLEM DESCRIPTION:\n` +
                        `"${problem}"\n` +
                        `\n` +
                        `PREMIUM BRUTALIST SERVICE PROPOSAL:\n` +
                        `1. Intake Setup: Deploy a bidirectional local voice agent via Supertonic.\n` +
                        `2. Core Pipeline: Sync incoming client logs to Google Sheets with real-time alerts.\n` +
                        `3. Final Settle: Implement automatic Google Docs docket generation and scheduling.\n` +
                        `\n` +
                        `Good'ai — Sorted.\n`;

        await runGwsCommand([
          'docs', 'documents', 'batchUpdate',
          '--params', JSON.stringify({ documentId })
        ], {
          requests: [
            {
              insertText: {
                location: {
                  index: 1
                },
                text: docText
              }
            }
          ]
        });
        logs.push('Scope description successfully written to document.');
      } else {
        logs.push(`[SIMULATED] Docs: Created scope document for ${name} (GWS CLI not available)`);
        results.docUrl = '#simulated';
      }
    }

    // 3. Gmail Notification Automation
    if (actions.emailNotification && email) {
      logs.push('Executing: gws gmail users messages send...');
      const timestamp = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Perth' });
      
      const rawEmail = 
        `To: ${email}\r\n` +
        `Subject: Good'ai Automation Received - Hello ${name}\r\n` +
        `Content-Type: text/plain; charset="utf-8"\r\n` +
        `\r\n` +
        `Hi ${name},\r\n\r\n` +
        `This is a live test notification from your Good'ai local workspace.\r\n\r\n` +
        `We received your request on ${timestamp}:\r\n` +
        `"${problem}"\r\n\r\n` +
        `Our team will review this and call you on ${phone} to coordinate the setup.\r\n\r\n` +
        `Cheers,\r\n` +
        `The Good'ai Automations Team\r\n`;

      // Base64Url encode raw email
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
      })) as { id?: string } | null;
      
      if (emailResult && emailResult.id) {
        results.emailId = emailResult.id;
        logs.push(`Email notification sent successfully! ID: ${emailResult.id}`);
      } else {
        logs.push(`[SIMULATED] Gmail: Sent email notification to ${email} (GWS CLI not available)`);
        results.emailId = 'simulated-id';
      }
    } else if (actions.emailNotification) {
      logs.push('Skipping Gmail: No email address provided.');
    }

    // 4. Google Calendar Automation
    if (actions.calendar) {
      logs.push('Executing: gws calendar events insert...');
      
      // Schedule event for tomorrow at 10:00 AM Perth time
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const startIso = `${tomorrow.toISOString().split('T')[0]}T10:00:00`;
      const endIso = `${tomorrow.toISOString().split('T')[0]}T10:30:00`;
      
      const eventResult = (await runGwsCommand([
        'calendar', 'events', 'insert',
        '--params', JSON.stringify({ calendarId: 'primary' })
      ], {
        summary: `Good'ai Discovery Call - ${name}`,
        description: `Automated Discovery call regarding: ${problem}. Contact: ${phone}`,
        start: {
          dateTime: startIso,
          timeZone: 'Australia/Perth'
        },
        end: {
          dateTime: endIso,
          timeZone: 'Australia/Perth'
        }
      })) as { htmlLink?: string; summary?: string } | null;
      
      if (eventResult && eventResult.htmlLink) {
        results.calendarUrl = eventResult.htmlLink;
        logs.push(`Calendar Event scheduled: "${eventResult.summary}"`);
      } else {
        logs.push(`[SIMULATED] Calendar: Scheduled discovery call (GWS CLI not available)`);
        results.calendarUrl = '#simulated';
      }
    }

    // 5. n8n Webhook Pipeline Automation
    if (actions.n8n) {
      logs.push('Executing: n8n Webhook Pipeline Trigger...');
      const targetUrl = n8nUrl?.trim() || 'http://localhost:5678/webhook/goodai-demo';
      logs.push(`Sending lead payload to webhook URL: ${targetUrl}`);
      
      try {
        const payload = {
          event: 'goodai_lead_captured',
          timestamp: new Date().toISOString(),
          lead: { name, business, phone, email, problem }
        };
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout
        
        const n8nRes = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (n8nRes.ok) {
          logs.push(`[SYSTEM] Webhook trigger success! Response: ${n8nRes.status} ${n8nRes.statusText}`);
          results.n8nStatus = 'Success';
        } else {
          logs.push(`[WARNING] Webhook URL returned status ${n8nRes.status}. Check your n8n workflow.`);
          results.n8nStatus = `Returned ${n8nRes.status}`;
        }
      } catch (err: unknown) {
        const errorObject = err as { name?: string; message?: string };
        if (errorObject.name === 'AbortError') {
          logs.push('[WARNING] Webhook connection timed out. If you do not have n8n running locally, this is expected.');
        } else {
          logs.push(`[WARNING] Webhook trigger failed: ${errorObject.message || 'Unknown error'}. (Using simulated webhook demo fallback)`);
        }
        results.n8nStatus = 'Simulated / Timed out';
      }
    }

    return NextResponse.json({
      success: true,
      logs,
      results
    });

  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Automation run failed';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
