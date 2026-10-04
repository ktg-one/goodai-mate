"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const GenerativeTree = dynamic(
  () => import("@/src/shaders/elements/GenerativeTree").then((m) => m.GenerativeTree),
  { ssr: false },
);

const GROW_MS = 6000;
const SLEEP_AFTER_LEAVE_MS = 900;
const REDUCED_GROW_MS = 1500;

export function HeroTree() {
  const plateRef = useRef<HTMLDivElement>(null);
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [loaded, setLoaded] = useState(reduced);

  useEffect(() => {
    if (reduced) return undefined;

    const plate = plateRef.current;
    if (!plate) return undefined;

    let cleanup: (() => void) | undefined;
    let sleepTimer: ReturnType<typeof setTimeout> | undefined;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

    const attach = (iframe: HTMLIFrameElement) => {
      const win = iframe.contentWindow;
      if (!win) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const post = (paused: boolean) =>
        win.postMessage({ type: "generative-tree-controls", controls: { speed: 1, paused } }, "*");

      const wake = () => {
        clearTimeout(sleepTimer);
        post(false);
      };
      const sleepSoon = (delay: number) => {
        clearTimeout(sleepTimer);
        sleepTimer = setTimeout(() => post(true), delay);
      };

      const onLeave = () => sleepSoon(SLEEP_AFTER_LEAVE_MS);
      plate.addEventListener("pointerenter", wake);
      plate.addEventListener("pointerleave", onLeave);

      const observer = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting) {
          wake();
          sleepSoon(reducedMotion ? REDUCED_GROW_MS : GROW_MS);
        }
      });
      observer.observe(iframe);

      wake();
      sleepSoon(reducedMotion ? REDUCED_GROW_MS : GROW_MS);

      const onLoad = () => setLoaded(true);
      iframe.addEventListener("load", onLoad);
      fallbackTimer = setTimeout(() => setLoaded(true), 1500);

      cleanup = () => {
        clearTimeout(sleepTimer);
        clearTimeout(fallbackTimer);
        observer.disconnect();
        iframe.removeEventListener("load", onLoad);
        plate.removeEventListener("pointerenter", wake);
        plate.removeEventListener("pointerleave", onLeave);
      };
    };

    // The tree mounts via next/dynamic, so the iframe may appear after this
    // effect first runs.
    const existing = plate.querySelector<HTMLIFrameElement>("iframe");
    if (existing) {
      attach(existing);
    } else {
      const mo = new MutationObserver(() => {
        const iframe = plate.querySelector<HTMLIFrameElement>("iframe");
        if (iframe) {
          mo.disconnect();
          attach(iframe);
        }
      });
      mo.observe(plate, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    return () => cleanup?.();
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
          src="/sketchbook/perth.png"
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
