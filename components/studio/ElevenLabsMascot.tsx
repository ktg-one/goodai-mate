"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Mic, MicOff, Send, Volume2, VolumeX, X } from "lucide-react";
import { ELEVENLABS_AGENT_ID, ELEVENLABS_EMBED_SRC } from "@/lib/elevenlabs";

interface ElevenLabsMascotProps {
  onClose?: () => void;
}

type Turn = {
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

function encodeMonoWavBase64(samples: Float32Array, sampleRate: number): string {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, samples.length * 2, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function ElevenLabsMascot({ onClose }: ElevenLabsMascotProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([
    {
      role: "assistant",
      content:
        "G'day! I'm Goodie, running on our self-hosted Liquid LFM3 Omni model in Perth. Tap the mic to talk or type a question below.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceReplyOn, setVoiceReplyOn] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Float32Array[]>([]);

  useEffect(() => {
    if (!scriptLoaded) return;
    const timer = setTimeout(() => {
      document.dispatchEvent(
        new CustomEvent("elevenlabs-agent:expand", { detail: { action: "expand" } }),
      );
    }, 150);
    return () => clearTimeout(timer);
  }, [scriptLoaded]);

  const speakText = (text: string) => {
    if (!voiceReplyOn || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-AU";
      utter.rate = 1.02;
      window.speechSynthesis.speak(utter);
    } catch {
      /* browser speech synthesis unavailable */
    }
  };

  const sendToLfmOmni = async (messageText: string, audioBase64?: string) => {
    const clean = messageText.trim();
    if (!clean && !audioBase64) return;
    const displayUser = clean || "🎤 Voice message";
    const nextHistory = [...turns, { role: "user" as const, content: displayUser }];
    setTurns(nextHistory);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: clean,
          audioBase64,
          history: turns.slice(-6),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      const reply =
        data.reply ||
        data.error ||
        "Give us a bell on (08) 6102 3566 or head to /contact and we'll sort it out.";
      setTurns((prev) => [...prev, { role: "assistant", content: reply }]);
      speakText(reply);
    } catch {
      setTurns((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Couldn't reach the Perth engine just now — call (08) 6102 3566 or head to /contact.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const stopListening = async () => {
    setListening(false);
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    let wavB64: string | undefined;
    if (chunksRef.current.length > 0) {
      const total = chunksRef.current.reduce((acc, c) => acc + c.length, 0);
      const merged = new Float32Array(total);
      let offset = 0;
      for (const c of chunksRef.current) {
        merged.set(c, offset);
        offset += c.length;
      }
      chunksRef.current = [];
      if (total > 1600) {
        wavB64 = encodeMonoWavBase64(merged, 16000);
      }
    }
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      await audioCtxRef.current?.close();
    } catch {
      /* ignore */
    }
    streamRef.current = null;
    audioCtxRef.current = null;
    if (input.trim() || wavB64) {
      await sendToLfmOmni(input, wavB64);
    }
  };

  const startListening = async () => {
    if (listening) {
      await stopListening();
      return;
    }
    setListening(true);
    chunksRef.current = [];

    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (SR) {
      try {
        const rec = new SR();
        rec.lang = "en-AU";
        rec.interimResults = true;
        rec.continuous = false;
        let transcript = "";
        rec.onresult = (e) => {
          let built = "";
          for (let i = 0; i < e.results.length; i++) {
            built += e.results[i][0]?.transcript || "";
          }
          transcript = built.trim();
          setInput(transcript);
        };
        rec.onend = () => {
          setListening(false);
          if (transcript.trim()) {
            void sendToLfmOmni(transcript.trim());
          }
        };
        rec.onerror = () => setListening(false);
        recognitionRef.current = rec;
        rec.start();
        return;
      } catch {
        /* fallback to raw WAV capture for LFM3-Omni multimodal audio */
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext({ sampleRate: 16000 });
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      processor.onaudioprocess = (e) => {
        const channel = e.inputBuffer.getChannelData(0);
        chunksRef.current.push(new Float32Array(channel));
      };
      source.connect(processor);
      processor.connect(ctx.destination);
    } catch {
      setListening(false);
    }
  };

  return (
    <aside
      aria-label="Good'Ai Voice Agent"
      className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-8 sm:right-6"
    >
      {/* Loads the ElevenLabs custom element definition once per page load. */}
      <Script
        src={ELEVENLABS_EMBED_SRC}
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onReady={() => setScriptLoaded(true)}
      />

      <div className="w-80 sm:w-96 rounded-2xl border border-brand-line bg-brand-paper text-brand-ink shadow-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-brand-line pb-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-eucalyptus animate-pulse" />
            <div>
              <p className="text-sm font-bold leading-none">Goodie · LFM3 Omni</p>
              <p className="text-xs text-brand-ink/70 mt-0.5">Self-hosted Perth voice &amp; chat</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setVoiceReplyOn((v) => !v)}
              className="rounded-lg p-1.5 text-brand-ink/70 hover:bg-brand-ink/10 cursor-pointer"
              aria-label={voiceReplyOn ? "Mute spoken replies" : "Unmute spoken replies"}
              title={voiceReplyOn ? "Spoken replies on" : "Spoken replies muted"}
            >
              {voiceReplyOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 rounded-full bg-brand-ink px-2.5 py-1 text-xs font-medium text-brand-paper hover:bg-brand-coral hover:text-brand-ink cursor-pointer"
              aria-label="Close voice panel"
            >
              <X className="h-3.5 w-3.5" />
              <span>Close</span>
            </button>
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto flex flex-col gap-2 pr-1 text-xs leading-relaxed">
          {turns.map((t, idx) => (
            <div
              key={idx}
              className={
                t.role === "user"
                  ? "self-end rounded-xl bg-brand-ink text-brand-paper px-3 py-2 max-w-64"
                  : "self-start rounded-xl bg-brand-surface border border-brand-line text-brand-ink px-3 py-2 max-w-72"
              }
            >
              {t.content}
            </div>
          ))}
          {loading && (
            <div className="self-start rounded-xl bg-brand-surface border border-brand-line px-3 py-2 text-brand-ink/70">
              Goodie is thinking…
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["What do you build?", "How do voice agents work?", "How do we start?"].map((q) => (
            <button
              key={q}
              type="button"
              disabled={loading}
              onClick={() => void sendToLfmOmni(q)}
              className="rounded-full border border-brand-line bg-brand-surface px-2.5 py-1 text-xs text-brand-ink hover:border-brand-coral cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void sendToLfmOmni(input);
          }}
          className="flex items-center gap-1.5"
        >
          <button
            type="button"
            onClick={() => void startListening()}
            disabled={loading}
            className={
              listening
                ? "flex items-center gap-1 rounded-xl bg-brand-coral px-3 py-2 text-xs font-semibold text-brand-ink cursor-pointer"
                : "flex items-center gap-1 rounded-xl bg-brand-ink px-3 py-2 text-xs font-semibold text-brand-paper hover:bg-brand-coral hover:text-brand-ink cursor-pointer"
            }
            aria-label={listening ? "Stop recording and send" : "Speak to Goodie"}
          >
            {listening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            <span>{listening ? "Send" : "Talk"}</span>
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Or type to Goodie…"
            aria-label="Message Goodie"
            className="flex-1 rounded-xl border border-brand-line bg-brand-surface px-3 py-2 text-xs text-brand-ink placeholder:text-brand-ink/50 focus:outline-none focus:border-brand-coral"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-brand-ink p-2 text-brand-paper hover:bg-brand-coral hover:text-brand-ink disabled:opacity-40 cursor-pointer"
            aria-label="Send message"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>

        <div className="sr-only" aria-hidden="true">
          <elevenlabs-convai agent-id={ELEVENLABS_AGENT_ID} />
        </div>

        <div className="text-xs text-brand-ink/70 leading-tight">
          Powered by Liquid LFM3 Omni on our Perth stack. Do not share sensitive personal or financial information.
        </div>
      </div>

      {!scriptLoaded && (
        <span className="sr-only" role="status">
          Loading voice agent…
        </span>
      )}
    </aside>
  );
}
