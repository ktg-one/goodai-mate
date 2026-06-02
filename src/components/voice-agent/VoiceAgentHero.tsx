'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, Volume2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { Visualizer } from '@/components/hero/Visualizer';
import { transcribeWithSupertonic } from '@/lib/voice/supertonic';
import { BrandWordmark } from '@/components/brand/BrandWordmark';
import StampButton from '@/components/StampButton';

// Mechanical stamp easing (design-system-new canon)
const STAMP_EASE = [0.23, 1, 0.32, 1] as const;

/**
 * VoiceAgentHero
 * The new flagship product experience for the Good'ai marketing site.
 * Pure functional Voice Agent demo as the hero (no marketing copy inside).
 *
 * Uses local "Supertonic" for high-quality ASR during testing (user's setup).
 * Falls back gracefully. Wires into the existing /api/chat + Good'ai persona.
 *
 * Brand: Brutalist stamp aesthetic, one orange per surface, paper ribbons.
 */

type AgentStatus = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

interface VoiceAgentHeroProps {
  /** Local Supertonic endpoint for transcription. Example: http://localhost:8000/transcribe */
  supertonicUrl?: string;
  /** Leaks the "mail" (transcript + response) to parent for persistent docket / in-tray filing across sections */
  onMailFiled?: (transcript: string, response: string) => void;
}

export function VoiceAgentHero({ supertonicUrl = 'http://localhost:8000/transcribe', onMailFiled }: VoiceAgentHeroProps) {
  const [status, setStatus] = useState<AgentStatus>('idle');
  const [userTranscript, setUserTranscript] = useState('');
  const [agentResponse, setAgentResponse] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [analyzerNode, setAnalyzerNode] = useState<AnalyserNode | null>(null);
  const [sensitivity, setSensitivity] = useState(1);
  const [visualMode, setVisualMode] = useState<'calm' | 'dynamic'>('dynamic');

  const sensitivityRef = useRef(sensitivity);
  const visualModeRef = useRef(visualMode);

  // Stamp clack signal for Visualizer (bump on every new transcript line = hard mechanical pop in ribbons)
  const stampSignalRef = useRef(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // === HERO DESCENT SCROLL PHYSICS (signature Awwwards move) ===
  // The stamp-box "files itself" into the mail stack as you scroll. Shadows + ribbons react.
  // Mechanical, not floaty. Power curves + hard stops. Shadows participate. Paper edges curl.
  const heroStampRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroStampRef,
    offset: ['start 35%', 'end 65%'],
  });

  // Settle ref for 60fps hot path to Visualizer (no re-renders, no effect restarts)
  // ALSO publishes --hero-filing-progress CSS var (0-1) so the entire mail-board (ribbons, dockets, stamps)
  // can participate in physical "ink soak / shadow depth / paper settle" as the stamp-box descends.
  // One source of truth. 60fps. No additional scroll listeners.
  const settleRef = useRef(0);
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    settleRef.current = latest;
    // Global participation in the filing ritual (brand: every docket feels the weight of the hero mail dropping)
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--hero-filing-progress', latest.toFixed(3));
    }
  });

  // Mechanical settle values (no floaty — short, purposeful, slightly jarring settle)
  // Multi-phase for Awwwards signature filing: sink, slight compress + rotate, then deeper pile + skew settle.
  const heroY = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    prefersReducedMotion ? [0, 0, 0, 0] : [0, 14, 29, 42]
  );
  const heroRotate = useTransform(
    scrollYProgress,
    [0, 0.4, 0.75, 1],
    prefersReducedMotion ? [0, 0, 0, 0] : [0, -0.4, -1.1, -0.8]
  );
  const heroSkew = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [0, 0, 0] : [0, -0.6, -1.8]
  );
  const heroScale = useTransform(
    scrollYProgress,
    [0, 0.55, 1],
    prefersReducedMotion ? [1, 1, 1] : [1, 0.992, 0.985]
  );
  // Deeper navy pile shadow as it settles into the "tray" — shadow grows + shifts down/right
  const heroShadow = useTransform(scrollYProgress, [0, 0.45, 0.8, 1], 
    prefersReducedMotion 
      ? ['3px 3px 0 var(--ink)', '3px 3px 0 var(--ink)', '3px 3px 0 var(--ink)', '3px 3px 0 var(--ink)']
      : [
          '4px 4px 0 var(--ink)',
          '7px 11px 0 var(--navy-deep)',
          '11px 18px 1px rgba(11, 27, 60, 0.55)',
          '14px 24px 2px var(--navy-deep)',
        ]
  );
  // Legacy scalar for any consumers; real value lives in settleRef for Visualizer
  const heroScrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Keep refs in sync (Vercel best practice for hot animation paths)
  useEffect(() => { sensitivityRef.current = sensitivity; }, [sensitivity]);
  useEffect(() => { visualModeRef.current = visualMode; }, [visualMode]);

  const initAudio = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  }, []);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setAnalyzerNode(null);
  }, []);

  // Uses the dedicated Supertonic adapter (easy to swap later)
  const handleTranscription = async (audioBlob: Blob): Promise<string> => {
    try {
      return await transcribeWithSupertonic(audioBlob, supertonicUrl);
    } catch (err) {
      console.error('Supertonic transcription error:', err);
      // Friendly fallback so testing never feels broken
      return "The local Supertonic didn't catch that clearly. Give it another go?";
    }
  };

  const sendToAgent = async (transcript: string) => {
    setStatus('thinking');
    setAgentResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              parts: [{ type: 'text', text: transcript }],
            },
          ],
        }),
      });

      if (!res.ok) throw new Error('Chat backend error');

      // The route returns a UI message stream — for simplicity we read the last text
      const text = await res.text();
      // Very rough extraction for the demo (the real streaming UI message handling lives in ChatInterface)
      const clean = text
        .replace(/0:"|data:/g, ' ')
        .replace(/\\n/g, ' ')
        .trim()
        .slice(0, 420) || "We'll sort that for you. What's the main tool giving you grief right now?";

      setAgentResponse(clean);
      stampSignalRef.current = Date.now() + 7; // second clack for the filed response line (stagger feel)

      // Leak transcript + outcome so it can "file" into lower sections as persistent mail-received docket
      if (onMailFiled && transcript && clean) {
        onMailFiled(transcript, clean);
      }

      // Speak it (browser TTS for now — Supertonic local is for input)
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.rate = 0.96;
        utterance.pitch = 1.0;

        // Try to pick a decent Australian-ish voice if available
        const voices = window.speechSynthesis.getVoices();
        const aussie = voices.find(v =>
          /australia|en-au|au/i.test(v.lang || v.name)
        );
        if (aussie) utterance.voice = aussie;

        setStatus('speaking');

        utterance.onend = () => {
          setStatus('idle');
        };

        window.speechSynthesis.speak(utterance);
      } else {
        setStatus('idle');
      }
    } catch (err) {
      console.error(err);
      setAgentResponse("Something went sideways with the agent. The team will still sort it — leave your details below.");
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2400);
    }
  };

  const toggleListening = async () => {
    if (status === 'listening') {
      stopListening();
      setStatus('idle');
      return;
    }

    try {
      await initAudio();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;

      const source = audioContextRef.current!.createMediaStreamSource(stream);
      const analyzer = audioContextRef.current!.createAnalyser();
      analyzer.fftSize = 1024;
      source.connect(analyzer);
      setAnalyzerNode(analyzer);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setStatus('thinking');

        const transcript = await handleTranscription(audioBlob);
        setUserTranscript(transcript);
        stampSignalRef.current = Date.now(); // trigger stamp-pop clack in Visualizer canvas

        if (transcript && transcript.length > 3) {
          await sendToAgent(transcript);
        } else {
          setStatus('idle');
        }

        // Cleanup
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
        }
        setAnalyzerNode(null);
      };

      mediaRecorder.start();
      setStatus('listening');
      setUserTranscript('');
      setAgentResponse('');
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Microphone access is needed for the Voice Agent. Check your browser permissions.');
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setError(null);
      }, 2800);
    }
  };

  const replayLastResponse = () => {
    if (!agentResponse || status === 'speaking') return;

    const utterance = new SpeechSynthesisUtterance(agentResponse);
    utterance.rate = 0.96;

    setStatus('speaking');
    utterance.onend = () => setStatus('idle');
    window.speechSynthesis.speak(utterance);
  };

  const reset = () => {
    stopListening();
    setStatus('idle');
    setUserTranscript('');
    setAgentResponse('');
    setError(null);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  const isActive = status === 'listening' || status === 'speaking';

  return (
    <div className="relative w-full min-h-[92vh] flex flex-col bg-[var(--paper)] overflow-hidden font-sans">
      {/* Subtle paper grain */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(11,11,11,0.025) 0 1px, transparent 1px 4px)',
        }}
      />

      {/* Minimal top bar */}
      <div className="relative z-20 flex items-center justify-between px-6 md:px-12 pt-6 pb-4 border-b-2 border-[var(--ink)]">
        <BrandWordmark className="h-8" />
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink)]/60">
          The Voice Agent
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-12">
        {/* Small framing text — the "words" are intentionally minimal in the hero */}
        <div className="mb-8 text-center">
          <div className="inline-block font-mono text-xs uppercase tracking-[0.16em] bg-[var(--hi-yellow)] text-[var(--ink)] px-3 py-1 mb-4">
            Real. Local. No hype.
          </div>
          <h1 className="font-display text-[3.2rem] md:text-[4.5rem] leading-none tracking-[-0.04em] text-[var(--ink)]">
            Talk to <span className="hl-red">Good&apos;ai</span>
          </h1>
          <p className="mt-3 text-xl text-[var(--ink)]/80 max-w-md mx-auto">
            Speak your admin problem. We&apos;ll listen like a mate who actually gets it.
          </p>
        </div>

        {/* The Voice Agent surface — the actual product demo */}
        {/* HIGHEST-LEVERAGE Awwwards moment: physical mail "descent & filing" on scroll.
            Stamp shadow participates, ribbons damp, slight mechanical sink + rotation settle. 100% loyal to brutalist identity. */}
        <div className="w-full max-w-5xl" ref={heroStampRef}>
          <motion.div
            className="stamp-box relative overflow-hidden bg-[var(--paper-raised)] border-2 border-[var(--ink)]"
            style={{
              // Physical descent + filing: sinks, compresses, rotates and skews as "mailed into stack"
              y: heroY,
              rotate: heroRotate,
              skew: heroSkew, // additional paper edge torque as it settles
              scale: heroScale,
              boxShadow: heroShadow,
            }}
          >
            {/* Physical paper edge / docket curl layer — amplifies the filing metaphor with extra mechanical skew/rotation independent of main shell */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 border-l-[3px] border-t-[1px] border-[var(--ink)]/40 rounded-[3px]"
              style={{
                rotate: useTransform(scrollYProgress, [0, 0.6, 1], prefersReducedMotion ? [0,0,0] : [0, -1.4, -2.6]),
                skew: useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0,0] : [0, -2.1]),
                opacity: useTransform(scrollYProgress, [0, 0.25, 0.9, 1], [0.3, 0.65, 0.9, 0.75]),
                transformOrigin: 'left top',
              }}
            />
            {/* Visualizer header bar */}
            <div className="flex items-center justify-between border-b-2 border-[var(--ink)] bg-[var(--paper)] px-5 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 border-2 border-[var(--ink)]" />
                  <div className="w-2.5 h-2.5 border-2 border-[var(--ink)]" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink)]/70">
                  Acoustic Feed — Supertonic Local
                </span>
              </div>

              <StampButton
                variant="paper"
                size="sm"
                onClick={reset}
                className="font-mono uppercase tracking-[0.16em] gap-1.5"
                aria-label="Reset voice agent"
              >
                <RotateCcw size={14} aria-hidden="true" /> RESET
              </StampButton>
            </div>

            {/* Visualizer area */}
            <div className="relative h-[380px] md:h-[460px] bg-[var(--paper)]">
              <Visualizer
                analyzer={analyzerNode}
                active={isActive}
                status={status}
                sensitivityRef={sensitivityRef}
                modeRef={visualModeRef}
                settleRef={settleRef}
                stampSignalRef={stampSignalRef}
              />

              {/* Live status overlay — mechanical relay stamp */}
              <div className="absolute top-4 left-4 z-30">
                <div className="stamp-box inline-flex items-center gap-2 bg-[var(--paper)] border-2 border-[var(--ink)] px-4 py-1.5 font-mono text-xs uppercase tracking-[0.16em]">
                  {status === 'listening' && (
                    <span className="text-[var(--red)] stamp-relay font-bold">● LISTENING</span>
                  )}
                  {status === 'thinking' && (
                    <span className="text-[var(--ink)] tracking-[0.3em]">THINKING…</span>
                  )}
                  {status === 'speaking' && (
                    <span className="flex items-center gap-1.5 text-[var(--navy)] font-medium">
                      <Volume2 size={15} /> SPEAKING
                    </span>
                  )}
                  {status === 'idle' && <span className="text-[var(--ink)]/70">READY</span>}
                  {status === 'error' && <span className="text-[var(--warn)] font-bold">ISSUE</span>}
                </div>
              </div>

              {/* Mode controls — now full stamp-btn physics + stamp impression focus for keyboard */}
              <div className="absolute bottom-4 right-4 z-30 flex border-2 border-[var(--ink)] bg-[var(--paper)] text-[10px] font-mono uppercase font-bold overflow-hidden shadow-[2px_2px_0_var(--ink)]" role="group" aria-label="Visualizer mode">
                {(['calm', 'dynamic'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setVisualMode(m)}
                    aria-pressed={visualMode === m}
                    className={`stamp-btn stamp-btn-paper px-5 py-2 text-[10px] border-r-2 border-[var(--ink)] last:border-r-0 ${visualMode === m ? 'is-engaged bg-[var(--ink)] text-[var(--paper)]' : ''}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Transcript + Response area */}
            <div className="border-t-2 border-[var(--ink)] bg-[var(--paper)] p-6 space-y-5 min-h-[140px]">
              <AnimatePresence mode="wait">
                {userTranscript && (
                  <motion.div
                    initial={{ opacity: 0, y: -1, scale: 0.94, boxShadow: '1px 1px 0 var(--ink)' }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1.01, // slight mechanical overshoot clack (stamp landing)
                      boxShadow: '3px 3px 0 var(--ink)' 
                    }}
                    transition={{ duration: 0.12, ease: STAMP_EASE, delay: 0.01 }}
                    className="pl-1"
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink)]/60 mb-1">YOU SAID</div>
                    <p className="text-[var(--ink)] text-lg leading-snug">“{userTranscript}”</p>
                  </motion.div>
                )}

                {agentResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: -2, scale: 0.93, boxShadow: '1px 1px 0 var(--navy-deep)' }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: [1.02, 1], // fresh stamp pop + settle clack (hard cut, no float)
                      boxShadow: '4px 4px 0 var(--navy-deep)' 
                    }}
                    transition={{ duration: 0.135, ease: STAMP_EASE, times: [0, 1], delay: 0.03 }}
                    className="pl-1 pt-3 border-t border-[var(--cream-line)]"
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ocean-400)] mb-1.5">GOOD&apos;AI</div>
                    <p className="font-serif text-2xl leading-tight text-[var(--ink)]">“{agentResponse}”</p>

                    <StampButton
                      variant="paper"
                      size="sm"
                      onClick={replayLastResponse}
                      disabled={status === 'speaking'}
                      className="mt-4 font-mono uppercase tracking-widest"
                    >
                      <Volume2 size={15} aria-hidden="true" /> Replay in our voice
                    </StampButton>
                  </motion.div>
                )}
              </AnimatePresence>

              {!userTranscript && !agentResponse && status === 'idle' && (
                <div className="text-[var(--ink)]/60 text-sm pl-1">
                  Hold the button and speak naturally. The local Supertonic instance will transcribe it.
                </div>
              )}

              {error && <div className="text-[var(--warn)] text-sm pl-1">{error}</div>}
            </div>

            {/* Primary action bar — now using production <StampButton> primitive (exact 120ms physics, focus ring, keyboard parity, one red shout) */}
            <div className="border-t-2 border-[var(--ink)] bg-[var(--paper-raised)] p-5 flex justify-center">
              <StampButton
                variant="red"
                size="lg"
                engaged={status === 'listening'}
                onClick={toggleListening}
                disabled={status === 'thinking'}
                className="min-w-[280px] gap-3 text-lg tracking-[-0.01em] px-14 py-4 relative group"
                aria-label={status === 'listening' ? 'Stop listening' : 'Press to speak your problem'}
              >
                {/* Inner mechanical bevel for printed tactility (micro detail) */}
                <div 
                  className="absolute inset-0 rounded-[2px] pointer-events-none border border-white/15"
                  style={{ 
                    opacity: status === 'listening' ? 0.18 : 0.07,
                    boxShadow: status === 'listening' ? 'inset 2px 2px 0 rgba(0,0,0,0.3)' : 'inset 1px 1px 0 rgba(255,255,255,0.12)'
                  }} 
                />
                
                {status === 'listening' ? (
                  <>
                    <Square className="h-5 w-5" aria-hidden="true" /> STOP LISTENING
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 transition-transform group-active:scale-[0.92] duration-75" aria-hidden="true" /> PRESS TO SPEAK
                  </>
                )}
              </StampButton>
            </div>
          </motion.div>

          <p className="text-center mt-4 text-xs font-mono uppercase tracking-[0.16em] text-[var(--ink)]/50">
            Powered by your local Supertonic • Good&apos;ai persona • No data leaves your machine during testing
          </p>
        </div>
      </div>
    </div>
  );
}
