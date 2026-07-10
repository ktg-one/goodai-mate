'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, Volume2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { AudioVisualizer } from '@/components/voice-agent/AudioVisualizer';
import { BrandMark, BrandWordmark } from '@/components/brand/BrandWordmark';
import { CHARACTER_ASSETS } from '@/lib/brand-assets';
import StampButton from '@/components/StampButton';

type AgentStatus = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

interface GemVoiceProps {
  /** Leaks the "mail" (transcript + response) to parent for persistent docket / in-tray filing across sections */
  onMailFiled?: (transcript: string, response: string) => void;
}

/**
 * GemTalkingCharacter — Helper component inside gem-voice.tsx
 * Renders the 4-frame real-time mouth flapping avatar for Gem.
 */
function GemTalkingCharacter({ analyser, status }: { analyser: AnalyserNode | null; status: AgentStatus }) {
  const [frame, setFrame] = useState(1);
  const animationRef = useRef<number>(null);
  const statusRef = useRef(status);
  const frameRef = useRef(1);

  // Only touches React state when the frame actually changes, so the rAF
  // loop below doesn't force a re-render (VDOM diff + <img> src decode) on
  // every tick while speaking/listening.
  const applyFrame = useCallback((next: number) => {
    if (frameRef.current !== next) {
      frameRef.current = next;
      setFrame(next);
    }
  }, []);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    // If not active, reset to closed mouth (Frame 1)
    if (!analyser || (status !== 'speaking' && status !== 'listening')) {
      const timer = setTimeout(() => {
        applyFrame(1);
      }, 0);
      return () => clearTimeout(timer);
    }

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateFrame = () => {
      const now = Date.now();
      
      // Handle speaking lip-sync based on real audio frequencies
      if (statusRef.current === 'speaking' && analyser) {
        analyser.getByteFrequencyData(dataArray);
        
        let sum = 0;
        const limit = Math.floor(dataArray.length * 0.6); // Skip high frequency noise
        for (let i = 0; i < limit; i++) {
          sum += dataArray[i];
        }
        const avg = limit > 0 ? sum / limit : 0;
        const normalizedVolume = avg / 255;

        // Map volume threshold to 4 frames (1 = closed, 4 = wide open)
        let targetFrame = 1;
        if (normalizedVolume > 0.28) {
          targetFrame = 4;
        } else if (normalizedVolume > 0.16) {
          targetFrame = 3;
        } else if (normalizedVolume > 0.05) {
          targetFrame = 2;
        } else {
          targetFrame = 1;
        }
        applyFrame(targetFrame);
      }
      // Handle listening reaction (slight micro-jitter to show alertness)
      else if (statusRef.current === 'listening') {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length;

        // Slight alert response if user is making sound
        if (avg > 15) {
          applyFrame(now % 300 < 150 ? 2 : 1);
        } else {
          applyFrame(1);
        }
      }

      animationRef.current = requestAnimationFrame(updateFrame);
    };

    updateFrame();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, status, applyFrame]);

  // Handle subtle processing animation during 'thinking' state (slow breathing/humming)
  useEffect(() => {
    if (status !== 'thinking') return;

    const interval = setInterval(() => {
      applyFrame(frameRef.current === 1 ? 2 : 1);
    }, 450);

    return () => clearInterval(interval);
  }, [status, applyFrame]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[var(--paper)] p-4 select-none">
      {/* Outer brutalist frame for the avatar */}
      <div className="relative w-[340px] h-[340px] border-2 border-[var(--ink)] bg-[var(--gold-tint)] overflow-hidden shadow-[3px_3px_0_var(--ink)] flex items-center justify-center rounded-sm">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none opacity-[0.03] border border-[var(--ink)]" />
        
        {/* Neutral Stance Video Loop */}
        <video
          src={CHARACTER_ASSETS.gemLoop}
          loop
          autoPlay
          muted
          playsInline
          preload="auto"
          className={`absolute w-[90%] h-[90%] object-contain mix-blend-multiply transition-opacity duration-150 ${
            status === 'speaking' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        />

        {/* Real-time Lip Sync Image */}
        <img
          src={CHARACTER_ASSETS.gemFrame(frame)}
          alt="Gem avatar"
          className={`absolute w-[90%] h-[90%] object-contain transition-opacity duration-150 ${
            status === 'speaking' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            transform: status === 'speaking' && frame > 2 
              ? 'translateY(-2px) scale(1.01)' 
              : 'translateY(0px)'
          }}
        />

        {/* Dynamic Status Stamps */}
        <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 border border-[var(--ink)] bg-[var(--paper)] text-[9px] font-mono uppercase font-bold shadow-[1px_1px_0_var(--ink)]">
          AGENT: GEM
        </div>
        <div className={`absolute bottom-2 right-2 z-10 px-2 py-0.5 border border-[var(--ink)] text-[9px] font-mono uppercase font-bold shadow-[1px_1px_0_var(--ink)] ${
          status === 'speaking' 
            ? 'bg-[var(--gold)] text-[var(--ink)]' 
            : status === 'listening' 
              ? 'bg-[var(--red)] text-[var(--paper)]' 
              : 'bg-[var(--paper)] text-[var(--ink)]/50'
        }`}>
          {status}
        </div>
      </div>
    </div>
  );
}

/**
 * GemVoice
 * Dedicated Voice Agent demo for "Gem". Isolated to prevent AI conflicts.
 */
export function GemVoice({ onMailFiled }: GemVoiceProps) {
  const [status, setStatus] = useState<AgentStatus>('idle');
  const [userTranscript, setUserTranscript] = useState('');
  const [agentResponse, setAgentResponse] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [analyzerNode, setAnalyzerNode] = useState<AnalyserNode | null>(null);

  // ElevenLabs voice selection specifically for Gem
  const voiceOptions = [
    { id: 'jvcMcno3QtjOzGtfpjoI', name: "Gem (Default)" },
    { id: 'eppqEXVumQ3CfdndcIBd', name: "Claude Voice 1" },
    { id: 'fBD19tfE58bkETeiwUoC', name: "Claude Voice 2" },
    { id: 'WtA85syCrJwasGeHGH2p', name: "Claude Voice 3" },
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
  const [viewMode, setViewMode] = useState<'avatar' | 'wave'>('avatar');
  const [showLab, setShowLab] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const recognitionTranscriptRef = useRef<string>('');

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

  const heroStampRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroStampRef,
    offset: ['start 42%', 'end 72%'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--hero-filing-progress', latest.toFixed(3));
    }
  });

  const heroShadow = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [
    'drop-shadow(4px 4px 0 var(--ink))',
    'drop-shadow(6px 7px 0 var(--ink))',
    'drop-shadow(3px 9px 0 var(--navy-deep))',
    'drop-shadow(2px 11px 0 var(--navy-ink))',
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
      setError('Voice synthesis failed. Read instead?');
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

            let reply = "We'll sort that for you. Tell us a bit more about the tools you use.";
            try {
              const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  message: transcript.trim(),
                  model: selectedModelId,
                  agent: 'gem'
                }),
              });
              if (res.ok) {
                const data = await res.json();
                if (data.reply) {
                  reply = data.reply.trim();
                }
              }
            } catch (chatErr) {
              console.warn('Chat API failed, using default response:', chatErr);
            }

            setAgentResponse(reply);

            if (onMailFiled) {
              onMailFiled(transcript.trim(), reply);
            }

            speakReply(reply);
          } else {
            setError('No speech detected. Try again.');
            setStatus('idle');
          }
        } catch {
          setError('Could not reach the voice service. Using fallback.');
          setStatus('idle');
        }
      };

      mediaRecorder.start();
      setStatus('listening');
    } catch {
      setError('Microphone access needed. Allow mic access and try again.');
      setStatus('idle');
    }
  }, [onMailFiled, getAudioContext, selectedModelId, speakReply]);

  const reset = () => {
    stopListening();
    setStatus('idle');
    setUserTranscript('');
    setAgentResponse('');
    setError(null);
  };

  const isActive = status === 'listening' || status === 'speaking';

  return (
    <div ref={heroStampRef} className="w-full max-w-[620px] mx-auto px-4 md:px-0">
      <div className="relative">
        <div className="stamp-card stamp-card-navy p-6 relative rounded-sm">
          {/* Brutalist Docket Header */}
          <div className="border-b-2 border-[var(--ink)] pb-4 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BrandWordmark className="h-8" />
              <BrandMark variant="dark" className="h-5 opacity-60" />
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--paper)]/70">
              Voice intake
            </div>
          </div>

          {/* Dynamic Copy Area */}
          <div className="text-center mb-6">
            <span className="sticker-label sticker-label-gold mb-2">PERTH MATE</span>
            <h1 className="font-display text-[3.2rem] md:text-[4.5rem] leading-none tracking-[-0.04em] text-[var(--paper)]">
              Talk to <span className="hl-red">Gem</span>
            </h1>
            <p className="font-sans text-[15px] text-[var(--paper)]/80 max-w-[420px] mx-auto mt-2.5">
              Speak the admin mess once. Gem listens, replies, and files it into a real docket.
            </p>
          </div>

          {/* Core Interactive Card */}
          <motion.div
            className="stamp-box relative overflow-hidden bg-[var(--paper)] border-2 border-[var(--ink)]"
            style={{
              filter: heroShadow,
              boxShadow: 'none',
            }}
          >
            {/* Header / Reset Bar */}
            <div className="border-b-2 border-[var(--ink)] bg-[var(--paper)] px-5 py-3 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink)]/50">
                Acoustic Box
              </span>
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
            <div className="relative h-[420px] md:h-[520px] bg-[var(--paper)] overflow-hidden flex items-center justify-center">
              <img 
                src={CHARACTER_ASSETS.waveRibbon} 
                alt="" 
                aria-hidden 
                className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[68px] w-full object-cover mix-blend-multiply opacity-38" 
                style={{ transform: 'scaleY(0.7) translateY(calc(-50% + var(--hero-filing-progress, 0) * -7px))' }} 
              />
              <div className="absolute inset-0 z-10">
                <AudioVisualizer
                  analyser={analyzerNode}
                  active={isActive}
                  status={status}
                />
              </div>
              {viewMode === 'avatar' && (
                <div className="relative z-20">
                  <GemTalkingCharacter
                    analyser={analyzerNode}
                    status={status}
                  />
                </div>
              )}

              {/* Live status overlay */}
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

              {/* Mode controls */}
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

            {/* Transcript/Response Display */}
            <div className="border-t-2 border-[var(--ink)] bg-[var(--gold-tint)] p-5 min-h-[110px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {error ? (
                  <motion.div
                    key="err"
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    className="gai-error"
                  >
                    {error}
                  </motion.div>
                ) : status === 'idle' && !userTranscript ? (
                  <motion.p
                    key="prompt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    className="text-center font-mono text-xs uppercase tracking-[0.16em]"
                  >
                    System ready. Press speak to begin conversation.
                  </motion.p>
                ) : (
                  <motion.div
                    key="dialogue"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3 font-sans text-sm text-[var(--ink)]"
                  >
                    {userTranscript && (
                      <p className="flex gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink)]/40 mt-0.5">YOU:</span>
                        <span className="font-medium">{userTranscript}</span>
                      </p>
                    )}
                    {status === 'thinking' && (
                      <div className="gai-typing">
                        <span />
                        <span />
                        <span />
                      </div>
                    )}
                    {agentResponse && (
                      <p className="flex gap-2 border-t border-[var(--ink)]/5 pt-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--navy)] mt-0.5 font-bold">GEM:</span>
                        <span>{agentResponse}</span>
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Lab settings — collapsed for demo */}
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

            {/* Big red stamp CTA */}
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

          <p className="text-center mt-4 text-xs font-mono uppercase tracking-[0.16em] text-[var(--paper)]/60">
            Built in Perth · Voice intake demo
          </p>
        </div>
      </div>
    </div>
  );
}
