# Requirements

## Overview

This document defines the functional and non-functional requirements for the Good'Ai frontend marketing site. The site is a static, evidence-led public sales surface demonstrating advanced frontend engineering capabilities.

## Functional Requirements

### Site Structure

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-001 | Site must have a hero section introducing Good'Ai | High | Implemented |
| FR-002 | Site must have a product demonstration section (illustrative only) | High | Implemented |
| FR-003 | Site must have a features section describing capabilities | Medium | Implemented |
| FR-004 | Site must have a services carousel | Medium | Implemented |
| FR-005 | Site must have a pricing section | Medium | Implemented |
| FR-006 | Site must have a technical specifications section | Medium | Implemented |
| FR-007 | Site must have a testimonials section | Medium | Implemented |
| FR-008 | Site must have a FAQ section | Medium | Implemented |
| FR-009 | Site must have a CTA section for intake | High | Implemented |
| FR-010 | Site must have an infinite marquee for visual interest | Low | Implemented |
| FR-011 | Site must have a visual storytelling section | Low | Implemented |

### Component Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-201 | All sections must use brand color tokens (brand-ink, brand-paper, brand-coral, brand-eucalyptus) | High | Implemented |
| FR-202 | ProductDemo must clearly indicate it shows example data, not live operations | High | Implemented |
| FR-203 | ProductDemo must be usable without animation | High | Implemented |
| FR-204 | ProductDemo must clean up timers/listeners in effects | High | Implemented |
| FR-205 | Hero section must have GSAP-based animations | Medium | Implemented |
| FR-206 | Interactive elements must have hover/focus states | Medium | Implemented |

### Navigation & CTA

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-301 | All genuine intake CTAs must route through centralized destination | High | Implemented |
| FR-302 | No isolated CTA links should be added | High | Implemented |
| FR-303 | Brand spelling must be consistent: "Good'Ai" | High | Implemented |

## Non-Functional Requirements

### Performance

| ID | Requirement | Priority | Metric |
|----|-------------|----------|--------|
| NFR-001 | Site must load within 2 seconds on desktop | High | Lighthouse Performance > 80 |
| NFR-002 | Site must load within 3 seconds on mobile (3G) | High | Lighthouse Performance > 70 |
| NFR-003 | Animations must not block main thread | High | 60 FPS |
| NFR-004 | JavaScript bundle size must be optimized | Medium | < 500KB (gzipped) |

### Accessibility

| ID | Requirement | Priority | Standard |
|----|-------------|----------|----------|
| NFR-101 | Site must be keyboard navigable | High | WCAG 2.2 AA |
| NFR-102 | Site must have proper focus indicators | High | WCAG 2.2 AA |
| NFR-103 | Images must have alt text | Medium | WCAG 2.2 AA |
| NFR-104 | Color contrast must meet minimum ratios | Medium | WCAG 2.2 AA |
| NFR-105 | Animations must respect prefers-reduced-motion | High | CSS media query |

### Responsive Design

| ID | Requirement | Priority | Breakpoints |
|----|-------------|----------|-------------|
| NFR-201 | Site must be fully functional on mobile | High | 320px+ |
| NFR-202 | Site must be fully functional on tablet | High | 768px+ |
| NFR-203 | Site must be fully functional on desktop | High | 1024px+ |
| NFR-204 | Layout must adapt appropriately at each breakpoint | High | Tailwind breakpoints |

### Code Quality

| ID | Requirement | Priority | Tool |
|----|-------------|----------|------|
| NFR-301 | Code must pass ESLint checks | High | `npm run lint` |
| NFR-302 | Code must build successfully | High | `npm run build` |
| NFR-303 | TypeScript types must be correct | Medium | TypeScript compiler |
| NFR-304 | Code must follow existing patterns | Medium | Manual review |

### Brand Integrity

| ID | Requirement | Priority | Source |
|----|-------------|----------|--------|
| NFR-401 | Do not invent client outcomes | Critical | AGENTS.md |
| NFR-402 | Do not invent testimonials | Critical | AGENTS.md |
| NFR-403 | Do not claim live integrations | Critical | AGENTS.md |
| NFR-404 | Do not claim specific pricing | Critical | AGENTS.md |
| NFR-405 | Do not make compliance claims | Critical | AGENTS.md |

## Technical Requirements

### Framework & Libraries

| ID | Requirement | Version | Status |
|----|-------------|---------|--------|
| TR-001 | Next.js App Router | 16.0.8 | Implemented |
| TR-002 | React | 19.2.1 | Implemented |
| TR-003 | TypeScript | ^5 | Implemented |
| TR-004 | Tailwind CSS | v4 | Implemented |
| TR-005 | Framer Motion | ^12 | Implemented |
| TR-006 | GSAP | ^3.14 | Implemented |
| TR-007 | Lenis | ^1.3 | Implemented |
| TR-008 | Radix UI | ^1.1 | Implemented |
| TR-009 | Lucide React | ^0.560 | Implemented |

### Animation System

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| TR-101 | GSAP must be used for complex timelines | Medium | Implemented |
| TR-102 | Framer Motion must be used for component-level animations | Medium | Implemented |
| TR-103 | Lenis must be used for smooth scroll | Medium | Implemented |
| TR-104 | Animations must be performant | High | Implemented |
| TR-105 | Animations must degrade gracefully | Medium | Implemented |

## Constraints

1. **Content**: No invented client data, testimonials, integrations, pricing, or compliance claims
2. **CTA Links**: All intake CTAs must go through centralized destination
3. **Brand Spelling**: Always use "Good'Ai" (with apostrophe)
4. **ProductDemo**: Must remain clearly illustrative, not live operational data
5. **Animation**: ProductDemo must work without animation; clean up timers/listeners

## Assumptions

1. The site is static (no backend required)
2. Deployment is via Vercel
3. All data displayed is either static or illustrative
4. No user authentication is required
5. The site is marketing-focused, not transactional

## Dependencies

- Node.js 18+
- npm 10+
- Vercel CLI (for deployment)
- Modern browser (Chrome, Firefox, Safari, Edge latest versions)

## Open Questions

1. Should the ProductDemo section be enhanced or modified? (User referenced line 74)
2. Are there additional pages needed beyond the current single-page layout?
3. Should a blog or content management system be integrated?
4. Are there specific analytics or tracking requirements?

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-26 | GSD Initialization | Initial requirements capture |

---
*Requirements are living documents. Update as the project evolves.*
