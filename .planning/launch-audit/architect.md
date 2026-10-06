# Good'Ai launch audit — architect / QA

Scope: read-only review of API abuse surface, security headers, env documentation, and production route smoke on `npx next start -p 3123`.  
Repo: `C:/Users/kevin/Documents/goodai3/goodai-studio` (Next.js 16 App Router).  
No source edits. No git. Build already present (`.next/BUILD_ID`).  
Date of probe: 2026-10-06 (local).

---

## BLOCKER

1. **Committed secret-shaped value in `.env.example`**
   - Evidence: `.env.example:9` sets `RESEND_API_KEY=` to a non-empty `re_…` token (not a placeholder).
   - Risk: if this is/was a real Resend key it is leaked via the repo template; even if rotated, the file teaches people to paste live keys into example files.
   - Action: scrub to empty/`re_xxx` placeholder; rotate the key in Resend if it was ever valid; confirm it is not also in git history as the only copy.

2. **`/api/contact` has no rate limiting / abuse controls beyond honeypot**
   - Evidence: `app/api/contact/route.ts` — honeypot at L22–25, field caps L27–31, Resend send L49–59. No IP/session throttle, no CAPTCHA, no CSRF token, no middleware (`middleware.ts` absent).
   - Risk: unauthenticated POST can burn Resend quota and flood `CONTACT_TO_EMAIL` / default `hello@goodai.au` (L6). Honeypot only stops naive bots.
   - Action before public traffic: edge/platform rate limit (e.g. Vercel WAF / Upstash) + optional Turnstile; consider method allowlist already OK (GET → 405 in smoke).

3. **`/api/voice/call` is an open session-mint endpoint (cost / agent abuse when server key is set)**
   - Evidence: `app/api/voice/call/route.ts` L12–43 — any client may POST; `agentId` taken from `body.agentId` with only a default fallback (L16–17); `createCall({ apiKey, agentId, … })` uses server `TRILLET_API_KEY` (L15, L32–41). No auth, no rate limit, no agent allowlist.
   - Risk: with `TRILLET_API_KEY` configured, attackers mint LiveKit/Trillet rooms and drive billable voice usage; client-chosen `agentId` may hit other agents on the same key.
   - Action: allowlist agent IDs server-side; rate-limit by IP; keep route only behind `/demo` origin checks is weak alone — prefer signed short-lived tickets.

4. **Voice route fails open and discloses config posture**
   - Evidence: L19–29 returns HTTP 200 `{ mode: "public", message: "No server TRILLET_API_KEY configured…", agentId, workspaceId }` when key missing.
   - Live smoke (no key in prod process): POST `/api/voice/call` → 200, `mode=public`, message length 71, default `agentId=68f6b3cb-darling-good`.
   - Risk: recon for attackers; public fallback may still start client-side calls depending on widget behaviour (`components/studio/TrilletVoiceWidget.tsx` L23–24).

---

## SHOULD

1. **No baseline security headers on HTML responses**
   - Evidence: `next.config.ts` L9–11 only sets `Access-Control-Allow-Origin: *` for `/sketchbook/:file*.woff2`. No CSP, HSTS, `X-Frame-Options` / `frame-ancestors`, `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy`.
   - Live `GET /` response headers: `X-Powered-By: Next.js`, cache/prerender headers only — **none** of CSP / HSTS / X-Frame-Options / Referrer-Policy / X-Content-Type-Options present.
   - Action: add global `headers()` in `next.config.ts` (and HSTS at host/CDN). At minimum: `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`), `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, tight CSP compatible with Three/sketchbook iframe.

2. **Env documentation incomplete vs code**
   - Used in source (`process.env` grep) but missing or partial in `.env.example`:
     | Variable | Where used | In `.env.example`? |
     |---|---|---|
     | `RESEND_API_KEY` | `app/api/contact/route.ts:37` | Yes — **but non-empty value (BLOCKER)** |
     | `CONTACT_TO_EMAIL` | `app/api/contact/route.ts:6` | **No** |
     | `TRILLET_API_KEY` | `app/api/voice/call/route.ts:15` | Yes (empty) |
     | `NEXT_PUBLIC_TRILLET_AGENT_ID` | voice route L16; `TrilletVoiceWidget.tsx:23` | Yes |
     | `NEXT_PUBLIC_TRILLET_WORKSPACE_ID` | voice route L26; widget L24 | Yes |
     | `NEXT_PUBLIC_SITE_URL` | `app/layout.tsx:13`, `app/robots.ts:4`, `app/sitemap.ts:5` | **No** |
     | `NEXT_PUBLIC_VOICE_PHONE` | **not referenced in app code** (only `.env.example`) | Yes — dead doc |
   - Phone CTA is hardcoded in `lib/links.ts` (`PHONE_DISPLAY` / `PHONE_HREF`), not env-driven.
   - Action: document every live var with empty placeholders only; drop unused `NEXT_PUBLIC_VOICE_PHONE` or wire it through `lib/links.ts`.

3. **Error detail leak on voice failures**
   - Evidence: `app/api/voice/call/route.ts:45–47` returns `{ error: message }` with raw `Error.message` at 500.
   - Action: log server-side; client gets generic failure string.

4. **Client-controlled `agentId` / `variables` / PII fields on voice mint**
   - Evidence: L17, L36–40 accept `body.agentId`, `body.variables`, `body.phone`, `body.name` without validation/size caps (unlike contact route).
   - Action: schema-validate; strip unknown fields; cap string lengths.

5. **Stack fingerprinting**
   - Evidence: live `X-Powered-By: Next.js` on `/`.
   - Action: `poweredByHeader: false` in Next config.

6. **404 UX / SEO**
   - Evidence: smoke `GET /this-route-does-not-exist-xyz` → **404** body, but `<title>` is the homepage title (`Good'Ai — Good work. More life.`), not a dedicated not-found title (`app/not-found.tsx` present; metadata likely inherits root).
   - Action: distinct not-found title/description.

7. **Contact success path depends on secret ops hygiene**
   - Evidence: missing `RESEND_API_KEY` → 503 with safe client message (L38–40) — good. Resend failures → 502 (L61–63) — good. HTML escaped (L9–10, L44–46) — good.
   - Still: default lead inbox `hello@goodai.au` if `CONTACT_TO_EMAIL` unset (L6) — confirm that mailbox is monitored in prod.

---

## LATER

1. **Hardcoded Trillet agent id fallbacks in source** — `app/api/voice/call/route.ts:16`, `TrilletVoiceWidget.tsx:23` (`68f6b3cb-darling-good`). Prefer fail-closed without env.
2. **Sketchbook font CORS `*`** — `next.config.ts:10` intentional for null-origin iframe; keep scoped to `.woff2` only (already is).
3. **Long cache on prerendered home** — live `Cache-Control: s-maxage=31536000` on `/`. Fine if fully static; revisit if lead/offer copy must change fast without purge.
4. **CLAUDE.md drift** — CLAUDE.md L43 says contact form “fakes success”; API now really sends via Resend. Update docs post-launch so agents do not “fix” the wrong thing.
5. **No automated test suite** (CLAUDE.md) — add minimal route contract tests for contact validation + voice allowlist once controls land.
6. **`vercel.json` is framework-only** — no header or firewall config there yet (`vercel.json` L1–3).

---

## API review notes (detail)

### `app/api/contact/route.ts`
| Control | Status |
|---|---|
| Auth | None (public lead form — expected) |
| Rate limit | **Missing** |
| Honeypot | Present (`website`, L22–25); smoke POST with honeypot → 200 `{"ok":true}` and no send path |
| Input bounds | contact 200, note 4000, headaches ≤12×80 (L27–31) |
| XSS in email HTML | Escaped (L9–10) |
| Secret exposure to client | API key server-only; errors generic (L40, L63) |
| Method | POST only; GET smoke → 405 |

### `app/api/voice/call/route.ts`
| Control | Status |
|---|---|
| Auth | None |
| Rate limit | **Missing** |
| Agent allowlist | **Missing** (`body.agentId` trusted) |
| Secret exposure | `TRILLET_API_KEY` server-only — good; public mode message leaks config — bad |
| Error messages | Raw exception to client (L45–47) |
| Method | POST only; GET smoke → 405 |

### `next.config.ts` security headers
Only sketchbook font ACAO. Missing for launch hardening: CSP, HSTS (platform), X-Frame-Options / frame-ancestors, Referrer-Policy, nosniff, Permissions-Policy; consider disabling `X-Powered-By`.

---

## Env inventory (names only — values never printed)

| Name | Public? | Documented in `.env.example` | Notes |
|---|---|---|---|
| `RESEND_API_KEY` | no | yes (unsafe non-empty sample) | required for contact send |
| `CONTACT_TO_EMAIL` | no | **no** | defaults to `hello@goodai.au` |
| `TRILLET_API_KEY` | no | yes (empty) | required for authenticated voice mint |
| `NEXT_PUBLIC_TRILLET_AGENT_ID` | yes | yes | bundled to client |
| `NEXT_PUBLIC_TRILLET_WORKSPACE_ID` | yes | yes | bundled to client |
| `NEXT_PUBLIC_SITE_URL` | yes | **no** | defaults `https://goodai.au` |
| `NEXT_PUBLIC_VOICE_PHONE` | yes (if set) | yes | **unused in code** |

---

## Route status table

Probe: `npx next start -p 3123` against existing `.next` build, then process terminated.

| Status | Route | Content-Type (summary) | Title / body note |
|---:|---|---|---|
| 200 | `/` | text/html | Good'Ai — Good work. More life. |
| 200 | `/contact` | text/html | Contact Good'Ai — Good'Ai |
| 200 | `/demo` | text/html | Voice + automation demo — Good'Ai |
| 200 | `/lab` | text/html | Studio Lab \| Good'Ai Experiments — Good'Ai |
| 200 | `/privacy` | text/html | Privacy — Good'Ai |
| 200 | `/terms` | text/html | Terms — Good'Ai |
| 200 | `/robots.txt` | text/plain | Allows `/`; sitemap `https://goodai.au/sitemap.xml` |
| 200 | `/sitemap.xml` | application/xml | urlset present |
| 200 | `/favicon.ico` | image/x-icon | binary |
| 200 | `/icon.svg` | image/svg+xml | SVG icon |
| 200 | `/services/voice-agents` | text/html | AI voice agents — Good'Ai |
| 200 | `/services/business-automation` | text/html | Business automation — Good'Ai |
| 200 | `/services/custom-assistants` | text/html | Custom AI assistants — Good'Ai |
| 200 | `/services/ai-integration` | text/html | AI integration projects — Good'Ai |
| 200 | `/services/opportunity-audit` | text/html | AI opportunity audit — Good'Ai |
| 405 | `/api/contact` (GET) | empty | Method not allowed (expected) |
| 405 | `/api/voice/call` (GET) | empty | Method not allowed (expected) |
| 404 | `/this-route-does-not-exist-xyz` | text/html | Title still homepage title (see SHOULD) |

### API POST smoke (same server)

| Status | Request | Body (safe) |
|---:|---|---|
| 400 | POST `/api/contact` `{}` | `{"error":"Add a mobile number or email so we can reply."}` |
| 200 | POST `/api/contact` honeypot filled | `{"ok":true}` |
| 200 | POST `/api/voice/call` `{}` | `mode=public` (no server Trillet key in this process) |

Security headers on `GET /`: **none** of CSP / HSTS / X-Frame-Options / Referrer-Policy / X-Content-Type-Options. `X-Powered-By: Next.js` present.

---

## Launch gate summary

Ship only after BLOCKERs 1–4 are handled (secret scrub/rotate + rate limits / voice allowlist + fail-closed voice). Headers and env doc can land in the same PR wave as SHOULD items.

DONE blockers:4 should:7 later:6
