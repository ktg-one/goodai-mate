'use client';

import React from 'react';
import { BRAND_ASSETS, type WordmarkTone, wordmarkSrc } from '@/lib/brand-assets';

/**
 * BrandWordmark — canonical wordmark from public/company-assets/
 */
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

/** Swan / mark lockup */
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

/** Full logo lockup */
export function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <img
      src={BRAND_ASSETS.logo.default}
      alt="Good'ai"
      className={`h-9 w-auto ${className}`}
    />
  );
}

/** Shape language stamp for docket micro-details */
export function BrandShapesStamp({
  className = '',
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <img
      src={BRAND_ASSETS.shapes}
      alt=""
      aria-hidden
      className={`w-auto select-none opacity-30 ${className}`}
      style={style}
    />
  );
}