const fs = require('fs');
let content = fs.readFileSync('src/components/ChatInterface.tsx', 'utf8');

const importReplacement = `import { useCallback, useEffect, useRef, useState, useMemo } from 'react';`;
content = content.replace(`import { useCallback, useEffect, useRef, useState } from 'react';`, importReplacement);


const messagesBlock = `          {messages.map((msg) => {
            const text = msg.parts
              ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
              .map((p) => p.text)
              .join('') ?? '';
            if (!text) return null;

            const isUser = msg.role === 'user';

            return (
              <div key={msg.id} className={\`mb-4 flex \${isUser ? 'justify-end' : 'justify-start'}\`}>
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
          })}`;

const leadCardBlock = `          {showLeadCard && !leadCaptured && (
            <div ref={leadCardRef}>
              <LeadCaptureCard
                firstMessage={firstMessage}
                conversationTranscript={messages.map((m) => {
                  const text = m.parts
                    ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
                    .map((p) => p.text)
                    .join('') ?? '';
                  return m.role === 'user' ? \`Them: \${text}\` : \`Us: \${text}\`;
                }).join(' / ')}
                onDismiss={() => {
                  setShowLeadCard(false);
                  setLeadCaptured(true);
                }}
              />
            </div>
          )}`;


const targetStr = `  function handleSubmit(e: React.FormEvent) {`;

const hooksInjection = `  const renderedMessages = useMemo(() => {
    return messages.map((msg) => {
      const text = msg.parts
        ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
        .map((p) => p.text)
        .join('') ?? '';
      if (!text) return null;

      const isUser = msg.role === 'user';

      return (
        <div key={msg.id} className={\`mb-4 flex \${isUser ? 'justify-end' : 'justify-start'}\`}>
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
    });
  }, [messages, speakText]);

  const renderedLeadCard = useMemo(() => {
    if (!showLeadCard || leadCaptured) return null;
    return (
      <div ref={leadCardRef}>
        <LeadCaptureCard
          firstMessage={firstMessage}
          conversationTranscript={messages.map((m) => {
            const text = m.parts
              ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
              .map((p) => p.text)
              .join('') ?? '';
            return m.role === 'user' ? \`Them: \${text}\` : \`Us: \${text}\`;
          }).join(' / ')}
          onDismiss={() => {
            setShowLeadCard(false);
            setLeadCaptured(true);
          }}
        />
      </div>
    );
  }, [showLeadCard, leadCaptured, firstMessage, messages]);

  function handleSubmit(e: React.FormEvent) {`;


content = content.replace(targetStr, hooksInjection);
content = content.replace(messagesBlock, "          {renderedMessages}");
content = content.replace(leadCardBlock, "          {renderedLeadCard}");

fs.writeFileSync('src/components/ChatInterface.tsx', content);
