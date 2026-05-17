'use client';

import { Check, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface LeadCaptureCardProps {
  firstMessage: string;
  conversationTranscript: string;
  onDismiss?: () => void;
}

export default function LeadCaptureCard({ firstMessage, conversationTranscript, onDismiss }: LeadCaptureCardProps) {
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '',
          subject: `New lead: ${name}`,
          from_name: "Good'ai Website",
          name: name.trim(),
          business: business.trim() || '(not provided)',
          phone: phone.trim(),
          email: email.trim() || '(not provided)',
          problem: firstMessage,
          conversation: conversationTranscript,
        }),
      });
    } catch {
      // Preserve the original behavior: do not block the visitor on provider errors.
    }

    setIsSuccess(true);
    setIsSubmitting(false);
  }

  if (isSuccess) {
    return (
      <div className="mb-4 flex justify-start">
        <div className="w-full rounded-[18px] border-2 border-[var(--ocean-400)] bg-[var(--ocean-50)] px-5 py-4 text-[var(--ink)] shadow-[3px_3px_0_var(--ocean-600)]">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--ocean-500)] bg-white text-[var(--ocean-500)]">
              <Check size={20} />
            </span>
            <p className="text-[15px] leading-snug">
              <strong>Nice one.</strong> We&apos;ll be in touch within 24 hours.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 flex justify-start">
      <div className="relative w-full rounded-[18px] border-2 border-[var(--ink)] bg-white p-4 text-[var(--ink)] shadow-[3px_3px_0_var(--ink)] sm:p-5">
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)] transition-transform hover:-translate-x-px hover:-translate-y-px"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        )}

        <div className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--ocean-600)]">
          <Sparkles size={13} />
          Want us to scope this?
        </div>

        <h3 className="max-w-[420px] font-[family-name:var(--font-display)] text-[22px] font-bold leading-none tracking-[-0.02em] [font-variation-settings:'opsz'_72] sm:text-[26px]">
          Drop your details - we&apos;ll handle it.
        </h3>
        <p className="mt-2 max-w-[420px] text-[14px] leading-snug text-[var(--ink-mute)]">
          No obligation, no runaround. We&apos;ll come back with what it&apos;d take to fix.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2.5 sm:mt-5 sm:gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-[12px] border-2 border-[var(--cream-line)] bg-[var(--paper)] px-4 text-[14px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)] focus:border-[var(--ocean-400)] sm:h-12"
            />
            <input
              type="text"
              placeholder="Business name"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              className="h-11 rounded-[12px] border-2 border-[var(--cream-line)] bg-[var(--paper)] px-4 text-[14px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)] focus:border-[var(--ocean-400)] sm:h-12"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="tel"
              placeholder="Phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 rounded-[12px] border-2 border-[var(--cream-line)] bg-[var(--paper)] px-4 text-[14px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)] focus:border-[var(--ocean-400)] sm:h-12"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-[12px] border-2 border-[var(--cream-line)] bg-[var(--paper)] px-4 text-[14px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)] focus:border-[var(--ocean-400)] sm:h-12"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 h-11 w-fit rounded-[12px] border-2 border-[var(--ink)] bg-[var(--orange)] px-5 text-[14px] font-bold text-[var(--paper)] shadow-[var(--shadow-stamp)] transition-all hover:-translate-x-px hover:-translate-y-px hover:bg-[var(--orange-deep)] disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Get a callback'}
          </Button>
        </form>
      </div>
    </div>
  );
}
