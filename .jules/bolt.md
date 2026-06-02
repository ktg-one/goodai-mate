## 2025-05-17 - RequestAnimationFrame Performance
**Learning:** In highly active `requestAnimationFrame` loops (like `CursorEffects.tsx` and custom cursor implementations), updating inline `style.left` and `style.top` causes full layout and reflow calculations every frame, destroying performance.
**Action:** Always prefer `style.transform = "translate3d(x, y, 0)"` for cursor trackers and high-frequency DOM manipulation. It triggers hardware acceleration and prevents main-thread layout thrashing.
