"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createSketchbookDocument } from "./sketchbookDocument.js";

export type SketchbookPage = { file: string; title: string; place: string };

export type SketchbookProps = {
  assetBaseUrl?: string;
  className?: string;
  /** Replaces the canonical plates. Files resolve against assetBaseUrl. */
  pages?: SketchbookPage[];
  /** Page the intro flip settles on. */
  land?: number;
  title?: string;
};

export function Sketchbook({
  assetBaseUrl = "/sketchbook/",
  className = "",
  pages,
  land,
  title = "Interactive sketchbook",
}: SketchbookProps) {
  const [ready, setReady] = useState(false);
  const documentSource = useMemo(
    () => createSketchbookDocument(assetBaseUrl, { pages, land }),
    [assetBaseUrl, pages, land],
  );

  // A srcdoc iframe can finish loading before hydration attaches onLoad,
  // which would leave it stuck at opacity 0 — so ready also fires on a
  // short fallback timer.
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Wheel input forwarded from the frame: replay it on the host so Lenis (or
  // native scrolling when Lenis is off) handles it like any other wheel.
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow || e.data?.type !== "sketchbook:wheel") return;
      const { dx, dy, mode } = e.data as { dx: number; dy: number; mode: number };
      if (document.documentElement.classList.contains("lenis")) {
        window.dispatchEvent(new WheelEvent("wheel", { deltaX: dx, deltaY: dy, deltaMode: mode, cancelable: true }));
      } else {
        const unit = mode === 1 ? 16 : mode === 2 ? window.innerHeight : 1;
        window.scrollBy({ left: dx * unit, top: dy * unit });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className={`sketchbook${className ? ` ${className}` : ""}`} data-state={ready ? "ready" : "loading"}>
      <iframe
        ref={frame}
        className={`sketchbook__frame${ready ? " is-ready" : ""}`}
        title={title}
        srcDoc={documentSource}
        sandbox="allow-scripts"
        loading="eager"
        onLoad={() => setReady(true)}
      />
    </div>
  );
}
