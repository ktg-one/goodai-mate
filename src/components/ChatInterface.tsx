'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import LeadCaptureCard from '@/components/LeadCaptureCard';

interface ChatInterfaceProps {
  initialMessage: string;
  onFirstResponse?: () => void;
  onBack?: () => void;
}

export default function ChatInterface({ initialMessage, onFirstResponse, onBack }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [showLeadCard, setShowLeadCard] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasCalledFirstResponse = useRef(false);
  const leadCardShown = useRef(false);
  const initialSent = useRef(false);
  const aiResponseCount = useRef(0);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onFinish() {
      aiResponseCount.current += 1;

      if (!hasCalledFirstResponse.current) {
        hasCalledFirstResponse.current = true;
        onFirstResponse?.();
      }

      // Show lead card after first AI response, with a real delay
      if (aiResponseCount.current === 1 && !leadCardShown.current) {
        leadCardShown.current = true;
        setTimeout(() => setShowLeadCard(true), 8000);
      }
    },
  });

  const isBusy = status === 'submitted' || status === 'streaming';

  // Send the initial message once
  useEffect(() => {
    if (!initialMessage || initialSent.current) return;
    initialSent.current = true;
    sendMessage({ text: initialMessage });
  }, [initialMessage, sendMessage]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isBusy) return;
    sendMessage({ text: input });
    setInput('');
  }

  return (
    <div className="relative flex flex-col w-full" style={{ minHeight: 'calc(100vh - 120px)' }}>
      {/* Message list */}
      <div className="flex-1 overflow-y-auto max-w-[540px] w-full mx-auto pb-[120px] chat-scroll">
        {messages.map((msg) => {
          const text = msg.parts
            ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
            .map((p) => p.text)
            .join('') ?? '';
          if (!text) return null;

          return msg.role === 'user' ? (
            <div key={msg.id} className="flex justify-end mb-4 animate-fade-up">
              <div
                className="inline-block max-w-[85%] text-left px-5 py-3.5"
                style={{
                  background: 'rgba(216,106,61,0.07)',
                  border: '1px solid rgba(216,106,61,0.12)',
                  borderRadius: '16px 16px 4px 16px',
                }}
              >
                <p className="text-base leading-relaxed text-[var(--text-bright)]">{text}</p>
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex justify-start mb-4 animate-fade-up">
              <div
                className="inline-block max-w-[85%] px-5 py-3.5"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px 16px 16px 4px',
                }}
              >
                <p className="text-base leading-relaxed text-[var(--text)]">{text}</p>
              </div>
            </div>
          );
        })}

        {/* Lead capture card — after first AI response */}
        {showLeadCard && !leadCaptured && (
          <LeadCaptureCard
            firstMessage={initialMessage}
            conversationTranscript={messages.map((m) => {
              const t = m.parts?.filter((p): p is { type: 'text'; text: string } => p.type === 'text').map((p) => p.text).join('') ?? '';
              return m.role === 'user' ? `Them: ${t}` : `Us: ${t}`;
            }).join(' / ')}
            onDismiss={() => {
              setShowLeadCard(false);
              setLeadCaptured(true);
            }}
          />
        )}

        {/* Typing indicator — show when submitted (waiting for first token) */}
        {status === 'submitted' && (
          <div className="flex justify-start mb-4">
            <div
              className="inline-flex gap-[5px] items-center px-5 py-3.5"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px 16px 16px 4px',
              }}
            >
              <span className="typing-dot" />
              <span className="typing-dot" style={{ animationDelay: '0.2s' }} />
              <span className="typing-dot" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Fixed bottom input bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-10"
        style={{ background: 'linear-gradient(transparent, var(--bg) 35%)' }}
      >
        <div className="max-w-[540px] mx-auto px-10 pb-8 pt-5">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tell us your problem."
                disabled={isBusy}
                className={[
                  'w-full py-5 pl-6 pr-14',
                  'bg-[var(--surface)] border-[var(--border)] rounded-[14px]',
                  'text-base text-[var(--text-bright)]',
                  'placeholder:text-[var(--text-dim)] placeholder:font-light',
                  'focus-visible:border-[rgba(216,106,61,0.25)]',
                  'focus-visible:shadow-[0_0_4px_var(--accent-dim),0_0_32px_rgba(0,0,0,0.5)]',
                  'focus-visible:bg-[var(--surface-raised)] focus-visible:ring-0',
                  isBusy ? 'opacity-50' : '',
                ].join(' ')}
              />
              <button
                type="submit"
                disabled={isBusy}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-[10px] text-[var(--text-dim)] hover:text-[var(--accent)] hover:bg-[var(--accent-dim)] flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
