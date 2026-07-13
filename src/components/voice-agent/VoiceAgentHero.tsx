'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, Volume2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { AudioVisualizer } from '@/components/voice-agent/AudioVisualizer';
// Supertonic import removed
import { BrandMark, BrandWordmark } from '@/components/brand/BrandWordmark';
import { CHARACTER_ASSETS } from '@/lib/brand-assets';
import { TalkingCharacter } from '@/components/voice-agent/TalkingCharacter';
import StampButton from '@/components/StampButton';

// Mechanical stamp easing (canon design system)
const STAMP_EASE = [0.23, 1, 0.32, 1] as const;

/**
 * VoiceAgentHero
 * The new flagship product experience for the Good'ai marketing site.
 * Pure functional Voice Agent demo as the hero (no marketing copy inside).
 *
 * Uses browser SpeechRecognition for high-quality, free client-side ASR.
 * Falls back gracefully. Wires into the existing /api/chat + Good'ai persona.
 *
 * Brand: Brutalist stamp aesthetic, one red per surface, paper ribbons.
 * wave-ribbon.png integrated as design signal / waveform layer in the acoustic box (verbatim from design system).
 */

type AgentStatus = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

interface VoiceAgentHeroProps {
  /** Leaks the "mail" (transcript + response) to parent for persistent docket / in-tray filing across sections */
  onMailFiled?: (transcript: string, response: string) => void;
  /** Compact mode when embedded inside VoiceAgentDemo (no duplicate chrome) */
  embedded?: boolean;
}

export function VoiceAgentHero({ onMailFiled, embedded = false }: VoiceAgentHeroProps) {
  const [status, setStatus] = useState<AgentStatus>('idle');
  const [selectedAgent, setSelectedAgent] = useState<'darl' | 'robokev'>('darl');
  const [userTranscript, setUserTranscript] = useState('');
  const [agentResponse, setAgentResponse] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [analyzerNode, setAnalyzerNode] = useState<AnalyserNode | null>(null);
  const [viewMode, setViewMode] = useState<'avatar' | 'wave'>('avatar');
  const [showLab, setShowLab] = useState(false);

  // ElevenLabs voice selection — "a few to try"
  const voiceOptions = [
    { id: 'vr54y8Xovf4AEnfNrGqH', name: 'vr54 (Darl)' },
    { id: 'jvcMcno3QtjOzGtfpjoI', name: 'jvc (RoboKev)' },
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },
    { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni' },
  ];
  const [selectedVoiceId, setSelectedVoiceId] = useState(voiceOptions[0].id);
  const [customVoiceId, setCustomVoiceId] = useState('');
  const [isCustomVoiceActive, setIsCustomVoiceActive] = useState(false);

  // Vercel AI Gateway model selection
  const modelOptions = [
    { id: 'deepseek/deepseek-v4-flash', name: 'DeepSeek V4 Flash' },
    { id: 'google/gemini-1.5-pro', name: 'Gemini 1.5 Pro (Google)' },
    { id: 'groq/llama3-70b-8192', name: 'Llama 3 70B (Groq)' },
    { id: 'anthropic/claude-sonnet-4-20250514', name: 'Claude 3.5 Sonnet' },
  ];
  const [selectedModelId, setSelectedModelId] = useState(modelOptions[0].id);

  // Sync default voice ID when selected agent changes
  useEffect(() => {
    if (selectedAgent === 'darl') {
      setIsCustomVoiceActive(false);
      setSelectedVoiceId('vr54y8Xovf4AEnfNrGqH');
    } else if (selectedAgent === 'robokev') {
      setIsCustomVoiceActive(false);
      setSelectedVoiceId('jvcMcno3QtjOzGtfpjoI');
    }
  }, [selectedAgent]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  // Single persistent AudioContext shared by mic (listening) AND TTS (speaking).
  // Created once, resumed if suspended; disconnected (never closed) so it survives reuse.
  const audioContextRef = useRef<AudioContext | null>(null);
  // Mic MediaStreamSource — disconnected on stop without tearing down the context.
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const recognitionTranscriptRef = useRef<string>('');

  // Lazily create-once the shared AudioContext; resume if suspended. Returns the live ctx.
  const getAudioContext = useCallback((): AudioContext => {
    if (!audioContextRef.current) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new Ctx();
    }
    if (audioContextRef.current.state === 'suspended') {
      void audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  // === HERO DESCENT SCROLL PHYSICS (signature Awwwards move) ===
  // The stamp-box "files itself" into the mail stack as you scroll. Shadows + ribbons react.
  // Mechanical, not floaty. Power curves + hard stops. Shadows participate. Paper edges curl.
  const heroStampRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroStampRef,
    offset: ['start 42%', 'end 72%'],
  });

  // Settle ref for 60fps hot path to Visualizer (no re-renders, no effect restarts)
  // ALSO publishes --hero-filing-progress CSS var (0-1) so the entire mail-board (ribbons, dockets, stamps)
  // can participate in physical "ink soak / shadow depth / paper settle" as the stamp-box descends.
  // One source of truth. 60fps. No additional scroll listeners.
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    // Global participation in the filing ritual (brand: every docket feels the weight of the hero mail dropping)
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--hero-filing-progress', latest.toFixed(3));
    }
  });

  // Subtle "filing" sink + shadow depth only. Rotate/scale/skew were removed — they
  // tilted and compressed the whole card on scroll, which read as the card "warping".
  // Reduced-motion users get a fully static card (no sink).
  const heroY = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], prefersReducedMotion ? [0, 0, 0, 0] : [0, 22, 52, 85]);
  const heroShadow = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [
    '4px 4px 0 var(--ink)',
    '6px 7px 0 var(--ink)',
    '3px 9px 0 var(--navy-deep)',
    '2px 11px 0 var(--navy-ink)',
  ]);

  const speakReply = useCallback(async (text: string, overrideVoiceId?: string) => {
    if (!text) return;

    const vId = overrideVoiceId || selectedVoiceId;
    setStatus('speaking');

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: vId }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'TTS request failed');
      }

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      const ctx = getAudioContext();
      const src = ctx.createMediaElementSource(audio);
      const ttsAnalyser = ctx.createAnalyser();
      ttsAnalyser.fftSize = 128;
      ttsAnalyser.smoothingTimeConstant = 0.75;
      src.connect(ttsAnalyser);
      ttsAnalyser.connect(ctx.destination);

      const cleanup = () => {
        src.disconnect();
        ttsAnalyser.disconnect();
        setAnalyzerNode(null);
      };

      audio.onended = () => {
        cleanup();
        setStatus('idle');
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        cleanup();
        setStatus('idle');
        setError('Voice playback failed.');
        URL.revokeObjectURL(audioUrl);
      };

      setAnalyzerNode(ttsAnalyser);
      setStatus('speaking');
      await audio.play();
    } catch {
      setStatus('idle');
      setError('Voice playback failed. Read the reply below.');
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [selectedVoiceId, getAudioContext]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping speech recognition:', err);
      }
      recognitionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    // Disconnect the mic source but KEEP the shared AudioContext alive for TTS reuse.
    micSourceRef.current?.disconnect();
    micSourceRef.current = null;
    setAnalyzerNode(null);
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    setUserTranscript('');
    setAgentResponse('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = getAudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      micSourceRef.current = source;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.7;
      source.connect(analyser);
      setAnalyzerNode(analyser);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      // Set up native browser SpeechRecognition (ASR)
      const SpeechRecognition = typeof window !== 'undefined'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
        : null;

      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';
        recognitionTranscriptRef.current = '';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rec.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              recognitionTranscriptRef.current = event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          if (!recognitionTranscriptRef.current && interimTranscript) {
            recognitionTranscriptRef.current = interimTranscript;
          }
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rec.onerror = (e: any) => {
          console.warn('Browser SpeechRecognition error:', e);
        };

        recognitionRef.current = rec;
        try {
          rec.start();
        } catch (err) {
          console.warn('Failed to start SpeechRecognition:', err);
        }
      }

      mediaRecorder.onstop = async () => {
        setStatus('thinking');
        try {
          const transcript = recognitionTranscriptRef.current || '';
          if (transcript && transcript.trim()) {
            setUserTranscript(transcript.trim());

            // Call the real chat API (Good'ai persona)
            const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                message: transcript.trim(),
                model: selectedModelId,
                agent: selectedAgent
              }),
            });
            const data = await res.json();
            const reply = (data.reply || "We'll sort that for you. Tell us a bit more about the tools you use.").trim();
            setAgentResponse(reply);

            // Leak the mail to parent for physical in-tray + docket filing
            if (onMailFiled) {
              onMailFiled(transcript.trim(), reply);
            }

            // Speak the reply (brand voice, local)
            speakReply(reply);
          } else {
            setError('No speech detected. Try again.');
          }
        } catch {
          setError('Could not reach the voice service. Using fallback.');
          // Fallback reply so the flow still "files" a docket
          const fallback = "We'll sort the boring stuff. Drop us a line and we'll set up the intake.";
          setAgentResponse(fallback);
          if (onMailFiled && userTranscript) onMailFiled(userTranscript, fallback);
          speakReply(fallback);
        } finally {
          setStatus('idle');
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
          // Disconnect mic source but KEEP the shared context alive for TTS reuse.
          micSourceRef.current?.disconnect();
          micSourceRef.current = null;
          setAnalyzerNode(null);
        }
      };

      mediaRecorder.start();
      setStatus('listening');
    } catch {
      setError('Microphone access needed. Allow mic access and try again.');
      setStatus('idle');
    }
  }, [onMailFiled, userTranscript, getAudioContext, selectedModelId, selectedAgent, speakReply]);

  const replayLastResponse = () => {
    if (agentResponse) speakReply(agentResponse);
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
    <div className={`relative w-full flex flex-col overflow-hidden font-sans ${embedded ? '' : 'min-h-screen bg-[var(--paper)]'}`}>

      {!embedded && (
        <div className="relative z-20 flex items-center justify-between px-6 md:px-12 pt-6 pb-4 border-b-2 border-[var(--ink)]">
          <div className="flex items-center gap-2.5">
            <BrandWordmark className="h-8" />
            <BrandMark variant="dark" className="h-5 opacity-60" />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink)]/60">
            Voice intake
          </div>
        </div>
      )}

      <div className={`relative z-10 flex-1 flex flex-col items-center px-6 md:px-12 ${embedded ? 'pt-0' : 'pt-6 md:pt-10'}`}>
        {!embedded && (
          <div className="mb-6 text-center">
            <span className="sticker-label sticker-label-gold mb-2">PERTH MATE</span>
            <div className="flex justify-center gap-2 mb-4 font-mono text-[10px]">
              <StampButton
                variant="paper"
                size="sm"
                engaged={selectedAgent === 'darl'}
                onClick={() => setSelectedAgent('darl')}
                aria-label="Use Darl assistant persona"
              >
                Darl
              </StampButton>
              <StampButton
                variant="paper"
                size="sm"
                engaged={selectedAgent === 'robokev'}
                onClick={() => setSelectedAgent('robokev')}
                aria-label="Use RoboKev voice persona"
              >
                RoboKev
              </StampButton>
            </div>
            <h1 className="font-display text-[3.2rem] md:text-[4.5rem] leading-none tracking-[-0.04em] text-[var(--ink)]">
              Talk to <span className="hl-red">Good&apos;ai</span>
            </h1>
            <p className="mt-3 text-xl text-[var(--ink)]/80 max-w-md mx-auto">
              Speak your admin problem. We&apos;ll listen like a mate who actually gets it.
            </p>
          </div>
        )}

        {/* The Voice Agent surface — the actual product demo */}
        {/* HIGHEST-LEVERAGE Awwwards moment: physical mail "descent & filing" on scroll.
            Stamp shadow participates, ribbons damp, slight mechanical sink + rotation settle. 100% loyal to brutalist identity. */}
        {embedded && (
          <div className="flex justify-center gap-2 mb-4 font-mono text-[10px] w-full max-w-5xl">
            <StampButton
              variant="paper"
              size="sm"
              engaged={selectedAgent === 'darl'}
              onClick={() => setSelectedAgent('darl')}
            >
              Darl
            </StampButton>
            <StampButton
              variant="paper"
              size="sm"
              engaged={selectedAgent === 'robokev'}
              onClick={() => setSelectedAgent('robokev')}
            >
              RoboKev
            </StampButton>
          </div>
        )}

        <div className="w-full max-w-5xl mt-4 md:mt-6" ref={embedded ? undefined : heroStampRef}>
          <motion.div
            className="stamp-box relative overflow-hidden bg-[var(--paper)] border-2 border-[var(--ink)]"
            style={{
              // Physical descent + filing: gentle sink + deepening shadow as "mailed into stack".
              // Rotate/scale removed — they warped the card (and its canvas/text) on scroll.
              y: heroY,
              boxShadow: heroShadow,
            }}
          >
            {/* Physical paper edge / docket curl layer — static border overlay that fades in
                as the card files down. Rotate/skew removed (they warped the frame on scroll). */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 border-l-[3px] border-t-[1px] border-[var(--ink)]/40 rounded-[3px]"
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.25, 0.9, 1], [0.3, 0.65, 0.9, 0.75]),
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
                  Acoustic box
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

            {/* Visualizer area — wave-ribbon.png added verbatim as design signal / waveform layer (Brutalist Skill.html example, multiply blend, scaleY(0.7), participates in filing) */}
            <div className="relative h-[420px] md:h-[520px] bg-[var(--paper)] overflow-hidden flex items-center justify-center">
              <img 
                src={CHARACTER_ASSETS.waveRibbon} 
                alt="" 
                aria-hidden 
                className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[68px] w-full object-cover mix-blend-multiply opacity-38" 
                style={{ transform: 'scaleY(0.7) translateY(calc(-50% + var(--hero-filing-progress, 0) * -7px))' }} 
              />
              <div className={`absolute inset-0 z-10 ${viewMode === 'avatar' ? 'opacity-30' : 'opacity-100'}`}>
                <AudioVisualizer
                  analyser={analyzerNode}
                  active={isActive}
                  status={status}
                />
              </div>
              {viewMode === 'avatar' && (
                <div className="relative z-20">
                  <TalkingCharacter
                    analyser={analyzerNode}
                    status={status}
                    agent={selectedAgent === 'robokev' ? 'robokev' : 'darl'}
                  />
                </div>
              )}

              {/* Live status overlay — mechanical relay stamp */}
              <div className="absolute top-4 left-4 z-30">
                <div className="stamp-box inline-flex items-center gap-2 bg-[var(--paper)] border-2 border-[var(--ink)] px-4 py-1.5 font-mono text-xs uppercase tracking-[0.16em]" role="status" aria-live="polite">
                  {status === 'listening' && (
                    <span className="text-[var(--coral)] stamp-relay font-bold">● LISTENING</span>
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

              {/* Mode controls — SSOT StampButton (paper variant) with engaged + focus die ring, keyboard parity. Grouped segmented. */}
              <div className="absolute bottom-4 right-4 z-30 flex border-2 border-[var(--ink)] bg-[var(--paper)] text-[10px] font-mono uppercase font-bold overflow-hidden shadow-[2px_2px_0_var(--ink)]" role="group" aria-label="Visualizer mode">
                {(['avatar', 'wave'] as const).map((m) => (
                  <StampButton
                    key={m}
                    variant="paper"
                    size="sm"
                    engaged={viewMode === m}
                    onClick={() => setViewMode(m)}
                    aria-pressed={viewMode === m}
                    className={`px-5 py-2 text-[10px] border-r-2 border-[var(--ink)] last:border-r-0 ${viewMode === m ? 'bg-[var(--ink)] text-[var(--paper)]' : ''}`}
                  >
                    {m}
                  </StampButton>
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
                      scale: [1.02, 1], 
                      boxShadow: '4px 4px 0 var(--ink)' 
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
                    initial={{ opacity: 0, y: 1, scale: 0.96, boxShadow: '1px 1px 0 var(--ink)' }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1, 
                      boxShadow: '3px 3px 0 var(--ink)' 
                    }}
                    transition={{ duration: 0.1, ease: STAMP_EASE }}
                    className="pl-1"
                  >
                    <div className="font-mono text-[10px] tracking-[0.16em] text-[var(--navy)]/70 mb-1">Good<span className="text-[var(--coral)]">&rsquo;</span>ai</div>
                    <p className="text-[var(--ink)] text-[15px] leading-snug">“{agentResponse}”</p>
                    <button onClick={replayLastResponse} className="mt-1 text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--navy)]/60 hover:text-[var(--navy)] underline decoration-1 underline-offset-2">Replay voice</button>
                  </motion.div>
                )}
              </AnimatePresence>
              {!userTranscript && !agentResponse && (
                <div className="text-[var(--ink)]/60 text-sm pl-1">Press the button and speak naturally. The browser will transcribe your voice locally.</div>
              )}
              {error && (
                <div className="text-[var(--warn)] text-sm pl-1 font-medium">{error}</div>
              )}
            </div>

            <div className="border-t-2 border-[var(--ink)] bg-[var(--paper)] px-5 py-2 flex justify-end">
              <StampButton
                variant="paper"
                size="sm"
                engaged={showLab}
                onClick={() => setShowLab((v) => !v)}
                className="font-mono text-[10px] uppercase tracking-[0.16em]"
                aria-expanded={showLab}
              >
                {showLab ? 'Hide lab settings' : 'Lab settings'}
              </StampButton>
            </div>
            {showLab && (
              <>
                <div className="border-t-2 border-[var(--ink)] bg-[var(--paper)] px-5 py-3 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink)]/60 mr-1">Backend</span>
                  {modelOptions.map((m) => (
                    <StampButton
                      key={m.id}
                      variant="paper"
                      size="sm"
                      engaged={selectedModelId === m.id}
                      onClick={() => setSelectedModelId(m.id)}
                      className="text-[10px] px-3 py-1"
                    >
                      {m.name}
                    </StampButton>
                  ))}
                </div>
                <div className="border-t-2 border-[var(--ink)] bg-[var(--paper)] px-5 py-3 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink)]/60 mr-1">Voice</span>
                  {voiceOptions.map((v) => (
                    <StampButton
                      key={v.id}
                      variant="paper"
                      size="sm"
                      engaged={selectedVoiceId === v.id && !isCustomVoiceActive}
                      onClick={() => {
                        setIsCustomVoiceActive(false);
                        setSelectedVoiceId(v.id);
                        if (agentResponse) speakReply(agentResponse, v.id);
                      }}
                      className="text-[10px] px-3 py-1"
                    >
                      {v.name}
                    </StampButton>
                  ))}
                  <StampButton
                    variant="paper"
                    size="sm"
                    engaged={isCustomVoiceActive}
                    onClick={() => {
                      setIsCustomVoiceActive(true);
                      if (customVoiceId) {
                        setSelectedVoiceId(customVoiceId);
                        if (agentResponse) speakReply(agentResponse, customVoiceId);
                      }
                    }}
                    className="text-[10px] px-3 py-1"
                  >
                    Custom ID
                  </StampButton>
                  {isCustomVoiceActive && (
                    <input
                      type="text"
                      placeholder="Voice ID…"
                      value={customVoiceId}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        setCustomVoiceId(val);
                        setSelectedVoiceId(val);
                      }}
                      className="font-mono text-[10px] bg-[var(--paper-deep)] border-2 border-[var(--ink)] px-2 py-1 max-w-[200px] text-[var(--ink)] focus:outline-none"
                    />
                  )}
                </div>
              </>
            )}

            {/* Big red stamp CTA — one red per surface, full physics */}
            <div className="border-t-2 border-[var(--ink)] bg-[var(--gold-tint)] p-5 flex justify-center">
              <StampButton
                variant="red"
                size="lg"
                engaged={status === 'listening'}
                onClick={isActive ? stopListening : startListening}
                className="min-w-[280px] gap-3 text-lg tracking-[-0.01em] px-14 py-4 relative group"
                aria-label={isActive ? "Stop listening" : "Press to speak your problem"}
              >
                <div className="absolute inset-0 rounded-[2px] pointer-events-none border border-white/15" style={{ opacity: 0.07, boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.12)' }} />
                {isActive ? (
                  <>
                    <Square size={18} aria-hidden="true" className="transition-transform group-active:scale-[0.92] duration-75" /> STOP
                  </>
                ) : (
                  <>
                    <Mic size={18} aria-hidden="true" className="transition-transform group-active:scale-[0.92] duration-75" /> PRESS TO SPEAK
                  </>
                )}
              </StampButton>
            </div>
          </motion.div>

          {!embedded && (
            <p className="text-center mt-4 text-xs font-mono uppercase tracking-[0.16em] text-[var(--ink)]/50">
              Built in Perth · Voice intake demo
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
