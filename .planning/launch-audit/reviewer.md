# Launch audit — reviewer

Scope: content honesty, price copy, metadata/og, privacy/terms vs reality, phone, alt text, reduced-motion. Source read-only. 2026-10-06.
`privacy/page.tsx` and `terms/page.tsx` are single-line components, so line 3 = whole body.

## BLOCKER

1. **Wrong demo phone number.** `components/studio/MascotWidget.tsx:86` href `tel:+61877414198`, `:91` text "08 7741 4198". `lib/links.ts:5-6` = (08) 7741 4191 / `tel:+61877414191`. Mascot is mounted site-wide (`app/layout.tsx:54`), so every page offers a different number. Fix: import `PHONE_HREF` / `PHONE_DISPLAY`.
2. **Privacy names wrong voice vendor.** `app/privacy/page.tsx:3` says the voice demo "connects to ElevenLabs". Live widget is Trillet (`components/studio/TrilletVoiceWidget.tsx`; `components/studio/VoiceDemo.tsx:31` says "Trillet AI & Grok Realtime"). Name Trillet (and Grok Realtime if true).
3. **Privacy omits the contact-form data flow.** `app/privacy/page.tsx:3` says enquiry info "is used by Good'Ai". `app/api/contact/route.ts:5-6,50-60` sends contact, headaches and note via Resend to hello@goodai.au. Name Resend as processor and list what is collected.
4. **Legal pages are self-declared drafts.** `app/privacy/page.tsx:3` ("describes this design preview… being reconciled"). `app/terms/page.tsx:3` ("alternate Good'Ai website design review", "older company terms require reconciliation before public release"). Placeholder legal copy on a launch site. Rewrite as final or hold launch.
5. **Terms promise prices that are not published.** `app/terms/page.tsx:3` "Service descriptions and starting prices reflect the supplied finalized service catalogue". ROADMAP.md:38 says pricing was removed everywhere. Delete "starting prices".
6. **Legal contact email differs from the real inbox.** `app/privacy/page.tsx:3` and `app/terms/page.tsx:3` use `info@goodai.au`; contact route delivers to `hello@goodai.au` (`app/api/contact/route.ts:6`). Use hello@ or confirm info@ is monitored.
7. **Leftover price copy on every service page.** `app/services/[slug]/page.tsx:61` renders `{service.price}`, `:62` `{service.priceNote}`, `:82-84` a `price-detail` block with `{service.range}`. Data still in `lib/services.ts:2-6` (`price`, `priceNote`, `range`). ROADMAP.md:38 claims these were stripped; they were not. `lib/services.ts:6` "Fixed review" implies a fixed price that is not published. Remove fields and render; fix the roadmap claim.
8. **Unsubstantiated 24/7 and outcome claims.** `components/studio/VoiceDemo.tsx:27` "24/7 AI assistant". `components/ui/InteractiveWorkflowCanvas.tsx:162` title "24/7 Voice Agent Call", `:166` "Zero missed calls while on the tools", `:177`-ish "Sent in 0.2s". Reword to what the demo shows.
9. **Fabricated people and address in demo canvas.** `components/ui/InteractiveWorkflowCanvas.tsx:132,144,156,175,187,193` use Dave, Matt, Sarah K., "42 Hay St, Subiaco". `/demo` is in the sitemap. `components/studio/WorkflowPreview.tsx:13` carries an "Illustrative demo" label; confirm the canvas page shows the same label on-canvas, and that the address is not a real person's.
10. **Internal CTA opens a new tab.** `app/services/[slug]/page.tsx:65` `target="_blank"` on `SURVEY_URL` (`/contact`), rendered as plain `<a>`. Breaks back-nav on all five service pages. Use `<Link>`, drop target.

## SHOULD

1. **No per-route og/twitter/canonical.** Only root sets them (`app/layout.tsx:37-51`). `app/contact/page.tsx:6`, `app/demo/page.tsx:6`, `app/lab/page.tsx:7`, `app/services/[slug]/page.tsx:11-21`, `app/privacy/page.tsx:2`, `app/terms/page.tsx:2` set title/description only, so shares carry the homepage url/title. No `opengraph-image` file under `app/`. Add per-route `openGraph` + `alternates.canonical`.
2. **og image is a 1536x1024 webp.** `app/layout.tsx:44,52` `/brand/coastal-phone.webp`. Not 1200x630; some scrapers reject webp. Ship a 1200x630 png/jpg. og alt (`:44`) is just the title.
3. **`/contact` missing from sitemap.** `app/sitemap.ts` core routes list /, /demo, /lab, /privacy, /terms and services. Main conversion page absent.
4. **`/lab` is indexed and sitemapped.** `app/sitemap.ts` (lab entry), `app/lab/page.tsx:7`. Experimental per CLAUDE.md; set `robots: { index: false }` and drop from sitemap.
5. **Title template doubling.** `app/contact/page.tsx:7` "Contact Good'Ai" → "Contact Good'Ai — Good'Ai". `app/lab/page.tsx:8` "Studio Lab | Good'Ai Experiments" same. Use plain "Contact" / "Lab".
6. **Voice disclosure thin.** `components/studio/VoiceDemo.tsx:31` says audio/transcripts "processed in real-time"; no retention or recording note. Verify "Grok Realtime" is true of the Trillet agent or remove.
7. **Retired ElevenLabs components still shipped.** `components/studio/BrandedVoiceWidget.tsx:43,52,58`, `components/ui/ElevenLabsWidget.tsx`, `components/ui/BrandedElevenLabsWidget.tsx` (ROADMAP Phase 4 says retire). Delete to stop privacy drift.
8. **Reduced-motion gaps.** Guarded: `components/studio/SmoothScroll.tsx:14`, `StudioMotion.tsx:11`, `components/ui/InteractiveWorkflowCanvas.tsx:250`, `HeroTree.tsx:36`, CSS `app/globals.css:29,1973`, `app/studio-controls.css:22,113,137`. Not guarded: `components/ui/Preloader.tsx:25,51-67` (forced 1.2s min display + framer fade, no `useReducedMotion`); `components/studio/TrilletVoiceWidget.tsx:255,283,285,365` (`animate-ping`, `animate-pulse`); `components/studio/MascotWidget.tsx:58,117` (`animate-pulse`, hover scale). `components/sections/Hero.tsx:22-44` uses `Magnetic` (`components/ui/MagneticButton.tsx`); verify it honours the preference. One global `@media (prefers-reduced-motion: reduce)` rule for `.animate-ping,.animate-pulse` fixes most.
9. **Mascot widget a11y.** `components/studio/MascotWidget.tsx:107-121` `role="button"` div has `aria-expanded` but no `aria-controls`; panel `:51` appears without focus move. Inline styles and raw hex at `:54,88,96` break the lint contract.
10. **Footer phone caption vs mascot wording.** `components/studio/Shell.tsx:16` "Business line / AI voice agent" vs `MascotWidget.tsx:91` "Call demo line". Confirm 7741 4191 is both; if a second number exists, label both honestly.
11. **Contact failure + abuse.** `app/api/contact/route.ts` returns 503 "Please call us instead." Confirm `components/studio/SussTheFussCard.tsx` shows phone/email on failure (ROADMAP.md:88 says it does). No rate limit (ROADMAP.md:93-94); form is open to spam at launch.
12. **Sketchbook filename.** `components/studio/SketchbookFlip.tsx:12` src `/sketchbook/perth-.png` looks like a typo; verify file exists in `public/sketchbook/`. Alts at `:12-14,100` are good; `:34` `alt=""` ok only if decorative duplicate.
13. **Marketing capability copy for Phase 7 audit.** `app/page.tsx:20-22` ("We send the quote chasers…", "A voice agent answers the phone while you're on the tools"). Fine if services exist at launch; no testimonials or numeric outcomes found in `app/` or `components/studio/`.

## LATER

1. **Parked template components with invented-claim risk.** `components/sections/Testimonials.tsx`, `Pricing.tsx`, `ProductDemo.tsx`, `Features.tsx`, `VisualStory.tsx` (ROADMAP.md:47). Delete or move to `docs/components/`.
2. **Stale nav/footer pair.** `components/layout/Navbar.tsx:16` and `components/layout/Footer.tsx:21` link `#pricing` (no target on home). Unmounted (layout uses `Shell`); delete.
3. **Dead service fields/tests** after BLOCKER-7: drop `price*`/`range` from `lib/services.ts` and update `lib/services.test.ts`.
4. **Preloader cost.** `components/ui/Preloader.tsx:25` 1.2s forced display hurts LCP vs Lighthouse gate (ROADMAP Phase 7). Show on first visit only.
5. **`app/tokens/*.css`** off-palette (CLAUDE.md warns); remove to avoid accidental import.
6. **JSON-LD** `Organization`/`LocalBusiness` (Perth, phone from `lib/links.ts`) once phone confirmed.
7. **Raw hex to tokens** at `components/studio/MascotWidget.tsx:54,88,96`.
8. **Phase 7 pass not recorded.** Lighthouse, keyboard + screen-reader and reduced-motion runs absent from `.planning/STATE.md`.
9. **Legal review** of Privacy/Terms against Australian Privacy Act, Spam Act 2003 (contact consent) and call-recording consent in WA, since the voice demo captures audio.

DONE blockers:10 should:13 later:9
