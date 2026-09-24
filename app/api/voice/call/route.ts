import { NextResponse } from "next/server";
import { createCall, type TrilletRoomDetails } from "@trillet-ai/web-sdk/server";

export const dynamic = "force-dynamic";

/**
 * Backend Voice Agent Session Minting Route
 *
 * Secure pattern: Generates a short-lived LiveKit room token via Trillet AI server SDK
 * without exposing the Trillet API key or sensitive credentials to the browser.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const apiKey = process.env.TRILLET_API_KEY;
    const defaultAgentId = process.env.NEXT_PUBLIC_TRILLET_AGENT_ID || "68f6b3cb-darling-good";
    const agentId = body.agentId || defaultAgentId;

    if (!apiKey) {
      // If no server API key is configured, tell the client to use public call mode
      return NextResponse.json(
        {
          mode: "public",
          message: "No server TRILLET_API_KEY configured. Falling back to public call mode.",
          agentId,
          workspaceId: process.env.NEXT_PUBLIC_TRILLET_WORKSPACE_ID || "",
        },
        { status: 200 }
      );
    }

    const roomDetails: TrilletRoomDetails = await createCall({
      apiKey,
      agentId,
      mode: "voice",
      variables: body.variables || {
        source: "goodai-studio-web",
        clientPhone: body.phone || undefined,
        callerName: body.name || undefined,
      },
    });

    return NextResponse.json({ mode: "authenticated", ...roomDetails });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to initialize voice session";
    console.error("[Trillet Voice API Error]:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

