# Launch audit — referee summary (asta, 2026-10-06)

Sources: architect.md (grok-4.5, hermes -p ceo, pane w8:p8), reviewer.md (claude sonnet 5.5, pane w8:p2), asta gate run.
Gates: build PASS · lint 0 errors / 142 warnings · tests 9/9 · 15 routes 200, 404 OK.

## Verified by referee (not just claimed)
- .env.example:9 holds a real-looking `re_…` Resend key, tracked in git, in history since 471f250. ROTATE.
- Service pages still render price/priceNote/range (app/services/[slug]/page.tsx:61-62,82-84; lib/services.ts:2-6). ROADMAP Phase 1 "pricing removed everywhere" is FALSE — likely regressed by PR #271. Tests pass because they don't catch it.
- app/services/[slug]/page.tsx:65 target=_blank on internal /contact.
- MascotWidget.tsx:86 phone ends 4198; lib/links.ts ends 4191.

## Launch blockers (merged, deduped)
1. Rotate Resend key + scrub .env.example (KEV: rotation)
2. Rate limit /api/contact and /api/voice/call; voice agentId allowlist; voice fail-closed when no key
3. Privacy/Terms are self-declared drafts: wrong vendor (ElevenLabs→Trillet), Resend unnamed, info@ vs hello@, "starting prices" (KEV: approve final copy)
4. Remove price render from service pages
5. Fix mascot phone → lib/links.ts (KEV: which number is real?)
6. Unsubstantiated "24/7" / "Zero missed calls" / "0.2s" demo copy
7. Internal CTA target=_blank

## Should (fix-wave 2)
Security headers + poweredByHeader:false · per-route OG/canonical, 1200x630 OG · /contact into sitemap, /lab noindex · env docs (CONTACT_TO_EMAIL, NEXT_PUBLIC_SITE_URL) · reduced-motion for animate-ping/pulse + Preloader · delete ElevenLabs widgets + parked template components · 404 title.

## Disagreements
None material. Reviewer counted 10 blockers, architect 4; overlap only on rate limit. Referee keeps both lists; headers demoted to SHOULD (no traffic yet).
