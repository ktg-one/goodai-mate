"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Mic, MicOff, Send, Volume2, VolumeX, X } from "lucide-react";
import { ELEVENLABS_AGENT_ID, ELEVENLABS_EMBED_SRC } from "@/lib/elevenlabs";

interface ElevenLabsMascotProps {
  onClose?: () => void;
  initialMode?: "voice" | "private";
}

type Turn = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

const STARTER_TURNS: Turn[] = [
  {
    id: "starter-0",
    role: "assistant",
    content:
      "G'day! We run this private chat on our own Perth hardware so your questions stay local. Tap Talk or type a question below.",
  },
];

const QUICK_QUESTIONS = [
  "What do you build?",
  "How does setup work?",
  "Can you automate my calls?",
] as const;

function speakAussieReply(text: string, enabled: boolean) {
  if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-AU";
    utter.rate = 1.02;
    window.speechSynthesis.speak(utter);
  } catch {
    /* speech synthesis unavailable */
  }
}

function createSpeechRecognizer(
  onTranscript: (text: string) => void,
  onEnd: () => void,
): SpeechRecognitionLike | null {
  if (typeof window === "undefined") return null;
  const win = window as unknown as Record<string, unknown>;
  const Ctor = win.SpeechRecognition ?? win.webkitSpeechRecognition;
  if (typeof Ctor !== "function") return null;
  try {
    const rec = new (Ctor as new () => SpeechRecognitionLike)();
    rec.lang = "en-AU";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e) => {
      const text = e.results?.[0]?.[0]?.transcript?.trim() || "";
      if (text) onTranscript(text);
    };
    rec.onerror = onEnd;
    rec.onend = onEnd;
    rec.start();
    return rec;
  } catch {
    return null;
  }
}

function PrivateAiChatSection({ voiceReplyOn }: { voiceReplyOn: boolean }) {
  const [turns, setTurns] = useState<Turn[]>(STARTER_TURNS);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const turnSeq = useRef(1);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const nextId = () => {
    const id = `turn-${turnSeq.current}`;
    turnSeq.current += 1;
    return id;
  };

  const sendToPrivateAi = async (messageText: string) => {
    const clean = messageText.trim();
    if (!clean || loading) return;

    setError(null);
    setInput("");
    const userTurn: Turn = { id: nextId(), role: "user", content: clean };
    setTurns((prev) => [...prev, userTurn]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: clean,
          history: turns.slice(-6).map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(errData.error || "Private assistant is unavailable right now.");
      }

      const data = (await res.json().catch(() => ({}))) as { reply?: string };
      const reply =
        data.reply ||
        "G'day! Tell us what admin is eating your week on our contact page and we'll help sort it out.";
      const assistantTurn: Turn = { id: nextId(), role: "assistant", content: reply };
      setTurns((prev) => [...prev, assistantTurn]);
      speakAussieReply(reply, voiceReplyOn);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not reach private AI right now. Try again in a moment.",
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = createSpeechRecognizer(
      (transcript) => void sendToPrivateAi(transcript),
      () => setListening(false),
    );
    if (!rec) {
      setError("Voice input isn't supported in this browser — type your question below.");
      return;
    }
    recognitionRef.current = rec;
    setListening(true);
  };

  return (
    <section aria-label="Private AI chat" className="flex flex-col gap-2.5">
      <div className="max-h-64 overflow-y-auto flex flex-col gap-2 pr-1 text-sm leading-relaxed">
        {turns.map((turn) => (
          <div
            key={turn.id}
            className={
              turn.role === "user"
                ? "self-end rounded-xl bg-brand-ink text-brand-paper px-3 py-2 max-w-72"
                : "self-start rounded-xl bg-brand-eucalyptus/20 border border-brand-ink/15 text-brand-ink px-3 py-2 max-w-80"
            }
          >
            {turn.content}
          </div>
        ))}
        {loading && (
          <div className="self-start rounded-xl bg-brand-eucalyptus/20 border border-brand-ink/15 px-3 py-2 text-brand-ink/80">
            Goodie is thinking...
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            disabled={loading}
            onClick={() => void sendToPrivateAi(q)}
            className="rounded-full border border-brand-ink/20 bg-brand-paper px-2.5 py-1 text-xs text-brand-ink hover:border-brand-coral disabled:opacity-60 cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendToPrivateAi(input);
        }}
        className="flex items-center gap-1.5"
      >
        <button
          type="button"
          onClick={toggleListening}
          disabled={loading}
          className={
            listening
              ? "flex items-center gap-1 rounded-xl bg-brand-coral px-2.5 py-2 text-xs font-semibold text-brand-ink cursor-pointer"
              : "flex items-center gap-1 rounded-xl bg-brand-ink px-2.5 py-2 text-xs font-semibold text-brand-paper hover:bg-brand-coral hover:text-brand-ink cursor-pointer"
          }
          aria-label={listening ? "Stop listening" : "Speak to Private AI"}
        >
          {listening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
          <span>{listening ? "Stop" : "Talk"}</span>
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => void fetch("/api/chat/session?warm=1").catch(() => null)}
          placeholder="Type your question..."
          aria-label="Message private AI"
          className="flex-1 rounded-xl border border-brand-ink/20 bg-brand-paper px-3 py-2 text-sm text-brand-ink placeholder:text-brand-ink/55 focus:outline-none focus:border-brand-coral"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-xl bg-brand-ink p-2 text-brand-paper hover:bg-brand-coral hover:text-brand-ink disabled:opacity-40 cursor-pointer"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
      {error && <p className="text-xs text-brand-coral">{error}</p>}
      <p className="text-xs leading-tight text-brand-ink/75">
        Private AI runs on our self-hosted Perth stack. Avoid sharing sensitive personal or financial data.
      </p>
    </section>
  );
}

export function ElevenLabsMascot({ onClose, initialMode = "voice" }: ElevenLabsMascotProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [mode, setMode] = useState<"voice" | "private">(initialMode);
  const [voiceReplyOn, setVoiceReplyOn] = useState(true);

  useEffect(() => {
    if (!scriptLoaded || mode !== "voice") return;
    const timer = setTimeout(() => {
      document.dispatchEvent(
        new CustomEvent("elevenlabs-agent:expand", { detail: { action: "expand" } }),
      );
    }, 150);
    return () => clearTimeout(timer);
  }, [scriptLoaded, mode]);

  const switchToPrivate = () => {
    setMode("private");
    void fetch("/api/chat/session?warm=1").catch(() => null);
  };

  return (
    <aside
      aria-label="Good'Ai Assistant"
      className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-8 sm:right-6"
    >
      <Script
        src={ELEVENLABS_EMBED_SRC}
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onReady={() => setScriptLoaded(true)}
      />

      <div
        className={`w-80 sm:w-96 rounded-2xl border border-brand-ink/15 bg-brand-paper text-brand-ink shadow-2xl p-4 flex flex-col gap-3 ${
          mode === "voice" ? "mb-20" : ""
        }`}
      >
        <div className="flex items-center justify-between border-b border-brand-ink/15 pb-2.5">
          <div>
            <p className="text-sm font-bold leading-none">Goodie Assistant</p>
            <p className="text-xs text-brand-ink/80 mt-0.5">
              {mode === "voice" ? "Live ElevenLabs voice demo" : "Private AI on our Perth stack"}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {mode === "private" && (
              <button
                type="button"
                onClick={() => setVoiceReplyOn((v) => !v)}
                className="rounded-lg p-1.5 text-brand-ink/70 hover:bg-brand-ink/10 cursor-pointer"
                aria-label={voiceReplyOn ? "Mute spoken replies" : "Unmute spoken replies"}
                title={voiceReplyOn ? "Spoken replies on" : "Spoken replies muted"}
              >
                {voiceReplyOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 rounded-full bg-brand-ink px-2.5 py-1 text-xs font-medium text-brand-paper hover:bg-brand-coral hover:text-brand-ink cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-coral"
              aria-label="Close assistant panel"
            >
              <X className="h-3.5 w-3.5" />
              <span>Close</span>
            </button>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Assistant mode"
          className="grid grid-cols-2 gap-1 rounded-xl bg-brand-ink/8 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "voice"}
            onClick={() => setMode("voice")}
            className={`rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer transition ${
              mode === "voice"
                ? "bg-brand-paper text-brand-ink shadow-sm"
                : "text-brand-ink/75 hover:text-brand-ink"
            }`}
          >
            ElevenLabs voice
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "private"}
            onClick={switchToPrivate}
            className={`rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer transition ${
              mode === "private"
                ? "bg-brand-paper text-brand-ink shadow-sm"
                : "text-brand-ink/75 hover:text-brand-ink"
            }`}
          >
            Private AI
          </button>
        </div>

        {mode === "voice" ? (
          <section aria-label="ElevenLabs voice demo" className="flex flex-col gap-1.5">
            <p className="text-xs leading-relaxed text-brand-ink/85">
              Tap the phone button below to talk live with our voice receptionist, or switch to{" "}
              <button
                type="button"
                onClick={switchToPrivate}
                className="font-semibold underline hover:text-brand-coral cursor-pointer"
              >
                Private AI
              </button>{" "}
              to chat with our self-hosted model.
            </p>
          </section>
        ) : (
          <PrivateAiChatSection voiceReplyOn={voiceReplyOn} />
        )}
      </div>

      <div className={mode === "voice" ? "block" : "hidden"}>
        <elevenlabs-convai agent-id={ELEVENLABS_AGENT_ID} />
      </div>

      {!scriptLoaded && mode === "voice" && (
        <span className="sr-only" role="status">
          Loading voice assistant...
        </span>
      )}
    </aside>
  );
}
