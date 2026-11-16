---
updated: 2026-11-16
by: claude-fable-5-2 (Claude Code, WSL)
surface: goodai-studio
---
# STATE: goodai-studio
Full rewrite on every update. Feature map: `state/WEBSITE-STATE.md`.

## Now
goodai.au (Next 16.4.3, Vercel `goodai-mate`). The site now builds in WSL at `~/projects/sites/goodai-mate`. `main` equals `origin/main` (`ae3e4cf`). Work sits on local branch `chore/wsl-harness-align`, not pushed. On that branch: `bun run check` green (0 lint errors, 45 warnings, 55/55 tests) and `bun run build` green.

## Shipped (branch only, not on `main`)
- WSL install fixed: `node_modules` was a stale Next 15.5 tree; `bun install --frozen-lockfile` restored the locked versions.
- Harness template v2 installed (adds only). `python3 scripts/harness_lint.py .` is clean.
- `CLAUDE.md` is now the pointer `@AGENTS.md`; its guidance moved verbatim to `docs/AGENT-GUIDE.md`; `AGENTS.md` gained a Production section.
- ESLint ignores `public/BRAND-CANON-JULY2026/**` (source of the only 2 lint errors); eight arbitrary Tailwind classes swapped for exact equivalents (warnings 62 to 45).

## Open (max 5)
- Review and merge `chore/wsl-harness-align` | Kev's call, `main` is production
- Harness files are untracked (`agents/`, `tasks/`, `templates/`, `memory/`, `_outbox/`, harness `scripts/*.py`, `.claude/`, `.agents/skills/*`) | gitignore vs commit
- Untracked `public/BRAND-CANON-JULY2026/`, `public/assets/`, `public/_merge-shots/`, `archive/`, `.planning/tmp-*` | keep, ignore or delete
- Optional: one-field newsletter input on `/blog` posting to `/api/contact`
- Blog cover images: upload in Instatic

## Blocked
None.

## Decisions
- `schemas/site-contracts.ts` and `tests/site-contracts.test.ts` guard nav labels, blog imagery, `/admin-engine` copy and chat reliability.
- Blog images come only from Instatic (`coverImage`), never homepage sketches.
- Free workers execute from cards in `_outbox/<task>/`; a different CLI checks. Log: `_outbox/delegation-log.md`.

## Next action
Kev reviews the branch diff, then decides merge and the gitignore question.

## Questions for Kev
- Commit the harness files into this repo, or gitignore them?
- Is `public/BRAND-CANON-JULY2026/` meant to ship with the site? It is in `public/`, so a commit would publish it.
