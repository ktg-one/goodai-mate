"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// The existing embed exposes colour variables but sets its own font inside an
// open shadow root. Keep that small compatibility layer scoped to this widget.
const shadowStyles = `
  :host > div { font-family: Manrope, sans-serif !important; }
  button, select, input, textarea { font-family: inherit !important; }
  button { min-height: 44px !important; }
  button:focus-visible { outline: 2px solid var(--el-focus-color); outline-offset: 4px; }
  [class*="_box_"] { box-shadow: 0 12px 36px #333b3226 !important; }
  [class*="_status_"] { font-weight: 500; }
  [class*="_poweredBy_"] { font-size: 11px; }
  [class*="_poweredBy_"] a, [class*="_poweredBy_"] span { opacity: 1; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { transition: none !important; animation: none !important; }
  }
`;

export function BrandedVoiceWidget() {
  const widget = useRef<HTMLElement>(null);
  useEffect(() => {
    const host = widget.current;
    if (!host) return;
    let disposed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let style: HTMLStyleElement | undefined;
    const show = () => { host.removeAttribute("data-scrolling"); };
    const scroll = () => {
      clearTimeout(timer);
      const shadow = host.shadowRoot;
      // Only hide a positively identified idle launcher. Calls, consent, errors
      // and focused controls stay accessible if the vendor changes its markup.
      const start = shadow?.querySelector<HTMLButtonElement>('button[title="Start a call"]');
      const idle = start && start.getClientRects().length > 0;
      if (idle && !shadow?.activeElement && !host.matches(":hover")) host.setAttribute("data-scrolling", "true");
      else show();
      timer = setTimeout(show, 240);
    };
    customElements.whenDefined("elevenlabs-convai").then(() => {
      if (disposed || !host.shadowRoot) return;
      style = document.createElement("style");
      style.dataset.goodaiBrand = "true";
      style.textContent = shadowStyles;
      host.shadowRoot.append(style);
    });
    window.addEventListener("scroll", scroll, { passive: true });
    host.addEventListener("focusin", show);
    host.addEventListener("elevenlabs-convai:call", show);
    return () => {
      disposed = true;
      clearTimeout(timer);
      window.removeEventListener("scroll", scroll);
      host.removeEventListener("focusin", show);
      host.removeEventListener("elevenlabs-convai:call", show);
      style?.remove();
      show();
    };
  }, []);

  return createPortal(<elevenlabs-convai
    ref={widget}
    className="goodai-voice-widget"
    agent-id="agent_8501m0h2hvh0edr99jkqzr4rw53n"
    avatar-image-url="/icon.svg"
    avatar-orb-color-1="#a4432b"
    avatar-orb-color-2="#dce3cc"
    action-text="Let’s talk it through."
    start-call-text="Start a call"
    end-call-text="End call"
    listening-text="Listening…"
    speaking-text="Go ahead, you can interrupt."
  />, document.body);
}
