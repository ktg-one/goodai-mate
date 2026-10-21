"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { Mascot } from "page-mascot";
import { Phone, MessageSquare, Mic, X } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/links";

const ElevenLabsMascot = dynamic(
  () => import("./ElevenLabsMascot").then((mod) => mod.ElevenLabsMascot),
  {
    ssr: false,
    loading: () => null,
  }
);

const MotionLink = m(Link);

const PANEL_VARIANTS = {
  hidden: { opacity: 0, scale: 0.9, y: 15 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 15 },
};

const REDUCED_PANEL_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const SMOOTH_TRANSITION = {
  duration: 1.0,
  ease: [0.16, 1, 0.3, 1] as const,
};

export function MascotWidget() {
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenVoice = () => {
      setVoiceOpen(true);
      setOpen(false);
    };
    window.addEventListener("openVoiceWidget", handleOpenVoice);
    return () => window.removeEventListener("openVoiceWidget", handleOpenVoice);
  }, []);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  return (
    <>
      {/* Voice Assistant Panel - rendered seamlessly without a colliding duplicate button */}
      {voiceOpen && (
        <ElevenLabsMascot onClose={() => setVoiceOpen(false)} />
      )}

      {/* Mascot Companion */}
      {!voiceOpen && (
        <aside 
          aria-label="Good'Ai Companion"
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 select-none"
        >
          {/* Speech bubble on toggle */}
          <AnimatePresence mode="wait">
            {open && (
              <m.div
                ref={panelRef}
                id="goodie-panel"
                tabIndex={-1}
                role="region"
                aria-label="Goodie quick actions"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={shouldReduceMotion ? REDUCED_PANEL_VARIANTS : PANEL_VARIANTS}
                transition={SMOOTH_TRANSITION}
                style={{ originX: 1, originY: 1, background: "#f6f3ea", color: "#2f3a33", borderColor: "#d8dfca" }}
                className="p-4 rounded-2xl shadow-xl border max-w-72 text-xs font-sans flex flex-col gap-2.5 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between font-bold text-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-eucalyptus animate-pulse" />
                    Goodie
                  </span>
                  <m.button
                    type="button"
                    onClick={() => setOpen(false)}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.15, rotate: 90 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
                    transition={SMOOTH_TRANSITION}
                    className="p-1 -mr-1 hover:opacity-70 transition cursor-pointer"
                    aria-label="Close dialog"
                  >
                    <X size={14} />
                  </m.button>
                </div>
                <p className="leading-relaxed opacity-90">
                  G&apos;day! Need a hand with voice agents or automating your business?
                </p>
                <div className="flex flex-col gap-1.5 pt-1">
                  <m.button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setVoiceOpen(true);
                    }}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.03, x: 2 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                    transition={SMOOTH_TRANSITION}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-brand-ink text-brand-paper font-medium hover:bg-brand-coral hover:text-brand-ink transition text-xs cursor-pointer shadow-sm"
                  >
                    <Mic size={13} className="text-brand-coral" />
                    <span>Talk with our AI voice agent</span>
                  </m.button>
                  <p className="text-xs text-brand-ink/70 leading-tight">
                    Notice: Voice streams processed ephemerally via ElevenLabs; not retained for biometric ID.
                  </p>
                  <m.a
                    href={PHONE_HREF}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.03, x: 2 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                    transition={SMOOTH_TRANSITION}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-white font-medium hover:opacity-90 transition text-xs"
                    style={{ background: "#ab4b3d" }}
                  >
                    <Phone size={13} />
                    <span>Call {PHONE_DISPLAY}</span>
                  </m.a>
                  <MotionLink
                    href="/contact"
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.03, x: 2 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                    transition={SMOOTH_TRANSITION}
                    className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg border border-brand-ink/20 font-medium hover:opacity-80 transition text-xs"
                    style={{ borderColor: "#2f3a33" }}
                    onClick={() => setOpen(false)}
                  >
                    <MessageSquare size={13} />
                    <span>Suss the fuss</span>
                  </MotionLink>
                </div>
              </m.div>
            )}
          </AnimatePresence>

          {/* Mascot character */}
          <m.div
            role="button"
            tabIndex={0}
            onClick={() => setOpen((prev) => !prev)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen((prev) => !prev);
              }
            }}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.08, y: -2 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
            transition={SMOOTH_TRANSITION}
            className="cursor-pointer drop-shadow-md bg-transparent border-0 p-0"
            title="Say g'day to Goodie!"
            aria-expanded={open}
            aria-controls="goodie-panel"
            aria-label="Goodie — quick actions"
          >
            <Mascot
              directions="/mascots/goodie/directions.png"
              reactions="/mascots/goodie/reactions.png"
              size={110}
              label="Goodie — Good'Ai mascot"
            />
          </m.div>
        </aside>
      )}
    </>
  );
}
