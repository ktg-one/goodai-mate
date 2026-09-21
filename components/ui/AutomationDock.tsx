"use client";

import { type ComponentType, useMemo, useState } from "react";
import { Bot, Cable, Mic, ShieldCheck, Workflow } from "lucide-react";

type DockItem = {
  label: string;
  hint: string;
  Icon: ComponentType<{ className?: string }>;
};

const ITEMS: DockItem[] = [
  { label: "Workflows", hint: "Map", Icon: Workflow },
  { label: "Agents", hint: "Assist", Icon: Bot },
  { label: "Voice", hint: "Call", Icon: Mic },
  { label: "Integrations", hint: "Connect", Icon: Cable },
  { label: "Controls", hint: "Guard", Icon: ShieldCheck },
];

export function AutomationDock() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const transforms = useMemo(() => {
    return ITEMS.map((_, index) => {
      if (activeIndex === null) return { scale: 1, lift: 0 };
      const distance = Math.abs(activeIndex - index);
      if (distance === 0) return { scale: 1.28, lift: 9 };
      if (distance === 1) return { scale: 1.13, lift: 4 };
      return { scale: 1, lift: 0 };
    });
  }, [activeIndex]);

  return (
    <div className="mt-8 hidden w-full max-w-2xl md:block">
      <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-brand-paper/55">
        Inspired by ThreeUI animated dock
      </p>
      <div
        className="mx-auto flex w-fit items-end gap-1.5 rounded-2xl border border-brand-paper/20 bg-brand-paper/10 px-2.5 py-2 backdrop-blur-sm"
        onMouseLeave={() => setActiveIndex(null)}
      >
        {ITEMS.map(({ label, hint, Icon }, index) => {
          const t = transforms[index];
          return (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="group relative flex h-14 w-14 origin-bottom flex-col items-center justify-center rounded-xl border border-brand-paper/20 bg-brand-paper text-brand-ink shadow-[0_8px_18px_-14px_var(--brand-ink)] transition-colors hover:bg-brand-eucalyptus outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-coral focus-visible:ring-2 focus-visible:ring-brand-coral/50"
              style={{ transform: `translateY(${-t.lift}px) scale(${t.scale})` }}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
            >
              <Icon className="h-5 w-5" />
              <span className="pointer-events-none absolute -bottom-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.15em] text-brand-paper/75 group-hover:block group-focus-visible:block">
                {hint}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}