"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

// Each source image is a photographed open spread. The page area (inside the
// book edges) is measured in % of the image: spine at 50%, outer edges at
// 2.2% / 97.8%, top 12.7%, height 77.1%.
const PAGE = { top: 12.7, height: 77.1, width: 47.8, leftOuter: 2.2 };

const spreads = [
  { src: "/sketchbook/perth-.png", alt: "Watercolour spread of the Perth skyline and Swan River from Kings Park at sunset", caption: "Kings Park, looking east" },
  { src: "/sketchbook/perth2.png", alt: "Watercolour spread of families on Cottesloe Beach at sunset", caption: "Cottesloe, after work" },
  { src: "/sketchbook/perth3.png", alt: "Watercolour spread of a busy harbourside brewery hall at golden hour", caption: "Fremantle, Friday arvo" },
];

const SIZES = "(max-width: 1100px) 100vw, 1100px";

type Flip = { to: number; dir: 1 | -1 } | null;

function PageSlice({ src, side }: { src: string; side: "left" | "right" }) {
  // Positions the full image so only one page of the spread shows inside the slice.
  const left = side === "right" ? 50 : PAGE.leftOuter;
  return (
    <div
      className="sbf-slice-img"
      style={{
        width: `${(100 / PAGE.width) * 100}%`,
        height: `${(100 / PAGE.height) * 100}%`,
        left: `${(-left / PAGE.width) * 100}%`,
        top: `${(-PAGE.top / PAGE.height) * 100}%`,
      }}
    >
      <Image src={src} alt="" fill sizes={SIZES} draggable={false} />
    </div>
  );
}

export function SketchbookFlip() {
  const [current, setCurrent] = useState(0);
  const [flip, setFlip] = useState<Flip>(null);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (flip) return;
      const to = current + dir;
      if (to < 0 || to >= spreads.length) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setCurrent(to);
        return;
      }
      setFlip({ to, dir });
    },
    [current, flip],
  );

  const settle = () => {
    if (!flip) return;
    setCurrent(flip.to);
    setFlip(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.target instanceof HTMLElement) || !e.target.closest(".sbf")) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const shown = flip ? flip.to : current;
  const from = spreads[current].src;
  const to = flip ? spreads[flip.to].src : null;
  const pageBox = (side: "left" | "right") => ({
    top: `${PAGE.top}%`,
    height: `${PAGE.height}%`,
    width: `${PAGE.width}%`,
    left: side === "right" ? "50%" : `${PAGE.leftOuter}%`,
  });

  return (
    <section className="sbf" aria-roledescription="carousel" aria-label="Perth sketchbook">
      <div
        className="sbf-book"
        tabIndex={0}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
      >
        {/* All spreads stay mounted so flips never wait on a download. */}
        {spreads.map((s, i) => (
          <div key={s.src} className="sbf-spread" data-active={i === current || undefined}>
            <Image src={s.src} alt={s.alt} fill sizes={SIZES} priority={i === 0} draggable={false} />
          </div>
        ))}

        {flip && to && (
          <>
            {/* The page being uncovered underneath the turning leaf. */}
            <div className="sbf-slice" style={pageBox(flip.dir === 1 ? "right" : "left")}>
              <PageSlice src={to} side={flip.dir === 1 ? "right" : "left"} />
            </div>
            <div
              className={`sbf-leaf ${flip.dir === 1 ? "is-forward" : "is-back"}`}
              style={pageBox(flip.dir === 1 ? "right" : "left")}
              onAnimationEnd={settle}
            >
              <div className="sbf-face sbf-front">
                <PageSlice src={from} side={flip.dir === 1 ? "right" : "left"} />
              </div>
              <div className="sbf-face sbf-back">
                <PageSlice src={to} side={flip.dir === 1 ? "left" : "right"} />
              </div>
            </div>
          </>
        )}

        <button className="sbf-hit sbf-hit-prev" onClick={() => go(-1)} disabled={shown === 0} aria-label="Previous page" />
        <button className="sbf-hit sbf-hit-next" onClick={() => go(1)} disabled={shown === spreads.length - 1} aria-label="Next page" />
      </div>

      <div className="sbf-meta">
        <p className="sbf-caption" aria-live="polite">{spreads[shown].caption}</p>
        <span className="sbf-count">{String(shown + 1).padStart(2, "0")} / {String(spreads.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
