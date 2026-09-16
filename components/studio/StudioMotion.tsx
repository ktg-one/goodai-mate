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
      const play = (element: Element, delay = 0, distance = 24) => {
        const animation = element.animate(
          [{ opacity: 0, translate: `0 ${distance}px` }, { opacity: 1, translate: "0 0" }],
          { duration: 750, delay, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      };

      // Do not replay the hero over direct links to lower sections.
      if (!window.location.hash && window.scrollY < 100) {
        document.querySelectorAll(".hero-copy > h1, .hero-description, .hero-button, .hero-voice-link, .hero-handnote, .hero-figure figcaption")
          .forEach((element, index) => play(element, index * 95, 32));
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          observer.unobserve(target);
          play(target);
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
