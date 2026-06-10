# DESIGN-GAPS.md — Good'ai Brutalist Fidelity Audit (impeccable worker)

**Date:** 2026-06-03 (milestone updates during 5-worker swarm)
**Scope:** design-fidelity-scope.md verbatim. Prioritize mail-board (ribbons, dockets, stamps, GSAP "1978 corkboard rifled", assets, one-red/WONK/stamp-shadow).
**Process:** Gate0 (npx skills list + context.mjs + references/brand+audit+animate+overdrive+polish), read all SSOT (Brutalist Skill.html, colors_and_type.css, ui_kits/web/*, preview/*, PRODUCT.md, assets/), dev run + playwright screenshots (audit-*-clean.png tall/hero + design-cards.png), visual read via read_file, code grep/read (HomeClient, globals, VoiceAgentHero, BrandWordmark, StampButton, marketing/*), console/HTTP checks, detect.mjs.

## Current State (post clean dev :3000)
- Dev clean (kills, .next purge, detached start). GET 200, no CSSSyntaxError in fresh log.
- Screenshots: audit-current-tall-clean.png (full mail stack visible: swan logo top, stamp-box hero w/ canvas visualizer + letter-swan + logo-mark-nomouth, wave-ribbon.png thin colored line as ribbon, sections, dockets, footer), audit-hero-clean.png, audit-design-cards.png (for ref).
- globals.css: 177 lines, starts with ribbon rules using wave-ribbon.png verbatim as bg + overlays for --tape-*/shear/flutter/GSAP. Additional clack rules at end. (Previous long version had syntax error at ~1321 blocking render; now focused.)
- Ribbons: .mail-ribbon + .mail-ribbon-tear use png + CSS perf/shear. GSAP in HomeClient drives vars.
- Assets: wave-ribbon.png integrated (ribbons). letter-swan.svg + logo variants in hero stamp-box. wordmark in nav. Under-use of letter-a/good/i .
- Mail board: .mail-board, GSAP useGSAP for hero filing (--global-settle, --hero-filing-progress, --board-depth), ribbons (3 independent advance/shear/flutter sin/cos), dockets (pinned-notice w/ rots/ox/oy, scrub settle, stamp-depth, wear data), footer (wonk-line --wonk scrub, final-clack, pin, red stamp).
- VoiceAgentHero: Framer useScroll for filing to CSS var + Visualizer canvas. Stamp clack signal.
- Stamp primitives: StampButton (variants red/gold etc, engaged, stamp physics translate+shadow, one red intent), used.
- Copy: "we", short, "boring stuff", no hype. "Talk to Good'ai", "Speak your admin problem. We'll listen like a mate who actually gets it."
- Reduced: useReducedMotion kills GSAP, sets static docket rots/offsets/shadows/opacity.
- Other: hl / hl-red used, wonk var, 4pt, paper cream grain, 2px ink, flat 3px stamp shadows in code.

## Identified Deviations (ruthless, every one)
1. **Ribbons/GSAP mechanical "1978 corkboard being rifled" effect (PRIMARY)**: 
   - Now uses wave-ribbon.png (was CSS approx — fixed by swarm). But effect may lack tactility: flutter harmonic low amp, shear not ratchet enough, no visible "perforated tape advance + wind buckle + tear snap" on scrub (scope: 60fps refs-only, hard cubic 90-160ms). Tear uses ✂ emoji + dashed (design wave is static waveform in voice box example, not bridge). No "ribbon tear final" full physics on footer clack.
   - Dockets: rots/offsets static in reduced good, but live GSAP scrub may not "rifle" (non-uniform enough, no live edge wear/dog-ear on png, no pin hole + crease participation on every). Hero filing bridge to board exists but shadows/compress may not feel "pile settling under weight".
   - Footer ritual: wonk + clack + pin code there, but may not "stamp slam" visceral (no full board reaction, red imprint lock).
   - Evidence: screenshots show thin ribbon line (png visible as colored waves), dockets listed but not "pinned variance popping". Code comments claim SPYLT but user/scope noted "no gsap" pre.

2. **Under-use of assets (verbatim per scope)**:
   - wave-ribbon.png: now in ribbons (good, with blend multiply for ink soak). But not used in hero "acoustic" visualizer box (design example has it as voice waveform ribbon; current uses canvas swirl G).
   - letter-*.svg: letter-swan + logo-mark-nomouth used in hero stamp-box corners (good micro). letter-a.svg, letter-good.svg, letter-i.svg, other letter-swan not used in dockets (as stamped elements, dog-ears, wordmark comps, ribbon details), stamps, or custom compositions. logo-full, logo-g, v1/v2, wordmark-mark under-used.
   - Evidence: asset ls, screenshot hero has swan/mark, code grep in VoiceAgentHero/HomeClient/BrandWordmark only those.

3. **Stamp/ribbon/card fidelity gaps vs ui_kits/preview/Brutalist Skill.html**:
   - Cards/dockets: current uses numbered "01" "THE DOCKET" "THE SYSTEMS" (banned in brand.md as "numbered section markers" AI scaffolding; design/preview use stickers "STICKER · SALE", "PILOT" red label, full navy/gold/black blocks w/ cream text, one accent). Not matching coloured card grammar (paper is exception, colour the cards).
   - Stamp shadows: --shadow-stamp* defined, used in stamp-btn. But vs design: exact 3px 3px 0, participate hover/press (translate(-1,-1) grow, press +2+2 collapse). May drift in components (e.g. .pinned-notice uses 2px/4px ad-hoc in GSAP).
   - Buttons: stamp-btn* classes, variants enforce one red. But vs primitives.jsx/ui_kits: may not exact gai-btn or hover/press in all (e.g. lead card, chat). Some white cards on cream?
   - Ribbon: png good, but height 19px/23px, no exact match to design wave .ribbon img scaleY(0.7) blend in voice context.
   - Hero stamp-box: has inner hairline, letters at corners, good. But visualizer canvas large swirl vs design acoustic feed with wave ribbon + controls.
   - Evidence: screenshot vs audit-design-cards.png (gold/navy/black w/ stickers vs current numbered text), Brutalist Skill.html (wave example, stamp demos), ui_kits/web/index.html + primitives.

4. **One red / WONK / .hl discipline**:
   - Code comments + footer wonk-line + stamp-btn-red intent good. But screenshots show multiple highlights? Numbered lists violate "exactly one Fraunces WONK emphasis phrase per major surface". Multiple surfaces may have >1 red shout or no.
   - .hl / .hl-red used in Why etc.

5. **Reduced-motion static docket board**:
   - Code sets rots/ox/oy/shadow/opacity on .pinned-notice, kills GSAP. But "complete docket board with all stamps/pins/rots/perforations visible" — may miss static perfs on ribbon, full pin holes, wear data-attrs, stamp imprints, edge on png. Reduced users see incomplete "rifled" feel.
   - Evidence: HomeClient reduced branch.

6. **CSS/tokens drift from SSOT + syntax history**:
   - globals.css now ribbon-focused (png integration good, comments reference design). But full :root/tokens/stamp-btn/hl/wonk rules? (file ~177 lines, no full :root in read; previous version had syntax error blocking all). Not @import public/colors_and_type.css verbatim (SSOT). Some legacy --ocean etc.
   - Postcss/tailwind may provide some, but drift risk (hard edges, 4pt, radii 0-8, stamp only no blur).
   - Evidence: postcss.config, layout import only globals, previous dev log CssSyntaxError:1321, current read vs colors_and_type.css full.

7. **Voice/copy tone + anti-hype**:
   - Mostly good ("switched-on Perth mate", "we'll sort", short). But "Acoustic Feed — Supertonic Local" ok for dev, numbered in dockets not conversational. Some "Real. Local. No hype." good.
   - No emoji in product (✂ in tear is UI, borderline).

8. **Perf/60fps/mech**:
   - Hybrid GSAP (ribbons/dockets/footer) + motion (hero filing). useGSAP, ScrollTrigger scrub, will-change. Should be refs only. But may have thrash if not careful (set on many). No explicit fps test. Dev had crashes before (now clean).
   - Evidence: HomeClient useGSAP, Voice useMotionValueEvent.

9. **Other gaps**:
   - Large top swan logo (black/orange) in screenshot — may not in design (wordmark in bar, g mark icon).
   - Dockets "file" conversation but limited to 3, numbered text not physical "pinned notices".
   - Components (LeadCaptureCard, ChatInterface, marketing/) may not verbatim match ui_kits/web (Hero.jsx, LeadCard.jsx, ChatThread.jsx, Footer.jsx, primitives).
   - A11y: reduced respected, but console errors pre-clean, focus/stamp press keyboard.
   - From detect.mjs: side-tab border-left in globals (banned absolute), overused Fraunces (identity wins here).
   - Build: previous syntax blocked; now clean but no DESIGN.md (per signals).

## Success Criteria Status (pre patches)
- [ ] Running site matches screenshots/previews in public/ + Brutalist Skill when scrolled (current close on png use, but numbered, logo, visualizer, card style differ; error state pre-clean).
- [ ] Ribbons/dockets/stamps/hero filing/footer clack exact mechanical (code present, png used, but tactility/GSAP delivery gap per scope).
- [ ] All assets used where design calls (wave yes now, letters partial).
- [ ] One-red, WONK, stamp-shadow, paper/ink/card on every (partial, violations in numbers/sections).
- [ ] Reduced static complete docket (partial).
- [ ] No "AI" hype; voice matches (good).
- [ ] Lighthouse/perf/a11y not regressed; 60fps mail (unknown, pre had crash).

## Patches to Deliver (high-detail, surgical, direct; prioritize mail-board)
(See following edits. All trace to request. Match existing style. No speculative.)

## Remaining Gaps Post-Patch (verdict at end)
- Full visual parity requires 5 workers coord (this + GSAP one + UI one etc).
- Test on device, full a11y, build prod.
- If design HTML needs tiny update for shipped, propose (prioritize site->design).

**Verdict after patches + verify loop:** [to be filled at end]

---
Swarm note: Coordinated with other 4 (impeccable is craft/audit/brand guardrails/anti-slop/WONK/polish). Use DESIGN-GAPS as shared. Update claude-progress too.
