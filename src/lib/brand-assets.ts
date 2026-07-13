/**
 * Asset layout:
 *
 * - public/assets/          → logos, icons, sprites & motion art
 * - public/fonts/           → DM Sans + Fraunces (loaded in layout.tsx)
 */

/** Logos & wordmarks — Figma-exported SVGs */
export const BRAND_ASSETS = {
  wordmark: {
    /** For cream / paper backgrounds — navy + coral text */
    dark: '/assets/logo-L.svg',
    /** For navy / dark surfaces — cream + coral text */
    light: '/assets/logo-B.svg',
  },
  logo: {
    default: '/assets/logo-L.svg',
    /** Light-coloured mark for dark surfaces */
    dark: '/assets/logo-B.svg',
  },
  icon: {
    dark: '/assets/ico-D.svg',
    light: '/assets/ico-L.svg',
  },
  /** Decorative swirl vectors (teal + navy) */
  shapes: '/assets/shapes/vec-teal.svg',
  /** Per-theme shape variants */
  shapesOrange: '/assets/shapes/vec-orange.svg',
  shapesSilver: '/assets/shapes/vec-silver.svg',
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