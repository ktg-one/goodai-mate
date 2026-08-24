# Good'ai design tokens (SSOT)

## Palette — five core colours

| Name | Hex | Job |
|------|-----|-----|
| gold | `#F3A62A` | mustard panels, sticker labels |
| red | `#F4442E` | one shout per surface — CTA only |
| navy | `#202C59` | dark cards, headlines on colour |
| paper | `#FFF0D0` | warm cream canvas |
| ink | `#111111` | text, borders, stamp shadows |

Semantic aliases in CSS: `--orange` → red, `--ocean-400` → navy.

## Type

| Role | Family | Where |
|------|--------|-------|
| Display | Fraunces (SOFT + WONK) | h1/h2, `.wonk-line`, one WONK phrase per surface |
| Body | DM Sans | UI, paragraphs, buttons |
| Utility | system mono | eyebrows, mono labels, receipt strips |

Load from `public/fonts/` via `layout.tsx` next/font/local.

## Stamp physics

- Flat shadows only: `3px 3px 0 var(--ink)` — never blur
- Buttons/cards: `.stamp-btn*`, `.stamp-card-*` in `globals.css`
- Hover: `translate(-1px,-1px)` + shadow grow
- Active: `translate(2px,2px)` + shadow collapse
- Corners: 4px default; pills only for chips

## Highlights

```html
<span class="hl">gold sticker</span>
<span class="hl-red">coral shout</span>
<span class="hl-navy">navy block</span>
```

## Hard bans

- White/cream card on cream canvas (use **coloured** navy/gold/red cards)
- Numbered section markers `01 / 02` unless real sequence
- Glassmorphism, gradients, purple/teal SaaS palette
- Multiple red accents on one surface
- Raw `/assets/` or `/company-assets/` paths in components (use `brand-assets.ts`)