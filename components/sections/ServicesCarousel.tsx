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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);
  const parallaxScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.97, 1, 0.98]
  );
  const parallaxOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0.7, 1, 1, 0.7]
  );

  return (
    <m.div
      ref={containerRef}
      initial={
        shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
      }
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        y: shouldReduceMotion ? 0 : parallaxY,
        scale: shouldReduceMotion ? 1 : parallaxScale,
        opacity: shouldReduceMotion ? 1 : parallaxOpacity,
      }}
      className="relative w-full overflow-hidden"
    >
      <Carousel hero={hero} />
    </m.div>
  );
}
