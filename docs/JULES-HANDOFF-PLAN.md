# Jules Step-by-Step Implementation Plan (`goodai-studio`)

> **Guardrails for Jules**:
> - Canonical tokens live in `app/goodai-tokens.css` (and `brand-guide/goodai-tokens.css`) + `DESIGN.md` / `brand-guide/WEBSITE-DESIGN-TOKENS.md`.
> - Keep `Good'Ai` spelling. Never invent testimonials, outcomes, pricing, or certifications.
> - All CTAs must use centralized links from `lib/links.ts`.
> - Run `node docs/validate-design.cjs`, `npm run lint`, and `npm run build` after each step.
> - **Do not** redraw `busy-desk.svg`, `connected-work.svg`, or `knock-off-early.svg` yet (parked).

---

## Step 1: Component Token Alignment Sweep

**Objective**: Eliminate legacy hardcoded hex inline styles and off-palette values in studio components so every surface uses canonical `app/goodai-tokens.css` variables (`--paper: #eceee4`, `--ink: #333b32`, `--rust: #a44328`, `--rust-hover: #8f3d31`, `--sage: #dce3cc`, `--sage-deep: #5f7058`, `--muted: #5c665e`, `--line: #d6d6c8`, `--wash: #eceadf`, `--white: #fcfaf4`).

### Files to Modify
1. **`components/studio/MascotWidget.tsx`**:
   - Replace hardcoded inline styles on `#goodie-panel` (`style={{ background: "#f6f3ea", color: "#2f3a33", borderColor: "#d8dfca" }}`), the phone button (`style={{ background: "#ab4b3d" }}`), and the intake link (`style={{ borderColor: "#2f3a33" }}`) with canonical token classes (`bg-brand-surface text-brand-ink border-brand-line`, `bg-brand-coral`, `border-brand-line`).
2. **`components/studio/HeroTree.tsx` & `app/tokens/colors.css`**:
   - Sync any remaining `#f5f0e4` / `#f7f5ed` / `#a4432b` fallbacks to the canonical values in `app/goodai-tokens.css`.
   - Ensure all `h1 em`, `h2 em`, and `.image-seal` elements use `font-family: var(--font-studio-serif), serif; font-style: italic; font-variation-settings: "SOFT" 100, "WONK" 1;`.

---

## Step 2: Homepage De-Duplication & Concrete Value Proposition

**Objective**: Stop repeating the vague *"you're swamped → we'll sort it → knock off early"* pitch 4 times in a row after the top flipbook (`PerthSketchbook.tsx`), and state concretely what Good'Ai installs and wires up.

### Files to Modify
1. **`components/sections/Hero.tsx`**:
   - Keep headline `Good work. / More life.` (`em` in Fraunces Soft Wonk).
   - Update `.hero-description` so visitors immediately know what we build after scrolling past the flipbook:
     ```tsx
     <p className="hero-description">
       Custom AI voice receptionists, automated quote chasers, and workflow integrations
       <br className="desktop-break" /> wired straight into the tools your business already runs on.
     </p>
     ```
2. **`app/page.tsx` & `components/studio/ScrollStory.tsx`**:
   - Consolidate the redundant `#been-tough` empathy section and `ScrollStory` into a single, concrete 3-chapter progression where each chapter explains **what the system actually does** and matches its illustration (`busy-desk`, `connected-work`, `knock-off-early`):
     - **Chapter 1 (`busy-desk` — Inbound Call & Enquiry Capture)**:
       - `title`: `"1. Every call answered while you’re on the tools."`
       - `copy`: `"When you can’t get to the phone, your AI voice agent answers in a natural local voice, asks your qualifying questions, checks your live calendar, and texts you the job brief."`
       - `note`: `"No more 6pm voicemail backlog."`
       - `caption`: `"Missed call → qualified job brief."`
     - **Chapter 2 (`connected-work` — Zero Double-Entry Across Your Stack)**:
       - `title`: `"2. Typed once. Synced across your software."`
       - `copy`: `"An email, web form, or call transcript automatically creates the job card in your CRM, drafts the quote in Xero or Google Workspace, and queues the follow-up—with a human approval switch before anything sensitive is sent."`
       - `note`: `"Your tools finally talk to each other."`
       - `caption`: `"Enquiry → CRM, quote draft & calendar."`
     - **Chapter 3 (`knock-off-early` — Automated Chasing & 5pm Hand-Off)**:
       - `title`: `"3. The 8pm admin shift is already handled."`
       - `copy`: `"Unanswered quotes get chased automatically after 48 hours and booked clients get their SMS reminders. By 5pm, you check a clean daily summary and actually clock off."`
       - `note`: `"Your time is yours again."`
       - `caption`: `"Perth, end of the day."`

---

## Step 3: Concrete Deliverables in `#approach` & Optional Text Chat Drawer

### Files to Modify
1. **`app/page.tsx` (`#approach`)**:
   - Make the 3 steps in `#approach` concrete and operational:
     - `01` — **Audit the bottleneck.** `"We sit down with your workflow, find where leads or hours leak, and map the exact data flow between your phone, inbox, CRM, and accounting tools."`
     - `02` — **Wire and battle-test.** `"We build the voice agent or automation on your existing stack, set up human-in-the-loop approval gates, and test the edge cases before going live."`
     - `03` — **Hand over in plain English.** `"You get a live working system, clear documentation, a team walkthrough, and direct support if anything changes."`
2. **`components/studio/MascotWidget.tsx`** (Optional — gated by `NEXT_PUBLIC_CHAT_ENABLED=1`):
   - Wire `components/studio/GoodAiChat.tsx` into `MascotWidget.tsx` when `process.env.NEXT_PUBLIC_CHAT_ENABLED === "1"` so visitors who cannot talk out loud can type a question inside Goodie's drawer.
