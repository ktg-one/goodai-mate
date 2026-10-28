"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const GenerativeTree = dynamic(
  () => import("@/src/shaders/elements/GenerativeTree").then((m) => m.GenerativeTree),
  { ssr: false },
);

const GROW_MS = 6000;
const SLEEP_AFTER_LEAVE_MS = 900;
const REDUCED_GROW_MS = 1500;

const subscribeReducedMotion = (onStoreChange: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
};
const getReducedMotionSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getReducedMotionServerSnapshot = () => false;

export function HeroTree() {
  const plateRef = useRef<HTMLDivElement>(null);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const loaded = reduced || iframeLoaded;

  useEffect(() => {
    const plate = plateRef.current;
    if (reduced || !plate) return;

    const growDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? REDUCED_GROW_MS
      : GROW_MS;

    const post = (paused: boolean) => {
      const win = plate.querySelector<HTMLIFrameElement>("iframe")?.contentWindow;
      win?.postMessage({ type: "generative-tree-controls", controls: { speed: 1, paused } }, "*");
    };

    let sleepDelay = growDuration;
    let sleepTick = 0;
    const sleepInterval = setInterval(() => {
      if (sleepDelay > 0) {
        sleepTick += 300;
        if (sleepTick >= sleepDelay) {
          sleepDelay = 0;
          post(true);
        }
      }
    }, 300);

    const wake = () => {
      sleepTick = 0;
      sleepDelay = growDuration;
      post(false);
    };
    const onLeave = () => {
      sleepTick = 0;
      sleepDelay = SLEEP_AFTER_LEAVE_MS;
    };
    const onLoad = () => setIframeLoaded(true);

    plate.addEventListener("pointerenter", wake);
    plate.addEventListener("pointerleave", onLeave);
    plate.addEventListener("load", onLoad, true);

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        wake();
      }
    });
    observer.observe(plate);

    wake();
    const fallbackTimer = setTimeout(() => setIframeLoaded(true), 1500);

    return () => {
      clearInterval(sleepInterval);
      clearTimeout(fallbackTimer);
      observer.disconnect();
      plate.removeEventListener("pointerenter", wake);
      plate.removeEventListener("pointerleave", onLeave);
      plate.removeEventListener("load", onLoad, true);
    };
  }, [reduced]);

  return (
    <div
      className="hero-tree-plate"
      ref={plateRef}
      style={reduced ? undefined : { background: "#f5f0e4" }}
    >
      {!loaded && <div className="absolute inset-0 bg-brand-surface animate-pulse" />}
      {reduced ? (
        <img
          src="/images/book/14-sketch.webp"
          alt="Hero"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${loaded ? "opacity-100" : "opacity-0"}`}
        >
          <GenerativeTree daytime />
        </div>
      )}
    </div>
  );
}
