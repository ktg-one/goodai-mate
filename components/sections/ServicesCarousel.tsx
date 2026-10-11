"use client";

import { useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax transform channels
  const rawY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const rawBgY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.7, 1, 1, 0.7]);

  // Smooth spring physics with >=1.0s movement duration feel
  const springY = useSpring(rawY, { damping: 30, stiffness: 45, mass: 1 });
  const springBgY = useSpring(rawBgY, { damping: 30, stiffness: 45, mass: 1 });
  const springOpacity = useSpring(rawOpacity, { damping: 30, stiffness: 45, mass: 1 });

  const contentY = shouldReduceMotion ? 0 : springY;
  const bgY = shouldReduceMotion ? 0 : springBgY;
  const opacity = shouldReduceMotion ? 1 : springOpacity;

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* Background parallax depth layer */}
      <m.div
        aria-hidden="true"
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-brand-paper/50 via-transparent to-brand-paper/50"
      />

      {/* Main interactive carousel section with parallax motion */}
      <m.div
        style={{ y: contentY, opacity }}
        className="relative z-10 w-full h-full"
      >
        <Carousel hero={hero} />
      </m.div>
    </div>
  );
}
