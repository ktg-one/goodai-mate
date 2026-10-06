"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/links";

const emptySubscribe = () => () => {};

export function VoiceDemo() {
  const hasWindow = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Check if voice widget is enabled (we can't directly check the launcher state,
  // but we can show appropriate UI based on the expected behavior)
  const showVoiceIndicator = hasWindow;

  return (
    <section className="voice-panel" id="voice" aria-labelledby="voice-title">
      <div>
        <span className="handwritten voice-aside">Give it a ring.</span>
        <h2 id="voice-title">
          A conversation is worth
          <br />
          <em>a thousand buzzwords.</em>
        </h2>
        <p>
          Meet the Good’Ai voice agent. Try a live conversation and get a feel for how an AI
          voice assistant can cover the phone when you are on the tools.
        </p>
        <p className="voice-disclosure">
          Powered by Trillet AI &amp; Grok Realtime audio intelligence. Audio and transcripts are
          processed in real-time. You choose when to start or end the call.
        </p>
      </div>

      <div className="voice-actions">
        <a className="voice-phone" href={PHONE_HREF}>
          <span>Call our AI voice agent directly</span>
          <strong>{PHONE_DISPLAY}</strong>
          <span>Or try it in your browser below.</span>
        </a>

        <button
          type="button"
          className="button cursor-pointer"
          onClick={() => {
            // Trigger the global voice widget - for now just scroll instructions
            // The user can use the floating launcher in the bottom-right corner
            window.dispatchEvent(new CustomEvent("openVoiceWidget"));
          }}
        >
          Try the voice agent <ArrowUpRight size={17} />
        </button>

        {showVoiceIndicator && (
          <div className="rounded-xl border border-brand-paper/20 bg-brand-paper/10 p-3 flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-brand-teal animate-pulse" />
            <span className="text-xs font-mono text-brand-paper">
              Voice assistant available in the bottom-right corner.
            </span>
          </div>
        )}

        <Link href="/contact" className="text-link">
          Want one for your business? <Sparkles size={16} />
        </Link>
      </div>
    </section>
  );
}
