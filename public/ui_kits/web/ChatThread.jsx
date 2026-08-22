/* global React, Icon, Button, Input, LeadCard */
const { useState: useStateChat, useEffect: useEffectChat, useRef: useRefChat } = React;

// Fake "AI" reply generator — kit is cosmetic
const REPLIES = [
  "Yeah that's rough — Friday Xero runs are usually where the bleeding is. What software are you using right now to send them?",
  "OK got it. And how many invoices roughly per Friday — is it 5 or 50?",
  "Right — at that volume there's a clean win. Roughly: jobs flow from your job tracker into Xero as drafts, then get checked and sent in batches. Want us to scope it properly? Drop your details below and we'll be in touch.",
];

function ChatThread({ initial, onBack }) {
  const [messages, setMessages] = useStateChat([{ role: 'user', text: initial }]);
  const [pending, setPending] = useStateChat(false);
  const [input, setInput] = useStateChat('');
  const [showLead, setShowLead] = useStateChat(false);
  const [leadDone, setLeadDone] = useStateChat(false);
  const replyIdx = useRefChat(0);
  const endRef = useRefChat(null);

  useEffectChat(() => {
    // simulate first reply
    setPending(true);
    const t = setTimeout(() => {
      setMessages((m) => [...m, { role: 'ai', text: REPLIES[0] }]);
      replyIdx.current = 1;
      setPending(false);
      // show lead card after a beat
      setTimeout(() => setShowLead(true), 1400);
    }, 1100);
    return () => clearTimeout(t);
  }, []);

  useEffectChat(() => {
    endRef.current?.parentElement?.scrollTo({ top: 99999, behavior: 'smooth' });
  }, [messages, pending, showLead]);

  function send(e) {
    e.preventDefault();
    if (!input.trim() || pending) return;
    const text = input.trim();
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setPending(true);
    setTimeout(() => {
      const reply = REPLIES[replyIdx.current] || "Got it. Anything else you want us to look at?";
      replyIdx.current = Math.min(replyIdx.current + 1, REPLIES.length - 1);
      setMessages((m) => [...m, { role: 'ai', text: reply }]);
      setPending(false);
    }, 1200 + Math.random() * 600);
  }

  return (
    <section className="gai-chat">
      <div className="gai-chat-scroll">
        <div className="gai-chat-inner">
          {messages.map((m, i) => (
            <div key={i} className={cn('gai-bubble-row', m.role === 'user' && 'is-user')}>
              <div className={cn('gai-bubble', m.role === 'user' ? 'gai-bubble-user' : 'gai-bubble-ai')}>
                {m.text}
              </div>
            </div>
          ))}
          {pending && (
            <div className="gai-bubble-row">
              <div className="gai-bubble gai-bubble-ai gai-typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          {showLead && !leadDone && (
            <LeadCard
              onDismiss={() => setLeadDone(true)}
              onSubmit={() => setLeadDone(true)}
            />
          )}
          <div ref={endRef} style={{ height: 60 }} />
        </div>
      </div>

      <div className="gai-chat-bar">
        <form onSubmit={send} className="gai-chat-bar-inner">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={pending ? 'Thinking…' : 'Tell us more.'}
            disabled={pending}
          />
          <button type="submit" disabled={pending || !input.trim()} className="gai-iconbtn-send" aria-label="Send">
            <Icon name="send" size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}

Object.assign(window, { ChatThread });
