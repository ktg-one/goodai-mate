# Project State

**Last updated:** 2026-09-30
**Branch:** `revert/hero-tree-to-static-image` (uncommitted work — Phase 1 commits it)
**Milestone:** v1.0 Launch — see `.planning/ROADMAP.md`
**Site status:** not open yet; no live traffic.

## Where things are

- **Top of home:** ThreeUI sketchbook (`components/studio/PerthSketchbook.tsx` → `src/shaders/sketchbook/`) with 7 Perth plates cut to transparent WebP in `public/sketchbook/plates/`. Intro flips from the busywork sketches and lands on Cottesloe.
  - `sketchbookDocument.js` accepts `{ pages, land }` and patches the canonical source's arrow-click bug (stage pointer capture swallowed arrow clicks).
  - `next.config.ts` sends CORS headers for `/sketchbook/*.woff2` (the iframe is sandboxed, origin `null`).
- **Hero:** text-only, with a faint golden-spiral study on aged paper (`components/studio/HeroStudy.tsx`, `.hero::before` in `globals.css`). The photo was removed.
- **Tree:** removed from home. Still on `/lab`. `HeroTree.tsx` and `HomeScroll.tsx` are dead code (Phase 1).
- **Motion:** Lenis + preloader + the pinned scroll story only. Scroll reveals were removed in 1dac4ea (Phase 3).
- **Voice:** Trillet widget exists, only on `/demo`, never tested with a real call (Phase 4).
- **Leads:** the `/contact` form fakes success; nothing is sent (Phase 5).

## Decided 2026-09-30

- **No n8n for the site.** Instant work (demo email, lead alert) happens in a Next.js API route. Heavier work (deep dive, follow-ups) goes to an agent + skill on a schedule using the Google Workspace CLI. n8n on Railway (`gai-n8n-new`) is parked.
- **Email via Resend.** Visitor-facing mail comes from `Good'Ai <mate@goodai.au>`, signed "Big Kev, Founder". Lead alerts go to `hello@goodai.au` (changed 2026-10-01 from `bigkev@` — Kevin doesn't want his name public; override with `CONTACT_TO_EMAIL`), with reply-to set to the lead. `sorted@` is reserved for invoices later. No personal name on the site yet.
- **Content:** Instatic, self-hosted on Railway (BLOG project), admin `goodai.up.railway.app/admin`, posts at `/posts/<slug>`. Next.js keeps the intro, scroll story and demo.

**Blocking the build:** `RESEND_API_KEY` in `.env.local` and goodai.au verified in Resend.

## Open decisions (Kevin)

1. Scroll-story art: option a / b / c (Phase 2).
2. Lead delivery: email provider + address, webhook target (Phase 5).
3. Quick-dive output, runtime, model, cost cap, review step (Phase 6).
4. Which untracked folders get committed (`klint/`, `.agents/`, `bun.lock`, `skills-lock.json`).

## Next

Open gate = Phase 1 + Phase 5 (working CTA form) + smoke check. Run Phase 1 alone, then Phase 5 first in Wave 2.
Brand direction after opening: Phase 8 (sun-moving plant shadow) and Phase 9 (Kevin's handwriting drawn down the page on scroll).
Also running: original Aug-26 site at `../goodai-original` (git worktree, `npm run dev` on :3001) for reference only.
