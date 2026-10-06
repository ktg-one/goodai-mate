# Good'Ai copy rewrite — slogan → what we do

Drafted 2026-10-02 for GST-7. Voice: Perth, lazy summer, plain Aussie. Spelling: **Good'Ai**.
Offer frame (from god / `.planning/OFFER.md`, not yet a live catalogue): **Workflows**, **Voice agent**, **Consult**, **Integrations**.
Do not invent outcomes, numbers, testimonials, prices, or compliance claims.

**Applied now:** `app/page.tsx` (text only) + price hiding (GST-10) in `app/page.tsx` and `app/services/[slug]/page.tsx`.
**Parked:** `docs/components/studio/ScrollStory.tsx` until GST-3. Do not edit it yet.

Keep the headline phrase where it works. The subtitle does the concrete "what we do".

---

## Scroll-story chapters (apply after GST-3)

File: `docs/components/studio/ScrollStory.tsx`

| file:line | current | proposed |
| :--- | :--- | :--- |
| ScrollStory.tsx:11 title | Call it a day. | Call it a day. *(keep)* |
| ScrollStory.tsx:11 copy | Another day done. Leave the follow-ups, copying and chasing with us. | Knock off early. We take the admin off your hands: phone answering, quoting, follow-ups. |
| ScrollStory.tsx:11 note | This is home. | This is home. *(keep)* |
| ScrollStory.tsx:11 caption | Perth. Another day done. | Perth. Another day done. *(keep)* |
| ScrollStory.tsx:12 title | Go on. Knock off early. | Go on. Knock off early. *(keep)* |
| ScrollStory.tsx:12 copy | Pick up the kids. Be there for what matters. The routine work can keep moving without taking the rest of your day. | A voice agent answers the phone while you're out. Enquiries get written down. You pick up the kids. |
| ScrollStory.tsx:12 note | Go see the kids. | Go see the kids. *(keep)* |
| ScrollStory.tsx:12 caption | What matters is waiting. | What matters is waiting. *(keep)* |
| ScrollStory.tsx:13 title | We got you. | We got you. *(keep)* |
| ScrollStory.tsx:13 copy | See your mates. Have a proper arvo. Good work should leave room for a life outside it. | Workflows keep quoting, reminders and follow-ups moving. See your mates. Have a proper arvo. |
| ScrollStory.tsx:13 note | Your time is yours. | Your time is yours. *(keep)* |
| ScrollStory.tsx:13 caption | Less busywork. More living. | Less busywork. More living. *(keep)* |
| ScrollStory.tsx:59 h2 | Another day done. / Go live it. | Another day done. / Go live it. *(keep)* |
| ScrollStory.tsx:59 p | Perth → what matters → relax. | We take the admin: the phone, the quotes, the follow-ups. |

---

## Hero, promise, empathy, headings (`app/page.tsx`)

Line numbers are the pre-GST-7 file. Applied in the same file.

| file:line | current | proposed | applied |
| :--- | :--- | :--- | :--- |
| page.tsx:14 h1 | Good work. / More life. | Good work. / More life. *(keep — brand)* | keep |
| page.tsx:14 hero p | Knock off early. We'll sort it. Admin? Give us the work. Go see the kids. | Knock off early. We take the admin off your hands: phone answering, quoting, follow-ups. Go see the kids. | yes |
| page.tsx:14 handnote | Go on. Knock off early. | Go on. Knock off early. *(keep)* | keep |
| page.tsx:17 promise | Less chasing. Less copying. More getting on with it. | Less chasing. Less copying. More getting on with it. *(keep — BRAND.md supporting line)* | keep |
| page.tsx:19 h2 | It's been a lot, / hasn't it? | It's been a lot, / hasn't it? *(keep)* | keep |
| page.tsx:19 heading p | You're the one who picks up the slack. Who notices — even when no one else does. | The quotes you chase. The details you type twice. The phone you answer after hours. | yes |
| page.tsx:21 h3+p | The follow-up that became yours / because you cared enough to chase it. | The follow-up that became yours / We send the quote chasers and the reminders so it isn't you at 8pm. | yes |
| page.tsx:22 h3+p | The details copied twice / because that's faster than explaining the system. | The details copied twice / We connect the tools you already use so a job is typed once. | yes |
| page.tsx:23 h3+p | The day that never ends / because "one last thing" is never one, and never last. | The day that never ends / A voice agent answers the phone while you're on the tools. | yes |
| page.tsx:25 handnote | You've carried it long enough. | You've carried it long enough. *(keep)* | keep |
| page.tsx:28 h2 | A little less on / your plate. | A little less on / your plate. *(keep)* | keep |
| page.tsx:28 heading p | One problem or a few connected ones. Start with what's slowing you down. | Workflows take the admin off your hands. A voice agent answers the calls. A consult finds the first thing worth fixing. Integrations make the systems talk. | yes |
| page.tsx:29 h2 | A good system knows what happens next. | A good system knows what happens next. *(keep)* | keep |
| page.tsx:29 demo p | An enquiry arrives. The details find their way to the right place. Your team knows what to do. That's the idea. | An enquiry comes in. We turn it into a job card, chase the quote, remind them they're booked. Your team sees what happens next. | yes |
| page.tsx:30 h2 | Good people. / Useful technology. | Good people. / Useful technology. *(keep)* | keep |
| page.tsx:30 heading p | We keep the clever stuff behind the scenes. You get a system that makes sense. | Workflows, a voice agent, a consult, or an integration. You get a system that makes sense. | yes |
| page.tsx:30 step 01 | Find the friction. / We start with your day… | Find the friction. *(keep — already concrete)* | keep |
| page.tsx:30 step 02 | Make it work. / We agree the scope… | Make it work. *(keep)* | keep |
| page.tsx:30 step 03 | Make it yours. / Clear documentation… | Make it yours. *(keep)* | keep |
| page.tsx:31 FAQ start | …the A$490 AI opportunity audit gives you a prioritised set of recommendations. | Tell us about one task that gets copied, chased or done twice. If it needs a closer look, we start with a consult: one session, a written plan, the first thing worth fixing. | yes |
| page.tsx:31 FAQ support | …from A$149–299/month… A$299–499+/month. | Yes. We can stay on after the build to keep the system running and fix what breaks. Talk to us about what that looks like. | yes |
| page.tsx:32 contact h2 | Not sure where it's stuck? / Start with the form. | *(keep — already a next step)* | keep |

---

## Service row slogans (data in `lib/services.ts` — do not edit)

GST-9 (Jake) replaces the catalogue with the 4 buy paths. Until then the five rows still render from `lib/services.ts`. Proposed lines for when that lands, or for a render override later:

| slug | current `line` | proposed subtitle |
| :--- | :--- | :--- |
| voice-agents | A good first impression. Even when you're busy. | We answer the phone, take the enquiry, and pass it on. |
| business-automation | The follow-up. The copy-paste. The thing you forgot. | Quote chasers, reminders, job cards — the admin taken off your hands. |
| custom-assistants | Your company knowledge. Ready when it's needed. | Folded into Integrations when GST-9 lands. |
| ai-integration | Make the pieces work together. | Make the job system, the books, and the inbox talk to each other. |
| opportunity-audit | Start with the problem. Then pick the technology. | A consult: one session, a written plan, the first thing worth fixing. |

---

## Prices (GST-10 — render only)

Keep `price` / `range` / `priceNote` in `lib/services.ts`. Do not render them.

| surface | current | proposed | applied |
| :--- | :--- | :--- | :--- |
| page.tsx service-price | From / Fixed price + `service.price` + `setup + A$199/mo` | Talk to us | yes |
| page.tsx pricing-note | All prices in AUD… Start with an audit | Scope is agreed before we build. Talk to us → `SURVEY_URL` | yes |
| page.tsx FAQ | A$490 audit; A$149–499+/month support | no amounts; consult / talk to us | yes |
| services/[slug] aside | `service.price` + `service.priceNote` | Talk to us → `SURVEY_URL` | yes |
| services/[slug] price-detail | `service.range` + AUD amounts | A clear scope. Agree the work in writing first. No range string. | yes |

Parked `docs/components/sections/Pricing.tsx` still has dollar copy. It is unused on the live home. GST-3 must not put it on a public route while prices are hidden.

---

## Scroll-story lines to apply after GST-3 (quoted)

```
title: Call it a day.
copy: Knock off early. We take the admin off your hands: phone answering, quoting, follow-ups.

title: Go on. Knock off early.
copy: A voice agent answers the phone while you're out. Enquiries get written down. You pick up the kids.

title: We got you.
copy: Workflows keep quoting, reminders and follow-ups moving. See your mates. Have a proper arvo.

intro: Another day done. Go live it.
subtitle: We take the admin: the phone, the quotes, the follow-ups.
```
