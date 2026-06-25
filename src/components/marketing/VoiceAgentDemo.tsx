'use client';

import { useState } from 'react';
import StampButton from '@/components/StampButton';
import StampCard from '@/components/StampCard';
import { ScrollReveal } from '@/components/ScrollReveal';
import { VoiceAgentHero } from '@/components/voice-agent/VoiceAgentHero';
import OutboundCallCard from '@/components/voice-agent/OutboundCallCard';

/**
 * Voice Agent Demo — board-native filing surface.
 * Toggle between speaking directly in browser and getting an outbound callback.
 */
export default function VoiceAgentDemo() {
  const [showInline, setShowInline] = useState(false);
  const [activeTab, setActiveTab] = useState<'mic' | 'phone'>('mic');

  return (
    <section className="min-h-screen py-16 border-t-2 border-[var(--ink)] bg-[var(--paper)]">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal className="text-center mb-9">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--red)]">
            FILE ANOTHER ON THE BOARD
          </span>
          <h2 className="font-display text-5xl md:text-6xl tracking-[-0.03em] leading-none mt-3 mb-3">
            The Voice Agent.<br />Right here in the docket.
          </h2>
          <p className="max-w-md mx-auto text-xl text-[var(--ink)]/80">
            Speak what&apos;s eating your time, or choose an agent to call your phone directly.
          </p>
        </ScrollReveal>

        {!showInline ? (
          <StampCard variant="paper" className="p-9 text-center flex flex-col items-center justify-center" interactive pin>
            <p className="text-2xl mb-7">
              Ready to knock off early?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-xl">
              <StampButton
                variant="red"
                size="lg"
                onClick={() => {
                  setActiveTab('mic');
                  setShowInline(true);
                }}
                className="flex-1"
              >
                Speak in browser (mic) →
              </StampButton>
              <StampButton
                variant="gold"
                size="lg"
                onClick={() => {
                  setActiveTab('phone');
                  setShowInline(true);
                }}
                className="flex-1"
              >
                Have Agent call your phone →
              </StampButton>
            </div>
            <p className="mt-4 text-xs font-mono uppercase tracking-[0.16em] text-[var(--ink)]/50">
              Perth local test dialer. Instant callback via n8n automation.
            </p>
          </StampCard>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Tabs Controller */}
            <div className="flex border-2 border-[var(--ink)] rounded-xs bg-[var(--paper-deep)] p-1.5 shadow-[2px_2px_0_var(--ink)]" role="group" aria-label="Demo mode selection">
              <button
                onClick={() => setActiveTab('mic')}
                aria-pressed={activeTab === 'mic'}
                className={`flex-1 py-2 font-mono text-xs font-bold uppercase tracking-[0.12em] transition-all cursor-pointer rounded-xs outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)] ${
                  activeTab === 'mic'
                    ? 'bg-[var(--ink)] text-[var(--paper)] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]'
                    : 'text-[var(--ink)]/70 hover:bg-[var(--paper)]/50 hover:text-[var(--ink)]'
                }`}
              >
                🎙️ Speak In Browser
              </button>
              <button
                onClick={() => setActiveTab('phone')}
                aria-pressed={activeTab === 'phone'}
                className={`flex-1 py-2 font-mono text-xs font-bold uppercase tracking-[0.12em] transition-all cursor-pointer rounded-xs outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)] ${
                  activeTab === 'phone'
                    ? 'bg-[var(--ink)] text-[var(--paper)] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]'
                    : 'text-[var(--ink)]/70 hover:bg-[var(--paper)]/50 hover:text-[var(--ink)]'
                }`}
              >
                📞 Have Agent Call You
              </button>
            </div>

            {/* Tab Panels */}
            {activeTab === 'mic' ? (
              <VoiceAgentHero supertonicUrl={undefined} />
            ) : (
              <OutboundCallCard />
            )}

            <div className="text-center mt-4">
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
