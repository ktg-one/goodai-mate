# Review sign-off — phase/01b-launch-blockers

Reviewer: claude (sonnet 5.5). Scope: uncommitted diff excluding `VisualStory.tsx`, `PerthSketchbook.tsx`, plus new `lib/rate-limit.ts` and `lib/rate-limit.test.ts`. Checked against `SUMMARY.md` and `reviewer.md`. Source read-only.
Ran: `node --test` on `lib/*.test.ts` → 13/13 pass. `eslint` on changed API, lib, policy pages, service page, `next.config.ts`, MascotWidget → no output (clean). Did not run build or a browser, so CSP findings below are by reading, not by loading the page.

## Verdict: REQUEST_CHANGES

Most blockers from `SUMMARY.md` are fixed: mascot phone now uses `lib/links.ts`, price render removed from service pages, internal CTA is a `<Link>` without `target`, privacy names Trillet and Resend, legal email is hello@, "24/7" copy gone from `VoiceDemo.tsx`, `/lab` noindex and out of the sitemap, `/contact` in the sitemap, voice route fails closed without a key. No price copy remains in the new privacy/terms text. Four items still break launch.

## Required changes

1. **Voice allowlist fails open.** `app/api/voice/call/route.ts:51` — `allow.size > 0 && !allow.has(requested)`. If neither `NEXT_PUBLIC_TRILLET_AGENT_ID` nor `TRILLET_ALLOWED_AGENT_IDS` is set, `allow` is empty and any client-supplied `agentId` (up to 80 chars) is passed to `createCall` with the server key. This is the exact abuse SUMMARY blocker 2 was meant to close. Fix: `if (!requested || !allow.has(requested))` so an empty allowlist rejects.
2. **Rate limiter leaks memory and is trivially bypassed.** `lib/rate-limit.ts:9,26-37` — `buckets` never deletes keys; expired timestamps are filtered but the empty bucket stays in the Map. `lib/rate-limit.ts:47-51` trusts the leftmost `x-forwarded-for` entry, which a client can set freely, so each request can use a new key: limiter bypassed and Map grows without bound (memory DoS). Fix: (a) delete the key when its filtered list is empty and sweep expired buckets on a counter/interval; (b) hard cap on Map size (e.g. evict oldest or refuse above N); (c) prefer the platform's trusted header (`x-real-ip`, or the rightmost XFF hop behind the known proxy count) instead of the leftmost XFF; (d) add a test for eviction.
3. **Shared "unknown" bucket.** `lib/rate-limit.ts:54` — every request without proxy headers shares `contact:unknown` / `voice:unknown`. Five anonymous submissions per minute from anyone lock out all unheaded traffic (and a local `next start` behind no proxy). Fix: when no IP is found, skip IP keying and use a coarse global cap that is clearly larger, or key on a fingerprint such as UA + accept-language, and document that it is best-effort.
4. **Per-route `openGraph` drops the site og image.** Next shallow-merges metadata and replaces `openGraph` wholesale (confirmed in `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md` ~line 1346-1348). `app/privacy/page.tsx:9`, `app/terms/page.tsx:9` and `app/services/[slug]/page.tsx:23-27` define `openGraph` with only title/url, so these pages lose `images`, `siteName`, `locale` and `type` from `app/layout.tsx:38-51`. Shares of service pages (the most shared URLs) will have no image. Fix: repeat `images`, `siteName`, `locale`, `type` in each, or export a shared `ogDefaults` helper and spread it. The twitter card is also replaced only if defined; at minimum keep it inheriting the root image.
5. **Internal reviewer note shipped as public copy.** `app/privacy/page.tsx:25-27` "Draft for launch — not independent legal review. Kevin approves before treating this as final policy." and `app/terms/page.tsx:26-27` "Draft for launch… Kevin approves before treating this as final terms." This names a person and an internal approval step to every visitor; it also repeats the "self-declared draft" problem from `reviewer.md` BLOCKER-4 in a new form. Fix: remove the sentence from the rendered text (keep the approval gate in `.planning/STATE.md`) and have Kevin sign off the wording before launch. Alternatively, put a neutral "Last updated: <date>" line.
6. **Scope creep: `StudioMotion` re-mounted in the layout.** `app/layout.tsx:7,55` adds `<StudioMotion />`. ROADMAP Phase 3 treats scroll-motion restoration as a separate phase on its own branch (commit 1dac4ea removed the reveals on purpose; Kevin's scroll rules apply: ≥~1.5s, 3 viewport heights, `start`/`end` comments). It is not a launch blocker from `SUMMARY.md`. Remove it from this branch, or confirm with Kevin and run `npm run lint:motion` plus a reduced-motion check first. At minimum it must not ship unreviewed in a "blockers" PR.
7. **`.env.example` not touched.** SUMMARY blocker 1 (real-looking Resend key in tracked `.env.example` since 471f250) has no change in this diff. Required before opening: replace with placeholders, document `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_SITE_URL`, `TRILLET_ALLOWED_AGENT_IDS`, and have Kevin rotate the key (history still holds it). I could not read `.env.example` in this session (read denied), so I confirm only that it is absent from the diff.

## Checked and OK

- **CSP vs sketchbook iframe** (`next.config.ts:14-31`, `src/shaders/sketchbook/Sketchbook.tsx:64`). The iframe is `sandbox="allow-scripts"` with `srcDoc`; it inherits the parent policy. Its document uses relative `sketchbook/*.png|jpg|woff2` and inline scripts/styles, with no external script or font CDN. `'unsafe-inline'` + `'self'` covers it, and `frame-src` does not apply to `about:srcdoc`. `X-Frame-Options: DENY` does not affect a srcdoc frame. I read this; not loaded in a browser. Smoke test needed: homepage with devtools console, watch for CSP violations on the sketchbook iframe and its woff2 (CORS header at `next.config.ts:41-43` is retained).
- **Trillet widget.** `connect-src 'self' https: wss:`, `media-src 'self' blob: https:`, `worker-src 'self' blob:`, `Permissions-Policy microphone=(self)` cover LiveKit WebRTC and the mic. Widget still handles non-OK responses (`TrilletVoiceWidget.tsx:172-180`); the 503 "not available" path surfaces an error instead of the old public-call fallback, which is the intended fail-closed behaviour. `startPublicCall` is now only reachable if the server returns a non-authenticated 200, which it no longer does; harmless dead branch.
- **Fonts.** No Google Fonts or gstatic references in `app/` or `components/studio/`; fonts are local, `font-src 'self' data:` is enough.
- **Lint contract.** `eslint` clean on changed files. `MascotWidget.tsx` still has inline `style` and raw hex at the old lines (pre-existing, `reviewer.md` LATER-7, not made worse).
- **Copy.** New privacy/terms text makes no outcome, price, compliance or testimonial claims. "Trillet AI and its model providers" is accurate to `VoiceDemo.tsx:31` (Grok Realtime). "Does not add third-party advertising or analytics scripts" holds: no analytics packages found in `app/`, `components/` or `package.json`.
- **Rate-limit tests** pass, but they do not cover eviction, empty-bucket cleanup or header spoofing (required in item 2).

## Not blocking, note for later

- `src/shaders/sketchbook/sketchbookDocument.js` still ships upstream template links (designcode.io, aura.build, dreamcut.ai, mailto:meng@designcode.io, x.com/MengTo) inside the sketchbook srcdoc. Visible only if that section renders; check before launch. Out of this diff.
- Serverless: the limiter is per-instance, so on Vercel-style functions it limits per warm instance only. On the Railway long-lived Node host it works; state this in the comment at `lib/rate-limit.ts:1-5`.
- Reduced-motion fixes (`reviewer.md` SHOULD-8), og image 1200x630, retired ElevenLabs components and parked template components are still open per `SUMMARY.md` fix-wave 2.

DONE verdict:REQUEST_CHANGES required:7

---

## Round 2 — re-check of items 1-6

Checked current diff only. `node --test lib/*.test.ts` 17/17 pass. `eslint` on `lib`, `app/api`, `app/privacy`, `app/terms`, `app/services/[slug]`, `app/layout.tsx` clean. No browser or build run.

| # | Item | Result |
|---|---|---|
| 1 | Voice allowlist fails open | FIXED. `app/api/voice/call/route.ts:51` now `!requested \|\| !allow.has(requested)`; empty allowlist rejects. Comment at `:50`. |
| 2 | Limiter leak and spoofable XFF | FIXED. `lib/rate-limit.ts:20-25` sweep every 64 ops, `:53-56` empty bucket deleted, `:27-33` hard cap 5,000 keys, `:84-97` prefers `x-real-ip` then rightmost XFF hop. Tests for sweep and cap at `lib/rate-limit.test.ts:68,80`. |
| 3 | Shared "unknown" bucket | FIXED. `lib/rate-limit.ts:104-118` `limitRequest` uses per-IP key, else a global key at a higher cap (40). Both routes use it (`app/api/contact/route.ts:18`, `app/api/voice/call/route.ts:27`). Test at `lib/rate-limit.test.ts:55`. |
| 4 | Per-route openGraph drops image | FIXED. `lib/seo.ts` shares `ogDefaults`/`twitterDefaults` (images, siteName, locale, type); spread in `app/privacy/page.tsx:10-11`, `app/terms/page.tsx:10-11`, `app/services/[slug]/page.tsx:26-34`. |
| 5 | Internal "Kevin approves" note | FIXED. No "Draft", "Kevin" or "legal review" text left in `app/privacy/page.tsx` or `app/terms/page.tsx`. |
| 6 | StudioMotion in layout | FIXED. No `StudioMotion` reference in `app/layout.tsx`. |

Residual notes, none blocking:
- `lib/rate-limit.ts:94` rightmost XFF is the closest hop. Behind a single proxy (Railway) that is the client. If a CDN is ever added in front, all users would share the CDN's IP key (5/min contact); set `x-real-ip` or count hops then. If the app is ever exposed directly with no proxy, XFF is client-set and the limiter is bypassable.
- `lib/rate-limit.ts:20-24` sweep uses the calling route's `windowMs` for every bucket. Both routes use 60s, so fine today; wrong if windows diverge.
- `app/privacy/page.tsx` and `app/terms/page.tsx` openGraph no longer set `url` (canonical is set). Cosmetic.
- Item 7 (`.env.example` scrub and Resend key rotation) was Kevin's action and not in your re-check list; still must be done before opening.

### Final verdict: APPROVE

Conditional on Kevin rotating the Resend key and confirming the privacy/terms wording before the site opens.

DONE verdict:APPROVE
