"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, PhoneOff, Sparkles, X, Volume2, ChevronUp } from "lucide-react";
import type { TrilletAgent as TrilletAgentType } from "@trillet-ai/web-sdk";

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
}

export function TrilletVoiceWidget({
  agentId = process.env.NEXT_PUBLIC_TRILLET_AGENT_ID || "68f6b3cb-darling-good",
  workspaceId = process.env.NEXT_PUBLIC_TRILLET_WORKSPACE_ID || "",
  agentName = "Darling Good",
  autoOpen = false,
}: TrilletVoiceWidgetProps) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [status, setStatus] = useState<"idle" | "connecting" | "connected" | "disconnected" | "error">("idle");
  const [statusLabel, setStatusLabel] = useState("Ready to talk");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptMessage[]>([]);

  const agentRef = useRef<TrilletAgentType | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = useCallback((text: string, role: "user" | "assistant" | "system") => {
    if (!text?.trim()) return;
    setTranscripts((prev) => {
      // Avoid exact duplicate consecutive messages
      if (prev.length > 0 && prev[prev.length - 1].text === text && prev[prev.length - 1].role === role) {
        return prev;
      }
      return [...prev, { id: `${Date.now()}-${Math.random()}`, role, text }];
    });
  }, []);

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  const startPolling = useCallback(() => {
    let lastCount = 0;
    pollIntervalRef.current = setInterval(() => {
      if (!agentRef.current || status !== "connected") return;
      try {
        const list = agentRef.current.getTranscripts?.() || [];
        for (let i = lastCount; i < list.length; i++) {
          const item = list[i] as { text?: string; role?: "user" | "assistant" | "system" };
          if (item?.text) {
            addMessage(item.text, item.role || "assistant");
          }
        }
        lastCount = list.length;
      } catch {
        // Safe fallback if transcripts method is not ready
      }
    }, 500);
  }, [status, addMessage]);

  const connectVoice = async () => {
    setStatus("connecting");
    setStatusLabel("Connecting to agent...");
    setIsOpen(true);

    try {
      // Dynamically load TrilletAgent to ensure clean client-side WebRTC initialization
      const { TrilletAgent } = await import("@trillet-ai/web-sdk");

      const agent = new TrilletAgent({
        workspaceId,
        agentId,
        mode: "voice",
      });
      agentRef.current = agent;

      agent.on("connected", () => {
        setStatus("connected");
        setIsMuted(false);
        setStatusLabel("Listening...");
        addMessage("Connected to Good'Ai Voice. Go ahead, speak normally.", "system");
        startPolling();
      });

      agent.on("disconnected", () => {
        setStatus("disconnected");
        setIsSpeaking(false);
        setStatusLabel("Call ended");
        addMessage("Voice session ended.", "system");
        stopPolling();
      });

      agent.on("error", () => {
        setStatus("error");
        setIsSpeaking(false);
        setStatusLabel("Connection error");
        addMessage("Unable to connect. Please check microphone permissions or try again.", "system");
        stopPolling();
      });

      agent.on("assistantStartedSpeaking", () => {
        setIsSpeaking(true);
        setStatusLabel(`${agentName} speaking...`);
      });

      agent.on("assistantStoppedSpeaking", () => {
        setIsSpeaking(false);
        setStatusLabel(isMuted ? "Microphone muted" : "Listening...");
      });

      // Listen for direct transcript events
      ["message", "transcript", "transcriptUpdate"].forEach((evt) => {
        agent.on(evt, (data: unknown) => {
          const payload = data as { isFinal?: boolean; text?: string; content?: string; role?: "user" | "assistant" };
          if (payload?.isFinal === false) return;
          const text = typeof data === "string" ? data : payload?.text || payload?.content;
          const role = payload?.role || "assistant";
          if (text) addMessage(text, role);
        });
      });

      // Request backend session token via Route Handler
      const response = await fetch("/api/voice/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      });

      const data = await response.json();

      if (data.mode === "authenticated" && data.connection) {
        // Secure server-minted room join
        await agent.joinRoom(data);
      } else {
        // Direct public call fallback
        await agent.startPublicCall();
      }
    } catch (err: unknown) {
      console.error("[Trillet Agent Connection Error]:", err);
      setStatus("error");
      setStatusLabel("Failed to connect");
      addMessage("Call failed to initialize. Please check microphone access.", "system");
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

  const endCall = () => {
    try {
      agentRef.current?.endCall();
    } catch (e) {
      console.error("[Trillet End Call Error]:", e);
    }
    stopPolling();
    setStatus("idle");
    setStatusLabel("Ready to talk");
    setIsSpeaking(false);
    setIsMuted(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcripts]);

  useEffect(() => {
    return () => {
      stopPolling();
      try {
        agentRef.current?.endCall();
      } catch {}
    };
  }, []);

  return (
    <>
      {/* Floating Trigger Bubble */}
      <aside aria-label="Voice Assistant Launcher" className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {!isOpen && (
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              if (status === "idle") connectVoice();
            }}
            className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-navy border border-brand-paper/30 shadow-2xl transition-all duration-300 hover:scale-105 hover:border-brand-coral cursor-pointer"
            aria-label="Open Voice Assistant"
          >
            {status === "connected" && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-coral opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-coral" />
              </span>
            )}
            <Mic className="h-6 w-6 text-brand-paper group-hover:text-brand-coral transition-colors" />
          </button>
        )}

        {/* Voice Agent Slide-Up Panel */}
        {isOpen && (
          <div
            className="w-[360px] sm:w-[400px] max-w-[calc(100vw-32px)] rounded-2xl bg-brand-navy border border-brand-paper/20 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 animate-in fade-in slide-in-from-bottom-6"
            style={{ maxHeight: "560px" }}
            role="region"
            aria-label="Good'Ai Voice Agent"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-paper/15 bg-brand-navy/90 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-paper/10 text-brand-coral border border-brand-paper/15">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-paper leading-tight">{agentName}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        status === "connected"
                          ? "bg-brand-teal animate-pulse"
                          : status === "connecting"
                          ? "bg-brand-coral animate-ping"
                          : status === "error"
                          ? "bg-red-400"
                          : "bg-brand-paper/30"
                      }`}
                    />
                    <span className="text-[11px] font-mono text-brand-paper/70 tracking-wide">
                      {statusLabel}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-paper/60 hover:text-brand-paper hover:bg-brand-paper/10 transition-colors"
                aria-label="Close voice panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Transcript Display Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[280px] bg-brand-navy/40">
              {transcripts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-brand-paper/50">
                  <Volume2 className="h-8 w-8 mb-2 text-brand-paper/30" />
                  <p className="text-xs font-mono">
                    {status === "idle"
                      ? 'Tap "Start Call" below to begin talking with our Australian AI voice agent.'
                      : status === "connecting"
                      ? "Establishing WebRTC audio stream..."
                      : "Listening... Speak naturally."}
                  </p>
                </div>
              ) : (
                transcripts.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === "user"
                        ? "items-end"
                        : msg.role === "assistant"
                        ? "items-start"
                        : "items-center"
                    }`}
                  >
                    {msg.role === "system" ? (
                      <span className="text-[10px] font-mono bg-brand-paper/10 text-brand-paper/60 px-2.5 py-1 rounded-full text-center">
                        {msg.text}
                      </span>
                    ) : (
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                          msg.role === "user"
                            ? "bg-brand-coral text-brand-navy font-medium rounded-br-xs"
                            : "bg-brand-paper/15 text-brand-paper border border-brand-paper/15 rounded-bl-xs"
                        }`}
                      >
                        {msg.text}
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={transcriptEndRef} />
            </div>

            {/* Audio Waveform Visualizer */}
            <div className="flex items-center justify-center gap-1.5 py-3 border-t border-brand-paper/10 bg-brand-navy/70">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    isSpeaking
                      ? "bg-brand-coral animate-pulse"
                      : status === "connected"
                      ? "bg-brand-teal/60"
                      : "bg-brand-paper/20"
                  }`}
                  style={{
                    height: isSpeaking ? `${12 + ((i * 7) % 18)}px` : "6px",
                    animationDelay: `${i * 120}ms`,
                  }}
                />
              ))}
            </div>

            {/* Bottom Controls */}
            <div className="p-4 border-t border-brand-paper/15 bg-brand-navy flex items-center justify-between gap-3">
              {status === "connected" ? (
                <>
                  <button
                    type="button"
                    onClick={toggleMute}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold font-mono transition-all cursor-pointer ${
                      isMuted
                        ? "bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30"
                        : "bg-brand-paper/10 border-brand-paper/20 text-brand-paper hover:bg-brand-paper/20"
                    }`}
                  >
                    {isMuted ? <MicOff className="h-4 w-4 text-red-400" /> : <Mic className="h-4 w-4" />}
                    {isMuted ? "Unmute Mic" : "Mute Mic"}
                  </button>

                  <button
                    type="button"
                    onClick={endCall}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-mono transition-all cursor-pointer shadow-lg"
                    aria-label="End call"
                  >
                    <PhoneOff className="h-4 w-4" />
                    <span>End Call</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={connectVoice}
                  disabled={status === "connecting"}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-coral hover:bg-brand-paper text-brand-navy font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Mic className="h-4 w-4" />
                  {status === "connecting" ? "Connecting..." : "Start Voice Conversation"}
                </button>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

