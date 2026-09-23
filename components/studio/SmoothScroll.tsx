"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    let updateLenis: ((time: number) => void) | null = null;

    const stop = () => {
      if (updateLenis) {
        gsap.ticker.remove(updateLenis);
        updateLenis = null;
      }
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
    };

    const start = () => {
      if (preference.matches || lenis) return;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        smoothWheel: true,
      });

      lenis.on("scroll", ScrollTrigger.update);

      updateLenis = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);
    };

    const syncPreference = () => {
      if (preference.matches) {
        stop();
        return;
      }
      start();
    };

    syncPreference();
    preference.addEventListener("change", syncPreference);

    return () => {
      preference.removeEventListener("change", syncPreference);
      stop();
    };
  }, []);

  return null;
}
