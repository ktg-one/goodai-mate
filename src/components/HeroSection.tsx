'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import ChatInterface from '@/components/ChatInterface';

/** Cursor-reactive 3D tilt on any element */
function useTilt(strength = 14) {
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * strength;
    el.style.transform = `perspective(400px) rotateY(${x}deg) rotateX(${-y}deg)`;
    el.style.filter = `drop-shadow(0 0 ${6 + Math.abs(x) + Math.abs(y)}px rgba(216,106,61,0.12))`;
  }, [strength]);

  const onMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = '';
    e.currentTarget.style.filter = '';
  }, []);

  return { onMouseMove, onMouseLeave };
}

/** Logo "drowning" effect — sinks when cursor dwells near center */
function useDrown(logoRef: React.RefObject<HTMLDivElement | null>) {
  const mousePos = useRef({ x: 0, y: 0 });
  const dwellTime = useRef(0);
  const lastMove = useRef(Date.now());
  const raf = useRef(0);

  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    const parent = logo.closest('[data-cursor-hover]') as HTMLElement;
    if (!parent) return;

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      lastMove.current = Date.now();
    };

    const onLeave = () => {
      dwellTime.current = 0;
      logo.style.transform = '';
      logo.style.filter = '';
      logo.style.opacity = '0.45';
    };

    const tick = () => {
      const rect = parent.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(mousePos.current.x - cx, mousePos.current.y - cy);
      const inCenter = dist < 180;
      const idle = Date.now() - lastMove.current > 400; // cursor stopped moving

      if (inCenter && idle) {
        dwellTime.current = Math.min(dwellTime.current + 0.008, 1);
      } else {
        dwellTime.current = Math.max(dwellTime.current - 0.025, 0);
      }

      const t = dwellTime.current;
      const mouth = logo.querySelector('[data-mouth]') as HTMLElement | null;

      if (t > 0.01) {
        const sinkY = t * 45;
        const squishX = 1 + t * 0.18;
        const squishY = 1 - t * 0.3;
        const wobble = Math.sin(Date.now() * 0.004) * t * 5;
        const fade = 0.45 - t * 0.15;

        logo.style.transform = `translateY(${sinkY}px) scaleX(${squishX}) scaleY(${squishY}) rotate(${wobble}deg)`;
        logo.style.filter = '';
        logo.style.opacity = `${Math.max(fade, 0.2)}`;

        // Mouth: smile (1) → flat (0) → frown (-1)
        if (mouth) {
          const mouthFlip = 1 - t * 2; // 1 → -1
          mouth.style.transform = `translateX(-50%) scaleY(${mouthFlip})`;
          // Flatten height in the middle of the transition
          const flatness = 1 - Math.abs(mouthFlip);
          mouth.style.height = `${20 - flatness * 14}px`;
        }
      } else {
        logo.style.transform = '';
        logo.style.filter = '';
        logo.style.opacity = '0.45';
        if (mouth) {
          mouth.style.transform = 'translateX(-50%) scaleY(1)';
          mouth.style.height = '20px';
        }
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove);
    parent.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('mousemove', onMove);
      parent.removeEventListener('mouseleave', onLeave);
    };
  }, [logoRef]);
}

type PagePhase = 'landing' | 'chatting';

export default function HeroSection() {
  const [phase, setPhase] = useState<PagePhase>('landing');
  const [initialMessage, setInitialMessage] = useState('');
  const [landingInput, setLandingInput] = useState('');

  function handleFirstMessage(text: string) {
    setInitialMessage(text);
    setPhase('chatting');
  }

  function handleLandingSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!landingInput.trim()) return;
    handleFirstMessage(landingInput.trim());
  }

  function handleBack() {
    setPhase('landing');
    setInitialMessage('');
    setLandingInput('');
  }

  const isChatting = phase === 'chatting';
  const tilt = useTilt(6);
  const logoRef = useRef<HTMLDivElement>(null);
  useDrown(logoRef);

  return (
    <>
      {/* Fixed header — chat mode only (back nav + centered wordmark) */}
      {isChatting && (
        <header
          className="fixed top-0 left-0 right-0 z-20 flex items-center py-4 px-6"
          style={{ background: 'linear-gradient(var(--bg) 60%, transparent)' }}
        >
          <button
            onClick={handleBack}
            className="text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
            aria-label="Back to home"
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="flex-1 text-center font-bold tracking-[-0.04em] text-lg text-[var(--text-bright)]">
            Good<span className="text-[var(--accent)] opacity-70">&apos;</span>ai
          </h1>
          <div className="w-5" />
        </header>
      )}

    <main
      className={[
        'flex flex-col items-center relative z-[1] px-10',
        isChatting ? 'justify-start pt-16' : 'justify-center min-h-screen',
      ].join(' ')}
    >
      {/* Wordmark — pinned top-left on landing (chat uses fixed header above) */}
      {!isChatting && (
        <div className="fixed top-0 left-0 w-full z-10 flex items-center px-10 py-6 animate-fadeUp" style={{ animationDelay: '0.3s' }}>
          <h1 className="font-bold tracking-[-0.04em] text-[20px] text-[var(--text-bright)]">
            Good<span className="text-[var(--accent)] opacity-70">&apos;</span>ai
          </h1>
        </div>
      )}

      {/* Brand group — cursor-reactive tilt, transparent so SDF shows through */}
      <div
        className="flex flex-col items-center relative"
        data-cursor-hover
        {...(!isChatting ? tilt : {})}
        style={{
          transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), filter 0.5s ease',
        }}
      >
        {/* Invisible expanded hit area for tilt detection */}
        {!isChatting && (
          <div
            className="absolute pointer-events-none"
            style={{
              inset: '-80px -120px',
              pointerEvents: 'auto',
              zIndex: -1,
            }}
          />
        )}

        {/* Logo icon — large, translucent, SDF circle shows through */}
        {!isChatting && (
          <div
            ref={logoRef}
            className="animate-fadeUp animate-ambient-pulse mb-3 relative"
            style={{
              width: '320px',
              height: '320px',
              animationDelay: '0.4s',
              pointerEvents: 'none',
              transition: 'transform 0.3s ease, filter 0.3s ease, opacity 0.3s ease',
            }}
          >
            <img
              src="/assets/logo-light-nomouth.svg"
              alt="Good'ai icon"
              style={{
                width: '100%',
                height: '100%',
                opacity: 0.45,
                mixBlendMode: 'screen',
              }}
            />
            {/* CSS mouth — arc that flips from smile to frown */}
            <div
              data-mouth
              style={{
                position: 'absolute',
                left: '50%',
                top: '56%',
                transform: 'translateX(-50%) scaleY(1)',
                width: '42px',
                height: '20px',
                borderBottom: '3px solid rgba(215, 210, 203, 0.45)',
                borderRadius: '0 0 50% 50%',
                transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), border-radius 0.4s ease, height 0.4s ease',
                mixBlendMode: 'screen',
              }}
            />
          </div>
        )}


      </div>

      {/* Subtitle — outside tilt zone */}
      {!isChatting && (
        <p
          className="font-mono text-[14px] font-light uppercase tracking-[0.14em] text-[var(--text-dim)] mb-8 animate-fadeUp"
          style={{ animationDelay: '0.55s' }}
        >
          business automations, sorted
        </p>
      )}

      {/* Landing input — hidden in chatting */}
      {!isChatting && (
        <div className="max-w-[440px] w-full animate-fadeUp mt-6" style={{ animationDelay: '0.8s' }}>
          <form onSubmit={handleLandingSubmit} className="relative">
            <Input
              value={landingInput}
              onChange={(e) => setLandingInput(e.target.value)}
              placeholder="Tell us your problem."
              className={[
                'w-full py-6 pl-7 pr-14',
                'bg-[var(--surface)]/80 border-[var(--border)] rounded-[14px]',
                'text-lg text-[var(--text-bright)]',
                'placeholder:text-[var(--text-dim)] placeholder:font-light',
                'focus-visible:border-[rgba(216,106,61,0.25)]',
                'focus-visible:shadow-[0_0_4px_var(--accent-dim),0_0_32px_rgba(0,0,0,0.5)]',
                'focus-visible:bg-[var(--surface-raised)] focus-visible:ring-0',
              ].join(' ')}
            />
          </form>
          <p className="mt-5 font-mono text-sm font-light tracking-[0.04em] text-[var(--text-dim)] opacity-70">
            We&apos;ll figure out how to fix it.
          </p>
        </div>
      )}

      {/* Chat interface — shown in chatting */}
      {isChatting && <ChatInterface initialMessage={initialMessage} onBack={handleBack} />}

      {/* Service marquee — fixed bottom strip */}
      {!isChatting && (
        <div
          className="fixed bottom-14 left-0 w-full overflow-hidden animate-fadeUp"
          style={{ animationDelay: '1s' }}
        >
          <div className="flex animate-marquee whitespace-nowrap gap-4 py-3">
            {[
              'Email Drafting',
              'Invoice Processing',
              'CRM Sync',
              'Social Scheduling',
              'Custom Cartoons',
              'AI Voice Agents',
              'Workflow Automation',
              'Data Entry',
              'Lead Capture',
              'Report Generation',
              'Email Drafting',
              'Invoice Processing',
              'CRM Sync',
              'Social Scheduling',
              'Custom Cartoons',
              'AI Voice Agents',
              'Workflow Automation',
              'Data Entry',
              'Lead Capture',
              'Report Generation',
            ].map((s, i) => (
              <span
                key={`${s}-${i}`}
                className="inline-block text-[12px] font-mono tracking-wide text-[var(--text-dim)]/40 flex-shrink-0"
              >
                {s}<span className="mx-4 text-[var(--accent)]/20">/</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Perth badge — hidden in chatting */}
      {!isChatting && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 font-mono text-[12px] font-light uppercase tracking-[0.12em] text-[var(--text-dim)] animate-fadeUp"
          style={{ animationDelay: '1.2s' }}
        >
          PERTH <span className="text-[var(--accent-soft)] opacity-50">/</span> WA
        </div>
      )}
    </main>
    </>
  );
}
