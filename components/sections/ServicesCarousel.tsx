"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";

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
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.85, 1, 1, 0.85]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.98]);

  return (
    <m.div
      ref={sectionRef}
      style={{
        y: shouldReduceMotion ? 0 : parallaxY,
        opacity: shouldReduceMotion ? 1 : opacity,
        scale: shouldReduceMotion ? 1 : scale,
      }}
      className="w-full relative isolate"
    >
      <Carousel hero={hero} />
    </m.div>
  );
}
