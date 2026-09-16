# React Doctor review and carousel hero — 15 September 2026

## Result

The unused carousel is now the homepage hero visual, replacing the phone photograph while retaining the existing headline, enquiry destination, and voice-demo link. The image asset was preserved. Nothing was deployed, committed, or sent externally.

React Doctor 0.9.14: **45 → 43 findings**, score **39 → 42**. Both carousel rules are absent. Six security matches were rejected as false positives and remain visible because no rules, paths, or diagnostics were suppressed. The other **37 occurrences** were left for follow-up. The supplied diagnostics have no `fixGroupId` values; the six generated security matches were reviewed as one reported rule family with three underlying library contexts.

## Reviewed findings

### 1. Weak cryptography — Rejected, high confidence

The [canonical recipe](https://react.doctor/docs/rules/react-doctor/insecure-crypto-risk) scopes the rule to production source and exempts non-secret randomness. Fetched with `curl.exe -fLsS` and both `Cache-Control: no-cache` and `Pragma: no-cache`, following redirects. Also read the page's canonical Markdown recipe at `/prompts/rules/react-doctor/insecure-crypto-risk.md`.

Read all six generated files and inspected the exact diagnostic line/column:

| File under `.next-dev/dev/` | Actual operation |
| --- | --- |
| `server/vendor-chunks/gsap.js:50` | `shuffle` sorts animation values using `.5 - Math.random()` |
| `static/chunks/app/page.js:51` | Same bundled GSAP shuffle |
| `static/webpack/app/page.96e77025f8090b5b.hot-update.js:51` | Same GSAP shuffle in a hot update |
| `static/chunks/node_modules_next_dist_build_polyfills_polyfill-nomodule.js:1` | Internal `Symbol(...)` compatibility IDs |
| `static/chunks/polyfills.js:1` | Same Symbol compatibility code |
| `static/chunks/node_modules_next_dist_compiled_next-devtools_index_1dd7fb59.js:1642` | React internal `__reactFiber$`, `__reactProps$`, and related property names |

These matches do not create passwords, tokens, or credentials. Bundling puts unrelated security-shaped words on the same enormous line, causing the heuristic to misclassify ordinary randomness. No demonstrated security exposure from these six matches. This conclusion is limited to those matches, not a security audit of the application. Generated dependencies were not patched or deleted; scanner configuration was not changed.

### 2. Giant Carousel component — Confirmed failure, high confidence; fixed

The [canonical recipe](https://react.doctor/docs/rules/react-doctor/no-giant-component), fetched without cache, calls for meaningful presentation components and lifecycle hooks rather than treating length alone as a defect. The original component combined React markup, mutable scene ownership, WebGL rendering, input events, resource disposal, and label presentation.

Extracted:

- `CarouselFallback.jsx`: readable reduced-motion service list.
- `CarouselProjectList.jsx`: highlighted project list.
- `CarouselLabels.jsx`: two sets of morphing labels.
- `useCarousel.js`: stable DOM references and effect ownership.
- `ring/createCarousel.js`: imperative WebGL scene with its returned disposer, following the existing `createMeta` / `createTag` convention.

`Carousel.jsx` is now 80 lines and composes the presentation. The renderer retains its existing mathematical behavior; it is still substantial imperative code, not claimed to be fully simplified. This was a maintenance improvement: fewer unrelated responsibilities need to be understood to change the React view. There was no demonstrated visitor-facing crash caused by the original length.

Reran the real tool immediately after extraction: 44 findings, giant-component absent, will-change still reported in its new label component.

### 3. Permanent will-change — Observation; cleanup applied, hardware benefit unproven

The [canonical recipe](https://react.doctor/docs/rules/react-doctor/no-permanent-will-change), fetched without cache, says to remove the hint first and re-profile, rather than automatically adding it to animation callbacks.

Both label wrappers retained `will-change: filter` while their actual filter was `none`. Removed the static hint. Existing animation code already applies its real filter only during the morph and returns it to `none` afterward.

Before/after browser checks: persistent hints **2 → 0**; identical desktop arrow-key service selection; no runtime errors; one mounted canvas, zero after unmount, one after remount; reduced-motion path creates no canvas. React Doctor no longer reports this rule.

**Evidence limit:** Chromium used software graphics in this environment. LayerTree did not identify retained will-change layers. Desktop median frame interval was approximately 333 → 317 ms; mobile 533 → 550 ms. These slow, noisy software-rendering measurements do not establish a speedup, GPU-memory saving, or acceptable physical-device frame rate. The potential resource cost remains unverified on hardware. This is removal of an unnecessary permanent hint, not a proven GPU-performance repair. Real mobile/Safari profiling remains a follow-up.

## Hero integration requested during the review

Before this change, `ServicesCarousel` imported Carousel, but no page imported ServicesCarousel. Source inspection establishes that it was unused; it does not explain the historical decision.

The homepage now renders `<ServicesCarousel hero />`. The hero variant fits the entire ring into its panel, uses shorter entry timing, and preserves the standalone carousel's settings. Metadata sizing now uses the actual container width. A resize observer and scroll listener keep canvas sizing and pointer coordinates accurate when the hero is resized or the page scrolls; both are removed by the scene disposer. At reduced motion, the list expands in normal page flow instead of clipping its entries.

Desktop and mobile visual review caught and corrected mobile clipping and a label overlap. No service claims, artwork, pricing, or CTA destinations were invented for this integration.

## Verification

- `npm run lint`: passed.
- `npm run build`: passed, including TypeScript and static route generation.
- Focused ESLint on changed carousel, wrapper, and homepage files: passed.
- `git diff --check`: passed; Git printed existing line-ending conversion notices.
- Repeated unfiltered `npx react-doctor@latest --verbose`: 43 findings; no new findings compared with the supplied baseline; only the two expected carousel occurrences removed. Exit 1 reflects the remaining findings.
- Production preview at `http://localhost:3014`: desktop 1440×1000, mobile 390×844, reduced-motion mobile.
- Keyboard focus and ArrowRight changed the announced service; synthetic touch drag changed the service on both desktop and mobile viewports.
- No horizontal page overflow or uncaught browser errors in those scenarios.
- Reduced-motion list visible, zero WebGL canvases.
- Browser tests use Chromium with software graphics. Physical touch hardware and Safari were not tested. No production deployment was performed.

Raw local screenshots, before/after bundles, profiling scripts, and JSON results: `C:/Users/kevin/AppData/Local/Temp/goodai-react-doctor-review-20260915/`.

## Follow-up — stop this pass here

**First priority:** verify the scanner's Next.js / React Server Components vulnerability report and make the necessary dependency update as a separate pass. Then investigate server-render browser access and lifecycle cleanup. The following are scanner reports, not independently confirmed defects in this pass.

| Rule | Occurrences | Files |
| --- | ---: | --- |
| `effect-needs-cleanup` | 1 | components/studio/StudioMotion.tsx |
| `effect-observer-needs-disconnect` | 1 | components/studio/StudioMotion.tsx |
| `no-array-index-as-key` | 6 | components/sections/FAQ.tsx, components/sections/Features.tsx, components/sections/InfiniteMarquee.tsx, components/sections/Testimonials.tsx, components/sections/VisualStory.tsx, components/ui/StaggeredText.tsx |
| `no-impure-state-updater` | 1 | components/ui/Preloader.tsx |
| `no-layout-property-animation` | 4 | components/layout/Navbar.tsx, components/ui/Preloader.tsx |
| `no-side-effect-in-state-updater-function` | 1 | components/ui/Preloader.tsx |
| `no-transition-all` | 1 | components/layout/Navbar.tsx |
| `no-unguarded-browser-global-in-render-or-hook-init` | 1 | components/studio/BrandedVoiceWidget.tsx |
| `no-vulnerable-react-server-components` | 1 | package.json |
| `only-export-components` | 2 | components/ui/badge.tsx, components/ui/button.tsx |
| `prefer-tag-over-role` | 1 | components/sections/ProductDemo.tsx |
| `shadcn-icon-button-requires-label` | 1 | components/layout/Navbar.tsx |
| `use-lazy-motion` | 16 | components/layout/Navbar.tsx, components/sections/CTA.tsx, components/sections/FAQ.tsx, components/sections/Features.tsx, components/sections/Hero.tsx, components/sections/InfiniteMarquee.tsx, components/sections/Pricing.tsx, components/sections/TechSpecs.tsx, components/sections/Testimonials.tsx, components/sections/VisualStory.tsx, components/ui/CustomCursor.tsx, components/ui/MagneticButton.tsx, components/ui/Noise.tsx, components/ui/ParallaxImage.tsx, components/ui/Preloader.tsx, components/ui/StaggeredText.tsx |

In addition, the six rejected generated-library security warnings remain in the raw tool output.

Final unfiltered diagnostics: `C:/Users/kevin/AppData/Local/Temp/react-doctor-a1fec016-4f5b-4ef3-94ca-0e3044207679/diagnostics.json`.
