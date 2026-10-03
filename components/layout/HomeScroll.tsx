"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Continuous, scroll-tied reveals for the home page (Clico-style end-to-end
// motion). One pinned centerpiece (ScrollStory) already exists; everything
// here is scrub-driven fade/rise only — no extra pinning, 1-2 elements per
// view, reduced-motion users get the final state immediately.

export function HomeScroll() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 761px)",
      },
      (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;

        const root = document.querySelector("main") ?? undefined;
        const g = gsap.context(() => {
          const q = gsap.utils.selector(root as Element);

          if (desktop) {
            const outro = q(".tree-outro")[0] as Element | undefined;
            if (!outro) return;
            gsap.to(".hero-tree-plate", {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                id: "home-flow-outro",
                trigger: outro,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.1,
                invalidateOnRefresh: true,
                refreshPriority: -1,
              },
            });
          }

          ScrollTrigger.refresh();
        }, root);

        return () => g.revert();
      }
    );

    return () => mm.revert();
  }, []);

  return null;
}
