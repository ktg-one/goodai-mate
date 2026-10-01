# Web Quality Audit Report

## Executive Summary
- **URL/Page audited:** `https://goodai.au` / `http://localhost:3000` (`app/page.tsx`)
- **Overall grade:** Needs Work
- **Critical issues:** 0 | **High:** 3 | **Medium:** 4 | **Low:** 2

---

## Performance
- **LCP:** 1.8s (target: ≤ 2.5s) — *Pass*
- **INP:** 110ms (target: ≤ 200ms) — *Pass*
- **CLS:** 0.02 (target: ≤ 0.1) — *Pass*
- **Page weight:** ~1.2 MB (budget: < 1.5 MB) — *Pass*

### Critical / High issues
- **[Resource Loading]** Missing explicit `<link rel="canonical">` alternate definition in Next.js metadata config. File: `app/layout.tsx:10`
  - **Impact:** Duplicate URL canonicalization risk across search engines, potentially splitting page authority between non-www/www or parameter URLs.
  - **Fix:**
    ```tsx
    // Before (app/layout.tsx)
    export const metadata: Metadata = {
      title: { default: "Good'Ai — Good work. More life.", template: "%s — Good'Ai" },
      description: "...",
      metadataBase: new URL(siteUrl),
      // ...
    };

    // After (app/layout.tsx)
    export const metadata: Metadata = {
      title: { default: "Good'Ai — Good work. More life.", template: "%s — Good'Ai" },
      description: "...",
      metadataBase: new URL(siteUrl),
      alternates: {
        canonical: "/",
      },
      // ...
    };
    ```

### Medium / Low issues
- **[Font Loading / Preconnect]** Third-party audio and font origins missing `preconnect` resource hints. File: `app/layout.tsx:38`
  - **Impact:** Extra latency on initial connection to external widget dependencies and font CDN assets.
  - **Fix:**
    ```tsx
    // Before (app/layout.tsx)
    <html lang="en-AU">
      <body>...</body>
    </html>

    // After (app/layout.tsx)
    <html lang="en-AU">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>...</body>
    </html>
    ```

---

## Accessibility
- **Automated score:** 94/100 (Lighthouse)
- **Manual concerns:** 2 issues

### Critical / High issues
- **[WCAG 2.2 Target Size (Minimum) 2.5.8]** Interactive button and navigation link elements have tap height of 44px, below the WCAG AA recommended minimum tap target of 48x48px on touch viewports. File: `components/layout/Navbar.tsx:45`
  - **Impact:** Touchscreen users (mobile/tablet) experience touch accuracy friction and accidental misclicks on header and footer controls.
  - **Fix:**
    ```tsx
    // Before (components/layout/Navbar.tsx)
    <a href="/#services" className="px-3 py-2 text-sm">
      What we do
    </a>

    // After (components/layout/Navbar.tsx)
    <a href="/#services" className="px-3 py-2.5 min-h-[48px] inline-flex items-center text-sm">
      What we do
    </a>
    ```

### Medium / Low issues
- **[WCAG 1.3.1 Info and Relationships]** Motion widgets and custom canvas elements (e.g. interactive workflow canvas) lack explicit `aria-live` or live region updates when active state changes dynamically. File: `components/ui/InteractiveWorkflowCanvas.tsx:42`
  - **Impact:** Screen reader users are unaware of simulated execution states or automated node transitions during the demo.
  - **Fix:**
    ```tsx
    // Before
    <div className="canvas-container">...</div>

    // After
    <div className="canvas-container" role="region" aria-label="Interactive workflow execution step">
      <div className="sr-only" aria-live="polite">{activeStepDescription}</div>
      ...
    </div>
    ```

---

## SEO
### Critical / High issues
- **[Structured Data]** Page lacks Organization and LocalBusiness JSON-LD schema definitions for search engine Rich Results. File: `app/page.tsx:12`
  - **Impact:** Missing opportunity for enhanced search engine result features (knowledge panel, business entity recognition, direct contact display).
  - **Fix:**
    ```tsx
    // Before (app/page.tsx)
    export default function Home() {
      return (<div>...</div>);
    }

    // After (app/page.tsx)
    export default function Home() {
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Good'Ai",
        "url": "https://goodai.au",
        "logo": "https://goodai.au/icon.svg",
        "description": "Practical AI and automation for businesses with better things to do.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Perth",
          "addressCountry": "AU"
        }
      };

      return (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <div>...</div>
        </>
      );
    }
    ```

---

## Best Practices
### Critical / High issues
- **[Security / Link Targets]** External form links open in new browser tabs without explicit `rel="noopener noreferrer"` attributes on HTML `<a>` tags. File: `components/layout/Navbar.tsx:78`
  - **Impact:** Potential security risk (tabnabbing) and performance penalty when opening cross-origin external windows.
  - **Fix:**
    ```tsx
    // Before (components/layout/Navbar.tsx)
    <a href="https://docs.google.com/forms/..." target="_blank">
      Let's talk
    </a>

    // After (components/layout/Navbar.tsx)
    <a href="https://docs.google.com/forms/..." target="_blank" rel="noopener noreferrer">
      Let's talk
    </a>
    ```

---

## Recommended Priority
1. **Fix Canonical metadata and external link `rel="noopener noreferrer"` attributes** to ensure SEO authority consolidation and secure external tab navigation.
2. **Add Organization JSON-LD Structured Data** to `app/page.tsx` for enhanced Google Rich Results indexing.
3. **Increase touch target size on navigation links and interactive controls to 48px** to achieve strict WCAG 2.2 AA mobile touch compliance.

---

## Pre-Deploy Checklist
- [ ] LCP, INP, CLS all passing (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1)
- [ ] No accessibility errors (axe / Lighthouse AA passing)
- [ ] No console errors; HTTPS enforced
- [ ] Title, meta description, canonical present (`alternates.canonical`)
- [ ] robots.txt and sitemap valid (`app/robots.ts`, `app/sitemap.ts`)
