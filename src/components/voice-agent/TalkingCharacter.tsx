'use client';

import { useState, useEffect, useRef } from 'react';
import { CHARACTER_ASSETS } from '@/lib/brand-assets';

interface TalkingCharacterProps {
  analyser: AnalyserNode | null;
  status: 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';
  agent: 'darl' | 'robokev';
}

/**
 * TalkingCharacter — Real-time mouth-flapping agent avatar.
 * Analyzes audio volume/frequency at 60fps and maps it to animation frames.
 */
export function TalkingCharacter({ analyser, status, agent }: TalkingCharacterProps) {
  const [frame, setFrame] = useState(1);
  const animationRef = useRef<number>(null);
  const statusRef = useRef(status);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    // If not active, reset to closed mouth (Frame 1)
    if (!analyser || (status !== 'speaking' && status !== 'listening')) {
      const timer = setTimeout(() => {
        setFrame(1);
      }, 0);
      return () => clearTimeout(timer);
    }

    const dataArray = new Uint8Array(analyser.frequencyBinCount);


    const updateFrame = () => {
      const now = Date.now();
      
      // Handle speaking lip-sync based on real audio frequencies
      if (statusRef.current === 'speaking' && analyser) {
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average amplitude of human voice frequencies (lower range)
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
        setFrame(targetFrame);
      }
      // Handle listening reaction (slight micro-jitter to show alertness)
      else if (statusRef.current === 'listening') {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length;
        
        // Slight alert response if user is making sound
        if (avg > 15) {
          setFrame(now % 300 < 150 ? 2 : 1);
        } else {
          setFrame(1);
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
  }, [analyser, status]);

  // Handle subtle processing animation during 'thinking' state (slow breathing/blinking)
  useEffect(() => {
    if (status !== 'thinking') return;

    const interval = setInterval(() => {
      // Toggle between closed mouth and tiny open mouth to simulate humming/thinking
      setFrame(prev => (prev === 1 ? 2 : 1));
    }, 450);

    return () => clearInterval(interval);
  }, [status]);

  const getAssetPath = (f: number) => {
    if (agent === 'darl') {
      return f > 2 ? CHARACTER_ASSETS.darl.closed : CHARACTER_ASSETS.darl.idle;
    }
    return CHARACTER_ASSETS.gemFrame(f);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[var(--paper)] p-4 select-none">
      {/* Outer brutalist frame for the avatar */}
      <div className="relative w-[340px] h-[340px] border-2 border-[var(--ink)] bg-[var(--gold-tint)] overflow-hidden shadow-[3px_3px_0_var(--ink)] flex items-center justify-center rounded-sm">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none opacity-[0.03] border border-[var(--ink)]" />
        
        {/* Animated Avatar Frame */}
        <img
          src={getAssetPath(frame)}
          alt={`${agent} avatar`}
          className="w-[90%] h-[90%] object-contain transition-transform duration-75"
          style={{
            // Add subtle physical translation/jitter based on volume/thinking
            transform: status === 'speaking' && frame > 2 
              ? 'translateY(-2px) scale(1.01)' 
              : status === 'thinking' 
                ? 'translateY(1px)' 
                : 'translateY(0px)'
          }}
        />

        {/* Dynamic Status Stamps */}
        <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 border border-[var(--ink)] bg-[var(--paper)] text-[9px] font-mono uppercase font-bold shadow-[1px_1px_0_var(--ink)]">
          AGENT: {agent === 'robokev' ? 'GEM' : agent.toUpperCase()}
        </div>
        <div className={`absolute bottom-2 right-2 z-10 px-2 py-0.5 border border-[var(--ink)] text-[9px] font-mono uppercase font-bold shadow-[1px_1px_0_var(--ink)] ${
          status === 'speaking' 
            ? 'bg-[var(--gold-tint)] text-[var(--ink)]'
            : status === 'listening' 
              ? 'bg-[var(--coral)] text-[var(--paper)]'
              : 'bg-[var(--paper)] text-[var(--ink)]/50'
        }`}>
          {status}
        </div>
      </div>
    </div>
  );
}
