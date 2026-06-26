# Good'ai — Design System

> Using new tech and know-how to **equip the willing, educate the ignorant and aid the weak** — to raise up together as one, close the gap, reform positively and look past the violence; towards the stars. Finally breaking the damn cycle.

Good'ai is a Perth-based business automation company that helps small-to-medium businesses (~$1M–$30M turnover) get the boring stuff off their plate. The promise: *knock off early, spend time with the kids — we'll sort the systems.*

This design system is **direct-mail / high-contrast**: a warm-cream canvas carrying high-contrast **coloured cards** — navy, gold, red and black blocks with cream-on-colour type, hard edges, and flat "stamp" shadows. It reads like a confident notice pinned to a board, not a soft SaaS landing page.

---

## What's in this project

| File / Folder | What it is |
| --- | --- |
| `colors_and_type.css` | **Source of truth.** All design tokens — colours, fonts, spacing, radii, stamp shadows, semantic type classes. Drop into any HTML file. |
| `assets/` | Brand mark + wordmark SVGs. |
| `preview/` | Self-contained card files that populate the Design System tab. |
| `ui_kits/web/` | Marketing-site UI kit — hero, chat intake, lead-capture card, feature strip, marquee, footer. |
| `SKILL.md` | Skill definition; lets this folder be used as a Claude Code skill. |
| `README.md` | You are here. |

---

## THE KEY PRINCIPLE

**Paper background, high-contrast COLOURED cards, white-on-colour text.**

White cards on a cream page read as "an unfinished draft you forgot to colour in." So:

- Default card/section surfaces **carry colour** — navy, gold, red, or black fills with cream/white (or black-on-gold) text.
- Cream / paper-raised is the **rare quiet exception**, never the default.
- Keep brand restraint per block: **one accent moment** inside each coloured surface (usually the red CTA).
- The page background stays **warm cream** — don't colour the whole background; colour the **cards and blocks**.

---

## CONTENT FUNDAMENTALS

How Good'ai talks. This is canon.

### Voice
- **A switched-on mate who gets business.** Not a salesperson, not a robot. Casual, warm, direct — like a tradie who happens to understand systems.
- **"We" and "us"** — never "I". The reader is talking to the team, not a person.
- **Australian, Perth-flavoured.** "No worries", "sort it", "knock off early", "the boring stuff".
- **Match their energy.** If they're frustrated, acknowledge it before solving.
- **The vibe:** *"Knock off early, spend time with the kids — we'll sort the boring stuff."*

### Tone
- **Short sentences. No waffle. Get to the point.**
- Sentence-case everywhere except the wordmark. Headlines are not Title Case.
- Contractions on (we'll, you've, can't, that's). Commas, em-dashes, the occasional period mid-sentence for rhythm.
- One question at a time. Never bombard.

### Forbidden
- ❌ "AI", "artificial intelligence", "machine learning", "neural network" — say **automation**, **system**, **workflow**, **process** instead. (Audience is suspicious of tech hype.)
- ❌ Corporate speak: "leverage", "synergy", "optimize", "utilize", "streamline".
- ❌ Bullet points or numbered lists in conversational copy. Talk in sentences like a human.
- ❌ Specific savings claims or timelines without scoping first.
- ❌ Over-promising; over-selling.

### Examples (good → bad)

| ✅ Good'ai | ❌ Not Good'ai |
| --- | --- |
| *"Tell us your problem."* | *"Submit your inquiry below."* |
| *"Business automations, sorted."* | *"AI-powered workflow optimization."* |
| *"We'll figure out how to fix it."* | *"Our team will leverage cutting-edge AI to streamline your processes."* |
| *"Drop your details and we'll scope it out — no obligation, no runaround."* | *"Schedule a discovery call with one of our experts."* |
| *"Nice one. We'll be in touch within 24 hours."* | *"Thank you for your submission. A representative will follow up shortly."* |

### Emoji
**No emoji in product surfaces.** The wordmark's red apostrophe, the gold sticker chips, and the logo do the friendliness lifting. Emoji feel cheap next to Fraunces and break the calm.

### Casing
- **Wordmark:** `Good'ai` — lowercase `ai`, **red apostrophe**. Never `GoodAI`, never `Good AI`, never `goodai`.
- **Headlines:** sentence case.
- **Buttons:** sentence case ("Get a callback", not "GET A CALLBACK").
- **Eyebrows / mono labels:** UPPERCASE with `0.16em` tracking. *Only* place all-caps appears.

---

## VISUAL FOUNDATIONS

### Colour — the five core colours
| Token | Hex | Job |
| --- | --- | --- |
| `--navy` | `#202C59` | Dark surfaces, headlines, dark card fills, links |
| `--ink` | `#111111` | Text, borders, hard edges |
| `--paper` | `#FFF0D0` | Page canvas — **warm cream** |
| `--gold` | `#F3A62A` | Coloured panels / blocks / sticker labels |
| `--red` | `#F4442E` | Primary CTA / shout accent |

Deeper steps: `--gold-deep #D98E1C`, `--red-deep #D8331F`, `--navy-deep #161E3D`, `--paper-deep #F6E2B8`. Success `#2E6E3E`, Error `#D8331F`.

Colour the **cards**, not the whole page. One accent (usually the red CTA) per surface — never all five loud at once.

**Legacy aliases** (kept so older files don't break): `--orange*` → reds, `--ocean*` → navies, `--hi-yellow` → gold. Prefer the new `--gold / --red / --navy` names in new work.

### Type
- **Display:** Fraunces (variable — opsz, weight, plus SOFT + WONK axes). Hero, H1/H2. Italic + WONK = the emphasis lift — **one phrase per surface**.
- **Sans:** DM Sans (300–800). Body, UI, buttons, labels.
- **Mono:** JetBrains Mono. Eyebrows, code, the feature marquee, the Perth/WA tag.

### Spacing
4-pt grid: `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80 / 96`. Default page padding `clamp(24px, 5vw, 64px)`. Cards breathe — minimum `18–24px` interior padding.

### Radii — sharp is the default
`xs:4 / sm:8 / md:12 / lg:18 / pill:999`. **Cards and buttons stay sharp (0–8px).** Pills (`999px`) are the labelled exception — **chips, status dots, counters only. No pill buttons.** The logo container is square: the mark is the radius.

### Shadow — flat "stamp" only
A solid offset, **never a blur**. Match the stamp colour to the surface job:
- `--shadow-stamp` — `3px 3px 0 var(--ink)` (default)
- `--shadow-stamp-orange` — red stamp, for the CTA
- `--shadow-stamp-ocean` — navy stamp, for blocks
- `--shadow-stamp-deep` — `4px 4px 0 var(--ink)`

No drop-blur glows, no soft elevation ramps. The stamp **is** the signature.

### Backgrounds
- **Plain warm-cream paper** is the default. No gradient, no shader (an optional 1px static hairline texture at ~2.5% is fine; nothing animated).
- **Navy / gold / red / black blocks** carry the content as coloured cards.
- **Paper-deep tint** (`--bg-sunken`) for the occasional quiet sectioned strip.

### Animation
- Easing: `cubic-bezier(0.23, 1, 0.32, 1)`.
- Durations: `120ms` hover/press, `300ms` state changes, `600ms` entrance fades.
- **Fades and slide-ups** only. No bounces, no spin, no parallax. Marquee scroll is fine (slow loop).
- **Reduced-motion respected** — static fallbacks for the marquee and hero.

### Hover / press states
- **Buttons:** background one step darker (`--red → --red-deep`), `translate(-1px, -1px)`, stamp grows by 1px. On press, `translate(2px, 2px)` and the stamp drops to none — like pressing a real stamp down.
- **Cards / chips:** lift `translate(-2px, -2px)`, stamp grows.
- **Links:** colour is navy; deepens to `--navy-deep`, underline thickens to 2px.

### Borders
**2px ink** is the house border on every stamped surface. Hairlines use `--cream-line #E0C690` on cream. Never coloured borders mid-elevation; coloured edges only on focus rings.

### Imagery vibe
Warm, sunlit, real. Perth tradies, shopfronts, hands on tools, a laptop on a shop counter. **No stock-photo glass towers, no purple-gradient AI-art.** Where photography isn't supplied, UI kits use placeholder cards.

---

## ICONOGRAPHY

- **UI icons → Lucide-style.** Stroke-based, ~2px stroke, 24×24 viewBox, `currentColor`. No filled icons, no icon font, no emoji-as-icon, no unicode glyphs (`›` `✓`), no PNG icons. SVG only.
- **Brand mark & shape primitives → bespoke SVGs in `assets/`.** Geometric, slightly playful, never cute.
- Icon colour **matches its surface**: cream/white on navy/red/black, ink on gold/cream.
- When something Lucide doesn't cover comes up, draw it: 2px stroke, rounded caps, `--ink` outlines, an occasional **flat `--gold` / `--navy` fill**. No gradients in icons.

---

## INDEX

- **`colors_and_type.css`** — drop-in tokens + semantic classes (`.h1`, `.h2`, `.h3`, `.lede`, `.body`, `.eyebrow`, `.mono`, `.wordmark`).
- **`assets/`** — brand mark + wordmark SVGs.
- **`preview/`** — design-system cards (palette, type specimens, components, brand, spacing).
- **`ui_kits/web/`** — full marketing-site recreation: `index.html` (landing → chat → lead capture), `Hero.jsx`, `ChatThread.jsx`, `LeadCard.jsx`, `Footer.jsx`, `primitives.jsx`.
- **`SKILL.md`** — skill manifest for Claude Code.

---

## Caveats & open questions

- **Fonts:** DM Sans + JetBrains Mono (Google Fonts) + **Fraunces** (local variable file with SOFT + WONK axes) for display. If there's a real wordmark font, drop it into `fonts/` and replace the `@font-face` in `colors_and_type.css`.
- **Logo:** the real `good'ai` wordmark (`assets/logo-wordmark.svg`) sits in the landing top bar and footer; the standalone **`g` mark** (`assets/logo-g.svg`) is the icon. Both are black + brand red (`#F4442E`). Swap the `<img src>` to rebrand.
- **Imagery** is described but not provided — UI kits use placeholder cards where photography would go.
