# TODO

Actionable list. See `.planning/STATE.md` for full context on each item — this file is the checklist, STATE.md is the why.

## P0 — Blocking

- [ ] **Merge PR #64** (`claude/webdev-eval-migration-ppyy9p`) — fixes the 3-week production outage (typecheck error + Next.js 16 prerender bug). Nothing else in this list matters until production is deployable again.
- [ ] Add a branch-protection rule on `main` requiring `npm run build` to pass before merge. This did not exist and is the reason a broken build sat unnoticed for 19 deploys — see STATE.md "Build Health Incident."

## P1 — Should fix soon

- [ ] `api/demo-automation/route.ts:254` still defaults the *demo* webhook to `http://localhost:5678/webhook/goodai-demo` when the request body omits a URL. Wrapped in try/catch (degrades, no 500) but should read an env var for consistency with `trigger-call`.
- [ ] Watch vercel/next.js issues #84994, #85668, #86178, #87719 (the `/_global-error` prerender bug). When closed, re-evaluate reverting the Next 15.5.20 pin + two-phase build script back to a normal Next 16 + `next build`.
- [ ] Node 20 → 24 migration. Vercel deprecates Node 20 on 2026-10-01; `package.json` engines currently pins `>=20.9.0 <21`. Needs its own tested pass, not a drive-by change (see STATE.md).
- [ ] Dead code: `src/components/hero/Hero.tsx` and `src/components/voice-agent/VoiceAgentHero.tsx` appear to be superseded by `src/components/voice-agent/gem-voice.tsx` (the one actually wired into `HomeClient.tsx`). Confirm unused and delete, or document why both are kept.

## P2 — Deploy-side (product launch gate, not code)

- [ ] Set required Vercel env vars: `AI_GATEWAY_API_KEY`, `ELEVEN_API_KEY`, `ELEVEN_DEFAULT_VOICE`, `NEXT_PUBLIC_GWS_SCRIPT_URL`, `N8N_CALL_WEBHOOK_URL`, `GWS_CLI_PATH`, `NEXT_PUBLIC_ASR_URL`.
- [ ] Host ASR + n8n services referenced by the above env vars.

## Housekeeping

- [ ] `.planning/codebase/*.md` and `.planning/research/*.md` are dated 2026-05-25 and describe an earlier, since-superseded phase (empty `ChatInterface.tsx`, zero-byte fonts, etc. — none of that matches current `src/`). `STATE.md` (last updated 2026-07-08) supersedes them; they haven't been reconciled. Low priority, but a future agent skimming `codebase/CONCERNS.md` cold will get a stale picture.
