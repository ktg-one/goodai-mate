import { NextResponse } from "next/server";
import { limitRequest } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };
const DEFAULT_LFM_OMNI_URL = "https://ktg-nas.blowfish-snares.ts.net/v1/chat/completions";

const SYSTEM_PROMPT = [
  "You are Goodie, the friendly, straight-talking Perth AI assistant for Good'Ai (goodai.au).",
  "Good'Ai builds five practical services for Western Australian businesses:",
  "1. AI voice agents (answers calls, books jobs, takes clear messages when tradies or teams are on the tools).",
  "2. Business automation (routes enquiries, job cards, and follow-ups without manual copy-pasting).",
  "3. Custom AI assistants (searches internal SOPs, notes, and job history in seconds).",
  "4. AI integration projects (connects Xero, ServiceM8, calendars, and CRMs cleanly).",
  "5. AI opportunity audit (starts with the problem first before touching a tool).",
  "Our ethics: humans stay in control with stop authority, no mystery boxes, grounded answers, and least data needed.",
  "Never invent prices, compliance certifications, or fake guarantees. Scope is agreed before we build.",
  "Keep replies warm, concise (1 to 3 short sentences), and natural when spoken aloud. Invite them to use the contact form (/contact) or call (08) 6102 3566 if they want us to look at their business.",
].join(" ");

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

/**
 * POST /api/chat/session
 *
 * Connects the browser voice/chat widget to self-hosted Liquid LFM3-Omni-2B
 * running on the Good'Ai Proxmox NAS (gai-llama). Supports both text and
 * multimodal WAV audio input (input_audio).
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
  const audioBase64 =
    typeof body.audioBase64 === "string" && body.audioBase64.length < 2_500_000
      ? body.audioBase64.trim()
      : "";
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

  if (!rawMessage && !audioBase64) {
    return NextResponse.json(
      { error: "Say or type a question so Goodie can reply." },
      { status: 400, headers: NO_STORE },
    );
  }

  const userContent = audioBase64
    ? [
        { type: "input_audio", input_audio: { data: audioBase64, format: "wav" } },
        {
          type: "text",
          text: rawMessage || "Respond helpfully and concisely to what the caller just said.",
        },
      ]
    : rawMessage;

  const endpoint = process.env.LFM_OMNI_URL?.trim() || DEFAULT_LFM_OMNI_URL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "LFM3-Omni-2B",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...history,
          { role: "user", content: userContent },
        ],
        max_tokens: 160,
        temperature: 0.4,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Goodie is waking up the engine. Try again in a moment or call us." },
        { status: 502, headers: NO_STORE },
      );
    }

    const data = (await res.json()) as {
      model?: string;
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "G'day! Tell us what admin is eating your week on our contact page and we'll help sort it out.";

    return NextResponse.json(
      {
        ok: true,
        model: data.model || "LFM3-Omni-2B",
        reply,
      },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json(
      { error: "Could not reach LFM3 Omni right now. Please try again or call us." },
      { status: 503, headers: NO_STORE },
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: true, model: "LFM3-Omni-2B", status: "ready" },
    { status: 200, headers: NO_STORE },
  );
}
