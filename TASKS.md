# Good'Ai studio fork — launch checklist

Updated: 2026-09-15

Scope: this is the assistant-created, one-shot studio fork. Kevin's own version
remains in main. These tasks and readiness findings apply only to this fork;
they do not describe the state of Kevin's main site. No merge is authorised.

This is the studio fork task list. The older `.planning/` milestones describe
an earlier implementation and do not establish current launch readiness.
Continue authorised implementation work through verification; keep any work
requiring external access or release approval explicitly pending.

**Finish line:** a polished, animated, mobile-friendly public site where a
visitor understands the offer, can try the voice agent and can submit an enquiry.
**Next task:** verify the implemented animation pass in a functioning browser session, then finish voice-agent verification.

## 1. Animations — next

Implementation update: `StudioMotion.tsx` now adds staggered hero entrances
and viewport reveals for sections, services, workflow, voice, FAQ and contact.
Service icons/arrows have hover motion. Existing ScrollStory drawing animations
are retained. Motion honours reduced-motion changes and cleans up on route
changes; content is visible without JavaScript. Browser runtime/visual
verification remains pending, so the acceptance items below stay unchecked.

- [ ] Inspect the rendered studio components and existing motion; diagnose why motion is not apparent before adding more.
- [ ] Add a coordinated hero entrance for headline, supporting copy, CTA and image.
- [ ] Add visible, restrained scroll reveals for service rows, approach steps and section headings.
- [ ] Finish the scroll-story transitions and subtle image movement, keeping text readable throughout.
- [x] Finish hover, press and keyboard-focus feedback for buttons, links and service rows.
  Added :focus-visible styles to desktop-nav, mobile-nav, footer nav, header-phone, footer-phone, voice-phone, contact-phone, and service-row in globals.css and studio-controls.css.
- [ ] Verify on mobile and desktop, including reduced motion, touch, back navigation and direct section links. Content must remain accessible if animation fails.

Done means the motion has been observed in the browser, with no hidden content,
broken scrolling, layout jumps or uncleaned timers/listeners.

## 2. Voice agent — required for launch

- [ ] Restore a reliably visible, discoverable ElevenLabs experience using the existing agent and embed.
- [ ] Verify load, ready, permission, connection, listening, speaking, end-call and failure/retry states; script load alone is not proof the agent works.
- [ ] Complete a short approved test conversation and confirm the call ends cleanly.
- [ ] Check mobile placement, keyboard access and that the widget never covers a CTA or hides an active call.
- [ ] Confirm example-use guidance, privacy disclosure and a working enquiry fallback.
- [ ] Verify the embed on the intended deployed domain, including any domain restrictions.

Existing code: `components/studio/VoiceDemo.tsx` and
`components/studio/BrandedVoiceWidget.tsx`. A configured embed is present;
successful live operation has not been verified in this session.

## 3. CTAs and enquiry flow — required for launch

- [x] Add Kevin's business/AI voice-agent number, (08) 7741 4191, to desktop navigation, mobile menu, voice section, contact section and footer using a centralised international `tel:` link. Live call operation remains unverified.

Verification: served HTML and browser accessibility tree both show the four
always-rendered call links targeting `tel:+61877414191`; the fifth is in the
conditional mobile menu. Lint/build passed. Screenshot and interaction commands
failed with browser-control timeouts, including after fresh-tab recovery;
mobile visual, dialler and live-call checks remain pending.

- [ ] Review hero, header, services and closing CTAs for a clear next step and consistent wording.
- [x] Verify form CTAs use `SURVEY_URL` and call CTAs use `PHONE_HREF` in `lib/links.ts`.
  Verification: All form/enquiry links import and use `SURVEY_URL` from lib/links.ts. All phone/call links import and use `PHONE_HREF` from lib/links.ts. No hardcoded URLs found. Verification script added at scripts/verify-ctas.sh.
- [ ] Verify the destination opens, works on mobile and gives a clear submission confirmation.
- [ ] With approval for a labelled test enquiry, verify the submission reaches the intended recipient/system.
- [ ] Confirm usable contact fallback and no dead-end service pages.

Existing: header, hero and closing enquiry CTAs, plus the voice-section enquiry
link. Their presence is verified; the full submission path is not.

## 4. Essential content and usability — required for launch

- [ ] Review the offer, service scope, pricing and ongoing costs against Kevin's actual offers.
- [ ] Verify all published claims and any case-study evidence; keep simulated examples clearly labelled.
- [ ] Check navigation, mobile menu, FAQ, service pages, footer and all internal/external links.
- [ ] Review privacy and terms for the actual enquiry and ElevenLabs data flows.
- [ ] Verify responsive layouts at 320px, typical mobile, tablet and desktop widths.
- [ ] Verify keyboard navigation, visible focus, contrast, headings, labels and image alternatives.
- [ ] Check images/fonts, loading behaviour, console errors and mobile performance; fix material issues.

## 5. Release readiness

- [ ] Set the correct public metadata base URL, page titles, descriptions and sharing image; review canonical URLs, sitemap and robots settings.
- [ ] Remove preview-only `noindex` only for the approved public release.
- [ ] Run `npm run lint` and `npm run build` after final changes.
- [ ] Inspect the final preview at mobile and desktop sizes and exercise all primary visitor flows.
- [ ] Obtain approval for public deployment; verify the exact public domain, HTTPS, routes, enquiry destination and voice widget after release.

## Phase 2 — richer proof and measurement

- [ ] Add a bounded n8n workflow example showing input, actual processing and output; define data/access boundaries before connecting it.
- [ ] Add a second voice-agent use case or walkthrough if it helps demonstrate the offer.
- [ ] Add a supported anonymised case study or recorded demonstration.
- [ ] Decide on minimal enquiry/conversion measurement and its privacy requirements.

## Work already completed in this conversation

- [x] Adapt ThreeUI arrow-pill and keycap styling, workflow panel and recessed selector to the studio palette.
- [x] Preserve ThreeUI attribution and license in `docs/threeui-attribution.md`.
- [x] Run lint and production build successfully after the controls change.
- [x] Inspect header/hero at desktop and 390px mobile widths, and inspect the mobile workflow panel.

Outstanding from that pass: interaction, keyboard and runtime reduced-motion
checks. Browser control failed during clicks; these are not marked complete.
The site has not been declared finished or deployed by this work.
