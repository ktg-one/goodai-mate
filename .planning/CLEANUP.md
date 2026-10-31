# Cleanup queue (2026-10-28)

Found while reorganising `public/` on branch `chore/bun-only`. Section A is for agents. Section B waits on Kev.

Kev's bar: if it doesn't affect site speed or load time, it's optional. Only **C2** touches the live homepage load (three failed requests on every visit). Everything else is housekeeping.

## Rules for every agent

- Work on the current branch, or on a `chore/cleanup-*` branch cut from it. Never commit to `main`.
- Use bun only (`bun run …`, `bunx …`). Never npm or pnpm, and never add a lockfile.
- One task per commit. Message: `chore(cleanup): C<n> <title>`.
- Before deleting a file, grep for its name (without the extension) across `app components lib src scripts next.config.ts`. If anything still imports it, stop and log it under "Blocked" below.
- Every task must end with all of these passing:
  ```bash
  bun run check          # lint 0 errors, lint:motion, tests
  bun run build
  bash scripts/verify-ctas.sh
  ```
- Leave alone: `.claude/`, `.agents/`, `agent/`, `skills-lock.json`, `klint/`, `.venv/`, `hive/`, `.kilo/`.
- Never read or print `.env*` files.
- Tick the box here when a task is done. If you get blocked, log it and move to the next task.

---

## A. Agent tasks (safe, mechanical)

- [ ] **C1 Delete the old flat sketchbook.**
  - `components/studio/SketchbookFlip.tsx` is not imported anywhere. The 3D `PerthSketchbook` replaced it.
  - Delete the file and the 23 `.sbf*` rules in `app/globals.css` (they start near line 2470: `.sbf`, `.sbf-book`, `.sbf-spread`, `.sbf-slice`, `.sbf-leaf`, `.sbf-face`, `.sbf-hit`, `.sbf-meta`, `.sbf-caption`, `.sbf-count`, plus any keyframes they use).
  - Verify: `grep -rn "sbf" app components` returns nothing.

- [ ] **C2 Stop the book requesting three missing images.**
  - In `src/shaders/sketchbook/sketchbookDocument.js`, the `CANONICAL_SKETCHBOOK_HTML` string contains three `<img>` tags:
    - `<img class="botany l" src="sketchbook/botany-left.png" …>`
    - `<img class="botany r" src="sketchbook/botany-right.png" …>`
    - `<img class="bloom" src="sketchbook/bloom.png" …>`
  - These files don't exist. The images are already hidden with CSS (`.botany{display:none}`, line 21), but the browser still requests them, so every homepage visit gets three 404s.
  - Remove the three tags from the string. Leave the rest of the template alone.
  - Verify: run `bun run build && bunx next start -p 3101` and open `/` in Playwright. The network log must show no 404 under `/images/book/`, and the book must still render and turn pages.

- [ ] **C3 Unused import on /contact.**
  - Remove `ArrowUpRight` from the lucide import in `app/contact/page.tsx`.
  - Verify: `bunx eslint app/contact/page.tsx` shows no `no-unused-vars`.

- ~~**C4 Restore the /lab carousel images.**~~ Dropped (Kev, 2026-10-28). The carousel only renders on `/lab`, which is noindexed and code-split, so its missing images don't affect site speed. Leave it alone.

- [ ] **C5 Delete the duplicate Goodie sprites.**
  - `characters/goodie/{directions,reactions}.png` are byte-identical (md5) to `public/mascots/goodie/`, which is the copy the site loads.
  - Grep for `characters/` in code and in `.claude/skills/page-mascot`. If nothing references it, `git rm -r characters`.

- [ ] **C6 Remove the retired Trillet voice code.**
  - Nothing mounts the Trillet widget; ElevenLabs is the live voice.
  - Delete:
    - `components/studio/TrilletVoiceWidget.tsx`
    - `app/api/voice/call/route.ts` (and the empty `app/api/voice/` folders)
    - `lib/voice.ts`
    - `lib/voice.test.ts` (the test count drops; that's expected)
    - `components/studio/VoiceDemo.tsx` (unused)
  - In `next.config.ts`, change the CSP comment on line 12 to drop "+ Trillet". **Do not change the CSP value itself.**
  - In `CLAUDE.md`, replace the "Trillet (retired)" bullet with one line saying the code was removed.
  - Verify: `grep -rni trillet app components lib src next.config.ts` returns nothing.

- [ ] **C7 Delete clearly dead non-design files.** None of these is imported anywhere:
  - `components/studio/StudioMotion.tsx`
  - `components/layout/HomeScroll.tsx`
  - `src/shaders/Scene.tsx` (the old sketchbook scene; `PerthSketchbook` renders `Sketchbook` directly). Check that `src/shaders/threeui.css` is still imported by `GenerativeTree.tsx` before deleting Scene.
  - `components/carousel/ring/gui.js` (a dev-only lil-gui panel; first grep `components/carousel` for `gui`)
  - Verify: the build passes and `/lab` still renders.

- [ ] **C8 Fix lint warnings in live pages only.**
  - `app/lab/page.tsx`: 4 × `no-arbitrary-values`. Swap them for theme tokens or scale classes.
  - `app/contact/page.tsx`: 1 × `no-arbitrary-values` (`min-h-[100dvh]`). Use `min-h-dvh`.
  - `src/shaders/elements/sources/generative-tree.html.js`: `import/no-anonymous-default-export`. Name the export (`const source = …; export default source;`).
  - Verify: the warnings in these three files are gone, and the total count is below 52.

- [ ] **C9 Fix stale docs.**
  - `CLAUDE.md`: "`HeroTree.tsx` lives only on `/lab`" is wrong, because nothing imports it. Change it to "parked, unimported".
  - `docs/JULES-HANDOFF-PLAN.md`: mark the empathy-section task as done/moot. The `#been-tough` section was removed on 2026-10-28.
  - `CLAUDE.md`: after C1–C7, remove any mention of deleted files.

---

## B. Needs Kev (agents: do not touch)

| # | Item | Why it waits |
|---|------|--------------|
| K1 | Parked old-design components: `components/sections/{CTA,FAQ,InfiniteMarquee,TechSpecs,VisualStory}.tsx`, `components/ui/{CustomCursor,InteractiveWorkflowCanvas,Noise,ParallaxImage,StaggeredText,TextScramble,avatar,badge,card,separator,sheet,switch,tabs}.tsx`, `components/studio/HeroTree.tsx` | Kev kept these as reuse material (2026-10-04). All are unimported and carry most of the 52 lint warnings. Delete all, keep all, or pick. |
| K2 | `app/tokens/{colors,fonts,spacing,typography}.css` | The old navy palette, not imported (only `effects.css` is). Delete? |
| K3 | `klint/`: a 225 MB gitlink (mode 160000) with no `.gitmodules` | A broken submodule. Remove it from the index (`git rm --cached klint`) and from disk? |
| K4 | `.venv/`: 262 MB of local Python, gitignored | Local only. Delete if nothing in this repo needs Python. |
| K5 | Root stray files: `TASKS.md` (stale), `README.md` (upstream "Zenith" template), `battle-test-2026-10-14.md`, `impeccable-detector.json` | Archive to `docs/archive/`, rewrite, or delete. |
| K6 | Uncommitted skill folders: `.agents/skills/*`, `.claude/skills/{codebase-cleanup-refactor-clean,find-skills,improve-codebase-architecture,vercel-react-best-practices}`, `agent/`, `skills-lock.json` | Commit them as project skills, or leave them local. |
| K7 | Production header changes on this branch: CORS on `/fonts/*` (replaces the `/brand/*.ttf` and `/sketchbook/*.woff2` rules), and same-origin framing for `/machine/*` | CLAUDE.md requires Kev's sign-off before they ship to `main`. |
| K8 | `.env` committed in 07a8205 (2026-06-14) in the public repo | Revoke the Vercel token and the AI gateway key. n8n and Trillet are stale. Scrubbing history is optional. |

## Blocked

_(agents log here: task, what stopped it, what was tried)_
