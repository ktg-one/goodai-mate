## Color Updates 19-08-2026

The new color palette requires updating `globals.css` (or wherever CSS tokens live) to matching brand values:

- Navy (Background default): #202B3D
- Coral (Accent/Hover): #F66F61
- Teal (Secondary/Accent): #1CABB0
- Silver (Foreground/Text default): #D9D9D9
- Slate (Structure/Card border): #282C2D

Apply `public/assets/shapes/shape-big-*.svg` as backgrounds to every 2nd viewport and bare cards.

## 2024-08-26 - Missing Accessible Name on Mobile Menu Button
**Learning:** Icon-only buttons used for critical navigation elements like mobile menus often lack `aria-label`s, creating barriers for screen reader users trying to open the navigation drawer.
**Action:** Consistently ensure that all `<Button size="icon">` components or buttons that only wrap SVG icons receive a descriptive `aria-label` to provide context.

## 2024-09-10 - Missing Focus Rings on Framer Motion Buttons
**Learning:** Custom interactive UI components built with wrappers like Framer Motion (`<motion.button>`) or generic primitives (`SheetClose` without default focus styles) often lack default browser focus rings.
**Action:** Always append explicit `focus-visible` utility classes (e.g., `focus-visible:outline-2 focus-visible:outline-brand-coral outline-none`) to these custom components to maintain keyboard accessibility.
