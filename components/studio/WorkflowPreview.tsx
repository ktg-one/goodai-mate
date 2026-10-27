"use client";

import { useState } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Mail, CalendarDays, ListChecks, RotateCcw } from "lucide-react";

const scenarios = {
  enquiry: { title: "A new enquiry comes in", body: "A customer asks about availability.", items: ["Enquiry captured", "Availability checked", "Reply ready for your review"] },
  followup: { title: "A quote needs a follow-up", body: "A quote is waiting for a reply.", items: ["Quote status checked", "Reminder prepared", "Follow-up ready for your review"] },
  booking: { title: "A booking needs a home", body: "A customer requests an appointment.", items: ["Booking details captured", "Calendar checked", "Confirmation ready for your review"] },
};

const SCENARIO_BUTTONS = [
  ['enquiry', 'New enquiry'],
  ['followup', 'Quote follow-up'],
  ['booking', 'Booking'],
] as const;

export function WorkflowPreview() {
  const shouldReduceMotion = useReducedMotion();
  const [scenario, setScenario] = useState<keyof typeof scenarios>("enquiry");
  const [complete, setComplete] = useState(false);
  const selected = scenarios[scenario];

  return (
    <div className="workflow-preview">
      <div className="workflow-heading">
        <span className="workflow-brand">Good’Ai at work</span>
        <span className="example-label">Illustrative demo</span>
      </div>

      <div className="scenario-switch" role="group" aria-label="Choose an example workflow">
        {SCENARIO_BUTTONS.map(([id, label]) => {
          const isSelected = scenario === id;
          return (
            <m.button
              type="button"
              key={id}
              aria-pressed={isSelected}
              onClick={() => {
                setScenario(id);
                setComplete(false);
              }}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -2 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97, y: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            >
              {label}
            </m.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <m.div
          key={scenario}
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="workflow-title"
        >
          <Mail size={25} />
          <div>
            <h3>{selected.title}</h3>
            <p>{selected.body}</p>
          </div>
        </m.div>
      </AnimatePresence>

      <ol className={`workflow-stages ${complete ? "is-complete" : ""}`} aria-label="Example workflow steps">
        {selected.items.map((item, i) => (
          <m.li
            key={`${scenario}-${item}`}
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.0,
              delay: shouldReduceMotion ? 0 : i * 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className="stage-icon">
              <AnimatePresence mode="wait">
                <m.span
                  key={complete ? "check" : `icon-${i}`}
                  initial={shouldReduceMotion ? undefined : { scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { scale: 0.5, opacity: 0 }}
                  transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center justify-center"
                >
                  {complete ? <Check size={18} /> : i === 1 ? <CalendarDays size={18} /> : <ListChecks size={18} />}
                </m.span>
              </AnimatePresence>
            </span>
            <span>{item}</span>
            <m.span
              className="stage-status"
              animate={{ scale: complete ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            >
              {complete ? "Done" : "Ready"}
            </m.span>
          </m.li>
        ))}
      </ol>

      <div className="workflow-bottom">
        <p role="status">{complete ? "Example complete. You stay in control." : "Nothing sent. No tools connected."}</p>
        <m.button
          type="button"
          className="demo-run"
          onClick={() => setComplete(!complete)}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -2 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.97, y: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          {complete ? "Reset" : "Run example"}
          <AnimatePresence mode="wait">
            <m.span
              key={complete ? "reset" : "run"}
              initial={shouldReduceMotion ? undefined : { rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { rotate: 90, opacity: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center justify-center"
            >
              {complete ? <RotateCcw size={16} /> : <ArrowRight size={17} />}
            </m.span>
          </AnimatePresence>
        </m.button>
      </div>
    </div>
  );
}
