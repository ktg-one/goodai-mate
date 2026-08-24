'use client';

import { useState } from 'react';
import StampButton from '@/components/StampButton';
import StampCard from '@/components/StampCard';
import { ScrollReveal } from '@/components/ScrollReveal';
import { VoiceAgentHero } from '@/components/voice-agent/VoiceAgentHero';

/**
 * Voice demo — speak in the browser. Callback lives in CallLoopDemo (honest queue, no fake RINGING).
 */
export default function VoiceAgentDemo() {
  const [open, setOpen] = useState(false);

  return (
    <section className="min-h-screen py-16 border-t-2 border-[var(--ink)] bg-[var(--paper)]">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal className="text-center mb-9">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--red)]">
            Talk to it
          </span>
          <h2 className="font-display text-5xl md:text-6xl tracking-[-0.03em] leading-none mt-3 mb-3">
            The Voice Agent.<br />Right here.
          </h2>
          <p className="max-w-md mx-auto text-xl text-[var(--ink)]/80">
            Speak what&apos;s eating your time. Mic in the browser — no call charges.
          </p>
        </ScrollReveal>

        {!open ? (
          <StampCard variant="paper" className="p-9 text-center flex flex-col items-center justify-center" interactive pin>
            <p className="text-2xl mb-7">Ready to knock off early?</p>
            <StampButton variant="red" size="lg" onClick={() => setOpen(true)}>
              Speak in browser →
            </StampButton>
            <p className="mt-4 text-xs font-mono uppercase tracking-[0.16em] text-[var(--ink)]/50">
              Want a ring instead? Leave a number below.
            </p>
          </StampCard>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            <VoiceAgentHero supertonicUrl="http://localhost:8000/transcribe" />
            <div className="text-center mt-4">
              <StampButton
                variant="paper"
                size="sm"
                onClick={() => setOpen(false)}
                className="font-mono uppercase tracking-[0.16em]"
              >
                Close
              </StampButton>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
