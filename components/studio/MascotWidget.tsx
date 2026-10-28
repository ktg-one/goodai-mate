"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
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

export function MascotWidget() {
  const [open, setOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);

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

  // page-mascot owns the button and takes no ARIA props, so set the disclosure state on it.
  useEffect(() => {
    const button = mascotRef.current?.querySelector("button");
    button?.setAttribute("aria-expanded", String(open));
    button?.setAttribute("aria-controls", "goodie-panel");
  }, [open, voiceOpen]);

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
          {open && (
            <div 
              ref={panelRef}
              id="goodie-panel"
              tabIndex={-1}
              role="region"
              aria-label="Goodie quick actions"
              className="p-4 rounded-2xl shadow-xl border max-w-72 text-xs font-sans flex flex-col gap-2.5 backdrop-blur-sm"
              style={{ background: "#f6f3ea", color: "#2f3a33", borderColor: "#d8dfca" }}
            >
              <div className="flex items-center justify-between font-bold text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-eucalyptus animate-pulse" />
                  Goodie
                </span>
                <button 
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-1 -mr-1 hover:opacity-70 transition cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="leading-relaxed opacity-90">
                G&apos;day! Need a hand with voice agents or automating your business?
              </p>
              <div className="flex flex-col gap-1.5 pt-1">
                <button 
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setVoiceOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-brand-ink text-brand-paper font-medium hover:bg-brand-coral hover:text-brand-ink transition text-xs cursor-pointer shadow-sm"
                >
                  <Mic size={13} className="text-brand-coral" />
                  <span>Talk with our AI voice agent</span>
                </button>
                <p className="text-xs text-brand-ink/70 leading-tight">
                  Notice: Voice streams processed ephemerally via ElevenLabs; not retained for biometric ID.
                </p>
                <a
                  href={PHONE_HREF}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-white font-medium hover:opacity-90 transition text-xs"
                  style={{ background: "#ab4b3d" }}
                >
                  <Phone size={13} />
                  <span>Call {PHONE_DISPLAY}</span>
                </a>
                <Link 
                  href="/contact"
                  className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg border border-brand-ink/20 font-medium hover:opacity-80 transition text-xs"
                  style={{ borderColor: "#2f3a33" }}
                  onClick={() => setOpen(false)}
                >
                  <MessageSquare size={13} />
                  <span>Suss the fuss</span>
                </Link>
              </div>
            </div>
          )}

          {/* Mascot character. <Mascot> renders its own <button>, so the toggle listens
              for its click bubbling up instead of nesting a second button around it. */}
          <div
            ref={mascotRef}
            onClick={() => setOpen((prev) => !prev)}
            className="cursor-pointer transition-transform hover:scale-105 active:scale-95 drop-shadow-md"
            title="Say g'day to Goodie!"
          >
            <Mascot
              directions="/mascots/goodie/directions.png"
              reactions="/mascots/goodie/reactions.png"
              size={110}
              label="Goodie — quick actions"
            />
          </div>
        </aside>
      )}
    </>
  );
}
