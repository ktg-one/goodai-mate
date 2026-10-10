"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { m, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

const Carousel = dynamic(() => import("@/components/carousel/Carousel"), {
  ssr: false,
  loading: () => (
    <section
      aria-label="Loading services carousel"
      className="min-h-105 h-full bg-brand-paper"
    />
  ),
});

export default function ServicesCarousel({ hero = false }: { hero?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isTransforming, setIsTransforming] = useState(false);

  // Scroll parallax tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth spring response (damping 30, stiffness 100 ensures >=1.0s movement duration curve)
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 100,
    restDelta: 0.001,
  });

  // Parallax transforms for stage depth, subtle scaling, and floating background layers
  const rawStageY = useTransform(smoothProgress, [0, 1], ["-40px", "40px"]);
  const rawStageScale = useTransform(smoothProgress, [0, 0.5, 1], [0.97, 1, 0.97]);
  const rawBgY1 = useTransform(smoothProgress, [0, 1], ["-60px", "60px"]);
  const rawBgY2 = useTransform(smoothProgress, [0, 1], ["40px", "-40px"]);
  const rawBgRotate = useTransform(smoothProgress, [0, 1], [-4, 4]);

  // Respect prefers-reduced-motion
  const stageY = shouldReduceMotion ? "0px" : rawStageY;
  const stageScale = shouldReduceMotion ? 1 : rawStageScale;
  const bgY1 = shouldReduceMotion ? "0px" : rawBgY1;
  const bgY2 = shouldReduceMotion ? "0px" : rawBgY2;
  const bgRotate = shouldReduceMotion ? 0 : rawBgRotate;

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden isolate">
      {/* Floating parallax decorative background accents */}
      {!hero && (
        <>
          <m.div
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 -left-12 z-0 h-64 w-64 rounded-full bg-brand-coral/10 blur-3xl"
            style={{ y: bgY1, rotate: bgRotate, willChange: isTransforming ? "transform" : "auto" }}
            onMouseEnter={() => setIsTransforming(true)}
            onAnimationEnd={() => setIsTransforming(false)}
          />
          <m.div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-12 -right-12 z-0 h-80 w-80 rounded-full bg-brand-teal/10 blur-3xl"
            style={{ y: bgY2, rotate: bgRotate, willChange: isTransforming ? "transform" : "auto" }}
            onMouseEnter={() => setIsTransforming(true)}
            onAnimationEnd={() => setIsTransforming(false)}
          />
        </>
      )}

      {/* Main carousel stage with smooth vertical scroll parallax and scale depth */}
      <m.div
        className="relative z-10 w-full"
        style={{
          y: stageY,
          scale: stageScale,
          willChange: isTransforming ? "transform" : "auto",
        }}
        onMouseEnter={() => setIsTransforming(true)}
        onAnimationEnd={() => setIsTransforming(false)}
      >
        <Carousel hero={hero} />
      </m.div>
    </div>
  );
}
