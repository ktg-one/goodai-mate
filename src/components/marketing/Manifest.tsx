'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

/**
 * Manifest
 * The Good'ai belief / mission section (from new design system)
 * Hard stamp-in reveal for the core promise — brutalist, no easing softness.
 */
export default function Manifest() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // NOTE: All ribbon bridges unified under HomeClient GSAP mailBoard.
  // This component is a pure content layer in the single physical mail board.

  // Single hard stamp for the statement block
  const manifestVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 380, damping: 30, mass: 1 },
    },
  } as const;

  return (
    <section ref={sectionRef} className="py-16 border-t-2 border-[var(--ink)] bg-[var(--paper)]">
      {/* Unified physical ribbon bridge (GSAP mail-ribbon) owned by parent board — no local ribbon motion */}
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--red)] mb-4">
          THE MANIFEST
        </div>

        <motion.h2
          className="font-display text-4xl md:text-5xl tracking-[-0.03em] leading-none mb-8"
          variants={manifestVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          We exist so tradies, makers and small operators can <span className="hl">go home on time</span>.
        </motion.h2>

        <motion.div
          className="max-w-2xl mx-auto text-xl text-[var(--ink)]/80 space-y-4"
          variants={manifestVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: 0.06 }} // slight follow for rhythm
        >
          <p>
            Not to build another dashboard you have to manage.<br />
            Not to sell you more software you have to learn.
          </p>
          <p>
            We listen. We sort the <span className="hl-red">boring stuff</span>. You run the business you actually wanted.
          </p>
          <p className="font-medium text-[var(--ink)]">
            <span className="hl">Knock off early</span>. Spend time with the kids.<br />We&apos;ll handle the systems.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
