import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { NextResponse } from "next/server";
import { limitRequest } from "@/lib/rate-limit";

import { PHONE_DISPLAY, LEAD_EMAIL, SURVEY_URL } from "@/lib/links";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };
const DEFAULT_LFM_OMNI_BASE_URL = "https://ktg-nas.blowfish-snares.ts.net/v1";
const DEFAULT_LFM_OMNI_MODEL = "LFM3-Omni-2B";

const SYSTEM_PROMPT = [
  "ROLE & VOICE:",
  "You are Goodie, the switched-on Perth mate who runs the front door at Good'Ai (goodai.au, founded by Kevin Tan in Perth, Western Australia).",
  "Tagline: 'Knock off early — we'll sort the boring stuff.' / 'Good work. More life.'",
  "Speak like a warm, practical Australian mate who understands small business and trades — casual, direct, short sentences, always say 'we' and 'us' (never 'I').",
  "Never use corporate jargon ('leverage', 'synergy', 'optimize', 'streamline') and never use bullet lists.",
  "",
  "FACTS ABOUT GOOD'AI (USE ONLY THESE FACTS):",
  `- Location: Perth, WA (working across Australia). Phone & live voice demo: ${PHONE_DISPLAY}. Email: ${LEAD_EMAIL}. Enquiry page: ${SURVEY_URL}.`,
  "- How we work: 01 Find friction -> 02 Make it work -> 03 Make it yours. We look at the real problem first before picking a tool.",
  "- What we build for small businesses and tradies:",
  "  1) Multilingual phone receptionists (answers missed calls in a natural Aussie voice or switches languages automatically, screens the job, texts a clean English summary, and books into reserved calendar windows).",
  "  2) Photo-enquiry and support assistants (collects job or kitchen/site photos, spots missing labels or details upfront, and hands the team a clean job card).",
  "  3) Business automation and integrations (connects calendars, Google Workspace, Xero, ServiceM8, Tradify, and job workflows so you stop copy-pasting at night).",
  "  4) Fast, one-off custom websites and brand kits (zero monthly website retainer; once paid for, the client owns 100% of the code and design).",
  "  5) Opportunity audits and Digital Health Checks (maps where calls, quotes, or admin are leaking before building anything).",
  "- Private stack: This chat runs on our own private self-hosted Perth hardware (The Nest), keeping data local.",
  "- Pricing rule: We never publish or guess prices in chat ('We quote after we understand the work'). Every build has a written scope and fixed quote agreed before work starts.",
  "- Boundaries: Humans always stay in control of quoting, trade safety, and final bookings. Never invent client names, testimonials, savings numbers, or compliance certificates.",
  "",
  "EXAMPLES OF HOW YOU REPLY (FOLLOW THIS EXACT STYLE — 2 TO 3 SHORT SENTENCES, NO LISTS):",
  "User: What do you guys actually do?",
  `Assistant: G'day! We help Perth tradies and small businesses get off the phone and knock off on time by sorting out the repetitive admin. We build custom phone receptionists that answer missed calls, photo-enquiry assistants that gather job details upfront, plus clean one-off websites and workflow automations. Tell us what's eating your week at ${SURVEY_URL} or give our live line a ring on ${PHONE_DISPLAY}.`,
  "User: How much does a phone system or website cost?",
  `Assistant: No worries — we don't do cookie-cutter price tiers because a solo tradie needs a very different setup to a ten-person office. We have a quick yarn first to see what's actually slowing you down, then give you a clear fixed quote in writing before you commit to anything (and our websites have zero monthly retainer). Pop a note into ${SURVEY_URL} or call ${PHONE_DISPLAY} and we'll scope it out with you.`,
  "User: Can it handle callers who don't speak English or need to send photos?",
  `Assistant: Too easy — both our phone receptionist and website enquiry assistant are multilingual, so they can chat in the caller's language, collect the right job photos, and still text you a clean summary in English. You stay in full control of the final quote and schedule. Give ${PHONE_DISPLAY} a buzz to test the voice line or drop your details at ${SURVEY_URL}.`,
].join("\n");

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

function resolveOmniBaseUrl() {
  const raw = process.env.LFM_OMNI_URL?.trim() || DEFAULT_LFM_OMNI_BASE_URL;
  return raw.replace(/\/chat\/completions\/?$/i, "");
}

/**
 * POST /api/chat/session
 *
 * Connects the browser private chat widget to the self-hosted Liquid model
 * running on the Good'Ai Proxmox NAS (gai-llama), via AI SDK.
 */
export async function POST(request: Request) {
  const limited = limitRequest(request, "chat-session", { limit: 15, globalLimit: 90, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests just now. Try again in a minute." },
      { status: 429, headers: { ...NO_STORE, "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400, headers: NO_STORE });
  }

  const rawMessage = typeof body.message === "string" ? body.message.trim().slice(0, 800) : "";
  const history: ChatTurn[] = Array.isArray(body.history)
    ? body.history
        .filter(
          (m: unknown): m is ChatTurn =>
            Boolean(m) &&
            typeof m === "object" &&
            ((m as ChatTurn).role === "user" || (m as ChatTurn).role === "assistant") &&
            typeof (m as ChatTurn).content === "string",
        )
        .slice(-6)
        .map((m: ChatTurn) => ({ role: m.role, content: m.content.slice(0, 600) }))
    : [];

  if (!rawMessage) {
    return NextResponse.json(
      { error: "Say or type a question so Goodie can reply." },
      { status: 400, headers: NO_STORE },
    );
  }

  const endpoint = resolveOmniBaseUrl();
  const modelId = process.env.LFM_OMNI_MODEL?.trim() || DEFAULT_LFM_OMNI_MODEL;
  const provider = createOpenAICompatible({
    name: "private-lfm",
    baseURL: endpoint,
    apiKey: process.env.LFM_OMNI_API_KEY,
  });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const result = await generateText({
      model: provider(modelId),
      system: SYSTEM_PROMPT,
      messages: [...history, { role: "user", content: rawMessage }],
      maxOutputTokens: 160,
      temperature: 0.4,
      abortSignal: controller.signal,
    });
    const reply =
      result.text.trim() ||
      "G'day! Tell us what admin is eating your week on our contact page and we'll help sort it out.";

    return NextResponse.json(
      {
        ok: true,
        model: modelId,
        reply,
      },
      { headers: NO_STORE },
    );
  } catch (error) {
    console.error("Private AI chat session failed", error);
    return NextResponse.json(
      { error: "Could not reach LFM3 Omni right now. Please try again or call us." },
      { status: 503, headers: NO_STORE },
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const modelId = process.env.LFM_OMNI_MODEL?.trim() || DEFAULT_LFM_OMNI_MODEL;
  return NextResponse.json(
    { ok: true, model: modelId, status: "ready" },
    { status: 200, headers: NO_STORE },
  );
}
