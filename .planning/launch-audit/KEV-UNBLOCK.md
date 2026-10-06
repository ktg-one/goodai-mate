# KEV — unblock cash path (site is waiting on you)

Code on `phase/01b-launch-blockers` is launch-blocker complete (Round 2 gates green). Agents cannot finish go-live without secrets and a host.

## Do these in order (30–45 min)

1. **Rotate Resend** if the old key ever lived in git history (`.env.example` placeholder added and real key removed from tracked template; history may still hold it).
2. **Create `.env.local`** from `.env.example` and set at least:
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL=hello@goodai.au` (or your real inbox)
   - `NEXT_PUBLIC_SITE_URL=https://goodai.au`
   - For voice: `TRILLET_API_KEY` + `NEXT_PUBLIC_TRILLET_AGENT_ID` (+ optional `TRILLET_ALLOWED_AGENT_IDS`)
3. **Verify domain** `mate@goodai.au` (or FROM address) in Resend.
4. **Local smoke**
   - `npm run build && npx next start -p 3123`
   - POST a real enquiry from `/contact` — check hello@ inbox
   - Ring `(08) 7741 4191` and try `/demo` mic if Trillet is set
5. **Host env** — same vars on Vercel/Railway (wherever goodai.au points). No empty `RESEND_API_KEY`.
6. **Approve privacy/terms** wording (already public-safe; sign-off is business, not code).
7. **Tell asta** to integrate/commit `phase/01b-launch-blockers` (exclude Kevin’s dirty `VisualStory` / `PerthSketchbook` unless you want them).

## Then make money (not more website)

See `.planning/gtm/first-10-clients.md` Day 0–2:
- Google Business Profile
- 60-name list from public listings
- 15 warm intros
- Free audit door → voice pilot

Without step 2–5, the form returns 503 and outbound has nowhere clean to land.

## Agent status

- Launch blockers + review Round 2: **done**, waiting re-review/integrate
- Phase 3 motion, Phase 4 site-wide voice, Phase 6 quick-dive: **later / need decisions**
- No further site code unblocks first invoice
