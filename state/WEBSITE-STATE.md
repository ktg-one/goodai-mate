# Good'Ai Website State & Cross-Workspace Handoff (`WEBSITE-STATE.md`)

- **Last Updated**: `2026-10-15T12:26:00+08:00` (AWST)
- **Website Repo**: `C:\Users\kevin\Documents\goodai3\goodai-studio` (`ktg-one/goodai-mate`)
- **Branch / Commit**: `main` @ `2ee5128` (pushed to `origin/main`)
- **Production URL**: `https://www.goodai.au` (Vercel project `goodai-mate`)
- **Company Workspace**: `C:\Users\kevin\Documents\03` (`C:\Users\kevin\Documents\03\state\WEBSITE-STATE.md`)

See mirror at `C:\Users\kevin\Documents\03\state\WEBSITE-STATE.md`.

## Summary
- **Lead Capture (`POST /api/contact`)**: Live on `main` (`app/api/contact/route.ts`, `lib/contact.ts`, `lib/lead-webhook.ts`). Sends `[Good'Ai lead]` emails via Resend (with `onboarding@resend.dev` fallback on 403), direct Google Workspace TLS SMTP (`GMAIL_USER` + `GMAIL_APP_PASSWORD`), and optional HMAC webhook (`LEAD_WEBHOOK_URL` + `LEAD_WEBHOOK_SECRET`).
- **ElevenLabs Voice Agent (`ElevenLabsMascot.tsx`)**: Unblocked in `next.config.ts` CSP and auto-expands on click.
- **Canonical Tokens & Fonts**: `brand-guide/goodai-tokens.css`, `app/goodai-tokens.css`, `DESIGN.md`, `brand-guide/WEBSITE-DESIGN-TOKENS.md`, and `/fonts/Fraunces/` (`"SOFT" 100, "WONK" 1`) synced and validated (`node docs/validate-design.cjs` -> 0 missing, 0 orphan).
- **Mascot Icon**: `brand-guide/assets/goodai-icon.svg` + `app/icon.svg` (1.5 KB vector) and `brand-guide/assets/goodai-icon.png` (transparent 3D Goodie head).
- **Jules Queue**: Committed at `docs/JULES-HANDOFF-PLAN.md`.

