'use client';

import React from 'react';

/**
 * BrandWordmark
 * Uses the new brand assets from /public/assets/ (SSOT: public/design-system-new + good-ai-design-final.html)
 * Prefers vector for sharpness and correct apostrophe treatment.
 * One of the core "ink on paper" artifacts. Used in hero bar + Why section.
 */
export function BrandWordmark({ className = '' }: { className?: string }) {
  return (
    <img
      src="/assets/wordmark.svg"
      alt="Good'ai"
      className={`h-8 w-auto ${className}`}
      style={{ imageRendering: 'crisp-edges' }}
    />
  );
}

/**
 * BrandMark
 * The icon / swan mark from the new brand kit.
 * (Variants exist: logo-mark-dark.svg, logo-mark-nomouth.svg, wordmark-mark.svg — use when context demands)
 */
export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <img
      src="/assets/logo-mark.svg"
      alt="Good'ai mark"
      className={`h-8 w-auto ${className}`}
    />
  );
}

/**
 * Full lockup (mark + wordmark)
 */
export function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <img
      src="/assets/logo-full.svg"
      alt="Good'ai"
      className={`h-9 w-auto ${className}`}
    />
  );
}

/**
 * StampLetter / ModularLetter
 * Integrates the under-used modular letter SVGs (letter-a.svg, letter-good.svg, letter-i.svg, letter-swan.svg)
 * from public/assets/ for richer wordmark treatments + mail metaphor micro-details.
 * These are hand-drawn ink forms (swan = the bird, good/a/i = custom letterforms). Not font.
 * Use as rubber-stamp imprints on dockets, in-tray filed mail, or accent "filed" moments.
 * Serves the 1978 corkboard: real stamp die hits, slight rot/offset, low-opacity ink transfer.
 * One red accent rule: default to low opacity ink; wrap in .stamp-press-red container for shout.
 * Reduced-motion: static, fully visible tactile imprint (no animation lost).
 * Direct import only.
 */
export function StampLetter({
  which = 'swan',
  className = '',
  style,
}: {
  which?: 'a' | 'good' | 'i' | 'swan';
  className?: string;
  style?: React.CSSProperties;
}) {
  const src = `/assets/letter-${which}.svg`;
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      className={`w-auto select-none ${className}`}
      style={{ imageRendering: 'crisp-edges', ...style }}
    />
  );
}

/**
 * WordmarkMark
 * Compact mark asset (wordmark-mark.svg) for tight spaces or docket imprints.
 */
export function WordmarkMark({ className = '' }: { className?: string }) {
  return (
    <img
      src="/assets/wordmark-mark.svg"
      alt=""
      aria-hidden
      className={`h-auto w-auto ${className}`}
      style={{ imageRendering: 'crisp-edges' }}
    />
  );
}
