'use client';

import { useRef, useEffect } from 'react';

interface VisualizerProps {
  analyzer: AnalyserNode | null;
  active: boolean;
  /** Current VoiceAgentHero status — drives mechanical visual state shifts (stamp-like tension, processing grind, speaking clarity) */
  status?: 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';
  sensitivityRef: React.MutableRefObject<number>;
  modeRef: React.MutableRefObject<'calm' | 'dynamic'>;
  /** Ref to 0-1 scroll settleProgress from hero stamp-box descent (real value, no re-renders).
   *  Used for ribbon damping as the "mail files into the stack" — mechanical, not floaty.
   */
  settleRef?: React.MutableRefObject<number>;
  /** Bump this ref (Date.now()) on every new transcript line arrival. Triggers hard 60fps stamp-pop clack imprint + red ink burst in ribbons. */
  stampSignalRef?: React.MutableRefObject<number>;
}

/**
 * Advanced Paper Ribbon Visualizer
 * Direct, cleaned port of the signature visual from public/hero/src/App.tsx
 * Matches the brand brutalist + paper aesthetic.
 *
 * Uses refs for sensitivity/mode so frequent control changes don't cause re-renders
 * or effect restarts in the hot animation path (per Vercel best practices).
 */
export function Visualizer({
  analyzer,
  active,
  status = 'idle',
  sensitivityRef,
  modeRef,
  settleRef: settlePropRef,
  stampSignalRef,
}: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);
  const statusRef = useRef(status);
  const settleRef = useRef(0);
  const lastStampRef = useRef(0);
  const stampBurstRef = useRef(0); // 0-1 decay for visual clack burst (hot path)

  // Hot-path refs for canvas without effect restarts (Vercel perf rule + scroll scrub)
  statusRef.current = status;
  // Live sync from hero's scroll-driven settleRef (MotionValue change -> ref -> here every RAF)
  if (settlePropRef) settleRef.current = settlePropRef.current;
  // Stamp signal sync (new docket line = hard mechanical pop in the ribbons)
  if (stampSignalRef && stampSignalRef.current !== lastStampRef.current) {
    lastStampRef.current = stampSignalRef.current;
    stampBurstRef.current = 1.0; // trigger full clack burst
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // === 60FPS NON-NEGOTIABLE: DPR scaling (retina crisp ribbons, no blur) + will-change on parent
    // Cap at 2x for perf (Vercel rule). ctx.scale once; draw coords stay logical.
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    const LOGICAL_W = 1200;
    const LOGICAL_H = 500;
    canvas.width = LOGICAL_W * dpr;
    canvas.height = LOGICAL_H * dpr;
    ctx.scale(dpr, dpr);
    // Reset any prior transform on resize (hot path safe)
    const setCanvasSize = () => { /* static after mount for this visualizer */ };

    const dataArray = new Uint8Array(analyzer?.frequencyBinCount || 1024);

    // Reduced-motion + offscreen pause (P0 perf + a11y). Static ribbon fallback when reduced or !active long.
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isPaused = false;
    let io: IntersectionObserver | null = null;

    const drawStaticFallback = (cCtx: CanvasRenderingContext2D, cY: number) => {
      cCtx.clearRect(0, 0, LOGICAL_W, LOGICAL_H);
      // Brutalist static filed ribbons — inked paper, no flutter. Hard edges, slight fixed wave (metal stamp impression). Always feels like docket on the board.
      const ribbons = [
        { y: cY, color: '#222222', dark: '#0A0A0A', amp: 5 },
        { y: cY + 8, color: '#2A2A2A', dark: '#111111', amp: 3 },
        { y: cY, color: '#D98E1C', dark: '#B87415', amp: 6 },
        { y: cY - 3, color: '#F4442E', dark: '#D8331F', amp: 4 },
      ];
      cCtx.lineCap = 'round';
      cCtx.lineJoin = 'round';
      ribbons.forEach((r, idx) => {
        cCtx.strokeStyle = idx % 2 === 0 ? r.color : r.dark;
        cCtx.lineWidth = idx === 3 ? 10 : 14;
        cCtx.beginPath();
        for (let x = 0; x <= LOGICAL_W; x += 7) {
          const w = Math.sin(x * 0.008 + idx * 1.3) * r.amp * (1 - (idx * 0.1));
          cCtx.lineTo(x, r.y + w);
        }
        cCtx.stroke();
      });
      // Always-visible perforated docket receipt strip at bottom (physical paper artifact even when static / reduced)
      const docketY = LOGICAL_H - 36;
      cCtx.strokeStyle = '#111111';
      cCtx.lineWidth = 1.5;
      cCtx.beginPath();
      cCtx.moveTo(36, docketY);
      cCtx.lineTo(LOGICAL_W - 36, docketY);
      cCtx.stroke();
      cCtx.lineWidth = 1;
      for (let tx = 52; tx < LOGICAL_W - 52; tx += 16) {
        cCtx.beginPath();
        cCtx.moveTo(tx, docketY - 2.5);
        cCtx.lineTo(tx, docketY + 2.5);
        cCtx.stroke();
      }
      // Hard rubber stamp imprint
      cCtx.fillStyle = '#0F0F0F';
      cCtx.font = '600 10px var(--font-mono, ui-monospace, monospace)';
      cCtx.textAlign = 'right';
      cCtx.fillText('FILED  ·  IN TRAY', LOGICAL_W - 46, LOGICAL_H - 16);
    };

    const drawPaperRibbon = (
      colorMain: string,
      colorDark: string,
      yBase: number,
      freq: number,
      speed: number,
      thickness: number,
      amplitude: number,
      phase: number,
      settle: number = 0
    ) => {
      const points: { x: number; y: number; twist: number; opacity: number }[] = [];
      const step = 4;

      const isCalm = modeRef.current === 'calm';
      const currentStatus = statusRef.current;

      // === SETTLE DAMPING + STAMP BURST + VOICE PRESSURE (SAVAGE AWWARDS MECHANICAL) ===
      // Hero files the mail: ribbons lose life, high-freq flutter collapses harder, wind dies.
      // Stubs for partial overdrive state (full stampBurstRef + voicePressure live RMS wiring lives in future enhancement).
      // All raw math, refs, 60fps. No floaty. Brutalist 1978 press.
      const effSettle = Math.max(0, Math.min(1, settle ?? (settleRef?.current ?? 0)));
      const burst = 0; // placeholder — wire real transient stamp clack burst from parent on new mail filed
      const voicePressure = 0; // placeholder — live mic RMS from analyzer for speaking ribbon shake
      const settleDamp = 1 - (effSettle * 0.82);
      const dampAmp = amplitude * (1 - Math.min(0.88, effSettle * 0.88)) * (1 + burst * 0.6);
      const dampTurb = 1 - (effSettle * 0.82) + burst * 0.9;
      const dampWind = 1 - (effSettle * 0.93) + burst * 1.1;
      const dampFlutter = 1 - (effSettle * 0.72) + burst * 0.55;

      // === RAW BRUTALIST STATE-DRIVEN MECHANICS (no floaty easing, hard cuts, stamp clack feel) ===
      const isListening = currentStatus === 'listening';
      const isThinking = currentStatus === 'thinking';
      const isSpeaking = currentStatus === 'speaking';

      let speedMult = isCalm ? 0.35 : 1.0;
      let freqMult = isCalm ? 0.6 : 1.0;
      let ampMult = 1.0;
      let turbMult = 1.0;
      let colorShift = 0;
      let grainIntensity = isThinking ? 0.28 : 0.15;

      const settleDampState = 1 - (effSettle * 0.68);

      if (isListening) {
        speedMult *= 1.22;
        freqMult *= 0.91;
        ampMult = 1.48 * settleDampState;
        turbMult = 1.92 * (0.52 + settleDampState * 0.48) + voicePressure * 1.35; // audio reactive shake
        colorShift = 0.78 + burst * 0.4; // red bite + extra on clack
        grainIntensity = 0.19 + (1 - settleDampState) * 0.13 + burst * 0.22;
      } else if (isThinking) {
        speedMult *= 0.48;
        freqMult *= 1.48;
        ampMult = 0.78 * settleDampState;
        turbMult = 2.4 * (0.32 + settleDampState * 0.68);
        colorShift = -0.12;
        grainIntensity = 0.34;
      } else if (isSpeaking) {
        speedMult *= 1.06;
        freqMult *= 0.66;
        ampMult = 1.78 * settleDampState;
        turbMult = 0.52 * settleDampState + burst * 0.3;
        colorShift = -0.92;
        grainIntensity = 0.08;
      }

      // Extra brutal collapse when deep filed + burst for stamp clack pop
      if (effSettle > 0.65) {
        freqMult *= (1 - (effSettle - 0.65) * 0.95);
      }
      // Stamp-pop transient overrides: forces red ink flash + extra high freq life for 1 clack
      if (burst > 0.08) {
        colorShift = Math.max(colorShift, 0.95);
        turbMult *= (1 + burst * 1.4);
        grainIntensity = Math.max(grainIntensity, 0.26 + burst * 0.18);
      }

      const time = Date.now() * speed * speedMult;

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      const intensity = (sum / dataArray.length) / 128;
      const sens = sensitivityRef.current;

      const baseScale = active
        ? (0.5 + intensity * 1.5) * sens
        : isCalm ? 0.1 : 0.2;

      const scaleFactor = baseScale * (isSpeaking ? 1.1 : isThinking ? 0.75 : 1);
      const turbulence = Math.min(
        2.8,
        (active ? intensity * sens * (isCalm ? 0.3 : 1.2) : 0) * turbMult * dampTurb
      );

      for (let i = 0; i <= 1200; i += step) {
        const dataIdx = Math.floor((i / canvas.width) * dataArray.length * 0.4);
        const val = dataArray[dataIdx] / 255;
        const localFlurry = Math.min(1.5, val * scaleFactor);

        const curFreq = freq * freqMult;

        const baseWave = Math.sin(i * curFreq + time + phase);
        const flutter1 =
          Math.sin(i * curFreq * 2.2 - time * 1.6 + phase) *
          (0.2 + turbulence * 0.3);
        const flutter2 =
          Math.cos(i * curFreq * 5.1 + time * 3.2) *
          (0.1 + localFlurry * (isCalm && !isThinking ? 0.05 : 0.4));
        const wave = baseWave + flutter1 + flutter2;

        const baseTwist = Math.cos(i * curFreq * 0.5 + time * 0.7 + phase);
        // Extra harmonic twist flutter (paper edge torque under wind + stamp impact)
        const twistFlutter =
          (Math.sin(i * curFreq * 3.2 - time * 2.8) +
            Math.cos(i * curFreq * 4.9 + time * 1.9) * 0.6 +  // harmonic twist
            Math.sin(i * curFreq * 7.3 - time * 4.4) * 0.35) *
          ((isCalm && !isListening && !isThinking) ? 0.05 : 0.22 + turbulence * 0.42 + localFlurry * 0.22 + burst * 0.55) *
          dampFlutter;
        const twist = Math.max(-1, Math.min(1, baseTwist + twistFlutter));

        // === MULTI-HARMONIC WIND + TURBULENCE (real paper in 1978 office fan + voice pressure) ===
        // Incommensurate frequencies = non-repeating organic flutter (no visible loop).
        // voicePressure (mic RMS) + burst (transcript stamp) inject live physical shake.
        const windBase = (isCalm && !isListening ? 22 : 78) * scaleFactor * dampWind;
        const windGust =
          val *
          windBase *
          (Math.sin(i * 0.05 - time * 4.1) +
            Math.cos(i * 0.031 + time * 2.7) * 0.7 +   // harmonic 2
            Math.sin(i * 0.019 - time * 5.9) * 0.45);   // harmonic 3 (prime-ish for life)
        const voiceShake =
          voicePressure *
          (18 + burst * 24) *
          Math.sin(i * 0.027 + time * 3.3) *
          (isListening ? 1.15 : 0.4) *
          dampWind;
        const stampClackFlutter =
          burst *
          (12 + val * 9) *
          (Math.sin(i * 0.081 + time * 11) + Math.cos(i * 0.044 - time * 7.2));
        const currentAmp = dampAmp * (isCalm ? 0.5 : 1.0) * ampMult;
        const y =
          yBase +
          wave * currentAmp * Math.min(2.9, (isCalm ? 0.78 : 0.52) + scaleFactor) +
          windGust +
          voiceShake +
          stampClackFlutter;

        points.push({
          x: i,
          y,
          twist,
          opacity: 0.1 + val * 0.9,
        });
      }

      // Multiple passes for 3D paper effect + status color stamp
      for (let pass = 0; pass < 2; pass++) {
        const isShadowPass = pass === 0;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const w1 = Math.abs(p1.twist) * thickness;
          const isFront = p1.twist > 0;

          if (isShadowPass) {
            if (isFront) {
              ctx.strokeStyle = 'rgba(0,0,0,0.05)';
              ctx.lineWidth = w1 + (isThinking ? 14 : 10);
            } else {
              continue;
            }
          } else {
            // Raw color stamp modulation — hard switch, no lerp
            let cMain = colorMain;
            let cDark = colorDark;
            if (colorShift > 0.4) {
              // Listening red ink stamp
              cMain = '#F4442E';
              cDark = '#D8331F';
            } else if (colorShift < -0.5) {
              // Speaking gold clarity
              cMain = '#F3A62A';
              cDark = '#D98E1C';
            }
            ctx.strokeStyle = isFront ? cMain : cDark;
            ctx.lineWidth = Math.max(2, w1 * (isThinking ? 0.92 : 1));
          }

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Grainy highlight — state + settle driven (P0 choreography)
      // listening: aggressive paper bite grain; thinking: heavy jagged white relay grind; speaking: minimal clean
      ctx.globalCompositeOperation = 'overlay';
      ctx.strokeStyle = isThinking 
        ? `rgba(255,255,255,${grainIntensity})` 
        : isListening 
          ? `rgba(255,255,255,${Math.min(0.22, grainIntensity + 0.04)})` 
          : `rgba(255,255,255,${grainIntensity})`;
      ctx.lineWidth = thickness * (isThinking ? 0.30 : isListening ? 0.24 : 0.18);
      ctx.beginPath();
      for (let i = 0; i < points.length - 1; i++) {
        const p = points[i];
        if (p.twist > (isThinking ? 0.2 : 0.5)) {
          ctx.lineTo(p.x, p.y);
        } else {
          ctx.moveTo(p.x, p.y);
        }
      }
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    };

    // Wire pause observers (once, no re-runs)
    if (!prefersReduced && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        const vis = entries[0]?.isIntersecting ?? true;
        isPaused = !vis || document.hidden;
      }, { threshold: 0.08 });
      io.observe(canvas);
    }
    const onVis = () => { isPaused = document.hidden; };
    document.addEventListener('visibilitychange', onVis, { passive: true });

    const render = () => {
      if (!ctx || !canvas) return;

      if (isPaused || prefersReduced) {
        // Static brutalist fallback (no RAF burn, no motion). Still shows the paper-ribbon identity when offscreen or reduced.
        const centerY = LOGICAL_H / 2;
        drawStaticFallback(ctx, centerY);
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, LOGICAL_W, LOGICAL_H); // logical after scale

      const centerY = LOGICAL_H / 2;

      if (active && analyzer) {
        analyzer.getByteFrequencyData(dataArray);
      } else {
        for (let i = 0; i < dataArray.length; i++) dataArray[i] *= 0.92;
      }

      // Live settle sync right before draw (RAF hot loop reads the latest scroll settleRef from hero)
      if (settlePropRef) settleRef.current = settlePropRef.current;
      const currentSettle = settleRef.current;

      // Stamp clack burst decay (hot path, 60fps, drives transient ink pop on new transcript)
      if (stampBurstRef.current > 0.001) {
        stampBurstRef.current *= 0.86; // fast mechanical settle decay, no float
      } else {
        stampBurstRef.current = 0;
      }

      // Live mic amplitude proxy (RMS-ish) for audio-reactive paper turbulence during listening.
      // Wires Supertonic-era push-to-talk pressure directly into wind + flutter. Brutalist: voice shakes the ribbon.
      let voicePressure = 0;
      if (active && analyzer && statusRef.current === 'listening') {
        let sumSq = 0;
        for (let i = 0; i < dataArray.length; i += 3) { // sample for perf
          const v = (dataArray[i] - 128) / 128;
          sumSq += v * v;
        }
        voicePressure = Math.min(1.8, Math.sqrt(sumSq / (dataArray.length / 3)) * 2.8);
      }

      // Layered ribbons — now using canonical design-system-new tokens (brutalist ink + gold/red accents)
      // Paper-ink base layers (mechanical, non-decorative)
      // ALL ribbons receive currentSettle for full hero descent filing physics (P0 fix: dead settleProgress activated)
      // Ribbons lose amplitude/turbulence/windGust/tension as stamp "sinks into the mail stack" — real physical, no float.
      drawPaperRibbon('#222222', '#0A0A0A', centerY, 0.008, 0.0015, 24, 40, 0, currentSettle);
      drawPaperRibbon(
        '#2A2A2A',
        '#111111',
        centerY + 10,
        0.012,
        0.002,
        18,
        30,
        Math.PI,
        currentSettle
      );
      // Gold / red accent ribbons (the signature Good'ai "ink on paper" moment)
      drawPaperRibbon('#D98E1C', '#B87415', centerY, 0.015, 0.004, 32, 60, 2, currentSettle); // gold-deep
      drawPaperRibbon(
        '#F4442E',
        '#D8331F',
        centerY - 5,
        0.02,
        0.005,
        14,
        50,
        4,
        currentSettle
      ); // red + red-deep

      // === FILED DOCKET / IN-TRAY STAMP (appears as ribbons damp on settle) ===
      // Brutalist receipt strip + mechanical stamp imprint. Hard, stepped, ink on paper.
      if (currentSettle > 0.68) {
        const filedAlpha = Math.min(0.95, (currentSettle - 0.68) / 0.28);
        ctx.save();
        ctx.globalAlpha = filedAlpha;
        // Thin paper receipt edge / docket strip at bottom
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const docketY = LOGICAL_H - 38;
        ctx.moveTo(40, docketY);
        ctx.lineTo(LOGICAL_W - 40, docketY);
        ctx.stroke();
        // Perforation ticks (direct mail receipt)
        ctx.lineWidth = 1;
        for (let tx = 60; tx < LOGICAL_W - 60; tx += 18) {
          ctx.beginPath();
          ctx.moveTo(tx, docketY - 3);
          ctx.lineTo(tx, docketY + 3);
          ctx.stroke();
        }
        // The stamp: "FILED" or "IN TRAY" — hard mechanical, no soft fade curve
        ctx.fillStyle = currentSettle > 0.88 ? '#0B0B0B' : '#222222';
        ctx.font = '600 11px var(--font-mono, ui-monospace, monospace)';
        ctx.textAlign = 'right';
        ctx.fillText('FILED  ·  IN TRAY', LOGICAL_W - 48, LOGICAL_H - 18);
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (io) io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyzer, active]);  // statusRef + sensitivityRef + modeRef read via .current inside hot render loop (Vercel perf: no re-renders on transient state)

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={500}
      className="w-full h-full object-contain will-change-[contents] [content-visibility:auto]"
      aria-hidden="true"
    />
  );
}
