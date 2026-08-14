The goal is to implement ONE micro-UX change that transforms the design into the brand required for this site, as Palette 🎨. The memory says: "UX/CSS Pattern: To maintain a cohesive brutalist design system across the app, define primitive interaction classes (like `.stamp-btn` or `.gai-input` with specific strict physics, hover shadows, flat aesthetics, focus states, and color variants) globally in `globals.css` rather than hardcoding utility classes inline across multiple component files."

I see that `gai-input` is used in multiple places (`LeadCaptureCard.tsx`, `BuzzCTA.tsx`, `WebsiteAnalyzer.tsx`, etc.), but it is NOT defined in `src/app/globals.css`. I'll add the `.gai-input` class to `src/app/globals.css`.

The definition should follow the brutalist aesthetic: strict physics, flat aesthetics, focus states, and color variants.

I will define `.gai-input`:
```css
.gai-input {
  font-family: var(--font-sans);
  font-size: 16px;
  color: var(--ink);
  background: var(--paper);
  border: 2px solid var(--ink);
  border-radius: 0;
  padding: 10px 14px;
  outline: none;
  transition: box-shadow 120ms, transform 120ms;
  box-shadow: 2px 2px 0 var(--ink);
}

.gai-input:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 2px;
  box-shadow: 4px 4px 0 var(--ink);
  transform: translate(-2px, -2px);
}

.gai-input::placeholder {
  color: var(--ink-faint);
}

.gai-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--paper-deep);
}
```

Wait, let's look at `LeadCaptureCard.tsx` - it might be wrapping it in another way or maybe `gai-input` is the primary class. Yes, it's just `className="gai-input"`.

Let's check if there is an existing styling for input that we should replace, or if we just need to append this to `globals.css`.
