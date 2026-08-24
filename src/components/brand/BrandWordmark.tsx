'use client';

import React from 'react';
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
    />
  );
}

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
      alt="Good'ai mark"
      className={`h-8 w-auto ${className}`}
    />
  );
}

/** Full wordmark lockup */
export function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <img
      src={BRAND_ASSETS.logo.default}
      alt="Good'ai"
      className={`h-9 w-auto ${className}`}
    />
  );
}

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
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      className={`w-auto select-none ${className}`}
      style={style}
    />
  );
}
