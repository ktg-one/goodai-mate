# Roadmap

## Overview

This roadmap defines the phased execution plan for the Good'Ai frontend project. Each phase represents a focused body of work with clear deliverables and acceptance criteria.

## Milestones

### Milestone 1: GSD Initialization & Project Setup

**Status**: In Progress  
**Phase**: 0 (Setup)  
**Estimated Duration**: 1-2 hours  

#### Objective
Establish GSD workflow infrastructure and document the existing project state.

#### Deliverables
- [x] `.planning/PROJECT.md` - Project context and scope
- [x] `.planning/config.json` - Workflow preferences
- [x] `.planning/STATE.md` - Current project state
- [x] `.planning/REQUIREMENTS.md` - Functional and non-functional requirements
- [x] `.planning/ROADMAP.md` - This document
- [ ] `.planning/backlog/` - Initial backlog items (optional)
- [ ] `.planning/codebase/` - Codebase documentation (optional)

#### Acceptance Criteria
- All GSD core files are created
- Project context is accurately captured
- Requirements reflect the current state of the codebase
- Verification commands (`npm run lint`, `npm run build`) are configured

---

### Milestone 2: ProductDemo Enhancement & Verification

**Status**: Pending  
**Phase**: 1  
**Estimated Duration**: 2-4 hours  
**Priority**: High (user referenced ProductDemo.tsx:74)

#### Objective
Verify and potentially enhance the ProductDemo section, ensuring it meets all constraints from AGENTS.md and REQUIREMENTS.md.

#### Context
The user specifically referenced line 74 of `components/sections/ProductDemo.tsx`:
```tsx
<div className="relative aspect-video md:aspect-video lg:aspect-2/1 border border-brand-ink bg-brand-paper p-2 md:p-4 shadow-[8px_8px_0_var(--brand-coral)]">
```

This is the container for the macOS-style window demo that illustrates workflow jobs, status, and outcomes.

#### Tasks
- [ ] Audit ProductDemo.tsx against AGENTS.md constraints
- [ ] Verify example data is clearly marked as non-live
- [ ] Verify interaction works without animation
- [ ] Verify timers and listeners are cleaned up in effects
- [ ] Check responsive behavior (mobile, tablet, desktop)
- [ ] Check accessibility (keyboard focus, reduced motion)
- [ ] Check brand token usage consistency
- [ ] Run lint and build verification

#### Deliverables
- ProductDemo section that passes all constraints
- Updated STATE.md with findings
- Optional: Enhancements based on audit findings

#### Acceptance Criteria
- [ ] ProductDemo clearly indicates example/illustrative data
- [ ] ProductDemo is usable without animation
- [ ] All timers/listeners are cleaned up
- [ ] Responsive breakpoints work correctly
- [ ] Brand tokens are used consistently
- [ ] Passes `npm run lint`
- [ ] Passes `npm run build`

---

### Milestone 3: Codebase Health & Documentation

**Status**: Pending  
**Phase**: 2  
**Estimated Duration**: 4-8 hours  
**Priority**: Medium

#### Objective
Document the codebase architecture and ensure all sections meet quality standards.

#### Tasks
- [ ] Create codebase map in `.planning/codebase/`
- [ ] Document component hierarchy
- [ ] Document animation systems (GSAP, Framer Motion, Lenis)
- [ ] Document brand design system tokens
- [ ] Audit all sections for AGENTS.md compliance
- [ ] Identify and document any technical debt

#### Deliverables
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/ANIMATION.md`
- `.planning/codebase/DESIGN-SYSTEM.md`
- Updated backlog with identified issues

#### Acceptance Criteria
- Codebase is fully documented
- All sections are audited for compliance
- Technical debt is identified and prioritized

---

### Milestone 4: Performance & Accessibility Audit

**Status**: Pending  
**Phase**: 3  
**Estimated Duration**: 4-8 hours  
**Priority**: Medium

#### Objective
Ensure the site meets performance and accessibility requirements.

#### Tasks
- [ ] Run Lighthouse audit (Performance, Accessibility, SEO, Best Practices)
- [ ] Identify performance bottlenecks
- [ ] Fix accessibility issues (WCAG 2.2 AA compliance)
- [ ] Optimize animations for 60 FPS
- [ ] Verify prefers-reduced-motion support
- [ ] Test on mobile devices
- [ ] Test keyboard navigation

#### Deliverables
- Lighthouse report with scores > 80 (Performance), > 90 (Accessibility)
- Fixes for identified issues
- Documentation of optimizations

#### Acceptance Criteria
- Lighthouse Performance > 80 (desktop)
- Lighthouse Accessibility > 90
- All WCAG 2.2 AA criteria met
- Animations run at 60 FPS
- Mobile experience is smooth

---

### Milestone 5: Content & CTA Verification

**Status**: Pending  
**Phase**: 4  
**Estimated Duration**: 2-4 hours  
**Priority**: Medium

#### Objective
Verify all content meets the brand integrity constraints from AGENTS.md.

#### Tasks
- [ ] Audit all text content for invented claims
- [ ] Verify no fake testimonials
- [ ] Verify no fake client outcomes
- [ ] Verify no false integration claims
- [ ] Verify no specific pricing claims
- [ ] Verify no compliance claims
- [ ] Verify all CTAs route through centralized destination
- [ ] Verify brand spelling consistency (Good'Ai)

#### Deliverables
- Content audit report
- Fixes for any violations
- Updated content guidelines

#### Acceptance Criteria
- No invented claims in content
- All CTAs properly routed
- Brand spelling consistent throughout

---

## Backlog Items

These are potential future work items, not yet scheduled into milestones:

### Enhancements
- [ ] Add additional page templates (About, Blog, Contact)
- [ ] Integrate CMS for content management
- [ ] Add analytics tracking
- [ ] Implement theme switching
- [ ] Add internationalization (i18n)
- [ ] Enhance animation complexity
- [ ] Add more interactive demos

### Technical
- [ ] Upgrade dependencies to latest versions
- [ ] Add unit/integration tests
- [ ] Add Storybook for component development
- [ ] Implement CI/CD pipeline
- [ ] Add error tracking (Sentry)
- [ ] Add performance monitoring

### Content
- [ ] Add real client case studies (when available)
- [ ] Add team bios
- [ ] Add company story/history
- [ ] Create video demonstrations

---

## Priority Definitions

- **Critical**: Must be done immediately, blocks other work
- **High**: Important, should be done next
- **Medium**: Nice to have, schedule when resources allow
- **Low**: Backlog item, future consideration

## Status Definitions

- **Not Started**: Work not yet begun
- **In Progress**: Actively being worked on
- **Blocked**: Cannot proceed due to dependencies
- **Review**: Code/implementation complete, awaiting review
- **Done**: Complete and verified

---

## Next Actions

1. **Immediate**: Complete Milestone 1 (GSD initialization) - IN PROGRESS
2. **Next**: Begin Milestone 2 (ProductDemo audit) once user confirms focus area
3. **Optional**: User may want to define different first milestone based on their actual intent for referencing ProductDemo.tsx:74

---
*Roadmap Version: 1.0*  
*Last Updated: 2026-08-26*  
*Next Review: Upon completion of Milestone 1*

## Notes

- The user referenced ProductDemo.tsx:74 multiple times. This roadmap assumes they want to audit/verify that component.
- If the user has a different specific task in mind for ProductDemo, the roadmap can be adjusted.
- All work must respect the constraints in AGENTS.md and REQUIREMENTS.md.

### ⚡ Automation Phase (New)
ProductDemo is evolving from illustrative examples to **real automations** when verified data contracts, access models, and workflow sources are defined (per updated AGENTS.md). This is a future enhancement beyond the current GSD phases.
