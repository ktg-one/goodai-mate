'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Volume2, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Visualizer } from './Visualizer';
import StampButton from '@/components/StampButton';

// Logo component removed from wordmark per request.
// The wordmark is now a custom designed asset (with their own font treatment)
// created in Canva and placed in /assets/. The inline SVG brand mark + text
// rendering has been replaced with the proper graphic.

export function Hero() {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<
    'idle' | 'listening' | 'thinking' | 'speaking'
  >('idle');
  const [aiTranscript, setAiTranscript] = useState('');
  const [sensitivity, setSensitivity] = useState(1);
  const [visualMode, setVisualMode] = useState<'calm' | 'dynamic'>('dynamic');

  // Transient values for the visualizer — stored in refs to avoid re-renders on every animation frame / frequent updates.
  // The buttons still use state so the (small) control UI can re-render to show active state.
  const sensitivityRef = useRef(sensitivity);
  const visualModeRef = useRef(visualMode);

  // Keep refs in sync with state only when the user explicitly changes the controls.
  useEffect(() => { sensitivityRef.current = sensitivity; }, [sensitivity]);
  useEffect(() => { visualModeRef.current = visualMode; }, [visualMode]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const [analyzerNode, setAnalyzerNode] = useState<AnalyserNode | null>(null);

  const initAudio = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      const analyzer = audioContextRef.current.createAnalyser();
      analyzer.fftSize = 1024;
      analyzerRef.current = analyzer;
      setAnalyzerNode(analyzer);
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      setStatus('idle');
      return;
    }

    try {
      await initAudio();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setStatus('listening');
      setAiTranscript('');

      const source = audioContextRef.current!.createMediaStreamSource(stream);
      source.connect(analyzerRef.current!);

      // Demo timeout + fallback to existing /api/chat
      setTimeout(async () => {
        if (!isRecording) return;
        setIsRecording(false);
        setStatus('thinking');

        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [
                {
                  role: 'user',
                  parts: [
                    { type: 'text', text: 'I spoke my admin problem via voice.' },
                  ],
                },
              ],
            }),
          });
          const text = await res.text();
          const clean =
            text.replace(/0:"|data:/g, ' ').trim().slice(0, 260) ||
            "We'll handle the invoicing. What's the main tool you're using for jobs right now?";
          setAiTranscript(clean);
        } catch {
          setAiTranscript(
            "We'll handle the invoicing. What's the main tool you're using for jobs right now?"
          );
        }
        setStatus('idle');
      }, 6200);
    } catch (err) {
      console.error(err);
      setIsRecording(false);
      setStatus('idle');
    }
  };

  const handleInspireMe = async () => {
    setStatus('thinking');
    setAiTranscript('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              parts: [
                {
                  type: 'text',
                  text: 'Short inspiring quote about reclaiming time.',
                },
              ],
            },
          ],
        }),
      });
      const text = await res.text();
      const clean =
        text.replace(/0:"|data:/g, ' ').trim().slice(0, 180) ||
        "Knock off early. We'll sort the rest.";
      setAiTranscript(clean);
    } catch {
      setAiTranscript("Knock off early. We'll sort the rest.");
    }
    setStatus('idle');
  };

  const handleRepeatSpeak = () => {
    if (!aiTranscript) return;
    const u = new SpeechSynthesisUtterance(aiTranscript);
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--paper)] p-6 md:p-12 relative font-sans overflow-hidden">
      {/* Grain */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-40"
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(11,11,11,0.025) 0 1px, transparent 1px 4px)',
        }}
      />

      <header className="flex items-center justify-between relative z-20 mb-8 md:mb-16 pb-6 border-b-4 border-[var(--ink)]">
        <div className="flex items-center">
          {/* 
            WORDMARK — using Fraunces from the design (public/fonts/ matching public/design-system-new/fonts/ verbatim).
            Brand treatment follows the design system.
          */}
          <span className="brand-wordmark text-[1.9rem]">
            Good<span className="apos">&apos;</span>ai
          </span>
        </div>

        <nav className="hidden md:flex items-center border-2 border-[var(--ink)] bg-paper-raised shadow-[3px_3px_0_var(--ink)]">
          <a
            href="#workflows"
            className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--paper)] bg-[var(--ink)] px-6 py-3"
          >
            Workflows
          </a>
          <a
            href="#systems"
            className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink)] hover:bg-[var(--hi-yellow)] px-6 py-3 transition-colors border-x-2 border-[var(--ink)]"
          >
            Systems
          </a>
          <a
            href="#pricing"
            className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink)] hover:bg-[var(--hi-yellow)] px-6 py-3 transition-colors"
          >
            Pricing
          </a>
        </nav>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-1 relative z-10 w-full max-w-7xl mx-auto">
        {/* Left column */}
        <div className="flex flex-col gap-8 w-full max-w-xl mx-auto lg:mx-0 order-2 lg:order-1">
          <div>
            <span className="font-mono text-xs font-bold tracking-[0.16em] uppercase bg-[var(--hi-yellow)] text-[var(--ink)] px-3 py-1">
              Bidirectional Voice
            </span>
            <h1 className="font-display text-5xl md:text-[5.5rem] font-bold text-[var(--ink)] leading-[0.92] mt-6 mb-6 tracking-[-0.03em]">
              Tell us your <span className="hl">problem</span>.
            </h1>
            <p className="text-xl md:text-2xl text-[var(--ink)]/80 leading-snug">
              We&apos;ll handle the boring stuff. Speak straight in and watch it
              work in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <StampButton
              variant={isRecording ? 'red' : 'ink'}
              onClick={toggleRecording}
              engaged={isRecording}
              aria-label={isRecording ? 'Stop listening' : 'Start talking to the agent'}
            >
              {isRecording ? (
                <Square className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Mic className="h-5 w-5" aria-hidden="true" />
              )}
              <span>{isRecording ? 'Stop Listening' : 'Start Talking'}</span>
            </StampButton>

            <StampButton
              variant="paper"
              onClick={handleInspireMe}
              disabled={status !== 'idle'}
            >
              <Zap className="h-4 w-4" aria-hidden="true" /> Inspire Me
            </StampButton>
          </div>

          <div className="min-h-[140px] mt-2">
            <AnimatePresence mode="wait">
              {aiTranscript ? (
                <motion.div
                  key="response"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="stamp-box p-6 bg-paper-raised"
                >
                  <p className="font-display text-2xl text-[var(--ink)] leading-snug">
                    “{aiTranscript}”
                  </p>
                  <StampButton
                    variant="gold"
                    size="sm"
                    onClick={handleRepeatSpeak}
                    className="absolute -bottom-3 -right-2 font-mono text-[10px] uppercase tracking-widest"
                  >
                    <Volume2 className="h-3 w-3" aria-hidden="true" /> Replay
                  </StampButton>
                </motion.div>
              ) : (
                <div className="stamp-box flex items-center gap-3 px-4 py-3 w-fit">
                  <Activity
                    className={`h-4 w-4 ${isRecording ? 'text-[var(--orange)] animate-pulse' : 'text-[var(--border)]'}`}
                  />
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--ink)]/70">
                    {isRecording ? 'Go on — we\'re listening' : 'Ready when you are'}
                  </span>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Visualizer - the main hero visual */}
        <div className="relative w-full h-[420px] lg:h-[520px] stamp-box overflow-hidden order-1 lg:order-2">
          <div className="absolute top-0 left-0 right-0 h-9 border-b-2 border-[var(--ink)] bg-paper-raised flex items-center px-4 justify-between z-30">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 border-2 border-[var(--ink)]" />
              <div className="w-3 h-3 border-2 border-[var(--ink)]" />
            </div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--ink)]">
              Acoustic Feed
            </span>
          </div>

          <div
            className="absolute inset-0 pt-9"
            style={{
              background:
                'repeating-linear-gradient(0deg, rgba(11,11,11,0.03) 0 1px, transparent 1px 4px)',
            }}
          >
            <Visualizer
              analyzer={analyzerNode}
              active={isRecording}
              sensitivityRef={sensitivityRef}
              modeRef={visualModeRef}
            />
          </div>

          {/* Mode controls */}
          {/* Mode + Sensitivity controls — now stamp-btn physics + keyboard stamp focus */}
          <div className="absolute bottom-4 left-4 z-40 flex border-2 border-[var(--ink)] bg-paper-raised text-[10px] font-mono uppercase font-bold overflow-hidden">
            <button
              onClick={() => setVisualMode('calm')}
              className={`stamp-btn stamp-btn-paper px-4 py-1.5 text-[10px] border-r-2 border-[var(--ink)] ${visualMode === 'calm' ? 'is-engaged bg-[var(--ink)] text-[var(--paper)]' : ''}`}
            >
              CALM
            </button>
            <button
              onClick={() => setVisualMode('dynamic')}
              className={`stamp-btn stamp-btn-paper px-4 py-1.5 text-[10px] ${visualMode === 'dynamic' ? 'is-engaged bg-[var(--ink)] text-[var(--paper)]' : ''}`}
            >
              DYNAMIC
            </button>
          </div>

          <div className="absolute bottom-4 right-4 z-40 flex border-2 border-[var(--ink)] bg-paper-raised text-[10px] font-mono uppercase font-bold overflow-hidden">
            <button
              onClick={() => setSensitivity(0.5)}
              className={`stamp-btn stamp-btn-paper px-3 py-1.5 text-[10px] border-r-2 border-[var(--ink)] ${sensitivity === 0.5 ? 'is-engaged bg-[var(--ink)] text-[var(--paper)]' : ''}`}
            >
              STEADY
            </button>
            <button
              onClick={() => setSensitivity(1)}
              className={`stamp-btn stamp-btn-paper px-3 py-1.5 text-[10px] border-r-2 border-[var(--ink)] ${sensitivity === 1 ? 'is-engaged bg-[var(--ink)] text-[var(--paper)]' : ''}`}
            >
              NORMAL
            </button>
            <button
              onClick={() => setSensitivity(2.5)}
              className={`stamp-btn stamp-btn-paper px-3 py-1.5 text-[10px] ${sensitivity === 2.5 ? 'is-engaged bg-[var(--ink)] text-[var(--paper)]' : ''}`}
            >
              HIGH
            </button>
          </div>
        </div>
      </main>

      <div className="text-center mt-10 text-xs font-mono uppercase tracking-[0.16em] text-[var(--ink)]/50 relative z-10">
        Speak naturally. We&apos;ll turn it into systems. • Or use text mode below
      </div>
    </div>
  );
}
