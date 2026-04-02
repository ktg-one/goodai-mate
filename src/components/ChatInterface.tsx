'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import LeadCaptureCard from '@/components/LeadCaptureCard';

interface ChatInterfaceProps {
  initialMessage: string;
  onFirstResponse?: () => void;
}

export default function ChatInterface({ initialMessage, onFirstResponse }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showLeadCard, setShowLeadCard] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasCalledFirstResponse = useRef(false);
  const leadCardShown = useRef(false);

  async function sendToAPI(messagesToSend: { role: 'user' | 'ai'; content: string }[]) {
    setIsWaiting(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesToSend }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'ai', content: data.response }]);
      if (!hasCalledFirstResponse.current) {
        hasCalledFirstResponse.current = true;
        if (onFirstResponse) onFirstResponse();
        // Show lead card 600ms after first AI response
        if (!leadCardShown.current) {
          leadCardShown.current = true;
          setTimeout(() => setShowLeadCard(true), 3000);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: "Something broke on our end. Try again in a moment." },
      ]);
    } finally {
      setIsWaiting(false);
    }
  }

  useEffect(() => {
    if (!initialMessage) return;
    const userMsg = { role: 'user' as const, content: initialMessage };
    setMessages([userMsg]);
    sendToAPI([userMsg]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isWaiting]);

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputValue.trim() || isWaiting) return;
    const userMsg = { role: 'user' as const, content: inputValue.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInputValue('');
    sendToAPI(next);
  }

  return (
    <div className="relative flex flex-col w-full" style={{ minHeight: 'calc(100vh - 120px)' }}>
      {/* Message list */}
      <div className="flex-1 overflow-y-auto max-w-[540px] w-full mx-auto pb-[120px] chat-scroll">
        {messages.map((msg, i) =>
          msg.role === 'user' ? (
            <div key={i} className="flex justify-end mb-4 animate-fade-up">
              <div
                className="inline-block max-w-[85%] text-left px-5 py-3.5"
                style={{
                  background: 'rgba(216,106,61,0.07)',
                  border: '1px solid rgba(216,106,61,0.12)',
                  borderRadius: '16px 16px 4px 16px',
                }}
              >
                <p className="text-[15px] leading-[1.65] text-[var(--text-bright)]">{msg.content}</p>
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-start mb-4 animate-fade-up">
              <div>
                <span className="block mb-1.5 font-mono text-[10px] font-normal tracking-[0.08em] uppercase text-[var(--accent-soft)]">
                  GOOD&apos;AI
                </span>
                <div
                  className="inline-block max-w-[85%] px-5 py-3.5"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px 16px 16px 4px',
                  }}
                >
                  <p className="text-[15px] leading-[1.65] text-[var(--text)]">{msg.content}</p>
                </div>
              </div>
            </div>
          )
        )}

        {/* Lead capture card — after first AI response */}
        {showLeadCard && !leadCaptured && (
          <LeadCaptureCard
            firstMessage={initialMessage}
            conversationTranscript={messages.map((m) =>
              m.role === 'user' ? `Them: ${m.content}` : `Us: ${m.content}`
            ).join(' / ')}
            onDismiss={() => {
              setShowLeadCard(false);
              setLeadCaptured(true);
            }}
          />
        )}

        {/* Typing indicator */}
        {isWaiting && (
          <div className="flex justify-start mb-4">
            <div>
              <span className="block mb-1.5 font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--accent-soft)]">
                GOOD&apos;AI
              </span>
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
          <form onSubmit={handleFormSubmit}>
            <div className="relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tell us your problem."
                disabled={isWaiting}
                className={[
                  'w-full py-5 pl-6 pr-14',
                  'bg-[var(--surface)] border-[var(--border)] rounded-[14px]',
                  'text-base text-[var(--text-bright)]',
                  'placeholder:text-[var(--text-dim)] placeholder:font-light',
                  'focus-visible:border-[rgba(216,106,61,0.25)]',
                  'focus-visible:shadow-[0_0_4px_var(--accent-dim),0_0_32px_rgba(0,0,0,0.5)]',
                  'focus-visible:bg-[var(--surface-raised)] focus-visible:ring-0',
                  isWaiting ? 'opacity-50' : '',
                ].join(' ')}
              />
              <button
                type="submit"
                disabled={isWaiting}
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
