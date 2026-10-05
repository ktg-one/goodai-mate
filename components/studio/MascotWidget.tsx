"use client";

import { useState } from "react";
import { Mascot } from "page-mascot";
import { Phone, MessageSquare, X } from "lucide-react";

export function MascotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <aside 
      aria-label="Good'Ai Companion"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 select-none"
    >
      {/* Speech bubble on toggle */}
      {open && (
        <div 
          role="dialog"
          aria-label="Goodie quick chat"
          className="p-4 rounded-2xl shadow-xl border max-w-65 text-xs font-sans flex flex-col gap-2.5 backdrop-blur-sm"
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
              className="p-1 -mr-1 hover:opacity-70 transition"
              aria-label="Close dialog"
            >
              <X size={14} />
            </button>
          </div>
          <p className="leading-relaxed opacity-90">
            G&apos;day! Need a hand with voice agents or automating your business?
          </p>
          <div className="flex flex-col gap-1.5 pt-1">
            <a 
              href="tel:+61877414198"
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-white font-medium hover:opacity-90 transition text-xs"
              style={{ background: "#ab4b3d" }}
            >
              <Phone size={13} />
              <span>Call demo line (08 7741 4198)</span>
            </a>
            <a 
              href="/contact"
              className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg border border-brand-ink/20 font-medium hover:opacity-80 transition text-xs"
              style={{ borderColor: "#2f3a33" }}
            >
              <MessageSquare size={13} />
              <span>Suss the fuss</span>
            </a>
          </div>
        </div>
      )}

      {/* Mascot character */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((prev) => !prev); } }}
        className="cursor-pointer transition-transform hover:scale-105 active:scale-95 drop-shadow-md bg-transparent border-0 p-0"
        title="Say g'day to Goodie!"
        aria-expanded={open}
        aria-label="Chat with Goodie"
      >
        <Mascot
          directions="/mascots/goodie/directions.png"
          reactions="/mascots/goodie/reactions.png"
          size={110}
          label="Goodie — Good'Ai mascot"
        />
      </div>
    </aside>
  );
}
