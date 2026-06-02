'use client';

import { Check, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import StampButton from '@/components/StampButton';

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
      <div className="gai-bubble-row">
        <div className="gai-leadcard gai-leadcard-success">
          <div className="gai-leadcard-checkwrap">
            <Check size={20} />
          </div>
          <div className="gai-leadcard-success-text">
            <strong>Nice one.</strong> We&apos;ll be in touch within 24 hours.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gai-bubble-row">
      <div className="gai-leadcard">
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="stamp-btn stamp-btn-paper absolute top-3 right-3 w-7 h-7 p-0 flex items-center justify-center text-[10px] border-2 border-[var(--ink)]"
            aria-label="Close lead form"
          >
            <X size={12} aria-hidden="true" />
          </button>
        )}

        <div className="gai-leadcard-eyebrow">
          <Sparkles size={12} /> Want us to scope this?
        </div>

        <h3 className="gai-leadcard-title">Drop your details — we&apos;ll handle it.</h3>
        <p className="gai-leadcard-help">
          No obligation, no runaround. We&apos;ll come back with what it&apos;d take to fix.
        </p>

        <form className="gai-leadcard-form" onSubmit={handleSubmit}>
          <div className="gai-leadcard-row">
            <input
              className="gai-input"
              placeholder="Name"
              aria-label="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="gai-input"
              placeholder="Business name"
              aria-label="Business name"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
            />
          </div>
          <div className="gai-leadcard-row">
            <input
              className="gai-input"
              placeholder="Phone"
              aria-label="Phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              className="gai-input"
              placeholder="Email"
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <StampButton
            variant="red"
            size="sm"
            type="submit"
            disabled={isSubmitting}
            className="w-fit"
          >
            {isSubmitting ? 'Sending…' : 'Get a callback'}
          </StampButton>
        </form>
      </div>
    </div>
  );
}
