'use client';

import React from 'react';

/**
 * StampCard / ColouredSurface — production brutalist coloured block primitive
 *
 * - Variant-aware stamp shadows (navy/gold/ink/red/paper) that fully participate on hover/press
 * - Exact 22px padding (4pt scale, matches design system card specimens)
 * - 4px radii, 2px ink borders
 * - Hover: translate(-2px,-2px) + shadow grow. Active/press: collapse.
 * - engaged: sunk/letterpress state for pinned dockets.
 * - pin: docket-pin variant (pairs with .pinned-notice + GSAP rot/offset vars for real board variance).
 * - .hl / .hl-red / .hl-navy supported inside (contrast preserved by variant rules)
 * - One accent moment per surface (gold number or single red CTA inside). NO FLOAT.
 *
 * Direct import:
 *   import StampCard from '@/components/StampCard';
 *   <StampCard variant="gold" pin interactive><h3>...</h3><p>...</p></StampCard>
 */
export interface StampCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** navy/gold/ink/red = coloured surfaces. paper = quiet exception. */
  variant?: 'navy' | 'gold' | 'ink' | 'red' | 'paper';
  /** If true, applies interactive lift/press states (default true for marketing cards) */
  interactive?: boolean;
  /** Optional tighter padding for compact blocks */
  compact?: boolean;
  /** Engaged = sunk/pressed visual (docket pinned state). Forces active translate + shadow collapse. */
  engaged?: boolean;
  /** Enables docket-pin mechanical variance (real board rot/offset via CSS vars or GSAP). Adds pinned-notice base. */
  pin?: boolean;
}

const StampCard = React.forwardRef<HTMLDivElement, StampCardProps>(
  (
    {
      className = '',
      variant = 'paper',
      interactive = true,
      compact = false,
      engaged = false,
      pin = false,
      children,
      ...rest
    },
    ref
  ) => {
    const interactiveClass = interactive ? 'interactive' : 'pointer-events-none';
    const compactClass = compact ? 'p-4' : '';
    const engagedClass = engaged ? 'is-engaged' : '';
    const pinClass = pin ? 'pinned-notice' : '';

    const classes = [
      'stamp-card',
      `stamp-card-${variant}`,
      interactiveClass,
      compactClass,
      engagedClass,
      pinClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classes}
        data-variant={variant}
        data-engaged={engaged || undefined}
        data-pin={pin || undefined}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

StampCard.displayName = 'StampCard';

export default StampCard;
