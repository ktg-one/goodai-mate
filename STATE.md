---
updated: 2026-11-05
by: gemini-4-argon (Antigravity)
surface: goodai-studio
---
# STATE: goodai-studio
Full rewrite every time it's updated: current truth only, no history. History lives in git, `memory/` and the weekly catch-ups. Max ~300 words. Detailed feature map: `state/WEBSITE-STATE.md`.

## Now
goodai.au (Next 16, Vercel `goodai-mate`). Merged `feat/under-the-hood` into `main` and pushed. `bun run check`, `bun run build`, and `bun x react-doctor@latest .` (100/100, 0 issues) green: 0 lint errors, **52/52 tests** (including `tests/site-contracts.test.ts` enforcing `schemas/site-contracts.ts`).

## Shipped (on `main`)
- Dedicated `schemas/site-contracts.ts` and `tests/site-contracts.test.ts` locking in site invariants (no homepage sketch images in blog posts, `"Blog"` nav label, `/admin-engine` forbidden strings + brand logo cards, and `/api/chat/session` 25s NAS wake-up timeout + zero-503 fallback)
- Renamed `"Field notes"` / `"Notes"` to `"Blog"` across `Shell.tsx`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, and `lib/instatic.ts`, and removed `/images/book/*-sketch.webp` fallbacks so blog posts only render `coverImage` when set in the Instatic CMS
- Hardened `/api/chat/session` (`25_000`ms timeout for NAS `gai-llama` wake-up, `?warm=1` pre-warm ping, and `buildSmartFallbackReply` zero-503 fallback) + fixed `<elevenlabs-convai>` widget overlap in `ElevenLabsMascot.tsx`
- Trimmed `/admin-engine` header to `The Good’Ai machine.` + `A depiction of our process.`, hover-expand 3D labels, inline SVG brand logos (`ElevenLabs`, `OpenAI`, `Gemini`, `xAI`, `n8n`, `Google Cloud`), and removed `GCP Sydney`, `Your existing tools`, `APIs & webhooks`, and `Opportunity audit`
- AI SDK (`ai` + `@ai-sdk/openai-compatible`) + ElevenLabs/Private AI switch at **React Doctor 100 / 100**

## Open (max 5)
- Upload blog cover images directly in the Instatic CMS (`https://ktg-nas.blowfish-snares.ts.net/admin`) for posts that want artwork
- Optional: wire inline 1-field email input on `/blog` & `/blog/[slug]` ("Subscribe to newsletter" -> posts to `/api/contact`)
- Untracked `.agents/skills/*`, `.claude/skills/*`, `agent/` (~250 files from `bunx skills add`) | gitignore vs commit

## In the works...
- About page (founder talk on human-centric AI policy) | needs Kev's policy draft | nothing tried yet

## Decisions
- `schemas/site-contracts.ts` + `tests/site-contracts.test.ts` are enforced by `bun run test` / `bun run check` so agents cannot regress blog imagery, nav labels, `/admin-engine` copy, or chatbot reliability
- Blog images come exclusively from Instatic CMS (`coverImage: string | null`), never homepage scroll-story sketches

## Next action
Upload any desired blog cover images in Instatic CMS (`https://ktg-nas.blowfish-snares.ts.net/admin`).
