"use client";

import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Check, Mail, CalendarDays, Clock, FileText, Inbox, Loader2, PenLine, RotateCcw, UserRound } from "lucide-react";

type Step = { label: string; doing: string; icon: LucideIcon };
type Scenario = { title: string; body: string; steps: Step[]; result: { kind: string; text: string } };

// Illustrative only: no tools are connected and nothing is sent.
const scenarios: Record<"enquiry" | "followup" | "booking", Scenario> = {
  enquiry: {
    title: "A new enquiry comes in",
    body: "Sam asks if you can fit a job in this week.",
    steps: [
      { label: "Enquiry captured", doing: "Reading the message and pulling out the details", icon: Inbox },
      { label: "Availability checked", doing: "Looking for free slots in your calendar", icon: CalendarDays },
      { label: "Reply drafted", doing: "Writing a reply in your tone", icon: PenLine },
    ],
    result: { kind: "Draft reply", text: "Hi Sam, thanks for getting in touch. I can do Thursday 10am or Friday 2pm. Which suits you better?" },
  },
  followup: {
    title: "A quote needs a follow-up",
    body: "A quote went out a week ago with no reply.",
    steps: [
      { label: "Quote status checked", doing: "Checking whether it was opened or answered", icon: FileText },
      { label: "Reminder drafted", doing: "Writing a friendly nudge", icon: PenLine },
      { label: "Follow-up lined up", doing: "Queuing it for tomorrow morning", icon: Clock },
    ],
    result: { kind: "Follow-up", text: "Hi Jordan, just checking the quote came through OK. Happy to tweak anything. Want to lock in a start date?" },
  },
  booking: {
    title: "A booking needs a home",
    body: "Someone books a consult through your site.",
    steps: [
      { label: "Booking details captured", doing: "Saving their name, number and what they need", icon: UserRound },
      { label: "Calendar checked", doing: "Making sure the slot is still free", icon: CalendarDays },
      { label: "Confirmation drafted", doing: "Writing the confirmation and a reminder", icon: PenLine },
    ],
    result: { kind: "Booking confirmation", text: "Hi Alex, you're booked in for Tuesday at 9:30am. We'll send a reminder the day before." },
  },
};

const SCENARIO_BUTTONS = [
  ["enquiry", "New enquiry"],
  ["followup", "Quote follow-up"],
  ["booking", "Booking"],
] as const;

// Each step "works" long enough to read what it is doing.
const STEP_MS = 1600;
const EASE = [0.16, 1, 0.3, 1] as const;

type Phase = "idle" | "running" | "done";

function getStatus(phase: Phase, step: number, total: number, doing: string, approved: boolean) {
  if (phase === "running") return `Step ${step} of ${total}: ${doing}…`;
  if (phase !== "done") return "Nothing sent. No tools connected.";
  return approved ? "Approved. In a real setup it would go out now. This demo sends nothing." : "Done. Nothing goes out until you approve it.";
}

function WorkflowResult({
  kind,
  text,
  approved,
  onApprove,
  shouldReduceMotion,
}: {
  kind: string;
  text: string;
  approved: boolean;
  onApprove: () => void;
  shouldReduceMotion: boolean | null;
}) {
  return (
    <m.div
      className="workflow-result"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
      transition={{ duration: 1.0, ease: EASE }}
    >
      <span className="workflow-result-kind">
        {kind} · {approved ? "approved" : "waiting for your OK"}
      </span>
      <p>“{text}”</p>
      <button type="button" className="workflow-approve" onClick={onApprove} disabled={approved}>
        {approved ? <><Check size={14} /> Approved</> : "Approve"}
      </button>
    </m.div>
  );
}

function WorkflowControls({
  status,
  phase,
  onRun,
  onReset,
  shouldReduceMotion,
}: {
  status: string;
  phase: Phase;
  onRun: () => void;
  onReset: () => void;
  shouldReduceMotion: boolean | null;
}) {
  const running = phase === "running";
  const done = phase === "done";
  return (
    <div className="workflow-bottom">
      <p role="status">{status}</p>
      <m.button
        type="button"
        className="demo-run"
        onClick={done ? onReset : onRun}
        disabled={running}
        whileHover={shouldReduceMotion || running ? undefined : { scale: 1.03, y: -2 }}
        whileTap={shouldReduceMotion || running ? undefined : { scale: 0.97, y: 0 }}
        transition={{ duration: 1.0, ease: EASE }}
      >
        {done ? "Reset" : running ? "Running" : "Run example"}
        {done ? <RotateCcw size={16} /> : running ? <Loader2 size={17} className="animate-spin" /> : <ArrowRight size={17} />}
      </m.button>
    </div>
  );
}

export function WorkflowPreview() {
  const shouldReduceMotion = useReducedMotion();
  const [scenario, setScenario] = useState<keyof typeof scenarios>("enquiry");
  const [phase, setPhase] = useState<Phase>("idle");
  const [active, setActive] = useState(0);
  const [approved, setApproved] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const selected = scenarios[scenario];
  const total = selected.steps.length;

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const reset = () => {
    clearTimers();
    setPhase("idle");
    setActive(0);
    setApproved(false);
  };

  const run = () => {
    reset();
    if (shouldReduceMotion) {
      setActive(total);
      setPhase("done");
      return;
    }
    setPhase("running");
    for (let i = 1; i <= total; i++) {
      timers.current.push(setTimeout(() => {
        setActive(i);
        if (i === total) setPhase("done");
      }, i * STEP_MS));
    }
  };

  const status = getStatus(phase, active + 1, total, selected.steps[active]?.doing ?? "", approved);

  return (
    <div className="workflow-preview">
      <div className="workflow-heading">
        <span className="workflow-brand">Good’Ai at work</span>
        <span className="example-label">Illustrative demo</span>
      </div>

      <div className="scenario-switch" role="group" aria-label="Choose an example workflow">
        {SCENARIO_BUTTONS.map(([id, label]) => (
          <m.button
            type="button"
            key={id}
            aria-pressed={scenario === id}
            onClick={() => {
              reset();
              setScenario(id);
            }}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -2 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97, y: 0 }}
            transition={{ duration: 1.0, ease: EASE }}
          >
            {label}
          </m.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <m.div
          key={scenario}
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
          transition={{ duration: 1.0, ease: EASE }}
          className="workflow-title"
        >
          <Mail size={25} />
          <div>
            <h3>{selected.title}</h3>
            <p>{selected.body}</p>
          </div>
        </m.div>
      </AnimatePresence>

      <div className="workflow-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${active / total})` }} />
      </div>

      <ol className="workflow-stages" aria-label="Example workflow steps">
        {selected.steps.map((step, i) => {
          const state = i < active ? "done" : i === active && phase === "running" ? "running" : "pending";
          const Icon = state === "done" ? Check : state === "running" ? Loader2 : step.icon;
          return (
            <li key={`${scenario}-${step.label}`} data-state={state}>
              <span className="stage-icon">
                <Icon size={18} className={state === "running" ? "animate-spin" : undefined} />
              </span>
              <span className="stage-text">
                <span>{step.label}</span>
                <AnimatePresence>
                  {state === "running" && (
                    <m.span
                      className="stage-doing"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      {step.doing}…
                    </m.span>
                  )}
                </AnimatePresence>
              </span>
              <span className="stage-status">
                {state === "done" ? "Done" : state === "running" ? "Working" : "Waiting"}
              </span>
            </li>
          );
        })}
      </ol>

      <AnimatePresence>
        {phase === "done" && (
          <WorkflowResult
            key={`${scenario}-result`}
            kind={selected.result.kind}
            text={selected.result.text}
            approved={approved}
            onApprove={() => setApproved(true)}
            shouldReduceMotion={shouldReduceMotion}
          />
        )}
      </AnimatePresence>

      <WorkflowControls
        status={status}
        phase={phase}
        onRun={run}
        onReset={reset}
        shouldReduceMotion={shouldReduceMotion}
      />
    </div>
  );
}
