"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Mail,
  FileText,
  MessageSquare,
  Building2,
  Bell,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Audio Synthesizer via Web Audio API (Zero external audio asset dependencies)
class SoundFx {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(740, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  playBlip() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(580, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.07);
  }

  playChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const now = this.ctx.currentTime;
    [659.25, 880, 1318.51].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.1, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.36);
    });
  }
}

const sound = new SoundFx();

export type ScenarioId = "speed-to-lead" | "voice-agent" | "invoice-extract";

type Scenario = {
  id: ScenarioId;
  title: string;
  badge: string;
  description: string;
  timeSavings: string;
  nodes: {
    trigger: { title: string; subtitle: string; icon: typeof Mail };
    ai: { title: string; subtitle: string; extractedData: string[] };
    action1: { title: string; subtitle: string; icon: typeof MessageSquare; detail: string };
    action2: { title: string; subtitle: string; icon: typeof Building2; detail: string };
    alert: { title: string; subtitle: string; icon: typeof Bell; detail: string };
  };
};

export const SCENARIOS: Scenario[] = [
  {
    id: "speed-to-lead",
    title: "Speed-to-lead example",
    badge: "Illustrative demo",
    description: "Inbound website inquiry automatically parsed, SMS dispatched, job logged in CRM.",
    timeSavings: "Illustrative — not a measured outcome",
    nodes: {
      trigger: {
        title: "Website Form Webhook",
        subtitle: "Inbound: sample commercial quote request",
        icon: Mail,
      },
      ai: {
        title: "Good'Ai Intent Classifier",
        subtitle: "Parsing urgency, scope & location",
        extractedData: ["Client: Sample name", "Service: Commercial HVAC", "Urgency: HIGH — Today"],
      },
      action1: {
        title: "Twilio Instant SMS",
        subtitle: "SMS dispatched",
        icon: MessageSquare,
        detail: "G'day — received your quote request. Pick a short consult slot when you are free.",
      },
      action2: {
        title: "ServiceM8 / Xero Sync",
        subtitle: "Job #4092 Created",
        icon: Building2,
        detail: "Draft job card & contact created with zero manual data entry.",
      },
      alert: {
        title: "Slack / WhatsApp Alert",
        subtitle: "On-Call Tech Notified",
        icon: Bell,
        detail: "Lead auto-routed to on-call with a one-tap accept button.",
      },
    },
  },
  {
    id: "voice-agent",
    title: "After-hours voice agent call",
    badge: "Voice Automation",
    description: "Customer calls (08) 7741 4191 after hours. AI answers, qualifies, and books appointment.",
    timeSavings: "Example: calls covered while on the tools",
    nodes: {
      trigger: {
        title: "Inbound Call (08) 7741 4191",
        subtitle: "Caller: sample emergency plumbing enquiry",
        icon: PhoneCall,
      },
      ai: {
        title: "Good'Ai Voice Synthesizer",
        subtitle: "Australian conversational speech",
        extractedData: ["Caller: Sample name", "Issue: Burst hot water system", "Address: Example street, Perth"],
      },
      action1: {
        title: "Cal.com Dispatch",
        subtitle: "Slot Booked: 8:30 AM Tomorrow",
        icon: Clock,
        detail: "Slot reserved directly into calendar without phone tag.",
      },
      action2: {
        title: "Booking SMS Confirmation",
        subtitle: "SMS confirmation sent",
        icon: MessageSquare,
        detail: "Your emergency plumbing slot is confirmed for tomorrow morning with the on-call tech.",
      },
      alert: {
        title: "Urgent Alert to Master Plumber",
        subtitle: "Instant Dispatch",
        icon: Bell,
        detail: "Morning call-out ready. Parts list drafted for the job.",
      },
    },
  },
  {
    id: "invoice-extract",
    title: "Messy Receipt ➔ Xero",
    badge: "Operations Admin",
    description: "Photo of supplier docket emailed in. AI extracts line items, totals, and drafts bill.",
    timeSavings: "Kills Sunday night bookkeeping",
    nodes: {
      trigger: {
        title: "Supplier Docket Email / Photo",
        subtitle: "Attachment: Reece_Plumbing_Inv992.pdf",
        icon: FileText,
      },
      ai: {
        title: "Document OCR & Tax Validator",
        subtitle: "Extracting GST, ABN, line items",
        extractedData: ["Vendor: Reece Plumbing", "Total: $1,429.50 (incl GST)", "Job: #4092 Hay St"],
      },
      action1: {
        title: "Xero Draft Bill",
        subtitle: "Created in 0.6s",
        icon: Building2,
        detail: "Account Code: 310 (Materials). ABN verified on Aus Business Register.",
      },
      action2: {
        title: "Job Costing Updated",
        subtitle: "Margin recalculated",
        icon: CheckCircle2,
        detail: "Job #4092 real-time profit updated automatically.",
      },
      alert: {
        title: "1-Click Approval Push",
        subtitle: "Ready for Sign-Off",
        icon: Bell,
        detail: "Tap 'Approve' on your phone to schedule payment on Friday.",
      },
    },
  },
];

export function InteractiveWorkflowCanvas({
  selectedScenario,
  onSelectScenario,
}: {
  selectedScenario?: ScenarioId;
  onSelectScenario?: (id: ScenarioId) => void;
}) {
  const [internalScenarioId, setInternalScenarioId] = useState<ScenarioId>("speed-to-lead");
  const activeScenarioId = selectedScenario || internalScenarioId;

  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState<number>(0); // 0 = idle, 1 = trigger, 2 = ai, 3 = actions, 4 = complete
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timerRef = useRef<NodeJS.Timeout[]>([]);
  const shouldReduceMotion = useReducedMotion();

  const scenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  const clearTimers = () => {
    timerRef.current.forEach((t) => clearTimeout(t));
    timerRef.current = [];
  };

  const runSimulation = useCallback(() => {
    clearTimers();
    setIsRunning(true);
    setStep(1);
    sound.playPop();

    // Step 1 -> Step 2 (Trigger -> AI Brain: 1.3s to observe the trigger)
    timerRef.current.push(
      setTimeout(() => {
        setStep(2);
        sound.playBlip();
      }, 1300)
    );

    // Step 2 -> Step 3 (AI Brain -> Parallel Dispatch: 1.5s to read extracted data)
    timerRef.current.push(
      setTimeout(() => {
        setStep(3);
        sound.playBlip();
      }, 2800)
    );

    // Step 3 -> Step 4 (Actions complete -> Finale: 1.5s to see notifications deliver)
    timerRef.current.push(
      setTimeout(() => {
        setStep(4);
        setIsRunning(false);
        sound.playChime();
      }, 4300)
    );
  }, []);

  const resetSimulation = () => {
    clearTimers();
    setStep(0);
    setIsRunning(false);
  };

  const handleSelectScenario = (id: ScenarioId) => {
    if (onSelectScenario) {
      onSelectScenario(id);
    } else {
      setInternalScenarioId(id);
    }
    resetSimulation();
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const TriggerIcon = scenario.nodes.trigger.icon;
  const Action1Icon = scenario.nodes.action1.icon;
  const Action2Icon = scenario.nodes.action2.icon;
  const AlertIcon = scenario.nodes.alert.icon;

  return (
    <div className="w-full rounded-2xl border border-brand-paper/20 bg-brand-navy p-4 md:p-8 text-brand-paper shadow-2xl relative overflow-hidden">
      {/* Background n8n dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(var(--brand-paper) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Top Header & Scenario Switcher */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-paper/15 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2 w-2 rounded-full bg-brand-coral animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-brand-coral">
              Live n8n Automation Engine
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-brand-paper">
            {scenario.title}
          </h3>
          <p className="text-xs md:text-sm text-brand-paper/70 mt-1 max-w-xl">
            {scenario.description}
          </p>
        </div>

        {/* Controls: Sound & Run */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundEnabled ? "Mute audio" : "Enable audio"}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-paper/20 bg-brand-paper/10 text-brand-paper/80 hover:bg-brand-paper/20 transition-colors"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-brand-teal" /> : <VolumeX className="h-4 w-4 text-brand-paper/50" />}
          </button>

          {step === 4 ? (
            <button
              type="button"
              onClick={resetSimulation}
              className="flex items-center gap-2 rounded-xl border border-brand-paper/30 bg-brand-paper/10 px-4 py-2 text-xs uppercase font-medium tracking-wider text-brand-paper hover:bg-brand-paper/20 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          ) : (
            <button
              type="button"
              onClick={runSimulation}
              disabled={isRunning}
              className="group flex items-center gap-2 rounded-xl border border-brand-coral bg-brand-coral px-5 py-2.5 text-xs uppercase font-bold tracking-widest text-brand-paper hover:bg-brand-paper hover:text-brand-ink hover:border-brand-paper transition-[background-color,color,border-color] shadow-[0_0_20px_rgba(255,111,97,0.35)] disabled:opacity-50 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-current transition-transform group-hover:scale-110" />
              {isRunning ? "Running Pipeline..." : "Fire Test Trigger"}
            </button>
          )}
        </div>
      </div>

      {/* Scenario Tabs */}
      <div className="relative z-10 flex flex-wrap gap-2 mb-8">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => handleSelectScenario(s.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-mono transition-[background-color,color,box-shadow,border-color]",
              activeScenarioId === s.id
                ? "bg-brand-paper text-brand-navy font-bold shadow-md"
                : "bg-brand-paper/5 text-brand-paper/70 hover:bg-brand-paper/15 border border-brand-paper/10"
            )}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Canvas Area: n8n Connected Nodes */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-2">
        {/* Dynamic Animated Connecting SVG Lines between Nodes (Desktop Overlay) */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block z-20">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 300" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradient-trigger-ai" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--brand-coral)" />
                <stop offset="100%" stopColor="var(--brand-teal)" />
              </linearGradient>
              <linearGradient id="gradient-ai-action" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--brand-teal)" />
                <stop offset="100%" stopColor="var(--brand-paper)" />
              </linearGradient>
            </defs>

            {/* Connection Line 1: Trigger -> AI Brain */}
            <path
              d="M 250 150 L 333 150"
              stroke="var(--brand-paper)"
              strokeOpacity="0.15"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
            />
            <m.path
              d="M 250 150 L 333 150"
              stroke="url(#gradient-trigger-ai)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: step >= 2 ? 1 : 0,
                opacity: step >= 2 ? 1 : 0,
              }}
              transition={{
                duration: shouldReduceMotion ? 0 : 1.2,
                ease: "easeInOut",
              }}
            />

            {/* Connection Line 2: AI Brain -> Parallel Branch Actions */}
            <path
              d="M 583 150 L 666 150"
              stroke="var(--brand-paper)"
              strokeOpacity="0.15"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
            />
            <m.path
              d="M 583 150 L 666 150"
              stroke="url(#gradient-ai-action)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: step >= 3 ? 1 : 0,
                opacity: step >= 3 ? 1 : 0,
              }}
              transition={{
                duration: shouldReduceMotion ? 0 : 1.2,
                ease: "easeInOut",
              }}
            />
          </svg>
        </div>
        
        {/* Node 1: Inbound Trigger */}
        <div className="lg:col-span-3 flex flex-col items-center">
          <div
            className={cn(
              "w-full rounded-xl border p-4 transition-all duration-300 relative",
              step >= 1
                ? "border-brand-coral bg-brand-coral/15 shadow-[0_0_25px_rgba(255,111,97,0.3)]"
                : "border-brand-paper/20 bg-brand-paper/5"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-brand-paper/60 flex items-center gap-1.5">
                <TriggerIcon className="h-3 w-3 text-brand-coral" /> Trigger Node
              </span>
              {step >= 1 && (
                <span className="flex h-1.5 w-1.5 rounded-full bg-brand-coral animate-ping" />
              )}
            </div>
            <h4 className="font-bold text-sm text-brand-paper">{scenario.nodes.trigger.title}</h4>
            <p className="text-xs text-brand-paper/70 mt-1 font-mono">{scenario.nodes.trigger.subtitle}</p>

            <div className="mt-3 pt-2 border-t border-brand-paper/10 flex items-center justify-between text-[10px] text-brand-paper/60 font-mono">
              <span>Status</span>
              <span className={step >= 1 ? "text-brand-coral font-bold" : "text-brand-paper/40"}>
                {step >= 1 ? "Dispatched (0.0s)" : "Listening..."}
              </span>
            </div>
          </div>
        </div>

        {/* Node 2: AI Brain Node (Middle) */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div
            className={cn(
              "w-full rounded-xl border p-4 transition-all duration-300 relative",
              step >= 2
                ? "border-brand-teal bg-brand-teal/15 shadow-[0_0_25px_rgba(28,171,176,0.3)]"
                : "border-brand-paper/20 bg-brand-paper/5"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-brand-teal flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Good&apos;Ai Intelligence
              </span>
              {step >= 2 && (
                <span className="font-mono text-[10px] text-brand-teal font-bold">+1.3s</span>
              )}
            </div>
            <h4 className="font-bold text-sm text-brand-paper">{scenario.nodes.ai.title}</h4>
            <p className="text-xs text-brand-paper/70 mt-0.5">{scenario.nodes.ai.subtitle}</p>

            {/* Extracted Data Tags */}
            <div className="mt-3 space-y-1">
              {scenario.nodes.ai.extractedData.map((item) => (
                <div
                  key={item}
                  className={cn(
                    "text-[10px] font-mono px-2 py-0.5 rounded border transition-all duration-300",
                    step >= 2
                      ? "border-brand-teal/40 bg-brand-teal/10 text-brand-paper"
                      : "border-brand-paper/10 bg-brand-paper/5 text-brand-paper/40"
                  )}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Parallel Branch Actions (Right Side) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Action 1: Instant Client Contact */}
          <div
            className={cn(
              "rounded-xl border p-3 transition-all duration-300",
              step >= 3
                ? "border-brand-paper bg-brand-paper/15 shadow-[0_0_20px_rgba(255,240,208,0.2)]"
                : "border-brand-paper/20 bg-brand-paper/5"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Action1Icon className="h-3.5 w-3.5 text-brand-coral" />
                <span className="font-bold text-xs text-brand-paper">{scenario.nodes.action1.title}</span>
              </div>
              <span className={cn("text-[10px] font-mono", step >= 3 ? "text-brand-coral font-bold" : "text-brand-paper/40")}>
                {step >= 3 ? "Sent (+2.8s)" : "Waiting"}
              </span>
            </div>
            <p className="text-[11px] text-brand-paper/70 font-mono mt-1 line-clamp-1">{scenario.nodes.action1.detail}</p>
          </div>

          {/* Action 2: System Sync */}
          <div
            className={cn(
              "rounded-xl border p-3 transition-all duration-300",
              step >= 3
                ? "border-brand-teal bg-brand-teal/15 shadow-[0_0_20px_rgba(28,171,176,0.2)]"
                : "border-brand-paper/20 bg-brand-paper/5"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Action2Icon className="h-3.5 w-3.5 text-brand-teal" />
                <span className="font-bold text-xs text-brand-paper">{scenario.nodes.action2.title}</span>
              </div>
              <span className={cn("text-[10px] font-mono", step >= 3 ? "text-brand-teal font-bold" : "text-brand-paper/40")}>
                {step >= 3 ? "Synced (+3.4s)" : "Waiting"}
              </span>
            </div>
            <p className="text-[11px] text-brand-paper/70 font-mono mt-1 line-clamp-1">{scenario.nodes.action2.detail}</p>
          </div>

          {/* Action 3: Team Notification */}
          <div
            className={cn(
              "rounded-xl border p-3 transition-all duration-300",
              step >= 3
                ? "border-brand-coral bg-brand-coral/15"
                : "border-brand-paper/20 bg-brand-paper/5"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertIcon className="h-3.5 w-3.5 text-brand-coral" />
                <span className="font-bold text-xs text-brand-paper">{scenario.nodes.alert.title}</span>
              </div>
              <span className={cn("text-[10px] font-mono", step >= 3 ? "text-brand-coral font-bold" : "text-brand-paper/40")}>
                {step >= 3 ? "Delivered (+4.0s)" : "Waiting"}
              </span>
            </div>
            <p className="text-[11px] text-brand-paper/70 font-mono mt-1 line-clamp-1">{scenario.nodes.alert.detail}</p>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      <AnimatePresence>
        {step === 4 && (
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="relative z-10 mt-6 rounded-xl border border-brand-teal bg-brand-teal/20 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-brand-teal flex-shrink-0" />
              <div>
                <span className="font-bold text-xs uppercase tracking-wide text-brand-paper">
                  Pipeline Completed in 4.2s
                </span>
                <p className="text-xs text-brand-paper/80 font-mono">
                  {scenario.timeSavings}
                </p>
              </div>
            </div>
            <span className="font-mono text-xs uppercase px-3 py-1 rounded bg-brand-teal text-brand-navy font-bold">
              0 Human Minutes Wasted
            </span>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
