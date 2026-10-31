# goodai-studio — live state

Updated: 2026-10-31 · Branch: `feat/under-the-hood`

## Live right now

- **Sketchbook opens `/`:** `<PerthSketchbook />` renders as a full-viewport `<dialog open>` on the homepage (`app/page.tsx`, `components/studio/PerthSketchbook.tsx`). Flips through all 14 spreads by itself (8 s cover, 6.2 s per spread, 7 s back cover), then slides up over 1.5 s to reveal the site. `Skip intro →` button + `Esc` close early. Respects `prefers-reduced-motion` (static spreads, no auto-flip).
- **Spreadsheet calculator removed from `/`** per Kev: the sketchbook is the opener now. Calculator component stays in `components/studio/PerthProblemSection.tsx` if needed later.
- **Services section:** `<SketchbookFlip />` — single book on `/` that flips through 7 spreads on click/arrow-keys/swipe (cover, 5 services, back). Replaced the 3D WebGL book that crashed WebGL contexts.
- **Voice demo:** `<VoiceAgentSection />` — ElevenLabs widget (`agent_8501m0h2hvh0edr99jkqzr4rw53n`).
- **Intake:** `<SussTheFussSection />` — native card on `/#suss-the-fuss`, posts to `/api/contact` (rate-limited, honeypot, Gmail SMTP primary → Resend fallback + live Proxmox NAS `gai-n8n` webhook `https://ktg-nas.blowfish-snares.ts.net/webhook/goodai-lead`).
- **Under the hood (`/admin-engine`):** 3D machine (`public/machine/goodai-machine.html`) + `<StackPanel />` (`components/studio/StackPanel.tsx`, data in `lib/stack.ts`).
  - **4 Arms = 4 Build Services:** `Arm 01 · Hopper` → `AI voice agents` (`/services/voice-agents`), `Arm 02 · Press` → `Business automation` (`/services/business-automation`), `Arm 03 · Bell` → `Custom AI assistants` (`/services/custom-assistants`), `Arm 04 · Stamp` → `AI integration projects` (`/services/ai-integration`), driven by `Cam shaft · Blueprint` → `AI opportunity audit` (`/services/opportunity-audit`) and checked at `Human sign-off`.
  - **5 Interactive Layers (3D buttons + bidirectional page pills):**
    - `Labels`: The four arms & opportunity audit blueprint (links to `/services/[slug]`)
    - `Explode`: Our ethics & guardrails (*Human in control*, *No mystery box*, *Grounded, not guessed*, *Least data needed*)
    - `Cut away`: Underlying architecture (*Event-driven workflow harness*, *Scoped tool boundaries*, *Human sign-off gates*) & brains (`Gemini`, `Grok`, `ChatGPT`)
    - `X-ray`: Voices (`Trillet` · SOC 2 Type II, ISO 27001, HIPAA; `ElevenLabs`; `Hume`)
    - `Slow`: Where it runs (`Google Cloud` · `Sydney`, `n8n`, `PostgreSQL`)
- **Field notes / Blog (`/blog`, `/blog/[slug]`, `/posts` rewrites):** Connected to Proxmox NAS `gai-instatic` (`https://ktg-nas.blowfish-snares.ts.net/admin/api/cms/plugins/goodai.content-api/runtime/posts`), rendering 19 published field notes with full Markdown formatting and indexed into `gai-meili` (`:7700`) + `gai-n8n` sync workflow.

## Claims & residency policy (locked with Kev, 2026-10-31)

- Vendors named as "built with" only. No model version numbers, benchmarks, or compliance claims about Good'Ai.
- Certifications appear only on the vendor that holds them (Trillet).
- **Sydney residency applies to hosting + models (GCP Sydney), NOT to the voice vendors** (voice data handling sits with the voice platform). Enforced by `lib/stack.test.ts`.
- Footnote disclaims affiliation/endorsement.

## Verify

```bash
bun run test    # 44/44 pass (includes lib/stack.test.ts)
bun run lint    # 0 errors
bun run build   # clean
```
