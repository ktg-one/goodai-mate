"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { useCarousel } from "./useCarousel";
import { CarouselFallback } from "./CarouselFallback";
import { CarouselProjectList } from "./CarouselProjectList";
import { CarouselLabels } from "./CarouselLabels";

export default function Carousel({ hero = false }) {
  const sectionRef = useRef(null);
  const { containerRef, listRef, itemsRef, loaderRef, liveRef, cutRef, metaRef } = useCarousel(hero);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const rawRotate = useTransform(scrollYProgress, [0, 1], [-1.5, 1.5]);
  const shouldReduceMotion = useReducedMotion();

  const smoothY = useSpring(rawY, { stiffness: 30, damping: 20 });
  const smoothRotate = useSpring(rawRotate, { stiffness: 30, damping: 20 });

  const y = shouldReduceMotion ? 0 : smoothY;
  const rotate = shouldReduceMotion ? 0 : smoothRotate;

  return (
    <section
      ref={sectionRef}
      aria-label="Good'Ai work and services"
      className={hero ? "carousel-hero-stage relative isolate w-full overflow-hidden bg-[var(--paper)]" : "relative isolate min-h-[max(640px,100dvh)] w-full overflow-hidden bg-[var(--paper)]"}
      style={{
        "--ink": "var(--brand-ink)",
        "--paper": "var(--brand-paper)",
        "--red": "var(--brand-coral)",
      }}
    >
      <CarouselFallback />

      <m.div
        style={{ y, rotate }}
        className="relative w-full h-full min-h-[inherit] motion-reduce:hidden"
      >
        {/* Vertical touch panning remains available to the page; horizontal
            movement is reserved for the carousel drag. */}
        <div
          ref={containerRef}
          aria-label="Interactive Good'Ai services carousel"
          className="absolute inset-0 touch-pan-y focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--red)]"
          role="group"
          tabIndex={0}
        />

        {!hero && <CarouselProjectList listRef={listRef} itemsRef={itemsRef} />}

        <CarouselLabels metaRef={metaRef} />

        {/* 001 to 100. Holds the entry at the seed until it gets there. */}
        <div
          ref={loaderRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 tracking-[-0.01em] text-[var(--ink)]"
        />

        <div ref={liveRef} aria-live="polite" className="sr-only" />

        {/* Alpha multiplied up hard and biased down, so a pixel is either fully
            opaque or gone. That is what fuses two blurred words into one
            silhouette instead of laying them over each other. Region is
            oversized because the blur bleeds well outside the text's own box. */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute h-0 w-0"
          focusable="false"
        >
          <defs>
            <filter
              id="name-goo"
              x="-20%"
              y="-100%"
              width="140%"
              height="300%"
              colorInterpolationFilters="sRGB"
            >
              <feColorMatrix
                ref={cutRef}
                in="SourceGraphic"
                type="matrix"
                values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 255 -140"
              />
            </filter>
          </defs>
        </svg>
      </m.div>
    </section>
  );
}
