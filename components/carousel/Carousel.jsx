"use client";

import { useCarousel } from "./useCarousel";
import { CarouselFallback } from "./CarouselFallback";
import { CarouselProjectList } from "./CarouselProjectList";
import { CarouselLabels } from "./CarouselLabels";

export default function Carousel({ hero = false }) {
  const { containerRef, listRef, itemsRef, loaderRef, liveRef, cutRef, metaRef } = useCarousel(hero);

  return (
    <section
      aria-label="Good'Ai work and services"
      className={hero ? "carousel-hero-stage relative isolate overflow-hidden bg-[var(--paper)]" : "relative isolate h-screen min-h-[640px] overflow-hidden bg-[var(--paper)]"}
      style={{
        "--ink": "var(--brand-ink)",
        "--paper": "var(--brand-paper)",
        "--red": "var(--brand-coral)",
      }}
    >
      <CarouselFallback />

      <div className="contents motion-reduce:hidden">
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
      </div>
    </section>
  );
}
