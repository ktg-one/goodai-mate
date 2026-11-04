"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Heart, Maximize2 } from "lucide-react";
import { SOCIAL_LINKS, SURVEY_URL } from "@/lib/links";
import { STACK_LAYERS, type StackLayer } from "@/lib/stack";
import { StackPanel, type StackState } from "@/components/studio/StackPanel";

const MACHINE_SRC = "/machine/goodai-machine.html";
const NO_LAYERS: StackState = {
  labels: false,
  explode: false,
  cut: false,
  xray: false,
  slow: false,
};

export function MachineDemo() {
  const [likes, setLikes] = useState(0);
  const [layers, setLayers] = useState<StackState>(NO_LAYERS);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Only the machine frame may report likes or mode changes, so identify it by
  // window reference rather than by origin.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow) return;
      const data = e.data as { type?: string; likes?: number; on?: Record<string, unknown> } | null;
      if (data?.type === "goodai-machine:like" && typeof data.likes === "number") setLikes(data.likes);
      if (data?.type === "goodai-machine:state" && data.on) {
        const next = { ...NO_LAYERS };
        for (const l of STACK_LAYERS) next[l] = data.on[l] === true;
        setLayers(next);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const handleToggle = (layer: StackLayer) => {
    const nextValue = !layers[layer];
    setLayers((prev) => ({ ...prev, [layer]: nextValue }));
    try {
      frameRef.current?.contentWindow?.postMessage(
        { type: "goodai-machine:toggle", layer, value: nextValue },
        window.location.origin,
      );
    } catch {
      /* standalone fallback */
    }
  };

  return (
    <div>
      <div className="machine-frame">
        <iframe
          ref={frameRef}
          src={MACHINE_SRC}
          title="The Good'Ai engine: an illustrative machine where four arms represent our four build services, driven by an opportunity audit cam shaft"
          allow="fullscreen"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
      <div className="machine-bar">
        <p>
          Drag to turn it. Slide the jobs a week, open the layers, or pull the plug.
          <span> Illustrative: nothing is connected, and the minutes saved are our estimates.</span>
        </p>
        <a className="text-link" href={MACHINE_SRC} target="_blank" rel="noopener noreferrer">
          Full screen <Maximize2 size={15} aria-hidden="true" />
        </a>
      </div>
      <StackPanel on={layers} onToggle={handleToggle} />
      {likes > 0 && (
        <div className="machine-thanks" role="status">
          <Heart size={18} aria-hidden="true" />
          {SOCIAL_LINKS.length > 0 ? (
            <>
              <span>Thanks for the like. Follow along:</span>
              {SOCIAL_LINKS.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label} <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              ))}
            </>
          ) : (
            <>
              <span>Thanks for the like. Want one of these running your admin?</span>
              <a href={SURVEY_URL}>
                Tell us about your business <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
