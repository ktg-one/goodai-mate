---
phase: 02
slug: visual-layer
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-05-25
---

# Phase 02 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

## Test Infrastructure

| Property | Value |
|----------|-------|
| Framework | Next.js build + ESLint |
| Config file | `eslint.config.mjs`, `next.config.ts`, `tsconfig.json` |
| Quick run command | `npm run lint` |
| Full suite command | `npm run build` |
| Estimated runtime | ~60-180 seconds |

## Sampling Rate

- After every task commit: run `npm run lint` when source files changed.
- After every plan wave: run `npm run build`.
- Before `$gsd-verify-work`: lint and build must be green or the blocker must be documented.
- Max feedback latency: one task.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | SHDR/CURS supersession | T-02-01 | No accidental public secret/docs leak | lint/build | `npm run lint` | yes | pending |
| 02-01-02 | 01 | 1 | LAND assets | T-02-02 | No missing public asset reference | build | `npm run build` | yes | pending |
| 02-02-01 | 02 | 1 | LAND-01..09 | T-02-03 | Client code does not expose server keys | lint/build | `npm run lint && npm run build` | yes | pending |
| 02-02-02 | 02 | 1 | CHAT mount prep | T-02-04 | Chat handles API errors as user-safe messages | lint/build | `npm run lint && npm run build` | yes | pending |
| 02-03-01 | 03 | 2 | RESP prep | T-02-05 | No fragile mobile overflow | build + manual | `npm run build` | yes | pending |

## Wave 0 Requirements

- Existing infrastructure covers initial validation.
- Add Playwright later when the page compiles and behavior stabilizes.

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| First viewport composition | LAND-01..09 | Visual layout quality | Open local site at desktop and mobile widths and check no overlap, missing icons, or horizontal scroll. |
| Brand feel | Phase context | Subjective design judgement | Compare against `public/README.md` and `02-UI-SPEC.md`. |

## Validation Sign-Off

- [x] All plans include automated verify commands.
- [x] Sampling continuity: no 3 consecutive tasks without automated verify.
- [x] No watch-mode flags.
- [x] Feedback latency target is one task.

**Approval:** pending
