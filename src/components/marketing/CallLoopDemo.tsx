'use client';

import { useState, type ReactNode, type FormEvent } from 'react';
import { motion } from 'motion/react';
import StampButton from '@/components/StampButton';
import { ScrollReveal } from '@/components/ScrollReveal';

type Phase = 'idle' | 'connect' | 'send' | 'handset' | 'done' | 'error';

const AU_MOBILE = /^(?:\+?61|0)4\d{8}$/;
const EASE = [0.23, 1, 0.32, 1] as const;

function digits(phone: string) {
  return phone.replace(/[\s()-]/g, '');
}

function Node({
  label,
  active,
  children,
}: {
  label: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <div
        className={`stamp-box flex h-16 w-16 items-center justify-center border-2 border-[var(--ink)] ${
          active ? 'bg-[var(--navy)] text-[var(--paper)]' : 'bg-[var(--paper)] text-[var(--ink)]'
        }`}
        style={{
          boxShadow: active ? 'none' : '3px 3px 0 var(--ink)',
          transform: active ? 'translate(2px, 2px)' : undefined,
          transition:
            'transform 120ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 120ms cubic-bezier(0.23, 1, 0.32, 1), background 120ms',
        }}
      >
        {children}
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink)]/60">{label}</span>
    </div>
  );
}

function Connector({ on }: { on: boolean }) {
  return (
    <div
      className="h-0.5 w-12 md:w-16 bg-[var(--ink)]/20 relative overflow-hidden self-center mb-6"
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-y-0 left-0 bg-[var(--coral)]"
        initial={false}
        animate={{ width: on ? '100%' : '0%' }}
        transition={{ duration: 0.45, ease: EASE }}
      />
    </div>
  );
}

export default function CallLoopDemo() {
  const [phone, setPhone] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [dialled, setDialled] = useState(false);

  const busy = phase === 'connect' || phase === 'send' || phase === 'handset';

  async function runLoop(e: FormEvent) {
    e.preventDefault();
    const number = digits(phone);
    if (!AU_MOBILE.test(number) || busy) return;

    setError(null);
    setDialled(false);
    setPhase('connect');

    const req = fetch('/api/demo-callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: number }),
    });

    await new Promise((r) => setTimeout(r, 420));
    setPhase('send');

    try {
      const res = await req;
      const data = (await res.json()) as { ok?: boolean; error?: string; dialled?: boolean };
      if (!res.ok || !data.ok) {
        setPhase('error');
        setError(data.error || "Couldn't file the number.");
        return;
      }
      setDialled(!!data.dialled);
      setPhase('handset');
      await new Promise((r) => setTimeout(r, 500));
      setPhase('done');
    } catch {
      setPhase('error');
      setError("Couldn't reach us.");
    }
  }

  return (
    <section className="min-h-[100dvh] py-16 md:py-24 border-t-2 border-[var(--ink)] bg-[var(--paper)]">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal className="text-center mb-10">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--coral)]">
            One loop
          </span>
          <h2 className="font-display text-4xl md:text-6xl tracking-[-0.03em] leading-none mt-3 mb-3">
            Leave a number.<br />We ring you.
          </h2>
          <p className="max-w-md mx-auto text-lg text-[var(--ink)]/80">
            Not a robot blast from this page. We file it, then a real person — or the agent, when it&apos;s cheap enough — calls back.
          </p>
        </ScrollReveal>

        <form onSubmit={runLoop} className="max-w-xl mx-auto space-y-8">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink)]/50">
              Aussie mobile
            </span>
            <input
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={busy || phase === 'done'}
              placeholder="04xx xxx xxx"
              className="mt-2 w-full border-2 border-[var(--ink)] bg-[var(--paper)] px-4 py-3 font-sans text-base text-[var(--ink)] shadow-[3px_3px_0_var(--ink)] outline-none focus-visible:shadow-[0_0_0_2px_var(--coral)] disabled:opacity-60"
            />
          </label>

          <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-0">
            <Node label="You" active={phase !== 'idle'}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5 19c1.5-3 4-4.5 7-4.5S17.5 16 19 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
            </Node>
            <Connector on={phase !== 'idle' && phase !== 'error'} />
            <Node label="Agent" active={phase === 'send' || phase === 'handset' || phase === 'done'}>
              <img src="/assets/logo-g.svg" alt="" className="h-8 w-8" />
            </Node>
            <div className="relative flex items-center">
              <Connector on={phase === 'send' || phase === 'handset' || phase === 'done'} />
              {(phase === 'send' || phase === 'handset') && (
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-[18px] h-7 w-7 border-2 border-[var(--ink)] bg-[var(--coral)]"
                  initial={{ x: 0, opacity: 1 }}
                  animate={{ x: 48 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  aria-hidden="true"
                />
              )}
            </div>
            <Node label="Handset" active={phase === 'handset' || phase === 'done'}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 3h4l1 5-2 1c1 2 3 4 5 5l1-2 5 1v4c0 1-1 2-2 2C10 19 5 14 5 5c0-1 1-2 1-2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="miter"
                />
              </svg>
            </Node>
          </div>

          <div className="text-center">
            {phase !== 'done' ? (
              <StampButton type="submit" variant="red" size="lg" disabled={busy}>
                {busy ? 'Filing…' : 'Ring me'}
              </StampButton>
            ) : (
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink)]">
                {dialled ? 'Dialler took it. Phone should ring.' : `Filed. We'll ring ${phone}.`}
              </p>
            )}
            {phase === 'error' && (
              <p className="mt-3 text-sm text-[var(--coral)]">
                {error} Or just{' '}
                <a href="mailto:hello@goodai.au" className="underline">
                  hello@goodai.au
                </a>
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
