# Good'Ai offer — brainstorm draft

Drafted 2026-10-02 by temp `worker-offer-research`. **Draft for Kevin to react to, not decided.**
- Ranges only. No final prices. Every price below has a source (list at bottom).
- Most sources are vendor-written guides. Treat as market signals, not neutral data.
- A$ = Australian dollars. US$ = US dollars. GST status noted where the source states it.
- Today's site (`lib/services.ts`, legacy): voice A$199 setup + A$199/mo (~500 min), workflows A$750+ one-off, assistants A$1,500+, integrations A$2,500+, audit A$490.

---

## The 4 things to buy

| Path | Shape | One line |
|---|---|---|
| **Workflows** | Monthly retainer, scope drawn down from a catalogue | "Pick from the Top 10. We build it, run it, fix it." |
| **Voice agent** | Monthly plan, low entry | "Never miss the call." |
| **Consult** | Fixed fee, one session + written plan | "Find the first thing worth fixing." |
| **Integrations** | Quoted project | "Make the systems talk to each other." |

---

## 1. Top 10 workflows (Perth tradies, clinics, professional services)

Effort: **S** ≈ 1 day, **M** ≈ 2–3 days, **L** ≈ 4+ days. Effort is my rough estimate, not sourced. Validate on the first builds.

| # | Workflow | What it does | Connects | Effort |
|---|---|---|---|---|
| 1 | Missed-call text-back | Unanswered call → instant SMS "got your call, here's a link to book / tell us the job" | Phone line, SMS, CRM | S |
| 2 | Enquiry → job card | Web form / email enquiry → job created + auto-reply to customer | Website form, Gmail/Outlook, ServiceM8 / Tradify / Simpro | S |
| 3 | Quote chaser | Sent quote → follow-ups on day 2 / 5 / 10 until accepted or declined | ServiceM8 or Xero quotes, SMS, email | S |
| 4 | Booking reminders + no-show rebook | Confirm, remind 24h before, rebook link on no-show | Cliniko / Halaxy / Cal.com, SMS | S |
| 5 | Review request | Job marked done → SMS with Google review link | ServiceM8 / Cliniko, SMS, Google Business Profile | S |
| 6 | Overdue invoice chaser | Invoice overdue → polite staged email/SMS, stops on payment | Xero / MYOB, email, SMS | S–M |
| 7 | Bills into Xero | Supplier invoices/receipts in inbox → read and filed as draft bills | Gmail/Outlook, Xero (or Dext) | M |
| 8 | Client onboarding pack | New client form → engagement letter e-sign → folder → CRM record | Forms, e-sign, Google Drive / SharePoint, CRM | M |
| 9 | Monday numbers | Weekly email to owner: jobs, quotes won, cash owed | Xero + job system → email / Sheets | M |
| 10 | Inbox triage + draft replies | AI sorts incoming mail, drafts replies, routes urgent ones | Gmail/Outlook, LLM | M–L |

Market check: DataDesk prices missed-call text-back at A$500–1,500 setup + A$99–149/mo, and custom workflows at A$2,000–10,000+ setup + A$500–750/mo upkeep [S11]. So a catalogue of mostly S/M builds sits at the cheap end of the market. That is the "off the shelf" feel.

---

## 2. Retainer model (draw-down)

**How it works (proposal):**
- Client pays monthly. Each month buys **build points**.
- Catalogue price tags: S = 1 point, M = 2, L = 3. Custom (off-catalogue) work is quoted in points.
- Retainer always includes: hosting, monitoring, fixing anything already live.
- One request in progress at a time (the "subscription agency" pattern [S16]). Keeps delivery honest for a one-person studio.
- Open: do unused points roll over (cap 1 month?) — see questions.

**Tier shapes (ranges only):**

| Tier | Shape | Market range found | Evidence |
|---|---|---|---|
| Keep | 1 point/mo + upkeep of live workflows | A$299–995/mo | IOTAI plans from A$299/mo [S13]; AI Pivot workflow automation A$995/mo + A$1,495 setup [S12]; DataDesk upkeep A$500–750/mo [S11] |
| Grow | 2–3 points/mo + upkeep | ~A$500–2,000/mo | SMB retainers US$500–2,000/mo [S14]; n8n/Make agency retainers US$500–2,500/mo [S15]; AU advisory retainers A$500–2,500/mo [S18] |
| Partner | 4+ points/mo, priority, monthly review | ~US$1,200–2,500/mo and up | n8n "automation partner" tier US$1,200–8,000/mo [S15]; MondayAgents unlimited automations US$2,499/mo [S16] |

- Setup fee: market mostly charges one (A$500–3,000 [S11], A$1,495 [S12]). Option: waive setup on a minimum term instead.
- Tool cost floor is low: n8n self-host ≈ free + small server, Make from US$10.59/mo, Zapier from A$30/mo [S17]. Platform choice sets margin.

---

## 3. Voice agent

### Competitor prices

**Australia**

| Vendor | Entry | Mid | Top | Notes | Source |
|---|---|---|---|---|---|
| Hey Jodie | A$99 | A$199 | A$399 | No setup fee; "before tax"; unlimited calls on A$99 | [S1] [S3] |
| Kaylo | A$99 / 100 min | A$199 / 400 min | A$349 / 1,000 min | Overage A$0.80→0.40/min | [S3] |
| Sophiie | $99 / 30 calls | $299 / 500 calls | $819 | Gold Coast; currency not stated; older model A$300 + ~A$800 setup. Pricing page didn't render for me; figures search-reported | [S4] [S2] |
| Vertical AI | A$299 / 500 min | A$599 / 1,000 min | A$999 / 2,000 min | GST incl; build from A$2,490 | [S3] |
| Leva Relay | $199 flat | – | – | No setup, no contract, ServiceM8 link | [S2] |
| Amily (Melb) | A$149–249 | – | – | Local number, booking | [S2] |
| TransferToAI | A$99 | – | – | No setup fee | [S2] |
| Nexwin | A$249 | – | – | No setup fee | [S2] |

**Global (US$)**

| Vendor | Entry | Mid | Top | Notes | Source |
|---|---|---|---|---|---|
| Trillet | US$49 / 150 min | – | – | +US$0.20/min. White-label resale from US$99/mo. **Good'Ai's own voice SDK** | [S5] |
| Rosie | US$49 / 250 min | US$149 / 1,000 | US$299 / 2,000 | | [S6] |
| Goodcall | US$79 | US$129 | US$249 | Capped by unique callers, not minutes | [S6] |
| Smith.ai (AI) | ~US$97.50 / 30 calls | – | – | ~US$2.40 per extra call | [S1] |
| Dialzara | US$29 / 60 min | – | – | US$0.48/min after | [S5] |

**Read of the market:**
- AU entry floor is **A$99/mo, no setup fee** (Hey Jodie, Kaylo, TransferToAI, Sophiie Starter). Kevin's ~$99 read is confirmed.
- Typical tradie spend: A$200–300/mo [S2]. Good'Ai's current A$199 + A$199 setup is mid-market, but the setup fee is where it loses to A$0-setup rivals.
- Platform cost for ~150 calls/mo is roughly A$50–100 [S11]. Margin at A$99 is thin unless the line is cheap (Trillet white-label).

### Where Good'Ai can win
1. **Not on price alone.** US$29–49 global plans undercut everyone. Match the A$99 floor as a door opener, don't race below it.
2. **Done-for-you + local.** Most A$99 plans are self-serve. Good'Ai tunes the script to the business, in Perth, with a person to call.
3. **Voice + workflows bundle.** The call is only the start: call → job card (#2) → quote chaser (#3) → review request (#5). Rivals that do this (Sophiie Pro, Johnni) sit at ~A$300/mo [S2] [S4].
   - Option A: voice A$99-range standalone; bundle with Keep retainer.
   - Option B: voice included free in Grow/Partner retainer (voice becomes the hook, retainer is the revenue).

---

## 4. Consult

The buyer gets one working session (about 90 minutes, on-site in Perth or video) where Good'Ai maps how enquiries, quotes, jobs and invoices actually move, then a short written plan: the 3 biggest time drains, which Top 10 workflows fix them, rough point cost, and the one to build first. Savings stay labelled as estimates. Market: AU entry process audits A$500–2,000 [S18]; independent AI consultants A$150–450/hr [S18] [S19]; TwinMind sells a fixed A$500 audit [S20]. The current A$490 audit fits the low end. Option: credit the fee against the first retainer month.

## 5. Integrations

For work the catalogue can't cover: connecting business systems through their APIs (job system ↔ accounting ↔ CRM ↔ booking), syncing data both ways, custom internal tools, or AI assistants over company documents (folds in today's "custom assistants" and "AI integration"). The buyer gets a fixed-price scope after a short discovery, the build, testing, handover notes, and an option to move upkeep into a retainer. Market: AU small automations from A$2,500, multi-system A$5,000–15,000 [S10]; a single system integration from A$8,000 [S21]; Perth's Hello People quotes fixed-price after scoping [S20]. Note Xero now charges for API access above 5 connections (A$35/mo Core tier from 2 Mar 2026) [S20].

---

## 6. Open questions for Kevin

1. Voice entry: match A$99 with no setup fee, or hold A$199 and sell on done-for-you?
2. What does Good'Ai actually pay Trillet per voice line? That sets the real floor.
3. Retainer unit: points, hours, or "one request at a time, unlimited"?
4. Unused points: roll over 1 month, or expire?
5. Setup fee on retainers: charge, or waive for a minimum term (3 or 6 months)?
6. Build platform: n8n self-hosted (cheapest), Make, or Zapier (most familiar to clients)?
7. Is the Top 10 right for Perth? Swap any for licence/insurance expiry reminders, or hipages/Oneflare lead import?
8. Show prices on the site as "from", ranges, or "book a consult"? GST inclusive or exclusive?
9. Consult fee credited against the first month, yes or no?

---

## Sources

- [S1] Hey Jodie, Best AI Receptionist Australia 2026 (vendor-written, updated Jul 2026) — https://heyjodie.com/en-au/guides/best-ai-receptionist/
- [S2] Search summary of AU guides: Leva, Amily, TransferToAI, Nexwin, Sophiie, Johnni — https://levasolutions.com.au/relay/compare · https://amily.ai/blog/virtual-receptionist-cost-melbourne-2026 · https://www.basicsolutions.com.au/blog/ai-receptionist-cost-australia · https://callacy.com/au/blog/best-ai-receptionists-australia · https://replymate.io/compare/best-ai-receptionist-tradies-australia
- [S3] Vertical AI, AI receptionist cost in Australia (vendor-written; prices read 23 Sep 2026) — https://verticalai.com.au/guides/ai-receptionist-australia
- [S4] Sophiie pricing — https://www.sophiie.ai/pricing · older model: https://www.binaryelements.com/current-ai-insights/2025/12/05/ai-receptionist-cost-australia-2025/ · https://tradiespace.com.au/trade-brands/sophiie-ai/
- [S5] Trillet blog (vendor-written, Jul 2026) — https://trillet.ai/blogs/cheapest-ai-phone-answering-service · https://trillet.ai/blogs/ai-receptionist-for-franchise-businesses
- [S6] CloudTalk, Rosie pricing 2026 (incl. Goodcall Aug 2026) — https://www.cloudtalk.io/blog/rosie-ai-answering-service-pricing/ · https://www.quo.com/blog/rosie-ai-pricing/
- [S10] Source Digital (AU) — https://source-digital.com.au/business-automation-australia · Bocati — https://bocati.com.au/business-automation/
- [S11] DataDesk, AI automation agency cost Australia — https://datadesk.com.au/guides/ai-automation-agency-cost-australia
- [S12] AI Pivot, 10 business automations for AU SMBs — https://aipivot.com.au/blog/workflow-automation-tasks-australia
- [S13] IOTAI small business automation — https://www.iotai.com.au/solutions/small-business
- [S14] Taskip, AI automation agency pricing 2026 — https://taskip.net/ai-automation-agency-pricing/
- [S15] n8n agency pricing guides — https://ryven.co/blogs/n8n-automation-pricing · https://betonai.net/how-to-build-a-10k-month-ai-automation-agency-in-2026-n8n-vs-make-vs-zapier-complete-pricing-client-acquisition-and-revenue-playbook/
- [S16] MondayAgents unlimited automation subscription — https://mondayagents.gumroad.com/l/aiagents · subscription model examples: https://www.manyrequests.com/blog/productized-agency-examples
- [S17] FlowWorks, AI tools for AU small business (AUD tool pricing) — https://flowworks.com.au/blog/ai-tools-small-business-australia
- [S18] AU AI consulting cost guides — https://source-digital.com.au/blog/ai-consulting-cost-australia · https://rightlink.io/blog/ai-strategy-consulting-in-australia-what-it-is-what-it-costs-and-how-to-choose · https://www.jacinthsolutions.com.au/resources/ai-consulting-costs-australia-2026
- [S19] Team400, AI consulting cost Australia — https://team400.ai/blog/2026-04-03-ai-consulting-cost-australia
- [S20] Integration refs: Hello People (Perth) https://hellopeople.com.au/integrations/servicem8-integration · TwinMind https://twinmind.au/project/api-integration/ · Xero API pricing https://developer.xero.com/pricing
- [S21] Unified Computing, custom software cost Australia 2026 — https://www.unifiedcomputing.com.au/custom-software-development-cost-australia/
