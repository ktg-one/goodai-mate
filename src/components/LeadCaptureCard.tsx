'use client';

import { Check, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import StampButton from '@/components/StampButton';

interface LeadCaptureCardProps {
  firstMessage: string;
<<<<<<< HEAD
  conversationTranscript: string;
=======
  conversationTranscript: string | (() => string);
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
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
<<<<<<< HEAD
=======
      const resolvedConversationTranscript =
        typeof conversationTranscript === 'function' ? conversationTranscript() : conversationTranscript;

>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
      // 1. Submit to Google Apps Script Webhook (if defined)
      const gwsUrl = process.env.NEXT_PUBLIC_GWS_SCRIPT_URL;
      if (gwsUrl) {
        await fetch(gwsUrl, {
          method: 'POST',
          mode: 'no-cors', // Bypasses Google Apps Script redirect CORS issues
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            name: name.trim(),
            business: business.trim() || '(not provided)',
            phone: phone.trim(),
            email: email.trim() || '(not provided)',
            problem: firstMessage,
<<<<<<< HEAD
            conversation: conversationTranscript,
=======
            conversation: resolvedConversationTranscript,
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
            timestamp: new Date().toISOString(),
          }),
        });
      }

      // 2. Trigger the local Good'ai GWS & n8n automation pipeline
      await fetch('/api/demo-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          business: business.trim(),
          phone: phone.trim(),
          email: email.trim(),
<<<<<<< HEAD
          problem: `Client Admin Problem from Chat:\n"${firstMessage}"\n\nFull Chat History:\n${conversationTranscript}`,
=======
          problem: `Client Admin Problem from Chat:\n"${firstMessage}"\n\nFull Chat History:\n${resolvedConversationTranscript}`,
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
          actions: {
            sheet: true,
            doc: true,
            emailNotification: !!email.trim(),
            calendar: false,
            n8n: true
          }
        })
      });
    } catch (err) {
      // Preserve the original behavior: do not block the visitor on provider errors.
      console.error("GWS submission error:", err);
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
          <StampButton
            variant="paper"
            size="sm"
            onClick={onDismiss}
            className="absolute top-3 right-3 w-7 h-7 p-0 flex items-center justify-center text-[10px] border-2 border-[var(--ink)]"
            aria-label="Close lead form"
          >
            <X size={12} aria-hidden="true" />
          </StampButton>
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
<<<<<<< HEAD
              placeholder="Your name"
              aria-label="Your name"
=======
              type="text"
              placeholder="Your name"
              aria-label="Your name"
              autoComplete="name"
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="gai-input"
<<<<<<< HEAD
              placeholder="Business name"
              aria-label="Business name"
=======
              type="text"
              placeholder="Business name"
              aria-label="Business name"
              autoComplete="organization"
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
            />
          </div>
          <div className="gai-leadcard-row">
            <input
              className="gai-input"
<<<<<<< HEAD
              placeholder="Phone"
              aria-label="Phone"
=======
              type="tel"
              placeholder="Phone"
              aria-label="Phone"
              autoComplete="tel"
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              className="gai-input"
<<<<<<< HEAD
              placeholder="Email"
              aria-label="Email"
=======
              type="email"
              placeholder="Email"
              aria-label="Email"
              autoComplete="email"
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
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
