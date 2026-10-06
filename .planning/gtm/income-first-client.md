# Shortest honest route to a first paid Good'Ai engagement

Date 2026-10-06 (revised for REMOTE-ONLY, per Kev). Lane: strategist for Sol. Nothing sent, nothing changed on the site.
**Constraint [F, from Kev]:** Kevin cannot do in-person work. Everything below is sold and delivered remotely: no walk-ins, travel, site visits or on-site installs.
**[F]** = observed fact (file or page read). **[H]** = hypothesis, untested.

## 1. The offer: missed-call answering, a voice agent for after-hours and on-the-tools calls

Evidence it already exists:
- **[F]** Listed service "AI voice agents": enquiry capture, call routing, human hand-off (`lib/services.ts`). `PRODUCT.md` lists the five services as final and says support is an add-on.
- **[F]** A live demo line is documented: (08) 7741 4191 plus a browser demo at `/demo` (`lib/links.ts`, `.planning/launch-audit/KEV-UNBLOCK.md`). The route uses Trillet (`app/api/voice/call/route.ts`).
- **[F]** The earlier GTM plan already picks this as the wedge, entered through a free audit (`.planning/gtm/first-10-clients.md` §1). `.planning/OFFER.md` lists "missed-call text-back" as the smallest build (effort S, 1 day, effort is the author's own estimate).
- **[H]** The smallest sellable unit is missed-call text-back or a simple answering flow with human hand-off, not a full custom agent.
- **[H] Remote delivery path (all steps need no site visit):** (1) discovery and audit over phone or video call; (2) Kevin builds and tests the agent in Trillet and sends a test number/link; (3) the client turns on call-forwarding to the agent number themselves, following a written or screen-shared guide from their carrier's app or phone settings; (4) one live test call together on video; (5) written hand-off doc and a 2-week check-in by message. Risk: the client's own carrier setup (see proof gap 8). Where a client cannot or will not set forwarding, fall back to a web-form or SMS-based flow.

## 2. Five public Perth targets, as CHOICES, not five parallel commitments

Pick one or two to try first; the rest are a backup list. The service is remote, so these tradies are customers only; nothing requires going to them. All read on 2026-10-06; contact is each business's own public route.

All five advertise 24/7 or extended-hours service. **[H]** That is the most likely pain: an owner on a job cannot answer. None of the pages mention an answering service or chatbot **[F]**, which is not proof they lack one.

| # | Business | URL | Public route **[F]** |
|---|---|---|---|
| 1 | Go With The Flow Plumbing & Gas (Brabham) | https://gowiththeflowplumbing.com.au/ | Phone 0461 272 901, info@gowiththeflowplumbing.com.au, quote form at /contact-us/ |
| 2 | Willetton Plumbing & Gas | https://willettonplumbing.com/ | Phone 0423 854 687, ServiceM8 "Enquire Now" booking page, /contact/ |
| 3 | Plumb It Right (Yanchep) | https://plumbitright.com.au/ | Phone/text 0408 012 993, form at /contact-us/ (no public email) |
| 4 | Baywood Plumbing & Gas | https://baywoodplumbingandgas.com.au/emergency-plumber-perth/ | Phone 0418 922 906, /get-a-quote, /contact-us |
| 5 | Air-Cond Installs WA | https://www.aircondinstallswa.com.au/contact-us/ | Phone 0417 094 668, mail@aircondinstallswa.com.au, quote form; hours 7am-7pm daily |

Notes: staff size is not stated on any of them **[F]**. Several are small, family-style operations **[H]**. Suggested order **[H]**: start with #1 (public business email plus form) and #5 (business email, set daily hours, written quote enquiries). #2 and #3 have no readable public email: use their web form or booking page. #4 has a quote form. A cold call to a mobile is more intrusive; use it only after a form or email gets no reply. Check each against the Do Not Call Register and Spam Act footer rules in `first-10-clients.md` before any contact.

## 3. Remote outreach drafts (NOT SENT)

Remote channels only: website contact form, public business email, the business's own Google Business Profile message button if enabled, or LinkedIn for the owner if a business page names them. No walk-ins or visits. Draft A below is for a form or business email. Needs Kevin's real surname, address and ABN in the footer.

> Subject: Calls when you're on a job: quick question
>
> Hi, I'm Kevin from Good'Ai in Perth. I'm building phone-answering for small trade businesses, so a missed call gets the caller's details taken and sent to you instead of going to the next plumber.
> I'm new and have no client results yet, so I'm offering a free 20-minute look at how calls and quotes are handled, with a one-page write-up either way. You can hear the demo line now on (08) 7741 4191.
> Worth a chat? If not, just say and I won't write again.
> Kevin [surname] · Good'Ai · [address/ABN] · hello@goodai.au
> To stop further messages, reply "stop".

**Draft B: after a reply, booking the remote look (NOT SENT)**
> Thanks for coming back. Easiest is a 20-minute phone or video call; I'll ask how a call or quote enquiry is handled today, then send you a one-page write-up the same day. No visit needed: if it makes sense, I set everything up remotely and you only switch on call forwarding, which I'll walk you through. Does [day/time options] suit?

**Draft C: one polite follow-up after 4-5 days, then stop (NOT SENT)**
> Hi, Kevin from Good'Ai following up once. If missed calls aren't a problem, no worries and I won't write again. If they are, the offer of a free 20-minute call still stands. Demo line: (08) 7741 4191.

## 4. Proof gaps that block a sale (observed)

1. **No client, result or testimonial exists.** **[F]** Docs forbid inventing one. The pitch must be "new, free look, demo line".
2. **Go-live not confirmed.** **[F]** `KEV-UNBLOCK.md` lists undone steps: rotate Resend key, set `.env.local`, verify Resend sender, smoke test, host env vars. Unknown whether goodai.au is live. Contact form may not deliver until done.
3. **Demo line unverified end-to-end.** **[F]** Same file says to ring 4191 and test the mic once Trillet is set; no record that was done. The Trillet agent has a hardcoded fallback ID in earlier code history, so confirm the agent greets as "Good'Ai" and not a template.
4. **No price Kevin has approved.** **[F]** `first-10-clients.md` leaves setup/monthly as `$___`. `OFFER.md` has A$ figures based on vendor-written market research, labelled unvalidated. Kevin must pick one.
5. **No sender identity.** **[F]** About/ABN/surname are placeholders in `visitor-trust-drafts.md`. Spam Act needs sender identification.
6. **No signed-off terms or agreement template** for a paid job. **[F]** Terms page says a written quote comes first.
7. **Call recording and consent rules for a live agent** not reviewed (listed as LATER in `reviewer.md`).
8. **[H]** Unknown whether a client's calls can be forwarded to the agent in practice without a site visit (carrier forwarding, number porting, who pays Trillet minutes). Needs one dry run on Kevin's own phone, plus a short written guide for common carriers.
9. **[F gap]** No remote-onboarding checklist, screen-share guide or hand-off doc template exists yet; the remote path above is untested.

## 5. Counterargument to prioritising job applications

- **Time to cash.** **[H]** Application cycles typically take weeks to months. A free audit followed by a pilot can reach a first small invoice sooner, because the buyer is one owner, not a hiring process. Unproven for Good'Ai; no sale has happened.
- **Asset already built.** **[F]** The site, demo line, contact route and scripts are done; the remaining blockers are about an hour of Kevin's config plus a smoke test. Abandoning that now wastes the sunk work.
- **They aren't exclusive.** One 14-day outreach block costs 2-3 hours a day (`first-10-clients.md`). Job applications can run in the evenings. The real test is a hard stop: **if zero audits are booked by day 7 of outreach, switch fully to applications.** This caps the downside.
- **Evidence from a first client helps either path.** A real, approved case note or even a "customer for 30 days" is the one thing missing for both a job application portfolio and the next client.
- **Remote fits Kevin's constraint:** the offer is sold by form, email, phone and video and delivered by configuration, so it needs no travel. Many job searches likewise need on-site work; a remote service business avoids that limit. **[H]**, unproven.
- **Honest limit:** this argument fails if Kevin's immediate cash need is under about 3 weeks. A job or contracting gig pays regularly; a first pilot may pay a small amount once. I have no data on Kevin's runway.

## Limitations
- Web results are one-off reads; contact details can be stale. I did not check ABN/licence status, reviews, or whether any of them already uses an answering service.
- Remote delivery is untested; I have not verified Trillet number provisioning or carrier-forwarding steps.
- No prospect was contacted. Businesses were picked by search and page content, not by fit data.
- Pricing, timing and conversion claims above are hypotheses, not evidence.
