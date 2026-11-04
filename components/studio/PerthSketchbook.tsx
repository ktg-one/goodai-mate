"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sketchbook, type SketchbookHandle, type SketchbookPage } from "@/src/shaders/sketchbook/Sketchbook";

// ThreeUI sketchbook pointing at public/images/book/ (1-sketch through 14-sketch).
const pages: SketchbookPage[] = [
  { file: "1-sketch.webp", title: "Missing heaps of calls?", place: "" },
  { file: "2-sketch.webp", title: "On top of your emails and bookings?", place: "" },
  { file: "3-sketch.webp", title: "Don't forget all that admin too...", place: "" },
  { file: "4-sketch.webp", title: "Anyone would be swamped... especially today...", place: "" },
  { file: "5-sketch.webp", title: "So let Goodie smash it out for ya", place: "" },
  { file: "6-sketch.webp", title: "Git Goodie! those bookings! those dam receipts!", place: "" },
  { file: "7-sketch.webp", title: "Too easy... ya little legend!", place: "" },
  { file: "8-sketch.webp", title: "admin, emails, bookings, calls, invoices, posting socials, anything digital!", place: "" },
  { file: "9-sketch.webp", title: "Knock off early!", place: "" },
  { file: "10-sketch.webp", title: "Cheers! AI can be pretty sweet when done right!", place: "" },
  { file: "11-sketch.webp", title: "If AI's gonna take over, it's gonna happen on our terms", place: "" },
  { file: "12-sketch.webp", title: "So let's have a bit of fun with it... ", place: "" },
  { file: "13-sketch.webp", title: "Palm off as much as you can. Back to work Goodie!...", place: "" },
  { file: "14-sketch.webp", title: "Because quality time is really all that matters", place: "" },
];

// The homepage opens on the sketchbook, full screen and on its own (no header, no Goodie): a modal
// <dialog> sits in the top layer over everything. Reaching the last page rolls the site in; Skip or
// Escape does it straight away. Once per browser session, and never on a deep link (/#services).
const READ_KEY = "goodai:book-read";
const HOLD_MS = 2800; // time on the last page before the site rolls in
const ROLL_MS = 1500; // Kevin's floor for motion: nothing faster than ~1.5 s
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// read once per page load; the server always renders the book, the client may drop it
let showBook: boolean | null = null;
const shouldShow = () => {
  if (showBook === null) {
    let read = false;
    try { read = sessionStorage.getItem(READ_KEY) === "1"; } catch { /* storage blocked: show the book */ }
    showBook = !read && !window.location.hash;
  }
  return showBook;
};
const noSubscribe = () => () => {};

export function PerthSketchbook() {
  const show = useSyncExternalStore(noSubscribe, shouldShow, () => true);
  const dialog = useRef<HTMLDialogElement>(null);
  const book = useRef<SketchbookHandle>(null);
  const wheel = useRef({ acc: 0, locked: false, at: 0, quiet: 0 });
  const lastPage = useRef(0);
  const closing = useRef(false);
  const [phase, setPhase] = useState<"open" | "leaving" | "gone">("open");
  const [page, setPage] = useState({ i: 0, n: pages.length });
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (show && !dialog.current?.open) dialog.current?.showModal();
  }, [show]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    try { sessionStorage.setItem(READ_KEY, "1"); } catch { /* fine: the book shows again next visit */ }
    const done = () => { showBook = false; dialog.current?.close(); setPhase("gone"); ScrollTrigger.refresh(); };
    if (reducedMotion()) { done(); return; }
    setPhase("leaving");
    window.setTimeout(done, ROLL_MS);
  }, []);

  // the last page, reached going forwards, holds for a moment and then the site rolls in
  useEffect(() => {
    if (!finished) return;
    const t = window.setTimeout(close, HOLD_MS);
    return () => window.clearTimeout(t);
  }, [finished, close]);

  const onPage = useCallback((i: number, n: number) => {
    const from = lastPage.current;
    lastPage.current = i;
    setPage({ i, n });
    setFinished(i === n - 1 && from !== 0);
  }, []);

  // one page per wheel gesture: a turn locks until the wheel goes quiet (trackpad inertia) or the turn is done
  const onWheel = useCallback((dy: number) => {
    const w = wheel.current, now = performance.now();
    window.clearTimeout(w.quiet);
    w.quiet = window.setTimeout(() => { w.locked = false; w.acc = 0; }, 220);
    if (w.locked && now - w.at < 900) return;
    w.locked = false;
    w.acc += dy;
    if (Math.abs(w.acc) < 40) return;
    book.current?.turn(w.acc > 0 ? "next" : "prev");
    w.acc = 0; w.locked = true; w.at = now;
  }, []);

  // wheel and keys on the dialog itself (around the book) turn pages too, and never reach Lenis underneath
  useEffect(() => {
    const d = dialog.current;
    if (!d || phase !== "open") return;
    const onWheelEvent = (e: WheelEvent) => { e.preventDefault(); e.stopPropagation(); onWheel(e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY); };
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLButtonElement && (e.key === " " || e.key === "Enter")) return;
      const dir = ["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key) ? "next" : ["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key) ? "prev" : null;
      if (!dir) return;
      e.preventDefault();
      book.current?.turn(dir);
    };
    d.addEventListener("wheel", onWheelEvent, { passive: false });
    d.addEventListener("keydown", onKey);
    return () => { d.removeEventListener("wheel", onWheelEvent); d.removeEventListener("keydown", onKey); };
  }, [phase, onWheel]);

  if (!show || phase === "gone") return null;
  return (
    <dialog
      ref={dialog}
      className={`perth-sketchbook${phase === "leaving" ? " is-leaving" : ""}`}
      aria-label="Perth sketchbook"
      onCancel={(e) => { e.preventDefault(); close(); }}
    >
      <button type="button" className="perth-sketchbook-skip" onClick={close}>
        {finished ? "Into the site" : "Skip to the site"}
      </button>
      <span className="perth-sketchbook-count" aria-hidden="true">{page.i + 1} / {page.n}</span>
      <Sketchbook assetBaseUrl="/images/book/" pages={pages} land={0} title="Perth sketchbook" ref={book} gate onPage={onPage} onWheel={onWheel} />
      <div className="perth-sketchbook-progress" aria-hidden="true"><span style={{ "--p": (page.i + 1) / page.n } as CSSProperties} /></div>
    </dialog>
  );
}
