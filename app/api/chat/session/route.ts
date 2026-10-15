import { NextResponse } from "next/server";
import { limitRequest } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

/**
 * POST /api/chat/session
 *
 * Safe endpoint handler for chat sessions. If text chat is not enabled or
 * configured, returns a clean structured status rather than an unhandled 404.
 */
export async function POST(request: Request) {
  const limited = limitRequest(request, "chat-session", { limit: 6, globalLimit: 40, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many chat requests just now. Try again in a minute." },
      { status: 429, headers: { ...NO_STORE, "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  // Text chat is intentionally not mounted on the public site (voice and phone are the active paths).
  return NextResponse.json(
    { error: "Text chat is not available right now. Please call us or use our AI voice assistant." },
    { status: 503, headers: NO_STORE },
  );
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405, headers: NO_STORE },
  );
}
