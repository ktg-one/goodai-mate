'use client';

import { useRef } from 'react';
import StampCard from '@/components/StampCard';
import { ScrollReveal } from '@/components/ScrollReveal';

// Pure content participant in unified HomeClient mailBoard GSAP.
// All ribbon + pinned card physical choreography owned at board level for one artifact feel.
// No local motion here — prevents hook/import conflicts and keeps single source of truth for mail stack.

/**
 * Systems
 * Brutalist coloured surfaces using <StampCard> primitive (no ad-hoc motion/static shadows).
 * One red shout per gold surface (the number). .hl on headline. Zero "AI" hype words — locked to Perth mate voice.
 */
export default function AISolutions() {
  const sectionRef = useRef<HTMLElement>(null);

  const solutions = [
    {
      title: 'Voice Agent Intake',
      desc: 'Speak your problems. We turn them into real automations. No forms, no jargon.',
      variant: 'navy' as const,
      sticker: 'PILOT',
      stickerClass: 'sticker-label sticker-label-gold',
    },
    {
      title: 'Admin & Invoicing Systems',
      desc: 'Quotes, jobs, invoices and follow-ups that run themselves after you speak them once.',
      variant: 'gold' as const,
      sticker: 'STICKER · SALE',
      stickerClass: 'sticker-label sticker-label-red',
    },
    {
      title: 'Workflow Automation',
      desc: 'Xero, MYOB, ServiceM8, Tradify, Cliniko — we connect the tools you already use.',
      variant: 'ink' as const,
      sticker: 'LIVE',
      stickerClass: 'sticker-label sticker-label-gold',
    },
    {
      title: 'Ongoing Relief',
      desc: 'Not a one-off setup. A partner that keeps the boring stuff off your plate every week.',
      variant: 'gold' as const,
      sticker: 'PERTH MATE',
      stickerClass: 'sticker-label sticker-label-navy',
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 md:py-28 border-t-2 border-[var(--ink)] bg-[var(--paper)]">
      {/* Unified physical ribbon bridge (GSAP .mail-ribbon) + non-uniform pinned variance now controlled from HomeClient mailBoard.
          This section participates as coloured docket layers on the single brutalist mail artifact. */}

      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal className="mb-10">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--red)]">THE SYSTEMS</span>
          <h2 className="font-display text-5xl md:text-6xl tracking-[-0.03em] leading-none mt-3">
            Real <span className="hl">systems</span>.<br />Not another app.
          </h2>
          <p className="mt-3 max-w-md text-xl text-[var(--ink)]/80">Speak the mess once. We turn it into the docket that actually runs.</p>
        </ScrollReveal>

        {/* Cards fade in staggered via GSAP (opacity-only — preserves each card's
            CSS --rot/--ox/--oy pinned board variance, which a transform would clobber). */}
        <ScrollReveal className="grid md:grid-cols-2 gap-6" stagger={0.09} fade>
          {solutions.map((sol, index) => (
            <StampCard 
              key={index} 
              variant={sol.variant} 
              interactive 
              pin
              className="pinned-notice"
              style={{
                '--rot': `${[-1.1, 1.8, -0.6, 2.0][index % 4]}deg`,
                '--ox': `${[-3, 4, -2, 3][index % 4]}px`,
                '--oy': `${[2, -3, 4, -2][index % 4]}px`,
              } as React.CSSProperties}
            >
              <span className={`${sol.stickerClass} mb-3`}>{sol.sticker}</span>
              <h3 className="font-bold text-3xl mb-4 tracking-[-0.015em]">{sol.title}</h3>
              <p className="opacity-90 text-lg leading-snug">{sol.desc}</p>
            </StampCard>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
