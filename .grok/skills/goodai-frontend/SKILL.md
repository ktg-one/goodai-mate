---
name: goodai-frontend
description: >
  Good'ai brutalist/direct-mail frontend: brand tokens, stamp UI, voice hero,
  asset registry, and ESLint gates. Use when building or reviewing UI in
  goodai-mate, fixing design fidelity, prepping demos (ABS), running lint,
  or when the user says /goodai-frontend, goodai frontend, brutalist mail board,
  stamp design, or frontend-design for this project.
---

# Good'ai Frontend

You are the studio lead for **Good'ai** — Perth SME automation, voice-agent-as-hero, 1995 direct-mail rebuilt in 2026. Not generic SaaS. Not AI slop.

## Before any UI code

1. Read `PRODUCT.md` (voice, audience, anti-references).
2. Read `references/tokens.md` and `references/assets.md` in this skill folder.
3. Read `src/lib/brand-assets.ts` — single path registry.
4. Skim `src/app/globals.css` stamp primitives (`.stamp-btn`, `.stamp-card`, `.hl`, `.mail-ribbon`).
5. Run `npm run lint` after edits; fix new issues. Use `npm run lint:fix` for auto-fixables.

## Subject (pinned)

- **Product:** Working voice agent on the homepage — visitors speak admin pain, hear Good'ai reply.
- **Audience:** Time-poor Perth tradies/SME owners ($1M–$30M).
- **Page job:** Relief + quiet confidence. "These people will sort the boring stuff."

## Token system (brief is law)

**Palette:** gold `#F3A62A` · red `#F4442E` · navy `#202C59` · paper `#FFF0D0` · ink `#111111`

**Type:** Fraunces display (WONK once per surface) + DM Sans body + mono eyebrows

**Layout:** Mail-board scroll — hero stamp-box files into stack, ribbon bridges, pinned coloured dockets, navy footer ritual

**Signature:** The live voice conversation inside a brutalist stamped docket — product IS the hero

## Design process (from frontend-design, adapted)

**Pass 1 — plan (silent or 5 lines to user):**
- Colour: name all 5 hex values; one red per surface
- Type: Fraunces + DM Sans + mono — no Inter/Roboto
- Layout: one-sentence section rhythm (hero → why → promise → docket flow → systems → CTA)
- Signature: voice demo + mail filing metaphor
- Risk: mechanical GSAP ribbon/docket physics — justified by direct-mail subject

**Pass 2 — self-critique:**
- Would this pass for another client unchanged? → revise
- Numbered `01` markers without real sequence? → sticker labels (`PILOT`, `STICKER · SALE`)
- Cream card on cream paper? → navy/gold/red card
- Dev lab chrome visible in demo? → hide backend/voice pickers behind toggle

**Pass 3 — build surgical:**
- Reuse `StampButton`, `StampCard`, `BrandWordmark`, `CHARACTER_ASSETS`
- CSS vars only — no raw hex in components
- `prefers-reduced-motion`: static docket board, no GSAP thrash

## Component map

| Need | Use |
|------|-----|
| CTA | `StampButton variant="red"` — one per surface |
| Section card | `StampCard variant="navy|gold|ink"` |
| Logo bar | `BrandWordmark tone="dark"` on paper |
| Avatar lip-sync | `TalkingCharacter` + `CHARACTER_ASSETS` — keep `<img>` |
| Motion board | `HomeClient` GSAP ribbons + `.pinned-notice` |

## Copy rules

- We, not I. Short sentences. Plain Australian English.
- Active voice on controls: "Press to speak", not "Submit inquiry"
- Forbidden in product copy: leverage, synergy, AI-powered, streamline, optimize
- Errors: what happened + what to do — no apologies

## ESLint contract

Config: `eslint.config.mjs`

| Script | When |
|--------|------|
| `npm run lint` | Every UI PR |
| `npm run lint:fix` | After bulk edits |
| `npm run lint:strict` | Pre-demo / pre-merge (zero warnings) |

Notable rules:
- `@next/next/no-img-element` off only for brand JPGs + character frame swap
- `no-restricted-syntax` warns on raw `/assets/` or `/company-assets/` literals outside `brand-assets.ts`

## Pre-ship checklist

- [ ] Tokens from CSS vars, not hex in TSX
- [ ] Logos via `BRAND_ASSETS`; sprites via `CHARACTER_ASSETS`
- [ ] `public/assets/` untouched (character animation)
- [ ] One red shout per major surface
- [ ] Coloured cards on paper canvas
- [ ] Reduced motion path works
- [ ] `npm run lint` clean (or `lint:strict` for demos)
- [ ] Voice hero works without exposing dev backend picker in default view

## Anti-patterns (instant fail)

- Deleting `public/assets/` (character frames live here)
- SVG wordmarks when JPG canonical exists in company-assets
- shadcn default slate/white cards
- Glass blur, mesh gradients, Lucide-as-decoration everywhere
- Hype copy, numbered fake process steps, emoji UI icons