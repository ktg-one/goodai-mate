'use client';

import { useState } from 'react';
import { Check, Phone } from 'lucide-react';
import StampButton from '@/components/StampButton';

export interface BuzzCTAPayload {
  name: string;
  email: string;
  phone: string;
  problem: string;
}

export interface BuzzCTAProps {
  /** Wire callback / outbound dialer when backend is ready. */
  onSubmit?: (payload: BuzzCTAPayload) => void | Promise<void>;
  className?: string;
}

export default function BuzzCTA({ onSubmit, className = '' }: BuzzCTAProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [problem, setProblem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !problem.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (onSubmit) {
        await onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim(), problem: problem.trim() });
      }
      setIsSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went sideways. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className={`stamp-card stamp-card-gold p-8 md:p-10 text-center ${className}`} data-buzz-cta="success">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--ok)] text-[var(--paper)] shadow-[2px_2px_0_var(--ink)]">
          <Check size={22} aria-hidden="true" />
        </div>
        <h3 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.02em] text-[var(--ink)] mb-2">
          Sorted — we&apos;ll <span className="hl-red">buzz ya</span> shortly.
        </h3>
        <p className="text-sm text-[var(--ink-mute)] max-w-md mx-auto">
          Keep your phone handy. Darl or the team will ring to sort the fix.
        </p>
      </div>
    );
  }

  return (
    <div className={`stamp-card stamp-card-red p-6 md:p-9 text-left ${className}`} data-buzz-cta="form">
      <div className="sticker-label sticker-label-gold mb-4 inline-flex items-center gap-1.5">
        <Phone size={12} aria-hidden="true" />
        Perth callback
      </div>

      <h2 className="font-display text-3xl md:text-[2.6rem] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--paper)] mb-6">
        Give us your deets and your headaches, we&apos;ll <span className="hl">buzz ya</span> back with a fix.
      </h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="buzz-name" className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--paper)]/70">Name</label>
            <input
              id="buzz-name"
              className="gai-input w-full"
              placeholder="Your name"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="buzz-email" className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--paper)]/70">Email</label>
            <input
              id="buzz-email"
              className="gai-input w-full"
              type="email"
              placeholder="you@business.com.au"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="buzz-number" className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--paper)]/70">Number</label>
            <input
              id="buzz-number"
              className="gai-input w-full"
              type="tel"
              placeholder="Mobile number"
              required
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="buzz-problem" className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--paper)]/70">Problem</label>
          <textarea
            id="buzz-problem"
            className="gai-input w-full min-h-[96px] resize-y text-sm"
            placeholder="What's causing ya headache? (invoices, scheduling, follow-ups…)"
            required
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />
        </div>

        {error && (
          <p className="font-mono text-xs text-[var(--paper)] bg-[var(--ink)]/20 border border-[var(--paper)]/30 px-3 py-2 rounded-xs" role="alert">
            {error}
          </p>
        )}

        <StampButton variant="gold" size="lg" type="submit" disabled={isSubmitting} className="w-full sm:w-fit">
          {isSubmitting ? 'Filing your docket…' : 'Buzz me'}
        </StampButton>
      </form>
    </div>
  );
}
