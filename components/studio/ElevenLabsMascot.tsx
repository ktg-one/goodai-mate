"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { X } from "lucide-react";
import { ELEVENLABS_AGENT_ID, ELEVENLABS_EMBED_SRC } from "@/lib/elevenlabs";

interface ElevenLabsMascotProps {
  onClose?: () => void;
}

export function ElevenLabsMascot({ onClose }: ElevenLabsMascotProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!scriptLoaded) return;
    const timer = setTimeout(() => {
      document.dispatchEvent(
        new CustomEvent("elevenlabs-agent:expand", { detail: { action: "expand" } }),
      );
    }, 150);
    return () => clearTimeout(timer);
  }, [scriptLoaded]);

  return (
    <aside
      aria-label="Good'Ai Voice Agent"
      className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-28 sm:right-6"
    >
      {/* Loads the ElevenLabs custom element definition once per page load. */}
      <Script
        src={ELEVENLABS_EMBED_SRC}
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onReady={() => setScriptLoaded(true)}
      />

      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-1.5 rounded-full bg-brand-ink px-3 py-1.5 text-xs font-medium text-brand-paper shadow-lg transition-colors hover:bg-brand-coral hover:text-brand-ink cursor-pointer"
        aria-label="Close voice panel"
      >
        <X className="h-3.5 w-3.5" />
        <span>Close voice</span>
      </button>

      <elevenlabs-convai agent-id={ELEVENLABS_AGENT_ID} />

      {!scriptLoaded && (
        <span className="sr-only" role="status">
          Loading voice agent…
        </span>
      )}
    </aside>
  );
}

