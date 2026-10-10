"use client";

import { useState } from "react";
import Script from "next/script";
import { X } from "lucide-react";
import { ELEVENLABS_AGENT_ID, ELEVENLABS_EMBED_SRC } from "@/lib/elevenlabs";

interface ElevenLabsMascotProps {
  onClose?: () => void;
}

export function ElevenLabsMascot({ onClose }: ElevenLabsMascotProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  return (
    <aside
      aria-label="Good'Ai Voice Agent"
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6"
    >
      {/* Loads the ElevenLabs custom element definition once per page load. */}
      <Script
        src={ELEVENLABS_EMBED_SRC}
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
        onReady={() => setScriptLoaded(true)}
      />

      <button
        type="button"
        onClick={onClose}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-ink text-brand-paper/80 shadow-lg transition-colors hover:text-brand-paper cursor-pointer"
        aria-label="Close voice panel"
      >
        <X className="h-4 w-4" />
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
