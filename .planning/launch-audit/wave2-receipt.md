# Wave 2 receipt (polish only, scope-cut applied)

Branch: phase/01c-launch-polish. No commit, no push. `SussTheFussCard.tsx` change kept untouched. `PerthSketchbook.tsx` and `VisualStory.tsx` not touched.

## Message note
The wave-2 brief reached me truncated (it began mid-item 3, so items 1-2 were not visible). I worked from the scope cut, which names what to keep. Anything from items 1-2 outside that list was not done.

## Files changed
- `app/globals.css` — appended `@media (prefers-reduced-motion: reduce)` rule: `.animate-ping, .animate-pulse { animation: none }`. Affects reduced-motion users only.
- `components/studio/MascotWidget.tsx` — a11y: `aria-controls="goodie-panel"` on trigger, `id`/`tabIndex={-1}`/`ref` on panel, focus moves into panel when it opens. No visual change.
- `app/layout.tsx` — JSON-LD `ProfessionalService` (name, url, description, phone, hello@goodai.au, Perth WA AU). No ratings, reviews or claims. `<` escaped as `<` in the serialised JSON.
- `lib/links.ts` — added `PHONE_E164` (`+61877414191`) beside existing phone constants.
- `CLAUDE.md` — contact-form line now says it sends via Resend (rate-limited, honest failure). Also removed stale price/Pricing.tsx/ProductDemo/ElevenLabs mentions that my deletions made false.
- Deleted (zero imports outside each other and unmounted code; verified by grep, no visual change):
  - `components/ui/ElevenLabsWidget.tsx`
  - `components/ui/BrandedElevenLabsWidget.tsx`
  - `components/studio/BrandedVoiceWidget.tsx`
  - `components/sections/Testimonials.tsx`
  - `components/sections/ProductDemo.tsx`
  - `components/sections/Pricing.tsx`
  - `components/sections/Features.tsx`
  - `components/layout/Navbar.tsx`
  - `components/layout/Footer.tsx`

## Skipped
- Item 3 (upstream links in `sketchbookDocument.js`) — dropped by Kevin's scope cut.
- Item 1 Preloader first-visit change — dropped by scope cut; `Preloader.tsx` untouched.
- Unreferenced but kept (not flagged, may have other uses): `components/sections/CTA.tsx`, `FAQ.tsx`, `TechSpecs.tsx`, `InfiniteMarquee.tsx`, `layout/HomeScroll.tsx`, `layout/SmoothScroll.tsx`. `VisualStory.tsx` kept (forbidden to touch).
- Items 1-2 content not visible in the truncated brief (other than the above).
- Leftover: CSS for `.goodai-voice-widget` remains in the stylesheets (harmless, no visual effect).
- Leftover: `lib/links.test.ts:29` comment still mentions the deleted Navbar/Footer/Pricing; comment only.

## Gates
- `npm run lint`: 0 errors, 66 warnings (limit 142; fewer because the deleted files carried warnings).
- `npm test`: 17/17 pass.
- `npm run build`: compiled successfully, 17/17 static pages, routes unchanged.
- Not run: browser check of the mascot focus behaviour and JSON-LD output; recommend a quick manual pass.

DONE files:15 skipped:3
