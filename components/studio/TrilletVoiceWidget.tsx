"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, PhoneOff, Sparkles, X, Volume2 } from "lucide-react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import type { TrilletAgent as TrilletAgentType } from "@trillet-ai/web-sdk";

type VoiceStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";

interface TranscriptMessage {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
}

interface TrilletVoiceWidgetProps {
  agentId?: string;
  workspaceId?: string;
  agentName?: string;
  autoOpen?: boolean;
  onClose?: () => void;
  hideTrigger?: boolean;
}

function getStatusDotClass(status: VoiceStatus) {
  if (status === "connected") return "bg-brand-teal animate-pulse";
  if (status === "connecting") return "bg-brand-coral animate-ping";
  if (status === "error") return "bg-destructive";
  return "bg-brand-paper/30";
}

function getEmptyTranscriptPrompt(status: VoiceStatus) {
  if (status === "idle") {
    return 'Tap "Start Call" below to begin talking with our Australian AI voice agent.';
  }
  if (status === "connecting") {
    return "Establishing WebRTC audio stream...";
  }
  return "Listening... Speak naturally.";
}

function VoicePanelHeader({
  agentName,
  status,
  statusLabel,
  onClosePanel,
}: {
  agentName: string;
  status: VoiceStatus;
  statusLabel: string;
  onClosePanel: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-brand-paper/15 bg-brand-ink/90 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-paper/10 text-brand-coral border border-brand-paper/15">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-brand-paper leading-tight">{agentName}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`h-2 w-2 rounded-full ${getStatusDotClass(status)}`} />
            <span className="text-xs font-mono text-brand-paper/70 tracking-wide">
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onClosePanel}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-paper/60 hover:text-brand-paper hover:bg-brand-paper/10 transition-colors"
        aria-label="Close voice panel"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function TranscriptMessageRow({ msg }: { msg: TranscriptMessage }) {
  const alignment =
    msg.role === "user" ? "items-end" : msg.role === "assistant" ? "items-start" : "items-center";

  return (
    <div className={`flex flex-col ${alignment}`}>
      {msg.role === "system" ? (
        <span className="text-xs font-mono bg-brand-paper/10 text-brand-paper/60 px-2.5 py-1 rounded-full text-center">
          {msg.text}
        </span>
      ) : (
        <div
          className={`max-w-xs rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
            msg.role === "user"
              ? "bg-brand-coral text-brand-paper font-medium rounded-br-xs"
              : "bg-brand-paper/15 text-brand-paper border border-brand-paper/15 rounded-bl-xs"
          }`}
        >
          {msg.text}
        </div>
      )}
    </div>
  );
}

function VoiceTranscriptView({
  transcripts,
  status,
  transcriptEndRef,
}: {
  transcripts: TranscriptMessage[];
  status: VoiceStatus;
  transcriptEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-50 max-h-70 bg-brand-ink/40">
      {transcripts.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 text-brand-paper/50">
          <Volume2 className="h-8 w-8 mb-2 text-brand-paper/30" />
          <p className="text-xs font-mono">{getEmptyTranscriptPrompt(status)}</p>
        </div>
      ) : (
        transcripts.map((msg) => <TranscriptMessageRow key={msg.id} msg={msg} />)
      )}
      <div ref={transcriptEndRef} />
    </div>
  );
}

function getWaveformBarMotion(
  index: number,
  shouldReduceMotion: boolean | null,
  isSpeaking: boolean,
  isConnected: boolean,
) {
  if (shouldReduceMotion) {
    return {
      animate: { scaleY: 0.5, opacity: 0.8 },
      transition: { duration: 1.0 },
    };
  }
  if (isSpeaking) {
    return {
      animate: {
        scaleY: [0.3, 1.6, 0.6, 1.9, 0.4],
        opacity: [0.8, 1, 0.85, 1, 0.8],
      },
      transition: {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 1.2 + (index % 3) * 0.2,
        delay: index * 0.15,
        ease: "easeInOut" as const,
      },
    };
  }
  if (isConnected) {
    return {
      animate: {
        scaleY: [0.4, 0.9, 0.5, 1.0, 0.4],
        opacity: [0.5, 0.85, 0.6, 0.9, 0.5],
      },
      transition: {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 1.5 + (index % 2) * 0.3,
        delay: index * 0.12,
        ease: "easeInOut" as const,
      },
    };
  }
  return {
    animate: { scaleY: 0.25, opacity: 0.4 },
    transition: { duration: 1.0, ease: "easeInOut" as const },
  };
}

function VoiceWaveformVisualizer({
  isSpeaking,
  status,
  shouldReduceMotion,
}: {
  isSpeaking: boolean;
  status: VoiceStatus;
  shouldReduceMotion: boolean | null;
}) {
  const isConnected = status === "connected";
  const barColorClass = isSpeaking
    ? "bg-brand-coral"
    : isConnected
    ? "bg-brand-teal/70"
    : "bg-brand-paper/20";

  return (
    <div className="flex items-center justify-center gap-1.5 py-3 border-t border-brand-paper/10 bg-brand-ink/70">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const motionProps = getWaveformBarMotion(i, shouldReduceMotion, isSpeaking, isConnected);
        return (
          <m.span
            key={i}
            className={`w-1 h-6 rounded-full transition-colors duration-500 ${barColorClass}`}
            style={{ transformOrigin: "bottom" }}
            animate={motionProps.animate}
            transition={motionProps.transition}
          />
        );
      })}
    </div>
  );
}

function VoiceBottomControls({
  status,
  isMuted,
  onToggleMute,
  onEndCall,
  onConnectVoice,
}: {
  status: VoiceStatus;
  isMuted: boolean;
  onToggleMute: () => void;
  onEndCall: () => void;
  onConnectVoice: () => void;
}) {
  return (
    <div className="p-4 border-t border-brand-paper/15 bg-brand-ink flex items-center justify-between gap-3">
      {status === "connected" ? (
        <>
          <button
            type="button"
            onClick={onToggleMute}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold font-mono transition-colors cursor-pointer ${
              isMuted
                ? "bg-destructive/20 border-destructive/40 text-brand-coral hover:bg-destructive/30"
                : "bg-brand-paper/10 border-brand-paper/20 text-brand-paper hover:bg-brand-paper/20"
            }`}
          >
            {isMuted ? <MicOff className="h-4 w-4 text-brand-coral" /> : <Mic className="h-4 w-4" />}
            {isMuted ? "Unmute Mic" : "Mute Mic"}
          </button>

          <button
            type="button"
            onClick={onEndCall}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-bold font-mono transition-colors cursor-pointer shadow-lg"
            aria-label="End call"
          >
            <PhoneOff className="h-4 w-4" />
            <span>End Call</span>
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={onConnectVoice}
          disabled={status === "connecting"}
          className="button w-full cursor-pointer"
        >
          <span>{status === "connecting" ? "Connecting..." : "Start Voice Conversation"}</span>
          <Mic size={14} />
        </button>
      )}
    </div>
  );
}

export function TrilletVoiceWidget({
  agentId = process.env.NEXT_PUBLIC_TRILLET_AGENT_ID || "68f6b3cb-darling-good",
  workspaceId = process.env.NEXT_PUBLIC_TRILLET_WORKSPACE_ID || "",
  agentName = "Darling Good",
  autoOpen = false,
  onClose,
  hideTrigger = false,
}: TrilletVoiceWidgetProps) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [statusLabel, setStatusLabel] = useState("Ready to talk");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptMessage[]>([]);

  const agentRef = useRef<TrilletAgentType | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const connectInFlightRef = useRef(false);
  const listenerCleanupRef = useRef<Array<() => void>>([]);

  const addMessage = useCallback((text: string, role: "user" | "assistant" | "system") => {
    if (!text?.trim()) return;
    setTranscripts((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].text === text && prev[prev.length - 1].role === role) {
        return prev;
      }
      return [...prev, { id: `${Date.now()}-${Math.random()}`, role, text }];
    });
  }, []);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const cleanupAgentListeners = useCallback(() => {
    listenerCleanupRef.current.forEach((dispose) => dispose());
    listenerCleanupRef.current = [];
  }, []);

  const bindAgentEvent = useCallback((
    agent: TrilletAgentType,
    eventName: string,
    handler: (...args: unknown[]) => void,
  ) => {
    agent.on(eventName, handler);
    listenerCleanupRef.current.push(() => {
      (agent as TrilletAgentType & { off?: (event: string, cb: (...args: unknown[]) => void) => void }).off?.(eventName, handler);
    });
  }, []);

  const startPolling = useCallback(() => {
    let lastCount = 0;
    pollIntervalRef.current = setInterval(() => {
      const list = agentRef.current?.getTranscripts?.() || [];
      for (let i = lastCount; i < list.length; i++) {
        const item = list[i] as { text?: string; role?: "user" | "assistant" | "system" };
        if (item?.text) addMessage(item.text, item.role || "assistant");
      }
      lastCount = list.length;
    }, 500);
  }, [addMessage]);

  const registerAgentEvents = useCallback((agent: TrilletAgentType) => {
    bindAgentEvent(agent, "connected", () => {
      setStatus("connected");
      setIsMuted(false);
      setStatusLabel("Listening...");
      addMessage("Connected to Good'Ai Voice. Go ahead, speak normally.", "system");
      startPolling();
    });

    bindAgentEvent(agent, "disconnected", () => {
      setStatus("disconnected");
      setIsSpeaking(false);
      setStatusLabel("Call ended");
      addMessage("Voice session ended.", "system");
      stopPolling();
    });

    bindAgentEvent(agent, "error", () => {
      setStatus("error");
      setIsSpeaking(false);
      setStatusLabel("Connection error");
      addMessage("Unable to connect. Please check microphone permissions or try again.", "system");
      stopPolling();
    });

    bindAgentEvent(agent, "assistantStartedSpeaking", () => {
      setIsSpeaking(true);
      setStatusLabel(`${agentName} speaking...`);
    });

    bindAgentEvent(agent, "assistantStoppedSpeaking", () => {
      setIsSpeaking(false);
      setStatusLabel("Listening...");
    });

    ["message", "transcript", "transcriptUpdate"].forEach((evt) => {
      bindAgentEvent(agent, evt, (data: unknown) => {
        const payload = data as { isFinal?: boolean; text?: string; content?: string; role?: "user" | "assistant" };
        if (payload?.isFinal === false) return;
        const text = typeof data === "string" ? data : payload?.text || payload?.content;
        if (text) addMessage(text, payload?.role || "assistant");
      });
    });
  }, [addMessage, agentName, bindAgentEvent, startPolling, stopPolling]);

  const connectVoice = async () => {
    if (connectInFlightRef.current || status === "connected") return;
    connectInFlightRef.current = true;
    setStatus("connecting");
    setStatusLabel("Connecting to agent...");
    setIsOpen(true);

    try {
      const { TrilletAgent } = await import("@trillet-ai/web-sdk");
      const agent = new TrilletAgent({ workspaceId, agentId, mode: "voice" });

      cleanupAgentListeners();
      agentRef.current = agent;
      registerAgentEvents(agent);

      const response = await fetch("/api/voice/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      });

      if (!response.ok) {
        throw new Error(`Voice call bootstrap failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.mode === "authenticated" && data.connection) {
        await agent.joinRoom(data);
      } else {
        await agent.startPublicCall();
      }
    } catch (err: unknown) {
      console.error("[Trillet Agent Connection Error]:", err);
      setStatus("error");
      setStatusLabel("Failed to connect");
      addMessage("Call failed to initialize. Please check microphone access.", "system");
    } finally {
      connectInFlightRef.current = false;
    }
  };

  const toggleMute = () => {
    if (!agentRef.current) return;
    const nextMuted = !isMuted;
    try {
      agentRef.current.toggleMicrophone(!nextMuted);
      setIsMuted(nextMuted);
      setStatusLabel(nextMuted ? "Microphone muted" : "Listening...");
    } catch (e) {
      console.error("[Trillet Mute Error]:", e);
    }
  };

  const endCall = useCallback(() => {
    try {
      agentRef.current?.endCall();
    } catch (e) {
      console.error("[Trillet End Call Error]:", e);
    }
    stopPolling();
    cleanupAgentListeners();
    setStatus("idle");
    setStatusLabel("Ready to talk");
    setIsSpeaking(false);
    setIsMuted(false);
  }, [cleanupAgentListeners, stopPolling]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcripts]);

  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      stopPolling();
      cleanupAgentListeners();
      try {
        agentRef.current?.endCall();
      } catch {}
    };
  }, [cleanupAgentListeners, stopPolling]);

  const panelTransition = shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 };

  return (
    <aside aria-label="Voice Assistant Launcher" className="fixed bottom-4 right-4 z-50 flex flex-col items-end sm:bottom-6 sm:right-6">
      {!hideTrigger && !isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            if (status === "idle") connectVoice();
          }}
          className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-ink border border-brand-paper/30 shadow-2xl transition-transform duration-300 hover:scale-105 hover:border-brand-coral cursor-pointer"
          aria-label="Open Voice Assistant"
        >
          <Mic className="h-6 w-6 text-brand-paper group-hover:text-brand-coral transition-colors" />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={panelTransition}
            animate={{ opacity: 1, y: 0 }}
            exit={panelTransition}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="w-90 sm:w-100 max-w-screen-sm rounded-2xl bg-brand-ink border border-brand-paper/20 shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: "560px" }}
            role="region"
            aria-label="Good'Ai Voice Agent"
          >
            <VoicePanelHeader
              agentName={agentName}
              status={status}
              statusLabel={statusLabel}
              onClosePanel={() => {
                setIsOpen(false);
                endCall();
                onClose?.();
              }}
            />
            <VoiceTranscriptView
              transcripts={transcripts}
              status={status}
              transcriptEndRef={transcriptEndRef}
            />
            <VoiceWaveformVisualizer
              isSpeaking={isSpeaking}
              status={status}
              shouldReduceMotion={shouldReduceMotion}
            />
            <VoiceBottomControls
              status={status}
              isMuted={isMuted}
              onToggleMute={toggleMute}
              onEndCall={endCall}
              onConnectVoice={connectVoice}
            />
          </m.div>
        )}
      </AnimatePresence>
    </aside>
  );
}

