---
updated: 2026-11-04
by: gemini-4-argon (Antigravity)
surface: goodai-studio
---
# STATE: goodai-studio
Full rewrite every time it's updated: current truth only, no history. History lives in git, `memory/` and the weekly catch-ups. Max ~300 words. Detailed feature map: `state/WEBSITE-STATE.md`.

## Now
goodai.au (Next 16, Vercel `goodai-mate`). Work sits on branch `feat/under-the-hood` (`aba86f0` pushed, plus AI SDK + ElevenLabs/Private AI switch and React Doctor 100/100 fixes in working tree). `bun run check`, `bun run build`, and `bun x react-doctor@latest .` (100/100, 0 issues) green: 0 lint errors, 43/43 tests.

## Shipped (on the branch)
- AI SDK (`ai` + `@ai-sdk/openai-compatible`) in `/api/chat/session` + ElevenLabs voice / Private AI switch in `ElevenLabsMascot.tsx` and `MascotWidget.tsx`, brought to **React Doctor 100 / 100** (0 errors, 0 warnings across 108 files) | working tree
- Redesigned `/blog` & `/blog/[slug]` with the lazy-summer Perth workbench aesthetic (`#2f3a33` / `#ab4b3d` / `#f6f3ea` / `#d8dfca`, Fraunces Soft Wonk 800, Manrope 800 rounded pill labels, large arch + 3 organic blobs + terracotta sun crop + botanical branch, 3-line wavy dividers for `<hr>`, Good'Ai sketchbook art `1-sketch.webp`..`14-sketch.webp`, markdown table rendering) | `aba86f0`
- Customised CTA buttons per context (`Sign me up`, `I’m sold`, `Yes, please`, `Subscribe to newsletter`, `Improve my life`) + merged `origin/main` PRs #327 & #315 | `b4a2a6a`
- `/admin-engine` "Under the hood" fresh-eyes analogy framing + aligned stack panel | `c6735f5`

## Open (max 5)
- Commit and push the AI SDK + ElevenLabs/Private AI switch + React Doctor 100/100 fixes on `feat/under-the-hood`, then merge `feat/under-the-hood` → `main` so live `goodai.au` gets all updates
- Optional: wire inline 1-field email input on `/blog` & `/blog/[slug]` ("Subscribe to newsletter" -> posts to `/api/contact`)
- Untracked `.agents/skills/*`, `.claude/skills/*`, `agent/` (~250 files from `bunx skills add`) | gitignore vs commit
- Vendor logos/branding for the stack layer (Trillet certs, Liquid LFM3) | later, per Kev
- Anatomy skill (wheresryan22/anatomy, MIT): candidate for empty homepage slot where workflow demo was

## Blocked
- About page (founder talk on human-centric AI policy) | needs Kev's policy draft | nothing tried yet

## Decisions
- Machine HTML is the source of the page's wording; edit the machine, then copy into `lib/stack.ts`, and the test enforces the match
- Page stays general (no vendor logos) until the branding pass
- Kev's word on his own vendors is enough → memory `kevs-word-on-vendor-facts`
- Next new site uses motionsites; goodai.au isn't redesigned

## Next action
Commit & push the AI SDK chatbot switch + React Doctor 100/100 fixes on `feat/under-the-hood` and merge to `main`.
