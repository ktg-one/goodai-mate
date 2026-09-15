"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Cable, PhoneCall, ShieldCheck, Workflow } from "lucide-react";
import { PHONE_HREF } from "@/lib/links";

type DockItem = {
  label: string;
  hint: string;
  icon: typeof Workflow;
  action: () => void;
};

export function AutomationDock() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const scrollToDemo = () => {
    const el = document.getElementById("demo");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const items: DockItem[] = [
    {
      label: "Workflows",
      hint: "n8n Engine",
      icon: Workflow,
      action: scrollToDemo,
    },
    {
      label: "Voice Agent",
      hint: "Call (08) 7741",
      icon: PhoneCall,
      action: () => {
        window.location.href = PHONE_HREF;
      },
    },
    {
      label: "AI Agents",
      hint: "Intake & Triage",
      icon: Bot,
      action: scrollToDemo,
    },
    {
      label: "Integrations",
      hint: "Xero / CRM / Cal",
      icon: Cable,
      action: scrollToDemo,
    },
    {
      label: "Guardrails",
      hint: "Human-in-Loop",
      icon: ShieldCheck,
      action: scrollToDemo,
    },
  ];

  return (
    <div className="mt-8 w-full max-w-xl mx-auto px-4">
      <div
        className="mx-auto flex w-fit items-end gap-2 rounded-2xl border border-brand-paper/20 bg-brand-navy/60 p-2 backdrop-blur-md shadow-2xl"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {items.map((item, index) => {
          let scale = 1;
          let lift = 0;

          if (hoveredIndex !== null) {
            const dist = Math.abs(hoveredIndex - index);
            if (dist === 0) {
              scale = 1.25;
              lift = -10;
            } else if (dist === 1) {
              scale = 1.12;
              lift = -5;
            }
          }

          const Icon = item.icon;

          return (
            <motion.button
              key={item.label}
              type="button"
              onClick={item.action}
              aria-label={`${item.label} - ${item.hint}`}
              animate={{
                scale,
                y: lift,
              }}
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 25,
              }}
              className="group relative flex h-12 w-12 sm:h-14 sm:w-14 origin-bottom flex-col items-center justify-center rounded-xl border border-brand-paper/25 bg-brand-paper text-brand-navy shadow-md hover:bg-brand-coral hover:text-brand-paper transition-colors cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
            >
              <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />

              {/* Tooltip hint */}
              <span className="pointer-events-none absolute -bottom-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-[10px] font-mono uppercase tracking-widest text-brand-paper bg-brand-navy/90 px-2 py-0.5 rounded border border-brand-paper/20 group-hover:block group-focus-visible:block z-30">
                {item.hint}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}