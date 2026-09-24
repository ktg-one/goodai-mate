"use client";

import { useEffect, useRef, useState } from "react";

// Keeps the original intersection/pointer plumbing harmlessly (no iframe → no-op).
const GROW_MS = 6000;
const SLEEP_AFTER_LEAVE_MS = 900;
const REDUCED_GROW_MS = 1500;

export function HeroTree() {
  const plateRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const iframe = plateRef.current?.querySelector<HTMLIFrameElement>("iframe");
    const win = iframe?.contentWindow;
    if (!win) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const post = (paused: boolean) =>
      win.postMessage({ type: "generative-tree-controls", controls: { speed: 1, paused } }, "*");

    let sleepTimer: ReturnType<typeof setTimeout> | undefined;
    const wake = () => {
      clearTimeout(sleepTimer);
      post(false);
    };
    const sleepSoon = (delay: number) => {
      clearTimeout(sleepTimer);
      sleepTimer = setTimeout(() => post(true), delay);
    };

    const plate = plateRef.current;
    const onLeave = () => sleepSoon(SLEEP_AFTER_LEAVE_MS);
    plate?.addEventListener("pointerenter", wake);
    plate?.addEventListener("pointerleave", onLeave);

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        wake();
        sleepSoon(reduced ? REDUCED_GROW_MS : GROW_MS);
      }
    });
    if (iframe) observer.observe(iframe);

    wake();
    sleepSoon(reduced ? REDUCED_GROW_MS : GROW_MS);

    return () => {
      clearTimeout(sleepTimer);
      observer.disconnect();
      plate?.removeEventListener("pointerenter", wake);
      plate?.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="hero-tree-plate relative" ref={plateRef}>
      {/* Reserve aspect to avoid layout jump; adjust aspect ratio if needed */}
      <div className="w-full aspect-[16/9] bg-gray-50 overflow-hidden relative">
        {!loaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
        <img
          src="/sketchbook/perth.png"
          alt="Hero"
          loading="eager"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ease-out ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </div>
  );
}
