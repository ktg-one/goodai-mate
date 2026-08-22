---
name: goodai-brutalist-design
description: Use this skill to generate Good'ai branded interfaces, assets, prototypes, and design-system guidance with a controlled brutalist/direct-mail aesthetic. Good'ai remains the brand source of truth: ink black, brand orange, cool off-white paper, WA Ocean, Fraunces, DM Sans, JetBrains Mono, logo-derived shapes, stamp shadows, and the Good'ai wordmark. Brutalism contributes layout discipline, raw functional structure, explicit component states, accessibility gates, migration notes, and QA checklists.
user-invocable: true
license: MIT-derived guidance from TypeUI brutalism skill; Good'ai brand assets and tokens remain project-owned.
metadata:
  author: ktg-one + adapted TypeUI brutalism guidance
  merged_from:
    - goodai-design
    - brutalism
---

# Good'ai Brutalist Design Skill

## Mission

Create practical, implementation-ready Good'ai visual assets, interfaces, prototypes, and design-system guidance using the existing Good'ai brand system with a restrained brutalist layout grammar.

The final output should feel like **1995 direct mail / back-of-the-Yellow-Pages composition, rebuilt with 2026 software**: hard-edged, useful, loud in the right places, readable, fast, and unmistakably Good'ai.

## Conflict resolution

When rules conflict, resolve them in this order:

1. **Good'ai brand source of truth wins.** Use `good-ai-design-final.html`, `README.md`, and `colors_and_type.css` first.
2. **Good'ai colour, type, logo, casing, and voice are locked.** Do not replace them with the generic brutalism palette or fonts.
3. **Accessibility beats aesthetic aggression.** Brutalist composition must still pass WCAG 2.2 AA and keyboard usability checks.
4. **Performance beats decoration.** No heavy visual effects, shader backgrounds, full-page pointer loops, or blur-heavy effects.
5. **Clarity beats novelty.** If a layout is visually interesting but hard to understand, simplify it.

## Source files to read first

Read these files before generating visual artifacts or production code:

1. `good-ai-design-final.html` — canonical brand book if present.
2. `README.md` — brand index, voice, palette, type, and usage rules.
3. `colors_and_type.css` — drop-in design tokens and type classes.
4. This merged skill file — brutalist composition and QA layer.

## Brand foundations

### Locked palette

Use Good'ai tokens only. Do not import the generic brutalism colours.

| Role | Token | Hex | Usage |
| --- | --- | --- | --- |
| Ink | `--ink` | `#0B0B0B` | Text, borders, blocks, hard edges. |
| Brand orange | `--orange` | `#F25C2B` | CTA, highlight, shout. One orange moment per surface. |
| Orange depth | `--orange-deep` | `#D7591A` | Depth, beak/shadow reference, hover. |
| Paper | `--paper` | `#F8F8F6` | Page canvas. Cool off-white, not warm cream. |
| Paper raised | `--paper-2` / `--paper-deep` | `#EFEEEC` | Panels and sunken surfaces. |
| Border | `--cream-line` | `#CCCAC6` | Hairline dividers. |
| WA Ocean | `--ocean-400` | `#006B8F` | Third brand surface and non-CTA brand blocks. |
| Sticker yellow | `--hi-yellow` | `#FFD400` | Alerts, sale labels, warning stickers. Use sparingly. |
| Trust blue | `--trust-blue` | `#1A3FA8` | Links only where ocean is not suitable. |
| Success | `--ok` | `#2E6E3E` | Success states. |
| Error | `--warn` | `#B53A1F` | Errors and destructive states. |

### Locked typography

Do not use the generic brutalism `Darker Grotesque` font stack. Good'ai type is part of the identity.

| Role | Font | Usage |
| --- | --- | --- |
| Display | `Fraunces` | H1, H2, hero lines, campaign headlines. Use soft/wonk optical character. |
| Sans | `DM Sans` | Body, UI, buttons, forms, labels. |
| Mono | `JetBrains Mono` | Eyebrows, codes, small system labels, marquee strips. |

Use existing type classes from `colors_and_type.css`: `.h1`, `.h2`, `.h3`, `.lede`, `.body`, `.eyebrow`, `.mono`, `.wordmark`.

### Logo and shapes

- Use existing Good'ai logo assets from `assets/` when present.
- Wordmark casing is **Good'ai**: lowercase `ai`, orange apostrophe.
- Do not write `GoodAI`, `Good AI`, `goodai`, or `Good Ai`.
- Shapes come from the logo: circles, half-circles, triangles, and bars.
- Use one ink shape plus one orange shape per composition.
- Do not rebuild or reinterpret the swan mark from loose pieces.

### Stamp shadow

The stamp shadow is the visual signature. Use flat offset shadows only.

```css
box-shadow: var(--shadow-stamp);        /* 3px 3px 0 var(--ink) */
box-shadow: var(--shadow-stamp-orange); /* 3px 3px 0 var(--orange) */
box-shadow: var(--shadow-stamp-deep);   /* 4px 4px 0 var(--ink) */
```

Rules:

- Ink behind paper is the default.
- Orange behind ink is for CTA emphasis.
- Never use blurred drop shadows.
- Never stack ink and orange stamp shadows on the same element.

## Brutalist composition layer

Brutalism here does **not** mean replacing the brand. It means using the Good'ai system with harder structure:

- Heavy borders.
- Exposed grid logic.
- Big type against compact utility details.
- Functional blocks over decorative polish.
- Slightly jarring but still readable spatial tension.
- Direct labels instead of vague marketing language.
- Obvious states and obvious controls.

### Layout rules

- Use grid-first layouts with visible divisions.
- Prefer rectangular cards, strips, blocks, and panels.
- Let one element be oversized: headline, logo mark, CTA card, diagnostic score, or quote block.
- Keep surrounding elements calmer so the loud element has a job.
- Use 8pt spacing rhythm: `4 / 8 / 12 / 16 / 24 / 40 / 64 / 96`.
- Use sharp corners by default: `0–8px` for cards and buttons.
- Use `999px` pills only for chips, counters, dots, and status badges. Never for main buttons.
- Use paper grain as the default background:

```css
background:
  repeating-linear-gradient(0deg, rgba(11,11,11,0.025) 0 1px, transparent 1px 4px),
  var(--paper);
```

### Colour-use rules

- One orange moment per surface maximum.
- Ink can be used heavily.
- Paper is the primary surface.
- WA Ocean can own a full section, but it should not compete with orange CTAs.
- Sticker yellow is for deliberate labels only: `SALE`, `FIX THIS`, `CHECK`, `URGENT`, or equivalent.
- Do not use gradients.
- Do not use purple, teal, neon blue, tomato red, or warm beige unless explicitly requested for a separate non-Good'ai asset.

## Component-level rules

When generating component guidance or code, define anatomy, variants, states, responsive behavior, and edge cases.

### Buttons

**Anatomy:** label, optional left Lucide icon, optional right arrow.

**Primary button**

- Background: `--ink`.
- Text: `--paper`.
- Shadow: `--shadow-stamp-orange`.
- Border: `2px solid var(--ink)`.
- Radius: `0–8px`.
- Hover: translate `-1px -1px`, preserve stamp shadow.
- Active: translate `2px 2px`, remove or reduce stamp offset.
- Focus-visible: `3px solid var(--hi-yellow)` plus `2px` offset.
- Disabled: `--paper-3` background, `--ink-faint` text, no shadow, `not-allowed` cursor.
- Loading: preserve button width; replace icon area with spinner or text label `Working…`.

**Secondary button**

- Background: `--paper`.
- Text: `--ink`.
- Border: `2px solid var(--ink)`.
- Shadow: `--shadow-stamp`.

Do not use pill buttons. Do not use vague labels like `Submit` when the action can be clearer.

### Cards and panels

- Background: `--bg-raised` or `--paper`.
- Border: `2px solid var(--ink)` for primary cards; `1px solid var(--border)` for quiet cards.
- Shadow: stamp shadow only.
- Header: `.eyebrow` or `.mono` label above `.h2`/`.h3`.
- Body: `.body` or `.lede` depending on density.
- Footer: obvious action or metadata row.
- Empty state: include a direct explanation and one next action.
- Overflow: long titles wrap; metadata truncates only when non-essential.

### Forms

- Labels must be visible. Do not rely on placeholder-only labels.
- Inputs use `--paper` background, `2px solid var(--ink)` border, `4px` radius.
- Focus-visible state must be obvious: `--hi-yellow` outline or `--orange` border plus accessible contrast.
- Error states use `--warn`, a text explanation, and `aria-describedby`.
- Helper text uses `--fg-mute`, not low-contrast grey.
- Touch targets must be at least `44px` tall.

### Navigation

- Use direct labels: `Workflows`, `Systems`, `Pricing`, `Proof`, `Contact`.
- Active state must be visible through border, underline, or ink block.
- Mobile nav must be keyboard-operable and escape-closeable.
- Avoid hover-only disclosure.

### Status chips

- Use `.mono` or `.eyebrow` style.
- Radius: `999px` allowed.
- Use clear state text: `Draft`, `Live`, `Needs check`, `Blocked`, `Done`.
- Do not communicate status by colour alone.

### Hero sections

- Use one large Fraunces headline.
- Put one practical promise under it.
- Use one primary CTA and one secondary proof/action.
- Use logo mark or logo-derived shape once.
- Prefer ink block or paper block. Use ocean section only when it has a clear role.
- Avoid generic SaaS glassmorphism, glowing gradients, and abstract robot imagery.

### Service strips and marquees

- Mono labels are allowed.
- Slow marquee is allowed only with reduced-motion fallback.
- Content must remain readable when animation is disabled.

## Accessibility requirements

Must meet WCAG 2.2 AA as a baseline.

Testable acceptance criteria:

- Text contrast meets AA for normal and large text.
- Focus-visible state is present on every interactive element.
- Keyboard users can reach, operate, and exit every interactive control.
- Touch targets are at least `44px` tall/wide where practical.
- Form errors are announced with text and programmatic association.
- Motion respects `prefers-reduced-motion`.
- No information is conveyed by colour alone.
- Landmarks are semantic: `header`, `main`, `section`, `nav`, `footer`, `form`.
- Buttons are buttons; links are links.
- Images have useful alt text or empty alt text when decorative.

If brutalist visual tension conflicts with accessibility, reduce the tension.

## Content and tone standards

Voice: switched-on Aussie mate. Casual, warm, direct, practical.

Rules:

- Use `we`, not `I`, for Good'ai copy.
- Prefer short sentences.
- Name the problem plainly.
- Use `automation`, `system`, and `workflow` instead of jargon.
- Avoid fake enterprise polish.

Forbidden words unless quoting user/source text:

- AI
- artificial intelligence
- machine learning
- neural network
- leverage
- synergy
- optimize
- utilize
- streamline
- disrupt
- hyper-scale

Good examples:

- `We'll handle the boring stuff.`
- `Built in Perth, runs everywhere.`
- `Knock off early on Friday.`
- `Tell us your problem.`

Bad examples:

- `Leveraging synergistic ML pipelines.`
- `AI-powered hyper-scale solutions.`
- `Submit your inquiry below.`
- `Unlock operational excellence.`

## Output behavior

When asked to generate design-system guidance, use this structure:

1. Context and goals.
2. Design tokens and foundations.
3. Component-level rules: anatomy, variants, states, responsive behavior.
4. Accessibility requirements and testable acceptance criteria.
5. Content and tone standards with examples.
6. Anti-patterns and prohibited implementations.
7. QA checklist.

When asked to generate visual artifacts:

- Produce static HTML/CSS when the user wants a previewable artifact.
- Use `colors_and_type.css` tokens when available.
- Copy/import logo assets where available.
- Keep the page performant and dependency-light.
- Include reduced-motion handling for any animation.
- Make it usable before making it clever.

When asked for production code:

- Preserve semantic tokens.
- Avoid raw hex values except inside token definitions.
- Keep components accessible by default.
- Include state variants explicitly.
- Explain migration notes only when existing inconsistent UI is present.

## Anti-patterns and prohibited implementations

Do not use:

- Generic brutalism palette in place of Good'ai colours.
- Darker Grotesque in place of Fraunces/DM Sans/JetBrains Mono.
- Gradient backgrounds.
- Blurred shadows.
- Glassmorphism.
- Purple SaaS hero sections.
- Teal pivots.
- Emoji as UI icons.
- Icon fonts.
- PNG UI icons where SVG/Lucide is appropriate.
- Stock-photo glass towers.
- Robot/brain/circuit-board imagery for generic automation messaging.
- Cursor-hiding effects.
- Full-page mouse-tracking animation loops.
- Layouts that depend on hover only.
- Low-contrast grey-on-paper text.
- Placeholder-only form labels.
- Ambiguous CTA labels.

## Migration notes

When adapting existing brutalist assets to Good'ai:

1. Replace all raw palette values with Good'ai tokens.
2. Replace generic fonts with Fraunces, DM Sans, and JetBrains Mono.
3. Replace blur shadows with stamp shadows.
4. Replace rounded SaaS cards with hard-edged panels.
5. Remove gradients and glass effects.
6. Reduce orange usage to one clear moment per surface.
7. Preserve logo assets; do not redraw the mark.
8. Check copy for forbidden jargon.
9. Add explicit hover, focus-visible, active, disabled, loading, and error states.
10. Run accessibility checks before treating the asset as ready.

## QA checklist

Before final delivery, verify:

- [ ] Good'ai palette is intact: ink, orange, paper, WA Ocean only as the core system.
- [ ] Orange appears once per surface at most.
- [ ] Fonts are Fraunces, DM Sans, and JetBrains Mono.
- [ ] Wordmark casing is `Good'ai`.
- [ ] Logo assets are used as supplied.
- [ ] Stamp shadows are flat offsets with no blur.
- [ ] Corners are sharp except chips/dots.
- [ ] Layout uses visible grid/block logic.
- [ ] CTAs have explicit default, hover, focus-visible, active, disabled, and loading states.
- [ ] Forms have visible labels and accessible error text.
- [ ] Motion respects reduced-motion settings.
- [ ] Text contrast passes WCAG 2.2 AA.
- [ ] Copy avoids forbidden jargon.
- [ ] The result is fast, readable, and useful.
