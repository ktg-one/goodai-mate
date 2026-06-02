'use client';

import { useState } from 'react';
import StampButton from '@/components/StampButton';
import StampCard from '@/components/StampCard';
import { VoiceAgentHero } from '@/components/voice-agent/VoiceAgentHero';

/**
 * Voice Agent Demo — board-native filing surface.
 * "File another docket" that participates in the single physical mail artifact.
 * Uses Stamp primitives + one red shout. No competing ribbons.
 */
export default function VoiceAgentDemo() {
  const [showInline, setShowInline] = useState(false);

  return (
    <section className="py-16 border-t-2 border-[var(--ink)] bg-[var(--paper)]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-9">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--red)]">
            FILE ANOTHER ON THE BOARD
          </span>
          <h2 className="font-display text-5xl md:text-6xl tracking-[-0.03em] leading-none mt-3 mb-3">
            The Voice Agent.<br />Right here in the docket.
          </h2>
          <p className="max-w-md mx-auto text-xl text-[var(--ink)]/80">
            Speak what&apos;s eating your time. It files straight into the tray above as a real docket.
          </p>
        </div>

        {!showInline ? (
          <StampCard variant="paper" className="p-9 text-center" interactive pin>
            <p className="text-2xl mb-7">
              Ready to knock off early?
            </p>
            <StampButton
              variant="red"
              size="lg"
              onClick={() => setShowInline(true)}
              className="px-10"
            >
              Speak &amp; file another docket →
            </StampButton>
            <p className="mt-4 text-xs font-mono uppercase tracking-[0.16em] text-[var(--ink)]/50">
              20 seconds. Adds straight to the physical in-tray. No sign-up.
            </p>
          </StampCard>
        ) : (
          <div className="space-y-5">
            {/* Board-native inline filing (participates in the single mail artifact) */}
            <VoiceAgentHero supertonicUrl="http://localhost:8000/transcribe" />
            <div className="text-center">
              <StampButton
                variant="paper"
                size="sm"
                onClick={() => setShowInline(false)}
                className="font-mono uppercase tracking-[0.16em]"
              >
                CLOSE FILING SURFACE
              </StampButton>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
