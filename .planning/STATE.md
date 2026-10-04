# Project State

**Last updated:** 2026-10-04 (pricing removed, tests wired and passing, docs realigned — see next section)
**Branch:** `revert/hero-tree-to-static-image` (PR #249, pushed; through commit 057712f). `main` on GitHub is a different line — see "GitHub".
**Milestone:** v1.0 Launch — see `.planning/ROADMAP.md`
**Site status:** not open yet; no live traffic. Next.js app = goodai.au (once the domain moves).

## 2026-10-04 — cleanup session

- **Pricing removed properly, not just hidden.** The 2026-10-02 session hid prices at the render sites but left `price`, `priceNote` and `range` in `lib/services.ts` (STATE.md line 14 said "data is unchanged"). All three fields are now stripped from the data itself and from every reference: `ServiceCard`, `ServicesCarousel`, the services page hero and all five `/services/[slug]` pages. The site publishes no prices at any layer, so a future render site can't reintroduce them by accident.
- **Tests wired and green** — 9 pass via `npm run test`; `npm run check` = lint (0 errors) + motion lint + tests.
- **Real bug found and fixed:** the footer's external `Field notes` anchor had no `target="_blank"` and no `rel="noopener noreferrer"`. The old link test *should* have caught it but failed earlier on `href={SURVEY_URL}`, which is internal now.
- **Drift fixed:** `.planning/config.json` said `node_version: 18+` (Next 16 needs `>=20.9.0`) and `test_command: null`.
- **Docs realigned to the code:** `PROJECT.md` (real architecture map, parked components, correct colour tokens, `npm run check` gate) and `ROADMAP.md` (Phase 1 done-work + open questions, Phase 5 corrected from "plans `/api/lead`" to "shipped as `/api/contact`, webhook and rate limit outstanding").
- **Still needs Kevin:** the `klint/` orphan gitlink (see ROADMAP Phase 1), and whether to delete or park the old-design components — `Pricing.tsx` is now doubly redundant.

## 2026-10-02 — hive office session (committed + pushed as 057712f, 2026-10-04)

Agents (god, Jake, Gina, temps) worked in this tree, then Kevin took webdev back. `npm run lint` (0 errors) and `npm run build` (17 routes) both pass on the result.

- **Build:** `npm run build` passes again (checked 2026-10-02). Before that it failed because `components/` had been moved into `docs/components/` on 1 Oct after commit e0ec5d5. Nobody knows who moved them.
- **components/:** Jake used `git restore` on 28 files that pages import: the carousel (all of it), `sections/ServicesCarousel`, and studio `Shell`, `PerthSketchbook`, `ScrollStory`, `HeroStudy` and others. 35 other files are still deleted. `docs/components/` (untracked parked copies) was left untouched, so the restored files now exist twice.
- **Copy (Gina):** `app/page.tsx` text rewritten to say what we do, and all prices hidden ("Talk to us"). `app/services/[slug]/page.tsx` hides price/range/priceNote. `lib/services.ts` data is unchanged. The scroll-story lines are proposed in `.planning/COPY.md` but NOT applied to `ScrollStory.tsx`.
- **Lint:** the GSAP/ScrollTrigger checks were removed from `scripts/ktg-lint.mjs` and the GSAP selectors from `eslint.config.mjs`. Ignores now include `hive/**` and `docs/components/**`. The `CLAUDE.md` lint section was updated. `npm run check` exits 0.
- **klint/** (its own git repo): rewritten to the Good'Ai design system from DESIGN.md (`design-system.lint.json`, `.oxlintrc.json`, `instructions/AGENTS.md`, `bin/ktg-lint.mjs`). It needs a `.gitignore` before committing (it has `node_modules/`).
- **New planning files:** `SITE-MAP.md` (routes and imports map), `OFFER.md` (offer draft from web research; weak, so redo it from Kevin's own market research), `COPY.md`, `BRAIN-DUMP.md` (Kevin's raw requests from 2026-10-02).
- **Kevin's decisions, 2026-10-02:** the services and prices in `lib/services.ts` are legacy. The new offer is 4 buy paths: Workflows, Voice agent, Consult, Integrations. Workflows are sold as a "Top 10" catalogue drawn down from a retainer. Never compete on the A$99 voice floor. Prices stay hidden until the offer is agreed.
- **Flip book:** new spreads are committed in `public/assets/sketches/` (01-stress x3, mess, mess2) next to perth-*.png and bg-wash.jpg. **They are not in the hero yet** — nothing references them; they are art waiting to be cut into plates. The hero still runs on the 2 cut plates wired in `components/studio/PerthSketchbook.tsx` (`plates/the-inbox.webp`, `plates/fremantle.webp`), with 5 more cut plates already sitting unused in `public/sketchbook/plates/`. Kevin expects ~5 more images once the whole set is put together. Story arc and the frames that need new art are below.
- **Parked hive cards:** GST-3 restore leftovers, GST-5 SVG shapes (plugin plus signature file unknown), GST-6 flip book, GST-9 4-path site. The office is now the analysis/strategy team, not webdev.

## Where things are

- **Top of home:** ThreeUI sketchbook (`components/studio/PerthSketchbook.tsx` → `src/shaders/sketchbook/`). Pages are now **2**: the inbox plate (tradie with phone calls) and the Fremantle brewery; `land={1}`. Other cut plates still in `public/sketchbook/plates/` (the-office, city-freeway, kings-park, swan-river, cottesloe).
  - The book loops forever (`(idx+1)%M`). Intro riffle is slow→fast→slow; first/last flips were slowed from 0.26s to 0.6s via a patch in `sketchbookDocument.js`. Phones / reduced motion skip it and open on the landing page.
  - `sketchbookDocument.js` patches: arrow-click bug, riffle timing. `next.config.ts` sends CORS headers for `/sketchbook/*.woff2`.
- **Hero:** `components/sections/Hero.tsx` — copy lives in the component, the three CTAs are wrapped in `<Magnetic>` (`components/ui/MagneticButton.tsx`), and it still renders `<HeroStudy />`, the faint golden-spiral study. Was inline in `app/page.tsx` until the 2026-10-04 merge with `main`.
- **Parked components (restored 2026-10-04, unimported):** 36 files culled as "dead code" were brought back because they are still wanted and simply not rebuilt into the Perth design yet. Nothing imports them, so the build is unaffected. Old-design page sections: `ProductDemo`, `Features`, `Pricing`, `TechSpecs`, `Testimonials`, `VisualStory`, `InfiniteMarquee`, `CTA`, `FAQ`, `Hero`, `Footer`, `Navbar`. shadcn primitives to keep: `tabs`, `button`, `card`, `badge`, `avatar`, `accordion`, `sheet`, `switch`, `separator`. Old voice stack, superseded by Trillet: `ElevenLabsWidget`, `BrandedElevenLabsWidget`, `BrandedVoiceWidget`. `ProductDemo` is the **automation** demo (Today / Jobs / Rules tabs), not voice — `WorkflowPreview` is its Today tab and is already live on the homepage. Prune deliberately later, with the rebuild in view.
- **Preloader:** brand wordmark `Good’Ai.` (paper bg, ink text, rust apostrophe/dot) with a fade-up.
- **Motion:** Lenis + preloader + pinned `ScrollStory` only. A scroll jerk after the story was reported and is **not diagnosed** (candidates: ScrollTrigger.refresh on font load / layout shift, the sketchbook iframe, wheel inertia). Seam between sketchbook bottom (`#ece7dc`) and hero is visible; fix proposed (fade the bottom of `.perth-sketchbook`), not applied.
- **Leads:** `/contact` now POSTs to `app/api/contact/route.ts` → Resend, from `Good'Ai <mate@goodai.au>` to `hello@goodai.au` (override `CONTACT_TO_EMAIL`). Honeypot on `website`. Fails honestly (503/502) when the key is missing. Not tested with a real send. **No webhook and no rate limiting** — `LEAD_WEBHOOK_URL` was never wired, and the ROADMAP's `/api/lead` route was replaced by `/api/contact`.
- **Voice:** Trillet widget only on `/demo`, never tested with a real call.
- **Lint:** `lint:motion` enforces the 10000px `.home-page` floor and THREE listener teardown, and skips missing dirs. GSAP is live (`ScrollStory`, `SmoothScroll`, `Preloader`, `carousel/ring`) but its ScrollTrigger tripwires were removed because nothing trips them — no file uses `toggleActions` or an unbounded `pin`, and `HomeScroll.tsx` (the `once: true` rule) is parked. `npm run lint` = 0 errors, 149 warnings, up from 40: the restored parked components carry ~109 old-design `no-arbitrary-values` warnings. None ship, since nothing imports them. `story-text-section` / `story-visual` are allow-listed again for the restored `VisualStory.tsx`.
- **Tests (fixed 2026-10-04):** were failing with `ERR_MODULE_NOT_FOUND` — they imported `"./services"` extensionless, which Node's ESM resolver rejects — and there was no `test` script in `package.json`, so none of it ever ran. Now: explicit `.ts` extensions, `allowImportingTsExtensions` in `tsconfig.json` (without it `npm run build` fails type checking), a `test` script running `node --test --experimental-strip-types "lib/*.test.ts"`, and `npm run check` chaining lint + motion lint + tests. 9 tests pass. The link tests also asserted `target="_blank"` on every anchor, which had been failing since `SURVEY_URL` became the internal `/contact` route; they now only require target/rel on external `https?://` anchors and only scan components the app actually renders.
- **The intake chain is intact and was not touched:** `SURVEY_URL = "/contact"` in `lib/links.ts` → `/contact` renders `<SussTheFussCard />` ("We'll Suss the Fuss") → `POST /api/contact` → Resend. `lib/links.ts` itself was never modified.

## Story plan for the sketchbook (Kevin, 2026-10-01)

Arc: pain → pain → pain → question → leave the pains → sunshine. Light moves cold/dim → warm.
1. Inbox plate (exists). 2–3. Pain crops cut from the same inbox plate (phone badges, laptop, paper stacks) — no new art.
4. The pains cancel one by one ("ding ding"), logo travels to the door, hand opens it, door handle becomes a beer mug, mugs clash (zoomed cheers frame), then flick to the Fremantle brewery (exists).
Needs new art: door/handle/mug frames, cheers close-up. About 9–10 frames in the run. Existing office plate is too bright for a "pain" and was dropped. Open: stop at the last page vs keep looping with a scroll cue (not decided).

## Headless content (Instatic) — plugins installed 2026-10-04

- Next.js is goodai.au and owns all design/tokens. Instatic (Railway project BLOG, admin `goodai.up.railway.app/admin`) is the content backend: blog posts and a `services` Data table.
- **Kevin installed the plugins 2026-10-04** (content-api plus the others), following a video walkthrough. So the CMS route is live after all — the earlier "we have no console control" reading was wrong and was reverted.
- Plugin source is `instatic-plugin/content-api/server/index.js`, shipped as `goodai-content-api.plugin.zip`. It mounts at `/admin/api/cms/plugins/goodai.content-api/runtime/` and serves `/posts` (published only) and `/services` as `{ table, records, totalCount }`. Entries come back as `{ id, slug, cells: { <fieldId>: value } }`, so field access is `cells.price`, not `price`.
- **Known fragility:** the handler registers POST unconditionally and registers GET *only if the host exposes `pub.get`*. Public GET was undocumented when this was written. Until a real GET is confirmed working, nothing can rely on it.
- **Tested from outside 2026-10-04, both methods 404:**
  - `GET  /admin/api/cms/plugins/goodai.content-api/runtime/posts` → 404
  - `POST /admin/api/cms/plugins/goodai.content-api/runtime/posts` → 404
  - `POST /admin/api/cms/plugins/goodai.content-api/runtime/services` → 404

  **This does not prove the plugin is missing.** An unauthenticated 404 on an `/admin/api/` path is consistent with either (a) the plugin not being installed/enabled under that id, or (b) the plugin being installed but admin routes hidden from unauthenticated callers. Cannot be distinguished from outside. Kevin has to check in the admin UI: is `goodai.content-api` listed and enabled, and does the plugin UI expose a public base URL? Until then `lib/instatic.ts` has nothing reliable to call.
- **Field ids for the `services` table: `slug, name, line, description, items, detail, order`** — `price`, `priceNote` and `range` were dropped on 2026-10-04 when pricing was removed from `lib/services.ts`. Add them back only if Kevin decides the CMS should hold prices the site does not render.
- Posts audit (19 published, for the record): fields title/slug/body(HTML)/featuredMedia/seoTitle/seoDescription. Gaps: no real publish date (all `2026-08-16` import time), no excerpt, no author/category; some slugs don't match titles; one title typo ("Australia s").
- **Not built yet:** `lib/instatic.ts` client, wiring home/services/sitemap to it, `/blog` + `/blog/[slug]` pages, and the footer "Field notes" link. Note the service pages are currently `generateStaticParams` off `lib/services.ts` with no `revalidate` — if the CMS becomes the source of truth, a build-time fetch would mean CMS edits need a redeploy to appear.
- **The footer "Field notes" link is CORRECT.** Verified 2026-10-04 by fetching it: `https://goodai.up.railway.app/` is the **published public blog** ("GOOD AI • FIELD GUIDE FOR THE FUTURE", 19 essays, newsletter signup) — not an admin page. The admin is the separate `/admin` subpath. An earlier note here wrongly called it "the CMS admin host"; that was a misreading of the `/admin` suffix and has been removed. The only real defect was the missing `target="_blank"` / `rel="noopener noreferrer"`, now fixed.
- **This means `/blog` + `/blog/[slug]` are not needed for v1.0.** The blog is already published and live at its own URL. Building a native blog route would duplicate content that already renders. Revisit only if you want the essays inside goodai.au for SEO.

## Decided 2026-09-30 / 10-01

- **No n8n for the site.** Instant work in Next.js API routes; heavier follow-ups via an agent + skill using the Google Workspace CLI (`gws`). n8n on Railway (`gai-n8n-new`) is parked. Composio is only a remembered preference in CompanyOS wiki; nothing built.
- **Email via Resend.** Visitor-facing mail from `mate@goodai.au`. Lead alerts to `hello@goodai.au` — **not** `bigkev@` (Kevin doesn't want his name public). STATE previously planned "Big Kev, Founder" as the visitor sign-off; this conflicts and is **undecided** — no visitor confirmation is sent yet.

**Blocking launch:** `RESEND_API_KEY` (in `.env.local` and Vercel env) and goodai.au verified in Resend; `hello@goodai.au` alias to exist in Workspace.

## GitHub

`ktg-one/goodai-mate` `main` has 16 bot commits (Jules/Bolt/Palette) not in this branch; this branch has 7+ not in `main`. ~40 stale bot PRs open. Kevin thinks this branch should be the canonical `main`. **Not done** — needs explicit go-ahead to force-push; plan: tag old `main` as `backup/main-2026-10-01`, run `npm run check` + `npm run build`, then `git push --force-with-lease origin <branch>:main`. Local-only, deliberately not committed: `.agents/ .claude/ .codegraph/ klint/ bun.lock skills-lock.json public/brand/hero public/sketchbook/perth*.png components/layout/HomeScroll.tsx components/studio/SketchbookFlip.tsx`, plus the agent runtime now covered by `.gitignore` (`.serena/ hive/ palace/ roster.json roster-backups/ hallways.json docs/components/`). `public/assets/sketches/` **is** tracked — it is the hero's source art.

## Open decisions (Kevin)

1. Sketchbook ending (stop vs loop + cue) and new plates; page transition (crossfade via React `<ViewTransition>`, no config needed in Next 16) — proposed, not built.
2. Services pricing, order (voice agents, then workflows first), nav "Contact us" at the top — Kevin is retrieving pricing / doing market research.
3. Quick-dive output, runtime, model, cost cap, review step (Phase 6).
4. Visitor email sign-off (see above).

## Next

Kevin: upload plugin 0.1.2; create `services` table; add `publishDate`/`excerpt` to posts; set Resend key; make plates. Then Claude: fill services, write `lib/instatic.ts` + `/blog`, fix sketchbook seam, trim lint:motion.
Also running: original Aug-26 site at `../goodai-original` (git worktree, `npm run dev` on :3001) for reference only.
