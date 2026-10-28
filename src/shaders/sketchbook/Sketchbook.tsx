"use client";

import { useEffect, useImperativeHandle, useMemo, useRef, useState, type Ref } from "react";
import { createSketchbookDocument } from "./sketchbookDocument.js";

export type SketchbookPage = { file: string; title: string; place: string };

/** Turns the page from the host (gate mode). */
export type SketchbookHandle = { turn: (dir: "next" | "prev") => void };

export type SketchbookProps = {
  assetBaseUrl?: string;
  className?: string;
  /** Replaces the canonical plates. Files resolve against assetBaseUrl. */
  pages?: SketchbookPage[];
  /** Page the intro flip settles on. */
  land?: number;
  title?: string;
  /** Gate mode (PerthSketchbook): the host turns the pages, so wheel input comes here instead of scrolling the page. */
  gate?: boolean;
  onPage?: (index: number, count: number) => void;
  onWheel?: (deltaY: number) => void;
  ref?: Ref<SketchbookHandle>;
};

export function Sketchbook({
  assetBaseUrl = "/sketchbook/",
  className = "",
  pages,
  land,
  title = "Interactive sketchbook",
  gate = false,
  onPage,
  onWheel,
  ref,
}: SketchbookProps) {
  const [ready, setReady] = useState(false);
  const documentSource = useMemo(
    () => createSketchbookDocument(assetBaseUrl, { pages, land, gate }),
    [assetBaseUrl, pages, land, gate],
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
  // In gate mode it goes to the gate instead, along with each settled page.
  const frame = useRef<HTMLIFrameElement>(null);
  useImperativeHandle(ref, () => ({
    turn: (dir) => frame.current?.contentWindow?.postMessage({ type: "sketchbook:step", dir }, "*"),
  }), []);
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow) return;
      if (e.data?.type === "sketchbook:page") {
        onPage?.(e.data.i as number, e.data.n as number);
        return;
      }
      if (e.data?.type !== "sketchbook:wheel") return;
      const { dx, dy, mode } = e.data as { dx: number; dy: number; mode: number };
      const unit = mode === 1 ? 16 : mode === 2 ? window.innerHeight : 1;
      if (onWheel) {
        onWheel(dy * unit);
      } else if (document.documentElement.classList.contains("lenis")) {
        window.dispatchEvent(new WheelEvent("wheel", { deltaX: dx, deltaY: dy, deltaMode: mode, cancelable: true }));
      } else {
        window.scrollBy({ left: dx * unit, top: dy * unit });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onPage, onWheel]);

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
