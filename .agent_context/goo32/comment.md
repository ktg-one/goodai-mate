Fixed — heading now renders as **Fraunces SOFT WONK**.

**Root cause:** the global heading rule had `font-variation-settings: "WONK" var(--wonk, 0.2), "SOFT" 60, "opsz" 120`. WONK is a 0→1 toggle, so `0.2` left the wonky display alternates **off** — which is why "Talk to Good'ai" rendered as a plain, sharp serif instead of the soft, wonky Fraunces display in your reference.

**Change** (`src/app/globals.css`, the `.font-display / h1 / h2 / .brand-wordmark` and `.wonk-line` rules):
`"WONK" 0.2, "SOFT" 60, "opsz" 120` → `"WONK" 1, "SOFT" 50, "opsz" 144` — matching the design spec verbatim (`public/preview/type-display.html`: hero = opsz 144, SOFT 50, WONK 1). The red highlight is untouched ("the font not the colour").

**Verified** on `localhost:3000` via Playwright:
- Fraunces font loaded: ✅
- computed `font-variation-settings` on the h1: `"SOFT" 50, "WONK" 1, "opsz" 144` ✅
- visual: soft, heavier display serifs + wonky alternate letterforms (alt a / soft terminals), display optical cut

Note: I'd normally route this through a free AI CLI per the orchestration setup, but Gemini (quota exhausted ~1h44m), Qwen (free tier discontinued) and Kimi (won't launch) were all unavailable. Since this was a fully-diagnosed 2-number CSS change matching the authoritative design spec, I applied it directly to avoid leaving the heading broken for ~2 hours. Scope: 2 lines, 1 file.

One open question: the title also says "and size" — I bumped the **optical** size to display (opsz 144). If you also meant the heading is physically too small (it's currently `3.2rem` / `4.5rem` on desktop in the voice hero), say the word and I'll scale it up.
