'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Volume2, VolumeX } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import LeadCaptureCard from '@/components/LeadCaptureCard';
import { ChatInput } from '@/components/ChatInput';

interface ChatInterfaceProps {
  initialMessage?: string;
  onFirstResponse?: () => void;
}

export default function ChatInterface({ initialMessage = '', onFirstResponse }: ChatInterfaceProps) {
  const [showLeadCard, setShowLeadCard] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [firstMessage, setFirstMessage] = useState(initialMessage);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const leadCardRef = useRef<HTMLDivElement>(null);
  const hasCalledFirstResponse = useRef(false);
  const leadCardShown = useRef(false);
  const initialSent = useRef(false);
  const aiResponseCount = useRef(0);
  const firstMessageRef = useRef(initialMessage);
  const spokenMessageIds = useRef(new Set<string>());
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const pickVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    return (
      voices.find((voice) => voice.lang.toLowerCase().startsWith('en-au')) ??
      voices.find((voice) => voice.lang.toLowerCase().startsWith('en')) ??
      voices[0]
    );
  }, []);

  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const cleaned = text.trim();
    if (!cleaned) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleaned);
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = 0.96;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }, [pickVoice]);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onFinish() {
      aiResponseCount.current += 1;

      if (!hasCalledFirstResponse.current) {
        hasCalledFirstResponse.current = true;
        onFirstResponse?.();
      }

      if (aiResponseCount.current === 1 && !leadCardShown.current) {
        leadCardShown.current = true;
        setTimeout(() => setShowLeadCard(true), 1800);
      }
    },
  });

  const isBusy = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    if (!initialMessage || initialSent.current) return;
    initialSent.current = true;
    firstMessageRef.current = initialMessage;
    sendMessage({ text: initialMessage });
  }, [initialMessage, sendMessage]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // Voice lists can load async in some browsers; this nudges availability.
    const primeVoices = () => {
      window.speechSynthesis.getVoices();
    };

    primeVoices();
    window.speechSynthesis.addEventListener('voiceschanged', primeVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', primeVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (!ttsEnabled) return;

    const latestAssistant = [...messages]
      .reverse()
      .find((msg) => msg.role === 'assistant' && !spokenMessageIds.current.has(msg.id));

    if (!latestAssistant) return;

    const text = latestAssistant.parts
      ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map((p) => p.text)
      .join('')
      .trim();

    if (!text) return;

    spokenMessageIds.current.add(latestAssistant.id);
    speakText(text);
  }, [messages, speakText, ttsEnabled]);

  useEffect(() => {
    if (showLeadCard) {
      leadCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status, showLeadCard]);

  const handleSubmit = useCallback((text: string) => {
    if (!firstMessageRef.current) {
      firstMessageRef.current = text;
      setFirstMessage(text);
    }

    sendMessage({ text });
  }, [sendMessage]);

  return (
    <section className="min-h-[620px] overflow-hidden rounded-[24px] border-2 border-[var(--ink)] bg-white text-[var(--ink)] shadow-[4px_4px_0_var(--ink)]">
      <div className="border-b border-[var(--cream-line)] bg-[rgba(255,255,255,0.92)] px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--ocean-600)]">Good&apos;ai / Voice</p>
            <h2 className="mt-1 text-[18px] font-bold leading-tight text-[var(--ink)]">Tell us what&apos;s chewing time.</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTtsEnabled((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--ink)] bg-[var(--paper)] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] transition-all hover:-translate-x-px hover:-translate-y-px"
              aria-label={ttsEnabled ? 'Disable voice playback' : 'Enable voice playback'}
            >
              {ttsEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
              {ttsEnabled ? 'TTS On' : 'TTS Off'}
            </button>
            <span className="rounded-full border border-[var(--border-strong)] bg-[var(--paper)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)]">
              Live
            </span>
          </div>
        </div>
      </div>

      <div className="flex h-[490px] flex-col bg-[rgba(248,248,246,0.58)]">
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="mb-4 flex justify-start">
            <div className="max-w-[88%] rounded-[18px] border-2 border-[var(--ink)] bg-[var(--bg-ocean)] px-4 py-3 text-[16px] leading-snug text-[var(--fg-on-ocean)] shadow-[3px_3px_0_var(--ocean-600)]">
              Tell us the boring task that keeps landing back on your desk. We&apos;ll ask a couple of straight questions and work out what system would sort it.
            </div>
          </div>

          {messages.map((msg) => {
            const text = msg.parts
              ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
              .map((p) => p.text)
              .join('') ?? '';
            if (!text) return null;

            const isUser = msg.role === 'user';

            return (
              <div key={msg.id} className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className="flex items-end gap-2">
                  <div
                    className={[
                      'max-w-[88%] whitespace-pre-wrap rounded-[18px] border-2 px-4 py-3 text-[16px] leading-snug shadow-[var(--shadow-stamp)]',
                      isUser
                        ? 'border-[var(--ink)] bg-[var(--orange)] text-[var(--paper)]'
                        : 'border-[var(--ocean-400)] bg-[var(--ocean-50)] text-[var(--ink)] shadow-[3px_3px_0_var(--ocean-600)]',
                    ].join(' ')}
                  >
                    {text}
                  </div>
                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => speakText(text)}
                      className="mb-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-white text-[var(--ink)] shadow-[2px_2px_0_var(--ink)] transition-all hover:-translate-x-px hover:-translate-y-px"
                      aria-label="Play this message"
                    >
                      <Volume2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {showLeadCard && !leadCaptured && (
            <div ref={leadCardRef}>
              <LeadCaptureCard
                firstMessage={firstMessage}
                conversationTranscript={messages.map((m) => {
                  const text = m.parts
                    ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
                    .map((p) => p.text)
                    .join('') ?? '';
                  return m.role === 'user' ? `Them: ${text}` : `Us: ${text}`;
                }).join(' / ')}
                onDismiss={() => {
                  setShowLeadCard(false);
                  setLeadCaptured(true);
                }}
              />
            </div>
          )}

          {status === 'submitted' && (
            <div className="mb-4 flex justify-start">
              <div className="inline-flex gap-[5px] rounded-[18px] border-2 border-[var(--ocean-400)] bg-[var(--ocean-50)] px-5 py-4 shadow-[3px_3px_0_var(--ocean-600)]">
                <span className="size-[6px] rounded-full bg-[var(--ocean-500)] animate-[gai-typing_1.4s_ease-in-out_infinite]" />
                <span className="size-[6px] rounded-full bg-[var(--ocean-500)] animate-[gai-typing_1.4s_ease-in-out_infinite] [animation-delay:0.2s]" />
                <span className="size-[6px] rounded-full bg-[var(--ocean-500)] animate-[gai-typing_1.4s_ease-in-out_infinite] [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput isBusy={isBusy} onSubmit={handleSubmit} />
      </div>
    </section>
  );
}
