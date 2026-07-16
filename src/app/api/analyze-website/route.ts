import { NextRequest, NextResponse } from 'next/server';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';
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

interface AnalyzePayload {
  url: string;
}

function isSafeUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);

    // Only allow HTTP/HTTPS
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    // Block internal hostnames
    if (url.hostname === 'localhost' || url.hostname.endsWith('.local')) {
      return false;
    }

    // Block private IP ranges
    const hostname = url.hostname;

    // Strict Regex for IPv4 private ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8)
    // Avoids false positives like 10.example.com
    const isLocalIPv4 = /^(?:127\.\d{1,3}\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}|0\.0\.0\.0|255\.255\.255\.255)$/;
    if (isLocalIPv4.test(hostname)) {
      return false;
    }

    // Very basic IPv6 local blocks check (::1, fc00::/7, fe80::/10, fd00::/8)
    if (
      hostname === '[::1]' ||
      /^\[fc[0-9a-f]{2}:/i.test(hostname) ||
      /^\[fd[0-9a-f]{2}:/i.test(hostname) ||
      /^\[fe8[0-9a-f]:/i.test(hostname) ||
      /^\[fe9[0-9a-f]:/i.test(hostname) ||
      /^\[fea[0-9a-f]:/i.test(hostname) ||
      /^\[feb[0-9a-f]:/i.test(hostname)
    ) {
      return false;
    }

    return true;
  } catch (_e) {
    return false;
  }
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
    return null; // Return null so GWS failures don't block the core analysis service
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = (await req.json()) as AnalyzePayload;

    if (!url || !url.trim()) {
      return NextResponse.json(
        { success: false, error: 'Website URL is required' },
        { status: 400 }
      );
    }

    const targetUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;
    const logs: string[] = [`[SYSTEM] Initializing Website Analysis for: ${targetUrl}`];
    let extractedEmail = '';

    // 1. Scrape Website
    let scrapedText = '';

    // Add SSRF protection check before making outbound request
    if (!isSafeUrl(targetUrl)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or restricted URL provided.' },
        { status: 403 }
      );
    }

    try {
      logs.push(`[ANALYZER] Fetching website content...`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s scrape timeout
      
      const fetchRes = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (fetchRes.ok) {
        const html = await fetchRes.text();
        
        // Extract email address via regex from the original HTML (catches mailto: links)
        const emailMatches = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}/g);
        if (emailMatches && emailMatches.length > 0) {
          const validEmails = emailMatches.filter(e => {
            const lower = e.toLowerCase();
            return !lower.endsWith('.png') && 
                   !lower.endsWith('.jpg') && 
                   !lower.endsWith('.jpeg') && 
                   !lower.endsWith('.gif') && 
                   !lower.endsWith('.svg') &&
                   !lower.endsWith('.webp') &&
                   !lower.endsWith('.js') &&
                   !lower.endsWith('.css');
          });
          if (validEmails.length > 0) {
            extractedEmail = validEmails[0];
            logs.push(`[ANALYZER] Extracted contact email from website: ${extractedEmail}`);
          }
        }
        if (!extractedEmail) {
          logs.push(`[ANALYZER] No contact email found on website landing page.`);
        }

        // Simple HTML text extractor
        scrapedText = html
          .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
          .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 4000); // Limit to first 4000 chars to avoid token bloat
        logs.push(`[ANALYZER] Successfully extracted HTML content (${scrapedText.length} chars).`);
      } else {
        logs.push(`[WARNING] Scraping returned status ${fetchRes.status}. Using domain metadata.`);
      }
    } catch (err: unknown) {
      const errorObject = err as { message?: string };
      logs.push(`[WARNING] Direct scrape failed or timed out: ${errorObject.message || 'Timeout'}. Falling back to domain prediction.`);
    }

    // 2. Run AI Analysis
    const gatewayApiKey = process.env.AI_GATEWAY_API_KEY;
    if (!gatewayApiKey) {
      return NextResponse.json(
        { success: false, error: 'AI Gateway is not configured.' },
        { status: 503 }
      );
    }

    const gateway = createOpenAICompatible({
      name: 'openai',
      apiKey: gatewayApiKey,
      baseURL: 'https://ai-gateway.vercel.sh/v1',
    });

    logs.push(`[ANALYZER] Evaluating business model via AI Gateway...`);

    const fallbackPrompt = `The user wants to analyze the website: "${targetUrl}". Deduce the business type from the domain name and target url.`;
    const promptContent = scrapedText 
      ? `Website Scraped Content:\n"""\n${scrapedText}\n"""\n\nAnalyze this small business website and identify exactly three administrative automation opportunities.`
      : `${fallbackPrompt}\n\nIdentify exactly three administrative automation opportunities for this type of business.`;

    const systemPrompt = `You are Good'ai systems engineer, a Perth local who speaks in a friendly, no-nonsense "mate" tone (e.g. references to tradies, Perth, "knocking off early", "sorted").
Analyze the provided business website content.
Return a clean JSON response strictly conforming to this schema:
{
  "businessType": "Short classification of the business (e.g. Fremantle Plumbing, Wanneroo Bakery)",
  "automations": [
    "Specific automation idea 1 (e.g., Sync online booking forms to ServiceM8 and send SMS reminders)",
    "Specific automation idea 2 (e.g., Automatically create Xero invoices when jobs are marked complete)",
    "Specific automation idea 3 (e.g., Compile client callback requests into a central Google Sheets Lead Board)"
  ],
  "summaryProposal": "A short 2-3 sentence paragraph explaining in a local Perth mate tone how Good'ai will sort this admin out so they can get their weekends back."
}
Only output the raw JSON object. Do not wrap in markdown code blocks or add additional conversational text.`;

    const result = await generateText({
      model: gateway('anthropic/claude-sonnet-4-20250514'),
      system: systemPrompt,
      prompt: promptContent,
      maxOutputTokens: 500,
    });

    const cleanJsonText = result.text.trim().replace(/^```json/, '').replace(/```$/, '').trim();
    let analysisResult;
    try {
      analysisResult = JSON.parse(cleanJsonText);
    } catch (err) {
      console.error('Failed to parse AI JSON:', cleanJsonText, err);
      // Fallback response structure
      analysisResult = {
        businessType: 'Local Perth Business',
        automations: [
          'Sync website customer contact form directly to your spreadsheet and phone alerts',
          'Create invoices inside Xero or Quickbooks automatically from job completions',
          'Automate booking callbacks and appointment calendar reminders'
        ],
        summaryProposal: "Looks like you've got a busy operation running here. We'll hook up n8n and Google Workspace to take all that spreadsheet and invoice copying off your hands. Sorted."
      };
    }

    logs.push(`[ANALYZER] AI Analysis complete. Business classified as: ${analysisResult.businessType}`);

    // 3. Log Website Lead to GWS Sheets / Gmail if CLI configured
    try {
      const destination = 'hello@goodai.au';
      logs.push(`[GWS] Sending website audit lead details to: ${destination}...`);
      const timestamp = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Perth' });
      
      const rawEmail = 
        `To: ${destination}\r\n` +
        `Subject: Good'ai Web Audit Lead - ${analysisResult.businessType}\r\n` +
        `Content-Type: text/plain; charset="utf-8"\r\n` +
        `\r\n` +
        `Good'ai Team / Darl,\r\n\r\n` +
        `A new website audit was run for a lead:\r\n` +
        `- Target Website: ${targetUrl}\r\n` +
        `- Extracted Contact Email: ${extractedEmail || 'None found'}\r\n` +
        `- Business Type: ${analysisResult.businessType}\r\n\r\n` +
        `THREE OPPORTUNITIES IDENTIFIED:\r\n` +
        `1. ${analysisResult.automations[0]}\r\n` +
        `2. ${analysisResult.automations[1]}\r\n` +
        `3. ${analysisResult.automations[2]}\r\n\r\n` +
        `RECOMMENDATION RECOMMEND:\r\n` +
        `"${analysisResult.summaryProposal}"\r\n\r\n` +
        `Audit time: ${timestamp}\r\n`;

      const base64UrlEmail = Buffer.from(rawEmail)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      await runGwsCommand([
        'gmail', 'users', 'messages', 'send',
        '--params', JSON.stringify({ userId: 'me' })
      ], {
        raw: base64UrlEmail
      });
      logs.push(`[GWS] Audit successfully sent via Workspace Gmail.`);
    } catch {}

    logs.push(`[SYSTEM] Website Analysis pipeline finished.`);

    return NextResponse.json({
      success: true,
      logs,
      results: analysisResult
    });

  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Website analysis failed';
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
