"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { cn } from "@/lib/utils";

export function BrandedElevenLabsWidget() {
  const [pastHero, setPastHero] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    let scrollStopTimer: NodeJS.Timeout;

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const heroThreshold = window.innerHeight * 0.65;

      setPastHero(scrollY > heroThreshold);
      setIsScrolling(true);

      clearTimeout(scrollStopTimer);
      scrollStopTimer = setTimeout(() => {
        setIsScrolling(false);
      }, 350);
    };

    // Check initial position
    handleScroll();

    if (lenis) {
      lenis.on("scroll", handleScroll);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(scrollStopTimer);
      if (lenis) {
        lenis.off("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lenis]);

  // Completely hidden on Hero; subtle while actively scrolling; crisp and visible when stationary
  const isVisible = pastHero;
  const isMuted = isScrolling;

  return (
    <div
      className={cn(
        "fixed bottom-5 right-5 z-[9999] transition-all duration-500 ease-out",
        isVisible
          ? isMuted
            ? "opacity-40 scale-95 translate-y-2 pointer-events-none"
            : "opacity-100 scale-100 translate-y-0 pointer-events-auto"
          : "opacity-0 scale-90 translate-y-8 pointer-events-none"
      )}
    >
      <elevenlabs-convai
        agent-id="agent_8501m0h2hvh0edr99jkqzr4rw53n"
        avatar-orb-color-1="#ff6f61"
        avatar-orb-color-2="#1cabb0"
        action-text="Test Good'Ai Voice Agent"
      />
    </div>
  );
}

