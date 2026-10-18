"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { m, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/links";

const emptySubscribe = () => () => {};

export function VoiceDemo() {
  const hasWindow = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const shouldReduceMotion = useReducedMotion();

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
          Meet the Good&apos;Ai voice agent. Try a live conversation and get a feel for how an AI
          voice assistant can cover the phone when you are on the tools.
        </p>
        <p className="voice-disclosure text-xs opacity-80 leading-relaxed">
          Notice: Voice input is streamed ephemerally via ElevenLabs global infrastructure for real-time demonstration purposes only. Do not disclose sensitive personal, financial, or confidential information. Voice streams are processed ephemerally and not retained for biometric identification.
        </p>
      </div>

      <div className="voice-actions">
        <m.a
          className="voice-phone block"
          href={PHONE_HREF}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.02, y: -2 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <span>Call our AI voice agent directly</span>
          <strong>{PHONE_DISPLAY}</strong>
          <span>Or try it in your browser below.</span>
        </m.a>

        <m.button
          type="button"
          className="button cursor-pointer"
          whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -2 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => {
            // Trigger the global voice widget - for now just scroll instructions
            // The user can use the floating launcher in the bottom-right corner
            window.dispatchEvent(new CustomEvent("openVoiceWidget"));
          }}
        >
          Try the voice agent <ArrowUpRight size={17} />
        </m.button>

        {showVoiceIndicator && (
          <m.div
            className="rounded-xl border border-brand-paper/20 bg-brand-paper/10 p-3 flex items-center gap-3"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <m.span
              className="flex h-2.5 w-2.5 rounded-full bg-brand-teal"
              animate={shouldReduceMotion ? undefined : { scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
              transition={{
                duration: 2.0,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-xs font-mono text-brand-paper">
              Voice assistant available in the bottom-right corner.
            </span>
          </m.div>
        )}

        <m.div
          whileHover={shouldReduceMotion ? undefined : { x: 3 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href="/contact" className="text-link inline-flex items-center gap-1.5">
            Want one for your business? <Sparkles size={16} />
          </Link>
        </m.div>
      </div>
    </section>
  );
}
