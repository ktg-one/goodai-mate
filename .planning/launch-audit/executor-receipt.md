# Executor receipt — Wave A + Wave B

**Agent:** bricks  
**Branch:** `phase/01b-launch-blockers` (no commit / no push — asta integrates)  
**Date:** 2026-10-06

---

## Wave A — launch blockers

| Path | Change |
|---|---|
| `lib/rate-limit.ts` | **new** in-process limiter + clientIp |
| `app/api/contact/route.ts` | 5/min/IP → 429 |
| `app/api/voice/call/route.ts` | 6/min/IP; allowlist; fail-closed 503; generic errors |
| `next.config.ts` | security headers + poweredByHeader false |
| `.env.example` | scrubbed secret; full env docs |
| `lib/services.ts` | price fields removed |
| `lib/links.ts` | LEAD_EMAIL only (phone digits untouched) |
| `app/services/[slug]/page.tsx` | no prices; internal Link; canonical |
| `app/privacy/page.tsx` | Resend + Trillet + hello@ draft (Kevin approves) |
| `app/terms/page.tsx` | no starting prices draft (Kevin approves) |
| `components/studio/MascotWidget.tsx` | PHONE_* from lib/links |
| `components/studio/VoiceDemo.tsx` | no 24/7 claim |
| `app/sitemap.ts` | +/contact, −/lab |
| `app/lab/page.tsx` | noindex |
| `app/not-found.tsx` | dedicated title + noindex |

---

## Wave B — motion + honesty + tests

| Path | Change |
|---|---|
| `components/studio/StudioMotion.tsx` | hero WAAPI + home ScrollTrigger reveals; reduced-motion safe |
| `app/layout.tsx` | mounts `<StudioMotion />` |
| `components/ui/InteractiveWorkflowCanvas.tsx` | illustrative demo copy; no fake outcomes / people-as-claims |
| `lib/rate-limit.test.ts` | **new** — 4 tests |

**Not touched:** `VisualStory.tsx`, `PerthSketchbook.tsx`.

---

## Gate results (latest)

| Gate | Result |
|---|---|
| `npm run lint` | PASS — 0 errors / 142 warnings |
| `npm run lint:motion` | PASS |
| `npm test` | PASS — **13/13** |
| `npm run build` | PASS |

---

## Still blocked on Kevin

1. Rotate Resend if old example key was real; set prod keys  
2. Trillet keys (else voice 503 by design)  
3. Approve privacy/terms draft  
4. Real form + mic smoke  
5. Domain go-live  

## Revenue unlock

More site code is not the cash bottleneck. Keys + first 10 outbound (see `.planning/gtm/first-10-clients.md`) + first quote is.

WAVE_B_DONE lint:pass motion:pass test:13/13 build:pass

## Round 2 — review-signoff REQUEST_CHANGES (items 1–6)

Referee: `review-signoff.md`. Item 7 skipped (resolved by referee).

| # | Fix |
|---|---|
| 1 | Voice allowlist fail-closed: `if (!requested || !allow.has(requested))` — empty allowlist rejects |
| 2 | Rate limiter: delete empty buckets, periodic sweep, `MAX_KEYS` eviction, prefer `x-real-ip` then **rightmost** XFF; tests for sweep + cap |
| 3 | No shared `unknown` IP key — `limitRequest` uses coarse `prefix:global` when no IP |
| 4 | `lib/seo.ts` ogDefaults/twitterDefaults spread into privacy, terms, services metadata |
| 5 | Draft/Kevin notes removed; public line `Last updated: 6 October 2026` |
| 6 | `StudioMotion` removed from `app/layout.tsx` (Phase 3, not this branch) |

**Not touched:** VisualStory.tsx, PerthSketchbook.tsx. No commit/push.

### Gate results (Round 2)

| Gate | Result |
|---|---|
| `npm run lint` | PASS — 0 errors |
| `npm test` | PASS — **17/17** |
| `npm run build` | PASS |

ROUND_2_DONE lint:pass test:17/17 build:pass

## Round 3 — failure UX + Kev unblock note

| Path | Change |
|---|---|
| `components/studio/SussTheFussCard.tsx` | On submit error, show Call + email CTAs from `lib/links` (no dead end when Resend is down/missing) |
| `.planning/launch-audit/KEV-UNBLOCK.md` | Ordered ops checklist for keys, smoke, host, GTM |

Gates: lint 0 errors · test 17/17

**Standing goal status:** Launch-blocker *code* is complete pending asta re-review + integrate. First invoice is blocked on Kevin secrets/host (see KEV-UNBLOCK). No further autonomous site code unblocks cash.

ROUND_3_DONE lint:pass test:17/17 STOP_BLOCKED_ON_KEV
