'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { Send } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, memo, useCallback } from 'react';
import LeadCaptureCard from '@/components/LeadCaptureCard';

type TextPart = UIMessage['parts'][number] & { type: 'text'; text: string };

function isTextPart(part: UIMessage['parts'][number]): part is TextPart {
  return part.type === 'text' && 'text' in part && typeof part.text === 'string';
}

function getMessageText(message: UIMessage) {
  return message.parts.filter(isTextPart).map((part) => part.text).join('');
}

const ChatMessage = memo(function ChatMessage({
  message,
}: {
  message: UIMessage;
}) {
  const text = getMessageText(message);
  if (!text) return null;
  const isUser = message.role === 'user';

  return (
    <div className={`gai-bubble-row ${isUser ? 'is-user' : ''}`}>
      <div className={`gai-bubble ${isUser ? 'gai-bubble-user' : 'gai-bubble-ai'}`}>
        {text}
      </div>
    </div>
  );
});
ChatMessage.displayName = 'ChatMessage';

interface ChatInterfaceProps {
  initialMessage?: string;
  onFirstResponse?: () => void;
}

export default function ChatInterface({ initialMessage = '', onFirstResponse }: ChatInterfaceProps) {
  const [firstMessage, setFirstMessage] = useState(initialMessage);
  const [showLeadCard, setShowLeadCard] = useState(false);
  const [leadDismissed, setLeadDismissed] = useState(false);
  const firstMessageRef = useRef(initialMessage);
  const initialSent = useRef(false);
  const firstResponseHandled = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const leadCardRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onFinish() {
      if (firstResponseHandled.current) return;
      firstResponseHandled.current = true;
      onFirstResponse?.();
      setShowLeadCard(true);
    },
  });

  const isBusy = status === 'submitted' || status === 'streaming';
  const conversationTranscript = useMemo(
    () => messages.map((message) => `${message.role}: ${getMessageText(message)}`).join('\n'),
    [messages],
  );
  const errorMessage = error?.message?.trim() || 'Something went sideways. Try again in a moment.';

  useEffect(() => {
    if (!initialMessage || initialSent.current) return;
    initialSent.current = true;
    firstMessageRef.current = initialMessage;
    sendMessage({ text: initialMessage });
  }, [initialMessage, sendMessage]);

  useEffect(() => {
    if (showLeadCard) {
      leadCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status, showLeadCard]);

  const handleMessageSubmit = useCallback((text: string) => {
    if (!text || isBusy) return;

    if (!firstMessageRef.current) {
      firstMessageRef.current = text;
      setFirstMessage(text);
    }

    sendMessage({ text });
  }, [isBusy, sendMessage]);

  return (
    <div className="gai-chat">
      {/* Header bar */}
      <div className="border-b border-[var(--ink)] bg-[var(--paper)] px-4 py-3">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--ocean-600)]">
          Good&apos;ai intake
        </p>
        <h2 className="mt-1 text-[17px] font-bold leading-tight text-[var(--ink)]">
          Tell us what keeps landing back on your desk.
        </h2>
      </div>

      {/* Scrollable thread */}
      <div className="gai-chat-scroll">
        <div className="gai-chat-inner">
          {/* Initial prompt bubble */}
          <div className="gai-bubble-row">
            <div className="gai-bubble gai-bubble-ai">
              What is the boring task you want off your plate first?
            </div>
          </div>

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isBusy && (
            <div className="gai-bubble-row">
              <div className="gai-bubble gai-bubble-ai gai-typing">
                <span key="a" /><span key="b" /><span key="c" />
              </div>
            </div>
          )}

          {error && (
            <div className="gai-error">{errorMessage}</div>
          )}

          {showLeadCard && !leadDismissed && firstMessage && (
            <div ref={leadCardRef}>
              <LeadCaptureCard
                firstMessage={firstMessage}
                conversationTranscript={conversationTranscript}
                onDismiss={() => setLeadDismissed(true)}
              />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="gai-chat-bar">
        <ChatInputForm isBusy={isBusy} onSubmit={handleMessageSubmit} />
      </div>
    </div>
  );
}

const ChatInputForm = memo(function ChatInputForm({
  isBusy,
  onSubmit,
}: {
  isBusy: boolean;
  onSubmit: (text: string) => void;
}) {
  const [input, setInput] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isBusy) return;

    onSubmit(text);
    setInput('');
  }

  return (
    <form onSubmit={handleSubmit} className="gai-chat-bar-inner">
      <input
        className="gai-input flex-1"
        aria-label="Admin problem description input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={isBusy ? 'Working…' : 'My admin mess is...'}
        disabled={isBusy}
      />
      <button
        type="submit"
        disabled={isBusy || !input.trim()}
        aria-label="Send"
        className="gai-iconbtn-send"
      >
        <Send size={17} />
      </button>
    </form>
  );
});
