# Impeccable audit — alternate Good’Ai site

13 September 2026. Audit skill: C:/Users/kevin/.agents/skills/impeccable/SKILL.md and reference/audit.md. Scope: all rendered routes in goodai-studio, with source inspection, desktop/mobile browser inspection and measured checks. This is an implementation audit, not a formal accessibility certification or a measured conversion result.

## Implementation integrity verdict

**Pass for local design comparison.** One visual system spans the homepage, service detail template, workflow examples, dashboard, missing page and preview notices. Five service entries map to the supplied catalogue. No invented testimonials, metrics, client identities or certification statements. Existing centralized intake URL retained. Example state is visibly distinguished from the opt-in third-party voice agent.

The bundled Impeccable detector returned an empty array on the homepage, styles, layout, studio components and service data. The later dashboard replacement was manually reviewed as part of the interaction pass. Zero detector findings does not prove absence of accessibility or performance issues.

## Health score

| Dimension | Score | Evidence and limit |
|---|---:|---|
| Accessibility | 3/4 | Contrast pairs pass AA text threshold; visible focus, native disclosures, labelled controls, switch state and Radix keyboard tabs verified. No assistive-technology session or exhaustive WCAG audit. |
| Performance | 3/4 | Static routes, local fonts, 235 KB WebP, no homepage third-party widget. GSAP is scoped to the illustrated homepage story. Production compilation passes. No Lighthouse/Core Web Vitals measurement. |
| Responsive design | 4/4 | Desktop 1440px, mobile 390px and narrow 320px checked. Detected hero overflow fixed. Service detail and dashboard checked on mobile. |
| Theming | 4/4 | Coherent light-only token system, readable semantic colours. Dark mode is deliberately not offered. |
| Implementation integrity | 4/4 | Complete catalogue, working local interactions, explicit simulated state, documented source authority, isolated fork. |
| **Total** | **18/20** | **Excellent within the tested local scope.** |

## Findings and dispositions

- **P1 — Mobile hero overflow (fixed).** A minimum height combined with aspect-ratio let the image grid item exceed its track. Explicit width:100% and min-width:0 resolve it. Final narrow viewport measurement: innerWidth 320, document scrollWidth 305 (scrollbar excluded), no elements extending beyond the viewport.
- **P1 — Font delivery failed in the sandbox (fixed).** Google font downloads failed during Next compilation, leaving fallback type. Fonts are now self-hosted with official OFL licenses. Browser font state loaded; builds no longer fetch Google Fonts.
- **P2 — Original dashboard controls were decorative (fixed in fork).** The old Rules switches were divs and Jobs was an empty-state message. Rules are now keyboard-operable switches with local state and a live summary; Jobs presents clearly labelled sample records.
- **P2 — Public legal copy needs reconciliation (open release task).** Source terms contain older prices; source privacy text does not describe this implementation exactly. /privacy and /terms are explicit preview notices. Impact: this fork must not be presented as an approved production legal surface. The founder should approve reconciled terms before public release.
- **P2 — External voice behaviour is only partly verified (open integration task).** Widget script loaded and the actual Start a call control rendered. A conversation, microphone access and backend responses were not tested. No call started. Do not describe this as an end-to-end voice validation.
- **P3 — Full accessibility/performance evaluation remains unmeasured.** Colour calculations and focused interaction checks support the current score; they do not substitute for a screen-reader session, zoom testing across devices or field performance data. Address through Impeccable audit/optimize when the chosen design moves toward public release.

## Browser evidence

- Desktop full-page composition: hero, service index, workflow example, process, questions, contact and footer inspected.
- Homepage image natural size >0 and document fonts loaded.
- Mobile menu opens, exposes correct destinations, closes on Escape, and returns focus to the trigger.
- Quote follow-up scenario selected; Run example changes the state to complete; Reset appears.
- FAQ opens and displays its answer.
- Service row navigates to the voice-agent detail page; service CTA keeps the centralized survey destination.
- Operations dashboard Today/Jobs/Rules render. ArrowRight from Jobs selects Rules. The reminder switch changes aria-checked and summary from 2 to 3 enabled rules.
- Optional ElevenLabs widget loaded; actual Start a call button seen. No conversation initiated.
- Reduced motion emulated at 320px: media query true, hero animation name none, no horizontal overflow.
- Focus outline visible on the narrow-screen primary action.
- Browser error log query returned no errors during the interaction pass.

## Contrast

| Text / surface | Ratio |
|---|---:|
| Ink / paper | 10.61:1 |
| Muted / paper | 5.24:1 |
| Rust / paper | 5.63:1 |
| Paper / rust | 5.63:1 |
| Ink / sage | 8.77:1 |
| Muted / white | 5.67:1 |
| Muted / wash | 4.88:1 |
| Success / sage | 5.91:1 |

## Checks

- npm run lint: pass.
- npm run build -- --webpack: pass, static homepage/demo/notices plus five generated service routes.
- Next emitted only the inherited baseline-browser-mapping age warning.
- No new dependency added. Original app files preserved.

## Positive patterns to retain

### Founder-requested motion refinement

The original Vibes handwriting and GSAP scroll storytelling were restored on 13 September 2026 after founder feedback. This is intentional brand character: brief handwritten reassurance and three original line illustrations of admin, connected work and a break in the sun.

- Desktop 1440px: sticky artwork follows the three chapters; SVG stroke offsets change with scrolling. An initial overlapping trigger range was corrected. At rest in the final chapter, scene opacities are exactly 0, 0, 1.
- Mobile 390px: hero handwriting and arrow fit; each drawing sits beneath its chapter. The middle drawing was visually inspected at its completed scroll position.
- Reduced motion at 320px: all three inline drawings are displayed, with stroke-dasharray none and offset 0px. Document scroll width 305px within the 320px viewport; no horizontal overflow.
- Original local Vibes font reports loaded. Browser error log returned no errors during this pass.
- Re-running the Impeccable detector with DESIGN.md present found four advisory radius mismatches in existing CSS. Normalized 3px corners to the documented 4px token and the switch to the full-round token. The follow-up detector returned an empty array. Design front matter has no missing or orphan token references.
- Motion is nonessential. Semantic chapter copy remains readable without animation. Timelines and media listeners are reverted on component cleanup; native scrolling is retained.
- This focused refinement does not expand the original audit into formal accessibility or performance certification.

The product story is specific to repetitive admin, rather than unsupported AI claims. Services are findable without operating a WebGL carousel. Navigation and essential content are visible immediately. Motion is limited and nonessential. Human review is part of examples. The generated artwork has a provenance record, and the design tokens have an explicit document.

## Recommended next actions

### Voice CTA and widget follow-up

13 September 2026: added a homepage voice section, hero/header links and adjacent centralized enquiry CTA. The original agent ID is unchanged. The widget uses brand CSS variables, local Manrope, the site icon and a smaller shadow. The vendor's open-shadow-root markup requires a small scoped font/shape adapter.

- Desktop: actual Start a call button rendered with rust background rgb(164,67,43), paper text rgb(247,245,237), Manrope and 44px height.
- Mobile 390px: widget bounds left 91px, right 359px, bottom 815.5px within an 844px viewport. No horizontal overflow.
- Observed DOM events confirm data-scrolling=true during scroll, followed by removal after the idle pause. Resting opacity is 1.
- Keyboard focus on the widget's provider link remains visible during scroll. Reduced-motion host and button transitions both compute to 0s.
- Existing embed code and remote published script were inspected. No explicit scroll-hide implementation was found in the local original checkout; the fork implements the requested behaviour independently.
- A real call, microphone permission, backend responses and in-call appearance were not tested. The visibility guard conservatively keeps any state without a visible idle Start a call button on screen.
- No ThreeUI code imported. Source review and candidate choices are in THREEUI-REVIEW.md. The selected brand's editable Canva import pack is in brand-guide/.

For this comparison, no further polish is needed. When the founder selects a direction: reconcile the two release items above, run Impeccable audit/optimize against the deployment candidate, then Impeccable polish only on verified remaining defects.
