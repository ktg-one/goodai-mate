'use client';

import { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
  /** Live AnalyserNode — mic during listening OR TTS audio element during speaking. */
  analyser: AnalyserNode | null;
  /** True while audio is flowing (listening or speaking). Drives bar decay to rest when false. */
  active: boolean;
  /** VoiceAgentHero status — biases bar energy/colour without restarting the RAF loop. */
  status: 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';
}

/**
 * AudioVisualizer — brutalist Good'ai audio equalizer.
 *
 * Sharp rectangular bars on a quantized grid, mirrored about a centre axis for a
 * waveform read. Brand ink on cream: --navy body bars, --gold for the louder mid
 * bars, --red ONLY on the single loudest/peak bar (one red per surface). Each bar
 * carries a flat ink stamp-offset shadow + ink stroke. No gradients, no rounded
 * caps, no blur.
 *
 * Hot-path ref pattern (mirrors hero/Visualizer.tsx): the single useEffect is keyed
 * only on [analyser, active]; transient `status` changes are read via statusRef so
 * they never tear down the RAF loop. Respects prefers-reduced-motion (static strip,
 * no RAF) and pauses offscreen / on tab hide.
 */
export function AudioVisualizer({ analyser, active, status }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);
  const statusRef = useRef(status);
  // Keep statusRef current without restarting the RAF loop (which is keyed on [analyser, active]).
  // Transient status changes flow into the hot loop via the ref, not via effect teardown.
  useEffect(() => { statusRef.current = status; }, [status]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // DPR-scaled crisp edges, capped at 2x. ctx.scale once; draw in logical coords.
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    const LOGICAL_W = 1200;
    const LOGICAL_H = 500;
    canvas.width = LOGICAL_W * dpr;
    canvas.height = LOGICAL_H * dpr;
    ctx.scale(dpr, dpr);

    // Brand colours read ONCE from CSS vars (never raw hex).
    const cs = getComputedStyle(document.documentElement);
    const NAVY = cs.getPropertyValue('--navy').trim() || '#202C59';
    const GOLD = cs.getPropertyValue('--gold').trim() || '#F3A62A';
    const RED = cs.getPropertyValue('--red').trim() || '#F4442E';
    const INK = cs.getPropertyValue('--ink').trim() || '#111111';

    const dataArray = new Uint8Array(analyser?.frequencyBinCount || 32);

    // Quantized bar grid.
    const BAR_COUNT = 32;
    const PAD_X = 56;
    const GRID_W = LOGICAL_W - PAD_X * 2;
    const GAP = 6;
    const BAR_W = (GRID_W - GAP * (BAR_COUNT - 1)) / BAR_COUNT;
    const CENTER_Y = LOGICAL_H / 2;
    const MAX_BAR = CENTER_Y - 48; // half-height headroom (mirrored => full = 2x)
    const MIN_BAR = 4; // resting strip so bars never fully vanish
    const STAMP = 3; // flat ink stamp offset (no blur)

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Per-bar smoothed heights (0-1) for organic fall/rise.
    const levels = new Float32Array(BAR_COUNT);

    const drawBar = (i: number, norm: number, color: string) => {
      const x = PAD_X + i * (BAR_W + GAP);
      const h = MIN_BAR + norm * (MAX_BAR - MIN_BAR);
      const top = CENTER_Y - h;
      const full = h * 2;
      // Flat ink stamp shadow (offset, sharp, no blur).
      ctx.fillStyle = INK;
      ctx.fillRect(x + STAMP, top + STAMP, BAR_W, full);
      // Brand fill.
      ctx.fillStyle = color;
      ctx.fillRect(x, top, BAR_W, full);
      // Ink stroke per bar.
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, top, BAR_W, full);
    };

    const drawCenterAxis = () => {
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(PAD_X, CENTER_Y);
      ctx.lineTo(LOGICAL_W - PAD_X, CENTER_Y);
      ctx.stroke();
    };

    // Static brutalist strip for reduced-motion: fixed stepped bars, navy body,
    // gold mid, one red peak. No motion, drawn once.
    const drawStatic = () => {
      ctx.clearRect(0, 0, LOGICAL_W, LOGICAL_H);
      drawCenterAxis();
      const peak = Math.floor(BAR_COUNT * 0.5);
      for (let i = 0; i < BAR_COUNT; i++) {
        const t = i / (BAR_COUNT - 1);
        const norm = 0.18 + 0.5 * Math.pow(Math.sin(t * Math.PI), 1.4); // arch
        const color = i === peak ? RED : norm > 0.45 ? GOLD : NAVY;
        drawBar(i, norm, color);
      }
    };

    if (prefersReduced) {
      drawStatic();
      return; // no RAF, no observers
    }

    // Pause when offscreen / tab hidden (perf), mirrors hero/Visualizer.tsx.
    let isPaused = false;
    let io: IntersectionObserver | null = null;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          const vis = entries[0]?.isIntersecting ?? true;
          isPaused = !vis || document.hidden;
        },
        { threshold: 0.05 },
      );
      io.observe(canvas);
    }
    const onVis = () => { isPaused = document.hidden; };
    document.addEventListener('visibilitychange', onVis, { passive: true });

    const render = () => {
      if (isPaused) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      const st = statusRef.current;

      // Source the per-bar target levels.
      if (active && analyser) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Decay toward rest so bars fall when audio stops.
        for (let i = 0; i < dataArray.length; i++) dataArray[i] *= 0.9;
      }

      const usable = Math.max(1, Math.floor(dataArray.length * 0.72)); // skip dead highs
      const time = Date.now() * 0.004;

      // Compute raw targets + find peak bar for the single red accent.
      let peakIdx = 0;
      let peakVal = -1;
      const targets = new Float32Array(BAR_COUNT);
      for (let i = 0; i < BAR_COUNT; i++) {
        const srcIdx = Math.floor((i / BAR_COUNT) * usable);
        let v = (dataArray[srcIdx] || 0) / 255;

        // Status biases energy (no loop restart — read from statusRef).
        if (st === 'thinking') {
          // Low, jittery grind — synthetic since no analyser is active here.
          v = 0.06 + 0.1 * Math.abs(Math.sin(time * 2 + i * 0.7)) + Math.random() * 0.05;
        } else if (st === 'listening') {
          // Red-biased peaks — sharpen so loud syllables spike.
          v = Math.pow(v, 0.8) * 1.15;
        } else if (st === 'speaking') {
          // Fuller navy/gold bars.
          v = Math.pow(v, 0.9) * 1.1 + 0.04;
        }

        v = Math.max(0, Math.min(1, v));
        targets[i] = v;
        if (v > peakVal) { peakVal = v; peakIdx = i; }
      }

      ctx.clearRect(0, 0, LOGICAL_W, LOGICAL_H);
      drawCenterAxis();

      for (let i = 0; i < BAR_COUNT; i++) {
        // Smooth toward target (snappy up, softer down) for mechanical fall.
        const tgt = targets[i];
        levels[i] += (tgt - levels[i]) * (tgt > levels[i] ? 0.55 : 0.22);
        const norm = levels[i];

        // Brand colour tiers: red ONLY on the loudest bar, gold for louder mids, navy body.
        let color = NAVY;
        if (i === peakIdx && peakVal > 0.12) color = RED;
        else if (norm > 0.5) color = GOLD;

        drawBar(i, norm, color);
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (io) io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [analyser, active]); // status read via statusRef in the hot loop — no restart on transient changes

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
