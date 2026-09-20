"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Progressive enhancement: content is visible before JS and after cleanup. */
export function StudioMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup = () => {};
    const start = () => {
      cleanup();
      if (preference.matches) return;
      const animations = new Set<Animation>();
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

      // Only the initial stationary hero entrance gets subtle settling on load
      if (!window.location.hash && window.scrollY < 100) {
        document.querySelectorAll(".hero-copy > h1, .hero-description, .hero-button, .hero-voice-link, .hero-handnote, .hero-figure figcaption")
          .forEach((element, index) => play(element, index * 95, 18));
      }

      // During scroll: elements stay grounded at their exact resting place ("we're coming to it")
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          observer.unobserve(target);
          play(target, 0, 0);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

      document.querySelectorAll(".section-heading, .story-intro, .chapter-copy, .service-row, .demo-copy, .workflow-preview, .voice-panel, .approach-steps article, .faq > h2, .faq details, .contact-inner, .detail-grid")
        .forEach(element => observer.observe(element));

      cleanup = () => {
        observer.disconnect();
        animations.forEach(animation => animation.cancel());
        animations.clear();
      };
    };
    start();
    preference.addEventListener("change", start);
    return () => { cleanup(); preference.removeEventListener("change", start); };
  }, [pathname]);

  return null;
}
