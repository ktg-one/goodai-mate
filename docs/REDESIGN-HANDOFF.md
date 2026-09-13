# Good’Ai — alternate studio design

A separate clone of `../goodai-main`, on branch `design/good-work-more-life`. The original working files and original branch have not been edited. The source checkout had existing AGENTS.md changes and untracked tool folders; tracked working files were copied into this fork so those tracked changes were preserved.

## View and run

- Alternate: http://localhost:3011
- Original: http://localhost:3010
- Development: `npm run dev -- --port 3011 --webpack`
- Production: `npm run build -- --webpack`, then `npm run start -- --port 3012`
- Verification: `npm run lint`

This local clone shares the original node_modules through a directory junction. A fresh standalone checkout can use `npm ci`. Development uses `.next-dev` so a production build cannot disturb it. No deploy, push, form submission, or voice call was made. The fork is deliberately noindex, with a localhost metadata base.

## Design decision

“Good work. More life.” makes the existing business promise concrete: useful automation gives people attention and time back. Manrope is the clear everyday voice; Fraunces supplies the human, expressive line. Paper, dark olive and rust relate to the generated coastal telephone photograph. A sage surface distinguishes the product example and closing invitation. The service list is an index rather than a set of generic feature cards.

Current typography examples were reviewed at https://refs.gallery/margins/best-typography-websites-2026 as visual context only, not evidence that a style improves conversion. The direction is an authored alternative, not a claim of proven market performance.

## Implemented

- Complete homepage: services, process, FAQs and enquiry path.
- Founder-requested Vibes handwritten asides and a GSAP scroll-drawn story: busy desk, connected work, then a chair in the sun. Desktop sticky composition, inline mobile drawings and static reduced-motion fallback.
- Five individually addressable service pages, using the supplied finalized catalogue and prices.
- Interactive examples for enquiries, quote follow-up and bookings.
- Operations dashboard: Today, sample Jobs, functional local Rules switches.
- Optional existing ElevenLabs agent, loaded only on request.
- Preview-specific privacy and terms, a branded missing-page view and favicon.
- Local fonts and a 235 KB WebP hero (original PNG retained).

## Source authority and boundaries

Current factual sources read in full:
- C:/Users/kevin/Documents/03/Finalized Good AI service list.md
- C:/Users/kevin/Documents/03/notebooklm-company-gap-fill-upload-manifest.md
- C:/Users/kevin/Documents/03/notebooklm-current-company-context-2026-08-28.md
- Source repo AGENTS.md, centralized lib/links.ts and current site copy.
- Company privacy policy and terms from 01-ADMIN/aib-inspection-package/02-legal.

The attached design-system prompt informed DESIGN.md; its embedded workflow instructions were not treated as new user instructions. NotebookLM upload instructions were treated as documentary context, not authorization to upload files.

AgentMemory was verified through mcp-hub (agentmemory.exe against http://localhost:3111). The direct mcp__agentmemory route returned empty results. The hub recovered historical brand record mem_msx3b0s1_ac8215746d00 (17 August): plainspoken voice, ink/cloud/coral/teal, Playfair Display, tracked labels, no gradients, contrasting borders. This is historical context, superseded visually by the explicitly authorized alternative. A full manifesto passage was not recovered.

No invented testimonials, client names, certifications, outcomes or deployment claims. The workflow examples are clearly simulated. No public launch is implied by this local design.

## Before public release

Reconcile and approve the company legal documents: the old terms carry superseded prices and the old privacy policy does not describe this exact optional ElevenLabs implementation. The linked preview notices explicitly acknowledge this boundary. Confirm final commercial terms, replace the localhost metadata base, remove noindex when publishing is authorized, and validate the real enquiry submission and voice conversation in a separate authorized test.

The generated photograph is conceptual brand artwork; it is not a photograph of a Good’Ai office, client, employee, or verified Perth location. Real future photography should show Kevin at work and genuine workflow artifacts, with permission, rather than imply a larger team.
