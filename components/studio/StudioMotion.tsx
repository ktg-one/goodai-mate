"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Progressive enhancement: content is visible before JS and after cleanup. */
export function StudioMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();

    const cleanup = () => {
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };

    const start = () => {
      cleanup();
      if (preference.matches) return;

      const play = (element: Element, delay = 0, distance = 0) => {
        const keyframes = distance > 0
          ? [{ opacity: 0, translate: `0 ${distance}px` }, { opacity: 1, translate: "0 0" }]
          : [{ opacity: 0 }, { opacity: 1 }];
        const animation = element.animate(
          keyframes,
          { duration: 600, delay, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      };

      // HomeScroll owns scroll-linked reveals. This component owns only the
      // stationary hero entrance so the two systems do not animate the same
      // opacity and transform properties.
      if (!window.location.hash && window.scrollY < 100) {
        document.querySelectorAll(".hero-copy > h1, .hero-description, .hero-button, .hero-voice-link, .hero-handnote, .hero-figure figcaption")
          .forEach((element, index) => play(element, index * 95, 18));
      }
    };

    start();
    preference.addEventListener("change", start);

    return () => {
      cleanup();
      preference.removeEventListener("change", start);
    };
  }, [pathname]);

  return null;
}
