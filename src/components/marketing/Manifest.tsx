'use client';

import { useRef } from 'react';
import { motion } from 'motion/react';

/**
 * Manifest
 * Hard stamp-in reveal for the core promise — brutalist, no easing softness.
 * From design system specimens. One .hl + one .hl-red per surface max.
 * Participates in mail board via parent ribbons (no local motion competing).
 */
export default function Manifest() {
  const sectionRef = useRef<HTMLElement>(null);

  const manifestVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.12, ease: [0.23, 1, 0.32, 1] } // exact stamp clack
    },
  } as const;

  return (
    <section ref={sectionRef} className="py-20 md:py-28 border-t-2 border-[var(--ink)] bg-[var(--paper)]">
      {/* Ribbon bridge above owned by HomeClient GSAP mailBoard */}

      <div className="mx-auto max-w-5xl px-6 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--red)]">THE PROMISE</span>

        <motion.h2
          className="font-display text-5xl md:text-6xl tracking-[-0.03em] leading-none mt-3 mb-8"
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
            Knock off early. Spend time with the kids.<br />We&apos;ll handle the systems.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
