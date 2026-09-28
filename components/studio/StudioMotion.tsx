"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP + ScrollTrigger Motion System for Good'Ai.
 * Handles staggered hero entrances, scroll reveals, image parallax,
 * and scoped cleanup on route changes with strict reduced-motion support.
 */
export function StudioMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (prefersReducedMotion.matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Coordinated Hero Entrance Timeline
      if (!window.location.hash && window.scrollY < 100) {
        const heroElements = gsap.utils.toArray<HTMLElement>(
          ".hero-copy > h1, .hero-description, .hero-actions > *, .hero-handnote, .hero-bottom, .hero-figure"
        );

        if (heroElements.length > 0) {
          gsap.from(heroElements, {
            opacity: 0,
            y: 28,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "opacity,transform",
          });
        }
      }

      // 2. Subtle Parallax for Hero Image
      const heroImage = document.querySelector<HTMLElement>(".hero-figure img");
      if (heroImage) {
        gsap.to(heroImage, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-figure",
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }

      // 3. Staggered Scroll Reveals using ScrollTrigger Batching
      const revealSelectors = [
        ".section-heading",
        ".story-intro",
        ".service-row",
        ".demo-copy",
        ".workflow-preview",
        ".voice-panel",
        ".approach-steps article",
        ".faq > h2",
        ".faq details",
        ".contact-inner",
        ".detail-grid",
        ".promise-strip",
      ];

      const targets = gsap.utils.toArray<HTMLElement>(revealSelectors.join(", "));

      if (targets.length > 0) {
        ScrollTrigger.batch(targets, {
          start: "top 88%",
          once: true,
          fastScrollEnd: true,
          preventOverlaps: true,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { opacity: 0, y: 28 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.08,
                ease: "power2.out",
                clearProps: "opacity,transform",
              }
            );
          },
        });
      }
    });

    // Refresh ScrollTrigger instances on fonts/images load
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
