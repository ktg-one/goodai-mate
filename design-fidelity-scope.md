# Design Fidelity Scope: Implement Good'ai Brutalist Direct-Mail Style Verbatim on the Live Site

## Context
The authoritative design style lives in `public/`:
- `public/` (SSOT tokens in `colors_and_type.css`, previews, ui_kits, assets)
- `Good'ai Brutalist Skill.html` (full spec + examples)
- `good-ai-design-final.html`
- Exported HTML mocks in `export/` and `public/export/`
- `preview/` components

This is a **brutalist / direct-mail** grammar: warm cream (`--paper #FFF0D0`) canvas, high-contrast **coloured cards/blocks** (navy, gold, red, ink), flat "stamp" shadows (3px 3px 0), hard 2px ink borders, sharp radii (0-8px), Fraunces display with WONK for exactly one emphasis phrase per surface, DM Sans body, JetBrains Mono mono.

**Key principle**: Colour the *cards*, not the whole page. One accent (usually red CTA) per surface. "1995 Yellow Pages direct mail rebuilt with 2026 software" — useful, hard-edged, readable, fast, unmistakably local Perth tradie mate.

The current Next.js site (src/) has partial adoption (some stamp shadows, paper bg, wonk, .mail-ribbon CSS, BrandWordmark using /assets/wordmark.svg, some pinned dockets). But it is **not following verbatim**:
- Ribbons use custom CSS approximation instead of the `wave-ribbon.png` asset + exact design styles.
- GSAP mail-board logic exists in HomeClient.tsx (ribbons with --tape-progress/shear/flutter, docket pinning variance, hero filing, footer clack) but is not producing the expected mechanical "1978 corkboard being rifled" effect on the running site (user reports "no gsap").
- Letter assets (letter-*.svg), multiple logo-mark variants, logo-full, etc. are under-utilized.
- Components, buttons, cards, voice UI, docket flow, footer ritual do not match the ui_kits/ and preview/ examples exactly.
- Missing full mechanical animation fidelity, one-red discipline enforcement, stamp press tactility, reduced-motion static artifacts, etc.

Recent dev run confirms the branding assets (wordmark) are partially live, but the full direct-mail mail-board choreography (ribbons, stamps, dockets) is not matching the design system.

## Goal
Bring the live site (http://localhost:3000 and production) to **verbatim fidelity** with the design system in public/. The site must look and behave like the design HTML mocks and previews when the GSAP mail stack is active.

The five "top front end detailed workers" (equipped via goodai-award-configuration with impeccable, awwwards-animations, awwwards-ui-skills, gsap-awwwwards-website, gsap-framer-scroll-animation) will execute this.

## Scope (What to do)
1. **Audit current vs design system (all 5 workers participate)**
   - Compare live site (run dev) against `public/Good'ai Brutalist Skill.html`, `ui_kits/web/`, `preview/`, `colors_and_type.css`, asset usage.
   - Document gaps in a shared artifact (e.g. DESIGN-GAPS.md).
   - Focus areas: colors/tokens, type (Fraunces WONK), stamp shadows, buttons/cards, voice UI, ribbons, docket/pinned notices, footer ritual, one-red-per-surface, voice copy tone.

2. **Implement / fix the mail-board GSAP mechanical system (primary for GSAP-equipped workers)**
   - Make .mail-ribbon, .mail-ribbon-tear, pinned dockets, hero stamp-box, footer exactly match the design spec's ribbon and stamp behaviors.
   - Use `public/assets/wave-ribbon.png` as the source for ribbon visuals (or exact CSS recreation that matches the image when static).
   - Full scroll-driven GSAP (or hybrid GSAP+Framer) for:
     - Ribbon advance / shear / flutter / tear physics (perforated tape ratchet, harmonic wind).
     - Non-uniform docket pinning (real rots, offsets, edge wear, dog-ears using letter/mark assets where appropriate).
     - Hero "filing" descent into the stack (grain, shadows, board depth).
     - Final footer clack ritual (wonk max, red stamp slam, ribbon tear).
   - 60fps refs-only, no layout thrash.
   - Perfect reduced-motion static fallbacks that still sell the 1978 docket board (all stamps, pins, rots, perforations visible).
   - Drive CSS vars (`--tape-progress`, `--tape-shear`, `--tape-flutter`, `--wonk`, `--stamp-depth`, `--final-clack`, `--global-settle`, etc.) exactly as expected by the current globals.css + design.

3. **Integrate public/assets/ verbatim across the site**
   - Full use of wordmark.svg / logo-mark*.svg / logo-full.svg in all appropriate places (top bars, sections, dockets, footer).
   - Integrate letter-a.svg, letter-good.svg, letter-i.svg, letter-swan.svg for custom wordmark compositions, stamped elements, or micro-details in dockets/ribbons.
   - Use wave-ribbon.png as the definitive ribbon asset (in hero voice section, mail ribbons, design signal areas).
   - Other logos (logo-g*, v1/v2) for historical or specific UI moments if they fit the spec.
   - Ensure crisp-edges, proper alt, sizing, and participation in stamp shadows / motion.

4. **Enforce design system rules site-wide (impeccable + awwwards-ui-skills focus)**
   - One red accent / shout per surface/block.
   - Exactly one Fraunces WONK emphasis phrase per major surface (via .hl or direct).
   - Stamp shadows only (flat offset, no blurs) — match --shadow-stamp, --shadow-stamp-orange, --shadow-stamp-deep.
   - Button / card / input / badge primitives match ui_kits and preview exactly (hover/press = real stamp press: translate + shadow change).
   - Hard edges, 2px ink borders, sharp radii, 4pt grid.
   - Voice copy tone and anti-hype rules from the spec.
   - Direct imports, no barrels.
   - Accessibility (WCAG 2.2 AA, keyboard, reduced motion).

5. **Polish & production (all workers)**
   - 60fps everywhere.
   - Hybrid GSAP + Framer where it adds declarative life without fighting timelines.
   - Update any drift in globals.css or components to match public/ design system tokens and examples.
   - Ensure the Voice Agent hero remains the pure functional product demo; the mail board below "files" the conversation state physically.
   - Test on dev + build. Provide before/after or patch diffs.
   - If design system itself needs tiny updates to match shipped reality, propose them (but prioritize site → design).

## Out of Scope (for this scope)
- New pages or major feature additions beyond fidelity.
- Backend / voice transcription fixes (unless they block visual fidelity).
- Full re-architecture — surgical upgrades to match the existing mail-board intent.

## Success Criteria (verifiable)
- Running the site (npm run dev) produces a visual and interaction experience that matches the screenshots/previews in public/ and the components in the Brutalist Skill HTML when scrolled.
- Ribbons, dockets, stamps, hero filing, footer clack behave with the exact mechanical "1978 mail board" tactility described and shown in the design (GSAP-driven or equivalent).
- All assets from public/assets/ are used in the live React components where the design calls for them.
- One-red, WONK, stamp-shadow, paper/ink/card grammar followed on every surface.
- Reduced-motion users see a complete, attractive static docket board with all artifacts.
- No "AI" hype; voice matches the spec.
- Lighthouse / perf / a11y not regressed; 60fps on the mail stack.

## Process for the Five Workers
- Each worker is equipped with one top skill (see goodai-award-configuration).
- All must read this scope + the full design system (start by opening/reading the HTML files, colors_and_type.css, ui_kits, previews, assets).
- Use the running dev server (or start it) + browser tools / screenshots to see current state vs design.
- Work in parallel but coordinate on shared artifacts (e.g. DESIGN-GAPS.md, implementation patches).
- Prefer concrete production edits over long analysis.
- End with clear verdicts + any remaining gaps.
- Strongly recommended: after the five finish, synthesize into one GSD phase / plan using a planner agent.

## References (must read)
- public/README.md
- public/colors_and_type.css
- public/Good'ai Brutalist Skill.html (full spec)
- public/Good'ai Brutalist Skill.html and standalone
- public/ui_kits/web/ (Hero, primitives, etc.)
- public/preview/ (all component and type cards)
- public/assets/ (all SVGs/PNGs)
- Current site: src/components/HomeClient.tsx (mail stack), VoiceAgentHero.tsx, globals.css (mail-ribbon, stamp, wonk rules), BrandWordmark.tsx, PRODUCT.md

This scope gives the agents a clear, verifiable target to follow.

---
Created to give the equipped frontend workers a concrete plan to follow for design fidelity + GSAP mail-board implementation.