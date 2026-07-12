/**
 * Asset layout (do not conflate):
 *
 * - public/company-assets/  → canonical logos & wordmarks (BrandWordmark, nav, footer)
 * - public/assets/          → runtime sprites & motion art (TalkingCharacter frames, ribbons)
 * - public/fonts/           → DM Sans + Fraunces (loaded in layout.tsx)
 *
 * When deleting legacy public/ folders, keep company-assets AND assets.
 */

/** Logos & wordmarks — company-assets only */
export const BRAND_ASSETS = {
  wordmark: {
    /** For cream / paper backgrounds */
    dark: '/brand/wordmark.png',
    /** For navy / dark surfaces */
    light: '/brand/wordmark-light.png',
  },
  logo: {
    default: '/company-assets/Logo.jpg',
    dark: '/company-assets/logo-dark2.jpg',
  },
  shapes: '/company-assets/wordmark-shapes.jpg',
} as const;

/** Character animation & UI motion art — assets folder (keep for lip-sync / avatar frames) */
export const CHARACTER_ASSETS = {
  darl: {
    idle: '/assets/claude-static.png',
    closed: '/assets/claude-closed.png',
  },
  gemFrame: (frame: number) => frame === 1 ? '/assets/gem-close.png' : '/assets/gem-open.png',
  gemLoop: '/assets/gem-loop.mp4',
  waveRibbon: '/assets/wave-ribbon.png',
} as const;

export type WordmarkTone = 'dark' | 'light';

export function wordmarkSrc(tone: WordmarkTone = 'dark'): string {
  return BRAND_ASSETS.wordmark[tone];
}