'use client';

import { useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Rise distance in px (default 48). Ignored when `fade`. */
  y?: number;
  /** Stagger the wrapper's direct children instead of the wrapper itself (seconds). */
  stagger?: number;
  /**
   * Opacity-only reveal (no transform). Use on `.pinned-notice` StampCards,
   * whose CSS `transform: rotate()/translate()` board variance must not be
   * overwritten by a GSAP transform.
   */
  fade?: boolean;
}

/**
 * Simple play-once GSAP ScrollTrigger reveal for static marketing content
 * (headings, card grids). Content rises + fades, or fades only (`fade`) for
 * pinned cards. Reduced-motion users get the static content with no hidden
 * start state via `gsap.matchMedia`; the start state is applied before paint
 * inside `useGSAP`, so the reveal never flashes. Transform + opacity only.
 *
 * Section scroll choreography (ribbons, pinned dockets, footer pin) stays owned
 * by HomeClient's mailBoard GSAP context — this is content-level reveal only.
 */
export function ScrollReveal({ children, className, y = 48, stagger, fade = false }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const targets = stagger != null ? el.children : el;
        gsap.from(targets, {
          ...(fade ? {} : { y }),
          autoAlpha: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: stagger ?? 0,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });
    },
    { scope: ref, dependencies: [y, stagger, fade] }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
