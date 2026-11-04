---
updated: 2026-11-04
by: gemini-4-argon (Antigravity)
surface: goodai-studio
---
# STATE: goodai-studio
Full rewrite every time it's updated: current truth only, no history. History lives in git, `memory/` and the weekly catch-ups. Max ~300 words. Detailed feature map: `state/WEBSITE-STATE.md`.

## Now
goodai.au (Next 16, Vercel `goodai-mate`). Work sits on branch `feat/under-the-hood` (`c6735f5` pushed, **not merged to main**). `bun run check` + `bun run build` green: 0 lint errors, 43/43 tests.

## Shipped (on the branch)
- Customised CTA buttons per context instead of generic "Suss the fuss": Hero (`"Sign me up"`), ScrollStory (`"I’m sold"`), Goodie mascot (`"Yes, please"`), Blog footer (`"Subscribe to newsletter"`), TechSpecs/CTA (`"Improve my life"`), Services/Mobile nav (`"Sign me up"`) | `Hero.tsx`, `ScrollStory.tsx`, `MascotWidget.tsx`, `app/blog/[slug]/page.tsx`, `TechSpecs.tsx`, `CTA.tsx`, `Shell.tsx`, `app/services/[slug]/page.tsx` (uncommitted)
- `/admin-engine` "Under the hood" fresh-eyes framing: H1 `"The Good’Ai machine: an analogy for how we run your admin."` + dry intro + 3D card header + aligned stack panel | `c6735f5`
- Self-hosted LFM3-Omni-2B voice/chat in Goodie | `1e2eeb3`

## Open (max 5)
- Optional: wire inline 1-field email input on `/blog` & `/blog/[slug]` ("Subscribe to newsletter" -> posts `{ contact, headaches: ["Newsletter"] }` to existing `/api/contact` SMTP/n8n pipeline)
- Commit and push copy tweaks on `feat/under-the-hood`, then merge to `main`
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
Finish any remaining site tweaks from Kev, optionally wire the inline blog newsletter email field, then commit, push, and merge `feat/under-the-hood` to `main`.
