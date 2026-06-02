'use client';

import React from 'react';

/**
 * StampButton — production brutalist CTA primitive (awwwwards-ui-skills canon)
 *
 * Owns:
 * - Exact 120ms mechanical press physics (hover: -1px/-1px + shadow grow; active: +2px/+2px + collapse)
 * - Variant-aware stamp shadows (red/gold/navy/ink/paper)
 * - 4px radii, 2px ink borders, 4pt scale paddings
 * - Focus-visible: 2px ring (ink or red for shout) matching stamp logic. Keyboard parity guaranteed.
 * - One red shout per surface: use variant="red" sparingly (primary CTA only).
 *
 * Usage (direct import — no barrels):
 *   import StampButton from '@/components/StampButton';
 *   <StampButton variant="red" size="lg" onClick={...}>Tell us your problem</StampButton>
 *
 * engaged: persistent sunk state (e.g. mic listening). Applies active physics + red treatment.
 */

export interface StampButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** red = shout/CTA (one per surface). gold = sticker. navy/ink = blocks. paper = quiet. */
  variant?: 'red' | 'gold' | 'navy' | 'ink' | 'paper';
  size?: 'sm' | 'md' | 'lg';
  /** Engaged = sunk/pressed visual (listening mic, active form). Forces active translate + shadow collapse. */
  engaged?: boolean;
  /** Optional: force full-width */
  fullWidth?: boolean;
}

const StampButton = React.forwardRef<HTMLButtonElement, StampButtonProps>(
  (
    {
      className = '',
      variant = 'red',
      size = 'md',
      engaged = false,
      fullWidth = false,
      disabled,
      children,
      ...rest
    },
    ref
  ) => {
    const sizeClass =
      size === 'lg' ? 'stamp-btn-lg' : size === 'sm' ? 'stamp-btn-sm' : '';

    const engagedClass = engaged ? 'is-engaged' : '';
    const widthClass = fullWidth ? 'w-full' : '';

    // Compose exactly — no arbitrary values inside component
    const classes = [
      'stamp-btn',
      `stamp-btn-${variant}`,
      sizeClass,
      engagedClass,
      widthClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={rest.type || 'button'}
        className={classes}
        disabled={disabled}
        aria-pressed={engaged || undefined}
        data-variant={variant}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

StampButton.displayName = 'StampButton';

export default StampButton;
