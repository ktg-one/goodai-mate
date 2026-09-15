# ThreeUI adaptations

The studio controls adapt the arrow-pill and Meridian keycap CSS patterns from
[ThreeUI Community RectangleButtons](https://github.com/MengTo/threeui/blob/main/src/shaders/rectangle-buttons/RectangleButtons.tsx).
The workflow panel and recessed selector are custom companion styles. Colours,
sizing, semantic links, existing actions and reduced-motion behaviour are local.
No ThreeUI runtime, iframe, shader loop or additional dependency is required.

The hero dock interaction in `components/ui/AutomationDock.tsx` is a local
adaptation inspired by the proximity-based interaction style of ThreeUI
AnimatedTopDock (`src/shaders/animated-top-dock/AnimatedTopDock.tsx`), rebuilt
with project tokens and existing iconography.

## Upstream license

MIT License

Copyright (c) 2026 Meng To

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
