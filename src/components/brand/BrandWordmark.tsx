'use client';

import React from 'react';

/**
 * BrandWordmark
 * Uses the new brand assets from /public/assets/
 * Prefers vector for sharpness and correct apostrophe treatment.
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
