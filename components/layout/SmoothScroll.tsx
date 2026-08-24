"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function ScrollTriggerSync() {
  useLenis(() => ScrollTrigger.update());

  useEffect(() => {
    let cancelled = false;

    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };

    refresh();
    document.fonts?.ready.then(refresh).catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
