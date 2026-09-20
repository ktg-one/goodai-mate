"use client";

import { useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/links";
import { TrilletVoiceWidget } from "./TrilletVoiceWidget";

export function VoiceDemo() {
  const [enabled, setEnabled] = useState(false);

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
          Meet the Good’Ai voice agent. Try a live conversation and get a feel for what a 24/7 AI
          assistant brings to your trade or local business.
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

        {!enabled ? (
          <button
            type="button"
            className="button cursor-pointer"
            onClick={() => setEnabled(true)}
          >
            Try the voice agent <ArrowUpRight size={17} />
          </button>
        ) : (
          <div className="rounded-xl border border-brand-paper/20 bg-brand-paper/10 p-3 flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-brand-teal animate-pulse" />
            <span className="text-xs font-mono text-brand-paper">
              Voice assistant active in the bottom-right corner.
            </span>
          </div>
        )}

        {enabled && (
          <TrilletVoiceWidget
            agentName="Darling Good"
            autoOpen={true}
          />
        )}

        <a href="#suss-the-fuss" className="text-link">
          Want one for your business? <Sparkles size={16} />
        </a>
      </div>
    </section>
  );
}
