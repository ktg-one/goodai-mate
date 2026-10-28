"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Heart, Maximize2 } from "lucide-react";
import { SOCIAL_LINKS, SURVEY_URL } from "@/lib/links";

const MACHINE_SRC = "/machine/goodai-machine.html";

export function MachineDemo() {
  const [likes, setLikes] = useState(0);

  // The engine runs in a same-origin iframe and posts a message when its like button is pressed.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const data = e.data as { type?: string; likes?: number } | null;
      if (data?.type === "goodai-machine:like" && typeof data.likes === "number") setLikes(data.likes);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div>
      <div className="machine-frame">
        <iframe
          src={MACHINE_SRC}
          title="The admin engine: an illustrative machine where an enquiry goes in and a paid job comes out"
          allow="fullscreen"
        />
      </div>
      <div className="machine-bar">
        <p>
          Drag to turn it. Slide the jobs a week, cut it open, pull the plug.
          <span> Illustrative: nothing is connected, and the minutes saved are our estimates.</span>
        </p>
        <a className="text-link" href={MACHINE_SRC} target="_blank" rel="noopener noreferrer">
          Full screen <Maximize2 size={15} aria-hidden="true" />
        </a>
      </div>
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
