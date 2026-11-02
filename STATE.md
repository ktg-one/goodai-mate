---
updated: 2026-11-02
by: gemini-4-argon (Antigravity)
surface: goodai-studio
---
# STATE: goodai-studio
Full rewrite every time it's updated: current truth only, no history. History lives in git, `memory/` and the weekly catch-ups. Max ~300 words. Detailed feature map: `state/WEBSITE-STATE.md`.

## Now
goodai.au (Next 16, Vercel `goodai-mate`). Work sits on branch `feat/under-the-hood` (pushed, **not merged to main**). `bun run check` + `bun run build` green: 0 lint errors, 43/43 tests.

## Shipped (on the branch, part uncommitted)
- `/admin-engine` "Under the hood" fresh-eyes framing: H1 `"The Good’Ai machine: an analogy for how we run your admin."` + dry intro (`"No, we don’t build conveyor belts — we just wanted to put a really cool 3D render on the site to show that we can, and this is our excuse..."`) + 3D card header (`"Visual analogy · Each part = one service"` / `"The Good’Ai machine."`) | `app/admin-engine/page.tsx`, `public/machine/goodai-machine.html`
- Page panel mirrors the machine's labels word for word (3 layers: Labels / Cut away / Explode); a test parses the machine HTML and fails if they drift | `lib/stack.ts`, `lib/stack.test.ts`, `components/studio/StackPanel.tsx`
- Estimates disclaimer restored under the machine | `components/studio/MachineDemo.tsx`
- Self-hosted LFM3-Omni-2B voice/chat in Goodie | `1e2eeb3`

## Open (max 5)
- Commit the machine + panel alignment + fresh-eyes copy | ready once check + build finish
- Vendor logos/branding for the stack layer (Trillet certs, Liquid LFM3) | later, per Kev; add to machine labels first, page follows
- Anatomy skill (wheresryan22/anatomy, MIT, v1.0 2026-10-10): invents a machine that maps 1:1 onto an idea, as an isometric figure | candidate for the empty homepage slot where the workflow demo was (BRAIN-DUMP); install per-project: `bunx skills add wheresryan22/anatomy -a claude-code`
- Merge `feat/under-the-hood` → main | preview check first
- Untracked `.agents/skills/*`, `.claude/skills/*`, `agent/` | agent decides commit vs gitignore

## Blocked
- About page (founder talk on human-centric AI policy) | needs Kev's policy draft | nothing tried yet

## Decisions
- Machine HTML is the source of the page's wording; edit the machine, then copy into `lib/stack.ts`, and the test enforces the match
- Page stays general (no vendor logos) until the branding pass
- Kev's word on his own vendors is enough → memory `kevs-word-on-vendor-facts`
- Next new site uses motionsites; goodai.au isn't redesigned

## Next action
Commit the machine + panel alignment + fresh-eyes copy on `feat/under-the-hood` and verify preview before merging to `main`.
