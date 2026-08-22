'use client';

import React from 'react';
<<<<<<< HEAD

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
=======
import { BRAND_ASSETS, type WordmarkTone, wordmarkSrc } from '@/lib/brand-assets';

/** BrandWordmark — Figma-exported SVG wordmark. tone='dark' = for light/cream bg. tone='light' = for navy bg. */
export function BrandWordmark({
  className = '',
  tone = 'dark',
}: {
  className?: string;
  tone?: WordmarkTone;
}) {
  return (
    <img
      src={wordmarkSrc(tone)}
      alt="Good'ai"
      className={`h-8 w-auto ${className}`}
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
    />
  );
}

<<<<<<< HEAD
/**
 * BrandMark
 * The icon / swan mark from the new brand kit.
 * (Variants exist: logo-mark-dark.svg, logo-mark-nomouth.svg, wordmark-mark.svg — use when context demands)
 */
export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <img
      src="/assets/logo-mark.svg"
=======
/** Icon mark only — use variant='dark' on dark/navy surfaces */
export function BrandMark({
  className = '',
  variant = 'default',
}: {
  className?: string;
  variant?: 'default' | 'dark';
}) {
  const src =
    variant === 'dark' ? BRAND_ASSETS.logo.dark : BRAND_ASSETS.logo.default;
  return (
    <img
      src={src}
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
      alt="Good'ai mark"
      className={`h-8 w-auto ${className}`}
    />
  );
}

<<<<<<< HEAD
/**
 * Full lockup (mark + wordmark)
 */
export function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <img
      src="/assets/logo-full.svg"
=======
/** Full wordmark lockup */
export function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <img
      src={BRAND_ASSETS.logo.default}
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
      alt="Good'ai"
      className={`h-9 w-auto ${className}`}
    />
  );
}

<<<<<<< HEAD
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
=======
/** Decorative swirl vector — teal+navy. Use as corner/background ornament. */
export function BrandShapesStamp({
  className = '',
  style,
  theme = 'teal',
}: {
  className?: string;
  style?: React.CSSProperties;
  theme?: 'teal' | 'orange' | 'silver';
}) {
  const src =
    theme === 'orange' ? BRAND_ASSETS.shapesOrange :
    theme === 'silver' ? BRAND_ASSETS.shapesSilver :
    BRAND_ASSETS.shapes;
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      className={`w-auto select-none ${className}`}
<<<<<<< HEAD
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
=======
      style={style}
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
    />
  );
}
