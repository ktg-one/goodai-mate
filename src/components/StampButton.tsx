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
 * - Polymorphic: href renders <a> for mailto/external links while preserving stamp physics + focus die.
 *
 * Usage (direct import — no barrels):
 *   import StampButton from '@/components/StampButton';
 *   <StampButton variant="red" size="lg" onClick={...}>Tell us your problem</StampButton>
 *   <StampButton variant="red" href="mailto:hello@goodai.au">DROP US A LINE</StampButton>
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
  /** If present, renders as <a> (for mailto etc) while keeping full stamp-btn physics, focus ring, classes. */
  href?: string;
}

const StampButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, StampButtonProps>(
  (
    {
      className = '',
      variant = 'red',
      size = 'md',
      engaged = false,
      fullWidth = false,
      disabled,
      children,
      href,
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

    const isLink = !!href;

    if (isLink) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          data-variant={variant}
          aria-disabled={disabled ? 'true' : undefined}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={rest.type || 'button'}
        className={classes}
        data-variant={variant}
        disabled={disabled}
        aria-pressed={engaged || undefined}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

StampButton.displayName = 'StampButton';

export default StampButton;
