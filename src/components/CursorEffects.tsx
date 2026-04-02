'use client';

import { useEffect, useRef, useState } from 'react';

// Named export — safety valve for Phase 3/4 code that calls registerCursorTargets().
// Event delegation on document handles all current and future DOM elements automatically.
export function registerCursorTargets(): void {
  // No-op: event delegation covers dynamically injected elements.
}

export default function CursorEffects() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const [isTouch, setIsTouch] = useState<boolean | null>(null);

  useEffect(() => {
    // Touch detection — must run client-side only
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(touch);

    if (touch) {
      document.body.style.cursor = 'auto';
      return;
    }

    document.body.style.cursor = 'none';

    // Raw mouse position tracker
    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    // Hover expansion — event delegation covers all current and future elements
    const HOVER_SELECTOR = 'input, button, a, [data-cursor-hover]';

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(HOVER_SELECTOR);
      if (target && cursorRef.current) {
        cursorRef.current.style.width = '48px';
        cursorRef.current.style.height = '48px';
        cursorRef.current.style.borderColor = 'rgba(216,106,61,0.55)';
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(HOVER_SELECTOR);
      if (target && cursorRef.current) {
        cursorRef.current.style.width = '20px';
        cursorRef.current.style.height = '20px';
        cursorRef.current.style.borderColor = 'rgba(216,106,61,0.35)';
      }
    };

    // RAF loop — lerp cursor, direct-follow glow
    const lerp = 0.12;
    const tick = () => {
      cursorPos.current.x += (mouseRef.current.x - cursorPos.current.x) * lerp;
      cursorPos.current.y += (mouseRef.current.y - cursorPos.current.y) * lerp;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${cursorPos.current.x}px`;
        cursorRef.current.style.top = `${cursorPos.current.y}px`;
      }

      if (glowRef.current) {
        glowRef.current.style.left = `${mouseRef.current.x}px`;
        glowRef.current.style.top = `${mouseRef.current.y}px`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.body.style.cursor = 'auto';
    };
  }, []);

  // Null during SSR and before hydration determines touch state
  if (isTouch === null || isTouch) return null;

  return (
    <>
      {/* Custom cursor — lerp-following circle */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none rounded-full mix-blend-difference"
        style={{
          zIndex: 9999,
          width: '20px',
          height: '20px',
          border: '1.5px solid rgba(216,106,61,0.35)',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease',
          left: 0,
          top: 0,
        }}
      />

      {/* Ambient glow — 700px radial gradient, CSS-eased to mouse */}
      <div
        ref={glowRef}
        className="fixed pointer-events-none rounded-full"
        style={{
          zIndex: 0,
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 65%)',
          transform: 'translate(-350px, -350px)',
          transition: 'left 0.9s cubic-bezier(0.23, 1, 0.32, 1), top 0.9s cubic-bezier(0.23, 1, 0.32, 1)',
          left: 0,
          top: 0,
        }}
      />
    </>
  );
}
