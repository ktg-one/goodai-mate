---
last_mapped_commit: 499a6fa1425d928d77d272e4bc4eb0e029745c14
---
# Testing Patterns

**Analysis Date:** 2026-08-24

## Test Framework

**Runner:**
- Playwright `@playwright/test` ^1.60.0 (devDependency in `package.json`)
- Config: Not detected — no `playwright.config.ts` / `playwright.config.js` in repo root
- Jest: Not detected
- Vitest: Not detected
- No `test` / `test:coverage` scripts in `package.json`

**Assertion Library:**
- Not applicable for unit tests (none exist)
- Playwright `test()` used without `expect()` in the only spec (`src/capture.spec.js`)

**Run Commands:**
```bash
npm run lint                 # ESLint only — not tests
npx playwright test          # Would run Playwright; no npm script wrapper
npx playwright test src/capture.spec.js   # Existing screenshot capture spec
```

Watch mode / coverage scripts: Not detected.

## Test File Organization

**Location:**
- Single ad-hoc spec: `src/capture.spec.js`
- No `__tests__/`, no colocated `*.test.ts`, no `e2e/` tree
- Playwright output dir present: `test-results/` (generated)
- Skills (`component-builder`) prescribe `__tests__/unit/components/` — **that directory does not exist**; do not assume coverage

**Naming:**
- Existing: `capture.spec.js` (Playwright screenshot helper, not a product assertion suite)
- If adding unit tests: follow skill path `__tests__/unit/components/<Name>.test.tsx` **or** colocate `ComponentName.test.tsx` — neither pattern is implemented yet; pick one and stay consistent
- If adding Playwright product tests: `*.spec.ts` next to `src/` or a new `e2e/` folder plus a real `playwright.config.ts`

**Structure:**
```
src/
  capture.spec.js          # visual capture against localhost:3000
  app/                     # no tests
  components/              # no tests
  lib/                     # no tests
test-results/              # Playwright artifacts (generated)
```

## Test Structure

**Suite Organization:**
```javascript
// src/capture.spec.js — actual pattern
import { test } from '@playwright/test';
import path from 'path';

test('capture screenshots', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 850 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(scratchDir, 'hero.png') });
});
```

**Patterns:**
- One Playwright `test()` with side effects (screenshots, `console.log` of computed styles)
- Collects `page` console errors/warnings into an array and prints them
- Hard-coded viewport `1280x850`
- Requires a running `next dev` on `http://localhost:3000`
- Hard-coded scratch output path under `C:\\Users\\kevin\\.gemini\\...` — **do not copy this path** into new tests; use a repo-relative `test-results/` or Playwright `outputDir`

No `beforeEach` / `afterEach` / arrange-act-assert unit pattern exists.

## Mocking

**Framework:**
- Not detected (no `vi.mock`, no `jest.mock`)

**Patterns:**
Not applicable. The capture spec hits the live app.

**What to Mock (when introducing unit tests):**
- External APIs: ElevenLabs (`src/app/api/tts/route.ts`), Vercel AI Gateway (`src/app/api/chat/route.ts`)
- `child_process.execFile` GWS CLI (`src/app/api/analyze-website/route.ts`, `src/app/api/trigger-call/route.ts`, `src/app/api/demo-automation/route.ts`)
- `process.env` keys (`AI_GATEWAY_API_KEY`, `ELEVEN_API_KEY`)
- Browser media / Web Audio in voice components (`src/lib/voice/supertonic.ts`, `src/components/voice-agent/VoiceAgentHero.tsx`)

**What NOT to Mock:**
- Pure helpers such as `cn()` in `src/lib/utils.ts`
- `SYSTEM_PROMPT` string in `src/lib/chatPersona.ts` (assert content, do not mock)

## Fixtures and Factories

**Test Data:**
Not detected. No `tests/fixtures/` or factory helpers.

When adding API tests, use inline payloads matching route shapes:

```typescript
// Example for src/app/api/analyze-website/route.ts
const body = { url: 'https://example.com' };

// Example for src/app/api/chat/route.ts
const body = { messages: [] }; // expect 400 { error: 'Messages array required' }
```

**Location:**
- Keep factories next to new tests until a shared `tests/fixtures/` is created

## Coverage

**Requirements:**
- None enforced
- No coverage reporter configured
- Component-builder skill says “every component gets a test” — **not implemented**

**Configuration:**
- Not detected

**View Coverage:**
```bash
# Not applicable — no coverage command
```

## Test Types

**Unit Tests:**
- Not used
- Highest-value first targets if adding: `src/lib/utils.ts` (`cn`), `src/app/api/chat/route.ts` (400/503/500 branches), `src/lib/chatPersona.ts` (export exists)

**Integration Tests:**
- Not used
- API routes depend on env keys and optional local GWS path `D:\\packages\\npm-global\\...` — mock `execFile` rather than calling that path

**E2E Tests:**
- Playwright is installed but used only as a **visual capture** tool (`src/capture.spec.js`)
- No user-flow assertions (no `expect(page).toHaveTitle`, no click/lead-form tests)
- Manual/visual verification also lives as PNG audits in repo root (`audit-*.png`, `verification-screenshot.png`) — not automated

**CI:**
- No `.github/workflows` test job detected (`.github/prompts/` only)
- `npm run lint` is the only quality script

## Common Patterns

**Async Testing:**
```javascript
test('capture screenshots', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
});
```

**Error Testing:**
- Not detected in tests
- Production routes already return status codes — assert those when adding tests:
  - `src/app/api/chat/route.ts`: 400 empty messages, 503 missing gateway key, 500 catch
  - `src/app/api/tts/route.ts`: 400 missing text, 500 missing `ELEVEN_API_KEY`
  - `src/app/api/analyze-website/route.ts`: 400 missing URL

**Snapshot Testing:**
- Not used
- Screenshot files are manual artifacts, not Playwright snapshot comparisons (`toHaveScreenshot`)

**Guidance for new tests:**
1. Add an `npm test` script when a real runner is wired
2. Do not treat `src/capture.spec.js` as the template for product tests — it writes to a machine-specific directory and never asserts
3. Prefer Playwright `expect` against `localhost` for landing-page smoke (hero, stamp CTA, chat) once `playwright.config.ts` exists
4. Keep secrets out of tests; use dummy env vars only

---

*Testing analysis: 2026-08-24*
*Update when test patterns change*
