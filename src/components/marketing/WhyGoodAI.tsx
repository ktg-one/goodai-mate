'use client';

import { useRef } from 'react';
import { motion } from 'motion/react';
import { BrandWordmark } from '@/components/brand/BrandWordmark';

/**
 * Why GoodAI?
 * Section from the new design system (public/ directory)
 * Purposeful hard reveal on the core pain + promise.
 */
export default function WhyGoodAI() {
  const sectionRef = useRef<HTMLElement>(null);

  // NOTE: Ribbon bridges are now owned exclusively by HomeClient GSAP mailBoard
  // (aggressive .mail-ribbon + shear/tear). This section is pure content participant
  // in the single physical direct-mail board artifact.

  // Hard mechanical stamp clack entry (canon 120ms cubic 0.23,1,0.32,1 exact per skill/brutalist. No floaty springs.)
  const STAMP_EASE = [0.23, 1, 0.32, 1] as const;
  const left = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.125, ease: STAMP_EASE } },
  } as const;
  const right = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.135, ease: STAMP_EASE, delay: 0.03 } },
  } as const;

  return (
    <section ref={sectionRef} className="py-20 md:py-28 border-t-2 border-[var(--ink)] bg-[var(--paper)] relative overflow-hidden">
      {/* Decorative swirl shape — bottom-right corner */}
      <img src="/assets/shapes/vec-teal.svg" alt="" aria-hidden className="pointer-events-none select-none absolute -bottom-24 -right-24 w-72 opacity-10" />
      {/* Unified physical ribbon bridge handled by parent mailBoard GSAP — no competing motion here */}

      <div className="mx-auto max-w-5xl px-6 relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <BrandWordmark className="h-7" />
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink)]/60">
            Why Good&apos;ai?
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <motion.div
            variants={left}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-70px' }}
          >
            <h2 className="font-display text-5xl md:text-6xl tracking-[-0.03em] leading-none mb-6">
              You didn&apos;t start a business<br />to do <span className="hl">admin</span>.
            </h2>
          </motion.div>

          <motion.div
            className="text-xl text-[var(--ink)]/80 space-y-4"
            variants={right}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <p>
              Most owners we meet are brilliant at what they do — but drowning in the boring stuff.
              Invoicing, chasing, quoting, scheduling, follow-ups… it steals nights and weekends.
            </p>
            <p>
              We built Good&apos;ai so you can speak the problem once and we turn it into systems that actually run.
              You get your time back. We get the work done.
            </p>
            <p className="font-medium text-[var(--ink)]">
              Built in Perth. Works everywhere. <span className="hl-red">Knock off early.</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
