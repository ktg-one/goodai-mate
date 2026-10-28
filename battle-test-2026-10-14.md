# Good'Ai production battle test — 2026-10-14 (AWST)

Scope: read-only/source inspection plus live HTTP probes of `https://www.goodai.au`. No fixes, deployment, real phone call, or credentials. A single synthetic contact test used `battle-test-2026-10-14@example.invalid` and a `TEST ONLY - discard` note; no real prospect data was submitted. **Do not mistake a GET 200 or a local implementation for an operational lead path.** Browser-level interaction was unavailable: browser harness creation returned HTTP 401, and desktop input was denied in headless single-query mode. Accordingly no mic permission, audio response, chatbot replies, or visual UI interaction is claimed verified.

## Which repository is live?

**Verdict: `C:/Users/kevin/Documents/goodai3/goodai-studio` (`ktg-one/goodai-mate`, main) is the closest identifiable source of the production site, but the exact deployed commit is not independently proven.** `git status` was clean at `f270279dc7b92147c5641ab9fa12b822f07401c5` (2026-10-10). `app/layout.tsx` names `goodai.au`, renders `MascotWidget`; `app/contact/page.tsx` and `/api/contact` correspond to production pages/API behaviour. Live `curl -IL https://goodai.au` returned a 308 to `www.goodai.au` and Vercel 200 with Next.js headers. A prior operations receipt (`03/03-OPERATIONS/outbox/launch-2026-10/2026-10-07-resend-existing-connection.md:43-45`) identified the `www.goodai.au` Vercel alias on `goodai-mate` project, production Ready as of 2026-10-07. The currently deployed commit was not inspected through Vercel.

Candidate elimination: `goodai3/goodai-original` shares `goodai-mate` package/remote but detached at 2026-08-26 with existing modified package files, hence stale; `ktgv2` is `ktg-one` with its own Vercel deploy script and different GitHub remote (`ktg-one/ktgv2`, last commit 2026-09-15); `ktg-one_kismet` is `kismet-website`, remote `ktg-one/kismet` (2026-08-24); `content-hub` has no commits on main and is not a website package. No root `DEPLOY.md` was found in the selected repo; its `README.md` refers to an unrelated Zenith demo, not evidence of deployment. **Important:** a separate unshipped `goodai-studio.worktrees/launch-rc` at `71d2647` has an ElevenLabs text chatbot and `/api/chat/session`; its handoff explicitly says nothing pushed/deployed. Do not test that release branch as if it were production.

## Chatbot (production): FAIL — no text chatbot exposed

Production `app/layout.tsx:67` renders `MascotWidget`; `components/studio/MascotWidget.tsx:49-106` labels its static menu “Goodie quick chat” and offers voice, telephone, and contact links, but **no message input or send control**. The main repo has only two API routes, `api/contact` and `api/voice/call`. Live `POST https://www.goodai.au/api/chat/session` with `{}` returned HTTP **404** and the site not-found HTML, not a chat session. The release candidate's text chatbot (`GoodAiChat.tsx`) is gated by `NEXT_PUBLIC_CHAT_ENABLED=1` and absent from the inspected main code. This is an availability failure, not evidence of a malicious or wrong model answer.

Reproduce: open the deployed homepage, activate “Chat with Goodie”; the menu has “Talk with our AI voice agent”, call, and “Suss the fuss”, with no text field. Alternatively POST `{}` with `Content-Type: application/json` to `/api/chat/session` and observe 404. Browser click itself was not executable in this run, so deployed DOM/menu description is corroborated by main source and server-rendered HTML, not an interactive assertion.

| Adversarial case requested | Status | Actual observation / latency | Correctness, crash, prompt leakage |
|---|---|---|---|
| Empty input | BLOCKED | No production text input; cannot submit | No answer observed; no crash/leak assessment |
| 5,000-character paste | BLOCKED | No production text input | No answer observed; no crash/leak assessment |
| “ignore previous instructions” | BLOCKED | No production text input | No answer observed; no crash/leak assessment |
| Off-topic question | BLOCKED | No production text input | No answer observed; no crash/leak assessment |
| Pricing question | BLOCKED | No production text input | No answer observed; no crash/leak assessment |
| Abuse | BLOCKED | No production text input | No answer observed; no crash/leak assessment |
| Unicode/emoji | BLOCKED | No production text input | No answer observed; no crash/leak assessment |
| Rapid double-send | BLOCKED | No production text input | No answer observed; no crash/leak assessment |
| Slow network simulation | BLOCKED | No production text session to throttle; browser unavailable | No answer observed; no crash/leak assessment |
| Nonsense | BLOCKED | No production text input | No answer observed; no crash/leak assessment |

**0/10 messages sent**; response latency is not measurable. The precondition for testing is to deploy and enable an approved text-chat implementation and provide an operable browser. The source RC has a 1,000-character input limit, but that is *not* a production result.

## Voice agent

| Check | Status | Evidence / next step |
|---|---|---|
| Site and launcher markup | PASS (static only) | `/demo` GET 200; server HTML shows voice demo copy and mascot trigger. Main `MascotWidget.tsx:39-41,78-84` opens `ElevenLabsMascot` and `ElevenLabsMascot.tsx:21-43` loads the ElevenLabs embed. This does not prove widget JS actually runs. |
| Embed availability | BLOCKED | Embed source is `https://unpkg.com/@elevenlabs/convai-widget-embed` (`lib/elevenlabs.ts:2`); URL returned HTTP 302 to a package asset, but browser loading and rendered custom element were not tested. |
| Microphone permission requested only on explicit start | BLOCKED | Browser harness HTTP 401 and desktop input approval unavailable; no mic-permission event observed. No credential should be entered to test this. |
| Conversation and audible response | BLOCKED | No microphone/browser audio session or real phone call was available. Existing hardcoded public ElevenLabs agent ID in `lib/elevenlabs.ts:1` is not proof of live availability. Need a working browser/microphone and a test conversation; if the agent is private, its owner must configure/authorize access, not supply a secret here. |
| Older Trillet bootstrap | FAIL (if used) | `POST /api/voice/call` `{}` returned HTTP 503 `Voice sessions are not available right now.` in ~0.51 s. `app/api/voice/call/route.ts:36-47` requires `TRILLET_API_KEY` and `:50-53` an allowed agent ID. The currently rendered widget uses ElevenLabs, not this route; therefore this result **does not prove** that the visitor-facing ElevenLabs voice widget is broken. Reproduce with that POST. |

## Lead capture

| Visitor path | Status | Actual destination / result |
|---|---|---|
| Homepage, header/footer/services CTAs and mascot “Suss the fuss” → `/contact` | PASS (navigation), FAIL (submission) | `/contact` GET 200. `SussTheFussCard.tsx:31-56` POSTs contact, optional note/tags to `/api/contact`. Live synthetic POST twice returned **502** `We couldn't send that just now. Please call us instead.` (one ~0.56 s). Reproduce with `POST /api/contact` JSON `{"contact":"battle-test-2026-10-14@example.invalid","headaches":["Missed Calls & Voicemails"],"note":"TEST ONLY - discard"}`; expect 502. `app/api/contact/route.ts:58-75` sends via Resend, returns 502 on rejection/network error; intended recipient is `CONTACT_TO_EMAIL` or `hello@goodai.au`. No evidence an email landed. The 502 does **not** identify the precise upstream reason. Browser success/error presentation not interactively verified. |
| Empty `/contact` submission | PASS (validation only) | `POST /api/contact` `{}` returned HTTP 400 `Add a mobile number or email so we can reply.`; UI has required contact field (`SussTheFussCard.tsx:128-141`). This sends no lead. |
| Telephone links (header, footer, home, contact, demo, mascot) | BLOCKED | `lib/links.ts:4-7` supplies a `tel:` link. The phone app/number, connection, agent answering, and downstream lead storage were not called/verified. No real outbound call made. |
| Email fallback on form error | BLOCKED | `SussTheFussCard.tsx:164-179` reveals `mailto:hello@goodai.au` and phone on failure. The mail app, delivery, and inbox receipt were not tested; no email sent. |
| Mascot voice conversation | BLOCKED | Could become a lead through vendor-side handling, but its capture/storage/configuration cannot be established from public source or HTTP GET. ElevenLabs embed, not `/api/contact`, is this path. Verify vendor conversation log and destination with an authorized test once browser/mic works. |
| Legacy GoDaddy-looking apex snapshot | BLOCKED / contradictory extractor | `web_extract(https://goodai.au)` returned “Empowering Businesses with AI” and a different Contact Us form, while a fresh `curl -IL https://goodai.au` returned Vercel 308 to the verified `www` Next.js site. Treat the extractor's apex content as stale/inconsistent; do **not** count or submit that form without a fresh browser inspection. |

The form's intended sink is Resend → configured recipient, not a demonstrated CRM. The earlier 2026-10-07 operations receipt reported missing `RESEND_API_KEY` at that *earlier* snapshot; today's 502 (rather than missing-key 503) suggests a send was attempted, but does not prove a valid key, sender-domain verification, or mailbox delivery. No vendor dashboard or recipient inbox was inspected. Static illustrative workflow on homepage explicitly says “Nothing sent. No tools connected”; do not classify it as lead capture.

## Reproduction / evidence boundaries

- Live: `curl -IL https://goodai.au` → 308 Vercel to `www`, GET `/`, `/contact`, `/demo` → 200 Next.js pages. HTTP probes were made on 2026-10-14 AWST; no secrets printed or entered.
- Live: `POST /api/contact` `{}` → 400; synthetic lead → 502 twice; `POST /api/voice/call` `{}` → 503; `POST /api/chat/session` `{}` → 404. HTTP statuses are production observations; endpoint source mapping is from local main, not a verified production build hash.
- Browser harness initialization failed HTTP 401 Unauthorized. `computer_use` could capture an unrelated Edge window but refused input in single-query mode; no claim of end-to-end UI, microphone, audio, phone or mailbox testing. No slow-network test was performed.
- Next verified step: arrange an approved interactive browser/microphone test and inspect Vercel deployment commit + contact-function logs/Resend response metadata (without exposing keys); separately verify mailbox receipt with the owner. Do not infer the cause of 502 solely from status.
