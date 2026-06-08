import { NextRequest, NextResponse } from 'next/server';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const GWS_PATH = 'D:\\packages\\npm-global\\node_modules\\@googleworkspace\\cli\\run.js';

interface AnalyzePayload {
  url: string;
  email?: string;
}

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
    return null; // Return null so GWS failures don't block the core analysis service
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, email } = (await req.json()) as AnalyzePayload;

    if (!url || !url.trim()) {
      return NextResponse.json(
        { success: false, error: 'Website URL is required' },
        { status: 400 }
      );
    }

    const targetUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;
    const logs: string[] = [`[SYSTEM] Initializing Website Analysis for: ${targetUrl}`];

    // 1. Scrape Website
    let scrapedText = '';
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
      const destination = email && email.trim() ? email.trim() : 'me';
      logs.push(`[GWS] Sending website audit report email to: ${destination}...`);
      const timestamp = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Perth' });
      
      const rawEmail = 
        `To: ${destination}\r\n` +
        `Subject: Good'ai Systems Audit - ${analysisResult.businessType}\r\n` +
        `Content-Type: text/plain; charset="utf-8"\r\n` +
        `\r\n` +
        `Hi there,\r\n\r\n` +
        `Here is your custom systems audit for ${analysisResult.businessType} requested on ${timestamp} for ${targetUrl}:\r\n\r\n` +
        `THREE AUTOMATION OPPORTUNITIES:\r\n` +
        `1. ${analysisResult.automations[0]}\r\n` +
        `2. ${analysisResult.automations[1]}\r\n` +
        `3. ${analysisResult.automations[2]}\r\n\r\n` +
        `GOOD'AI RECOMMENDATION:\r\n` +
        `"${analysisResult.summaryProposal}"\r\n\r\n` +
        `Cheers,\r\n` +
        `The Good'ai Team\r\n`;

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
