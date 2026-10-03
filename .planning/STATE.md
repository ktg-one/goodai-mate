# Project State

**Last updated:** 2026-10-01
**Branch:** `revert/hero-tree-to-static-image` (PR #249, pushed; commit e0ec5d5 and later). `main` on GitHub is a different line — see "GitHub".
**Milestone:** v1.0 Launch — see `.planning/ROADMAP.md`
**Site status:** not open yet; no live traffic. Next.js app = goodai.au (once the domain moves).

## Where things are

- **Top of home:** ThreeUI sketchbook (`components/studio/PerthSketchbook.tsx` → `src/shaders/sketchbook/`). Pages are now **2**: the inbox plate (tradie with phone calls) and the Fremantle brewery; `land={1}`. Other cut plates still in `public/sketchbook/plates/` (the-office, city-freeway, kings-park, swan-river, cottesloe).
  - The book loops forever (`(idx+1)%M`). Intro riffle is slow→fast→slow; first/last flips were slowed from 0.26s to 0.6s via a patch in `sketchbookDocument.js`. Phones / reduced motion skip it and open on the landing page.
  - `sketchbookDocument.js` patches: arrow-click bug, riffle timing. `next.config.ts` sends CORS headers for `/sketchbook/*.woff2`.
- **Hero:** text-only, with a faint golden-spiral study (`HeroStudy.tsx`).
- **Preloader:** brand wordmark `Good’Ai.` (paper bg, ink text, rust apostrophe/dot) with a fade-up.
- **Motion:** Lenis + preloader + pinned `ScrollStory` only. A scroll jerk after the story was reported and is **not diagnosed** (candidates: ScrollTrigger.refresh on font load / layout shift, the sketchbook iframe, wheel inertia). Seam between sketchbook bottom (`#ece7dc`) and hero is visible; fix proposed (fade the bottom of `.perth-sketchbook`), not applied.
- **Leads:** `/contact` now POSTs to `app/api/contact/route.ts` → Resend, from `Good'Ai <mate@goodai.au>` to `hello@goodai.au` (override `CONTACT_TO_EMAIL`). Fails honestly (503/502) when the key is missing. Not tested with a real send.
- **Voice:** Trillet widget only on `/demo`, never tested with a real call.
- **Lint:** `lint:motion` still enforces the 10000px `.home-page` floor and requires `components/layout/HomeScroll.tsx` (untracked, dead code). Kevin says these belong to a full scroll story, not this site — proposed trimming to the generic checks (pin needs `end`, no `toggleActions` in story files, THREE listener teardown); not done.

## Story plan for the sketchbook (Kevin, 2026-10-01)

Arc: pain → pain → pain → question → leave the pains → sunshine. Light moves cold/dim → warm.
1. Inbox plate (exists). 2–3. Pain crops cut from the same inbox plate (phone badges, laptop, paper stacks) — no new art.
4. The pains cancel one by one ("ding ding"), logo travels to the door, hand opens it, door handle becomes a beer mug, mugs clash (zoomed cheers frame), then flick to the Fremantle brewery (exists).
Needs new art: door/handle/mug frames, cheers close-up. About 9–10 frames in the run. Existing office plate is too bright for a "pain" and was dropped. Open: stop at the last page vs keep looping with a scroll cue (not decided).

## Headless content (Instatic) — decided 2026-10-01

- Next.js is goodai.au. Instatic (Railway project BLOG, service `corebunch/instatic:latest`, admin `goodai.up.railway.app/admin`) is the content backend: blog posts and a `services` Data table. Next owns all design/tokens. If it looks worse, swap back.
- Instatic has no public API (publishes HTML; session-cookie admin API). Workaround: plugin `instatic-plugin/content-api/` (id `goodai.content-api`, v0.1.2) exposing public `/posts` and `/services` under `/admin/api/cms/plugins/goodai.content-api/runtime/`. Zip: `instatic-plugin/goodai-content-api.plugin.zip` (forward-slash entries). **Only v0.1.0 (old, wrong routes) was ever uploaded; 0.1.2 needs re-uploading by Kevin** — the MCP has no plugin tools. Plugin written from docs, never run; public GET is undocumented (POST always registered).
- `services` must be created by Kevin in `/admin/data` (Data table; no collection-creation tool for the MCP or the in-admin Copilot). Field ids exactly: `slug, name, line, description, price, priceNote, items, detail, range, order`. Data tables have no publish status, so the plugin lists them unfiltered. After the table exists, Claude can fill the 5 services over the MCP from `lib/services.ts`.
- Posts audit: 19 published, fields title/slug/body(HTML)/featuredMedia/seoTitle/seoDescription. Gaps: no real publish date (all `2026-08-16` import time), no excerpt, no author/category; some slugs don't match titles; one title typo ("Australia s"). Proposed: add `publishDate` + `excerpt`. Bylines "By Kevin Tan" are legacy; leave.
- **Not built yet:** `lib/instatic.ts` client (an earlier write was blocked), wiring home/services/sitemap to it, `/blog` + `/blog/[slug]` pages, Footer "Field notes" link → `/blog`. Services stay in `lib/services.ts` as fallback until Instatic has entries.

## Decided 2026-09-30 / 10-01

- **No n8n for the site.** Instant work in Next.js API routes; heavier follow-ups via an agent + skill using the Google Workspace CLI (`gws`). n8n on Railway (`gai-n8n-new`) is parked. Composio is only a remembered preference in CompanyOS wiki; nothing built.
- **Email via Resend.** Visitor-facing mail from `mate@goodai.au`. Lead alerts to `hello@goodai.au` — **not** `bigkev@` (Kevin doesn't want his name public). STATE previously planned "Big Kev, Founder" as the visitor sign-off; this conflicts and is **undecided** — no visitor confirmation is sent yet.

**Blocking launch:** `RESEND_API_KEY` (in `.env.local` and Vercel env) and goodai.au verified in Resend; `hello@goodai.au` alias to exist in Workspace.

## GitHub

`ktg-one/goodai-mate` `main` has 16 bot commits (Jules/Bolt/Palette) not in this branch; this branch has 7+ not in `main`. ~40 stale bot PRs open. Kevin thinks this branch should be the canonical `main`. **Not done** — needs explicit go-ahead to force-push; plan: tag old `main` as `backup/main-2026-10-01`, run `npm run check` + `npm run build`, then `git push --force-with-lease origin <branch>:main`. Untracked folders deliberately not committed: `.agents/ .claude/ .codegraph/ klint/ bun.lock skills-lock.json public/assets/sketches/ public/brand/hero public/sketchbook/perth*.png components/layout/HomeScroll.tsx components/studio/SketchbookFlip.tsx`.

## Open decisions (Kevin)

1. Sketchbook ending (stop vs loop + cue) and new plates; page transition (crossfade via React `<ViewTransition>`, no config needed in Next 16) — proposed, not built.
2. Services pricing, order (voice agents, then workflows first), nav "Contact us" at the top — Kevin is retrieving pricing / doing market research.
3. Quick-dive output, runtime, model, cost cap, review step (Phase 6).
4. Visitor email sign-off (see above).

## Next

Kevin: upload plugin 0.1.2; create `services` table; add `publishDate`/`excerpt` to posts; set Resend key; make plates. Then Claude: fill services, write `lib/instatic.ts` + `/blog`, fix sketchbook seam, trim lint:motion.
Also running: original Aug-26 site at `../goodai-original` (git worktree, `npm run dev` on :3001) for reference only.
