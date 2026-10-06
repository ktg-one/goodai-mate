import { NextResponse } from "next/server";
import { createCall, type TrilletRoomDetails } from "@trillet-ai/web-sdk/server";
import { limitRequest } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

function allowedAgentIds(): Set<string> {
  const ids = new Set<string>();
  const primary = process.env.NEXT_PUBLIC_TRILLET_AGENT_ID?.trim();
  if (primary) ids.add(primary);
  const extra = process.env.TRILLET_ALLOWED_AGENT_IDS?.split(",") ?? [];
  for (const id of extra) {
    const t = id.trim();
    if (t) ids.add(t);
  }
  return ids;
}

/**
 * Backend Voice Agent Session Minting Route
 *
 * Secure pattern: Generates a short-lived LiveKit room token via Trillet AI server SDK
 * without exposing the Trillet API key to the browser. Fail closed when misconfigured.
 */
export async function POST(request: Request) {
  try {
    const limited = limitRequest(request, "voice", { limit: 6, globalLimit: 40, windowMs: 60_000 });
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Too many voice sessions just now. Try again shortly." },
        { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
      );
    }

    const body = await request.json().catch(() => ({}));
    const apiKey = process.env.TRILLET_API_KEY;
    const allow = allowedAgentIds();
    const requested =
      typeof body.agentId === "string" && body.agentId.trim()
        ? body.agentId.trim().slice(0, 80)
        : process.env.NEXT_PUBLIC_TRILLET_AGENT_ID?.trim() || "";

    if (!apiKey) {
      return NextResponse.json(
        { error: "Voice sessions are not available right now." },
        { status: 503 },
      );
    }

    // Empty allowlist = reject everything (fail closed). Never pass through client agentId.
    if (!requested || !allow.has(requested)) {
      return NextResponse.json({ error: "Unknown voice agent." }, { status: 400 });
    }

    const phone =
      typeof body.phone === "string" ? body.phone.trim().slice(0, 40) : undefined;
    const name =
      typeof body.name === "string" ? body.name.trim().slice(0, 80) : undefined;

    const roomDetails: TrilletRoomDetails = await createCall({
      apiKey,
      agentId: requested,
      mode: "voice",
      variables: {
        source: "goodai-studio-web",
        clientPhone: phone || undefined,
        callerName: name || undefined,
      },
    });

    return NextResponse.json({ mode: "authenticated", ...roomDetails });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to initialize voice session";
    console.error("[Trillet Voice API Error]:", message);
    return NextResponse.json(
      { error: "Could not start the voice session. Try again or call us." },
      { status: 500 },
    );
  }
}
