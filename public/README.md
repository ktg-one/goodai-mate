# Good'AI — Design System

> Using new tech and know-how to **equip the willing, educate the ignorant and aid the weak** — to raise up together as one, close the gap, reform positively and look past the violence; towards the stars. Finally breaking the damn cycle.

Good'AI is a Perth-based business automation company that helps small-to-medium businesses (~$1M–$30M turnover) get the boring stuff off their plate. The promise: *knock off early, spend time with the kids — we'll sort the systems.*

The brand book is a 1995-direct-mail / "back-of-the-Yellow-Pages" composition system running on 2026 software. Ink black structure, brand orange as the shout, cool off-white paper, WA Ocean as the third brand surface. No gradients, no drop-blurs, no all-three-loud-at-once.

---

## What's in this folder

| File / Folder | What it is |
| --- | --- |
| `good-ai-design-final.html` | **Source of truth.** The brand book (v1.0) — every token, scale, shape rule and component spec lives here. If anything else disagrees with this file, this file wins. |
| `colors_and_type.css` | Drop-in tokens — colour, font, spacing, radii, shadow, plus semantic type classes (`.h1`, `.h2`, `.lede`, `.body`, `.eyebrow`, `.mono`, `.wordmark`). |
| `assets/` | Brand mark + wordmark (`goodai-logo.png`, `goodai-logo.svg`, `logo-mark.svg`, etc.). |
| `fonts/` | Self-hosted Fraunces variable font (SOFT/WONK/opsz/wght axes). DM Sans + JetBrains Mono come from Google Fonts. |
| `preview/` | Self-contained card files for the Design System tab (palette, type, shapes, components). |
| `ui_kits/web/` | Marketing-site UI kit — hero, chat intake, lead-capture, services strip, footer. |
| `SKILL.md` | Skill manifest. Lets this folder be used as a Claude Code skill. |
| `README.md` | You are here. |

---

## Brand at a glance

### Palette — three colours do most of the work

| Token | Hex | Role |
| --- | --- | --- |
| `--ink` | `#0B0B0B` | Text, borders, hard edges. Use without fear. |
| `--orange` | `#F25C2B` | The Good'AI shout. **One per surface, maximum.** |
| `--paper` | `#F8F8F6` | Page canvas — cool off-white, *not* warm cream. |
| `--ocean-400` | `#006B8F` | WA Ocean. Third brand colour — brand surfaces, links. |

Supporting (used sparingly): `--orange-deep #D7591A`, `--orange-tint #FBD8C7`, `--paper-deep #EFEEEC`, `--cream-line #CCCAC6`, `--hi-yellow #FFD400` (alerts / "SALE!"), `--trust-blue #1A3FA8` (hyperlinks), `--ok #2E6E3E` (success), `--warn #B53A1F` (errors).

### Type

- **Display:** Fraunces soft wonk (variable, opsz 144, weight 500–700). Self-hosted from `fonts/`. Slightly slabby, soft, optical. Used for hero, page H1/H2.
- **Sans:** DM Sans (300–800). Body, UI, buttons, labels.
- **Mono:** JetBrains Mono. Eyebrows, code, the service marquee, the Perth/WA tag.

### Voice

A **switched-on Aussie mate.** Casual, warm, direct — like a tradie who happens to understand systems. "We" not "I". Short sentences. No waffle.

**Forbidden vocab:** "AI", "artificial intelligence", "machine learning", "neural network", "leverage", "synergy", "optimize", "utilize", "streamline", "disrupt", "hyper-scale". Say **automation**, **system**, **workflow** instead.

| ✅ Good'AI | ❌ Not Good'AI |
| --- | --- |
| *"We'll handle the boring stuff."* | *"Leveraging synergistic ML pipelines."* |
| *"Built in Perth, runs everywhere."* | *"AI-powered hyper-scale solutions."* |
| *"Knock off early on Friday."* | *"Disrupt the future of work."* |
| *"Tell us your problem."* | *"Submit your inquiry below."* |

### Shapes

From the logo: circles, half-circles, triangles, bars. One ink shape + one orange shape per composition. Flat fills only — no gradients, no 3D, no bevel, no drop-glow.

### Stamp shadow — the brand's visual signature

Flat offset shadow, never a blur:

- `--shadow-stamp: 3px 3px 0 var(--ink)` — ink behind paper. Default.
- `--shadow-stamp-orange: 3px 3px 0 var(--orange)` — orange behind ink (CTAs).
- `--shadow-stamp-deep: 4px 4px 0 var(--ink)` — heavier (hero, ad surfaces).

Ink behind paper. Orange behind ink. **Never both.**

### Spacing & radii

- **8-pt base:** `4 / 8 / 12 / 16 / 24 / 40 / 64 / 96`.
- **Sharp by default.** Buttons & cards: `0–8px`. Inputs & tags: `4px`. Soft surfaces: `8px`. **Pill `999px` only for chips and dots — never buttons.**

### Backgrounds

- **Paper with a 1px horizontal grain** (`repeating-linear-gradient(0deg, rgba(11,11,11,0.025) 0 1px, transparent 1px 4px)`) is the default page surface.
- **Ink block** for hero/footer.
- **Ocean block** for the "third brand surface" treatment.
- **No WebGL shaders.** No animated noise overlays. No `cursor: none`. No full-page mouse-tracking RAF loops. The original site lagged — keep things fast.

### Animation

- Easing: `cubic-bezier(0.23, 1, 0.32, 1)`.
- Durations: `120ms` hover/press, `300ms` state change, `600ms` entrance fade.
- Fades and slide-ups only. No bounces, no spin, no parallax. Marquee scroll on services strip is fine (slow, 30s loop).
- **Reduced-motion respected** — static fallbacks for marquee and any animated hero.

### Casing

- **Wordmark:** `Good'ai` — lowercase `ai`, orange apostrophe. Never `GoodAI`, never `Good AI`, never `goodai`.
- **Headlines & buttons:** sentence case. ("Get started", not "GET STARTED" or "Get Started".)
- **Eyebrows / mono labels:** UPPERCASE with `0.16em` tracking. The **only** place all-caps appears.

### Iconography

- **UI icons → Lucide.** 2px stroke, 24×24 viewBox, `currentColor`. Stroke-based, no fills.
- **Brand mark → bespoke SVGs in `assets/`.**
- **No icon fonts, no emoji-as-icon, no unicode-glyph-as-icon, no PNG icons.** SVG only.

### Imagery

Warm, sunlit, real. Perth tradies, Perth shopfronts, hands on tools, old laptops on a shop counter. **No stock-photo glass towers, no purple-gradient AI-art.** B&W with a warm duotone (ink shadows + paper highlights) is the house treatment; full-colour photography is fine when it's earned. Slight grain (4% noise) on photo blocks.

---

## INDEX

- **`good-ai-design-final.html`** — the brand book (source of truth).
- **`colors_and_type.css`** — drop-in tokens + semantic type classes.
- **`assets/`** — logo files. Canonical mark: `goodai-logo.png`.
- **`fonts/`** — self-hosted Fraunces variable.
- **`preview/`** — design-system cards (palette, type specimens, components).
- **`ui_kits/web/`** — full marketing-site recreation.
  - `index.html` — integrated demo.
  - `Hero.jsx`, `ChatThread.jsx`, `LeadCard.jsx`, `ServicesMarquee.jsx`, `Footer.jsx`, `primitives.jsx`.
- **`SKILL.md`** — skill manifest for Claude Code.

---

## Brand pivot — what changed

The original `globals.css` defined a "Perth Disruptor" palette: near-black surfaces, hidden cursor, animated lensblur shader, single orange accent. That site lagged. The brand book pivots to a paper-feeling, performant system anchored on **Ink + Orange + cool Paper**, with **WA Ocean** as the third surface. The orange survives — sharper, used once per surface. No teal, no warm cream, no tomato, no sunshine. Just the three.
