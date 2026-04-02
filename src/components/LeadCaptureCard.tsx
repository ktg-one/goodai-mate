'use client';

import { useState } from 'react';

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
      // Show success even on error — don't lose the lead
    }

    setIsSuccess(true);
  }

  if (isSuccess) {
    return (
      <div className="flex justify-start mb-4 animate-fade-up">
        <div className="max-w-[540px] w-full">
          <div
            className="relative overflow-hidden text-center py-5 px-6 backdrop-blur-sm"
            style={{
              background: 'rgba(28, 28, 26, 0.75)',
              border: '1px solid rgba(216, 106, 61, 0.5)',
              borderRadius: '14px',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(216,106,61,0.06) 0%, transparent 60%)',
              }}
            />
            <div className="relative">
              <div
                className="mx-auto mb-3 flex items-center justify-center"
                style={{ width: '28px', height: '28px', color: 'var(--accent)' }}
              >
                <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <p className="text-[15px] font-medium" style={{ color: 'var(--text-bright)' }}>
                Nice one. We&apos;ll be in touch within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4 animate-fade-up">
      <div className="max-w-[540px] w-full">
        <div
          className="relative overflow-hidden backdrop-blur-sm"
          style={{
            background: 'rgba(28, 28, 26, 0.75)',
            border: '1px solid rgba(216, 106, 61, 0.5)',
            borderRadius: '14px',
            padding: '24px',
            boxShadow: '0 0 40px rgba(216, 106, 61, 0.08), 0 0 80px rgba(216, 106, 61, 0.04), inset 0 0 30px rgba(216, 106, 61, 0.03)',
          }}
        >
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(216,106,61,0.06) 0%, transparent 60%)',
            }}
          />

          {/* Close button */}
          {onDismiss && (
            <button
              onClick={onDismiss}
              data-cursor-hover
              className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-full transition-colors"
              style={{
                color: 'var(--text-dim)',
                background: 'transparent',
                border: 'none',
                cursor: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; }}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}

          {/* Content */}
          <div className="relative">
            <h3
              className="text-[15px] font-semibold mb-1"
              style={{ color: 'var(--text-bright)' }}
            >
              Want us to look into this?
            </h3>
            <p
              className="text-[13px] mb-4"
              style={{ color: 'var(--text-dim)', lineHeight: 1.5 }}
            >
              Drop your details and we&apos;ll scope it out — no obligation, no runaround.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              {/* Row 1: Name + Business */}
              <div className="flex gap-2.5 max-sm:flex-col">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-cursor-hover
                  className="flex-1 text-sm outline-none"
                  style={{
                    padding: '12px 16px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    color: 'var(--text-bright)',
                    fontFamily: 'var(--font-sans), sans-serif',
                    fontSize: '14px',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(216,106,61,0.3)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
                />
                <input
                  type="text"
                  placeholder="Business name"
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  data-cursor-hover
                  className="flex-1 text-sm outline-none"
                  style={{
                    padding: '12px 16px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    color: 'var(--text-bright)',
                    fontFamily: 'var(--font-sans), sans-serif',
                    fontSize: '14px',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(216,106,61,0.3)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
                />
              </div>

              {/* Row 2: Phone + Email */}
              <div className="flex gap-2.5 max-sm:flex-col">
                <input
                  type="tel"
                  placeholder="Phone"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  data-cursor-hover
                  className="flex-1 text-sm outline-none"
                  style={{
                    padding: '12px 16px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    color: 'var(--text-bright)',
                    fontFamily: 'var(--font-sans), sans-serif',
                    fontSize: '14px',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(216,106,61,0.3)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-cursor-hover
                  className="flex-1 text-sm outline-none"
                  style={{
                    padding: '12px 16px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    color: 'var(--text-bright)',
                    fontFamily: 'var(--font-sans), sans-serif',
                    fontSize: '14px',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(216,106,61,0.3)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                data-cursor-hover
                className="mt-1 transition-all duration-150 ease-out"
                style={{
                  padding: '12px 24px',
                  background: 'var(--accent)',
                  color: 'var(--bg)',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-sans), sans-serif',
                  cursor: 'none',
                  opacity: isSubmitting ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = isSubmitting ? '0.5' : '1';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {isSubmitting ? 'Sending...' : 'Get a callback'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
