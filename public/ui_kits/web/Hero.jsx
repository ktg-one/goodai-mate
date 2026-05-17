/* global React, Wordmark, Icon, Button, Input, Eyebrow */
const { useState: useStateHero, useEffect: useEffectHero, useRef: useRefHero } = React;

// ──────────────────────────────────────────────────────────────
// HeroOnePager — single screen, one textbox, AI features showcase
// ──────────────────────────────────────────────────────────────

function HeroOnePager() {
  const [problem, setProblem] = useStateHero('');
  const [phase, setPhase] = useStateHero('idle'); // idle | thinking | answered
  const [answer, setAnswer] = useStateHero('');
  const [speaking, setSpeaking] = useStateHero(false);
  const [listening, setListening] = useStateHero(false);
  const [error, setError] = useStateHero('');
  const recogRef = useRefHero(null);
  const utterRef = useRefHero(null);

  async function ask(e) {
    e?.preventDefault();
    if (!problem.trim() || phase === 'thinking') return;
    setPhase('thinking');
    setError('');
    setAnswer('');
    try {
      const reply = await window.claude.complete(`You are the intake assistant for Good'ai, a Perth-based business automation company helping small-to-medium business owners. Voice: a switched-on Aussie mate who gets business — not a salesperson, not a robot. Casual, warm, direct. Short sentences. Use "we" not "I". NEVER say "AI", "machine learning", "leverage", "synergy", "optimize", "streamline". Say "automation", "system", "workflow" instead. No bullet points. Keep it under 3 sentences. Acknowledge the problem, give a quick useful insight, ask one focused question. \n\nThe person's problem: "${problem.trim()}"`);
      setAnswer(reply);
      setPhase('answered');
    } catch (err) {
      setError("Couldn't reach the brain just now. Try again?");
      setPhase('idle');
    }
  }

  function speak() {
    if (!answer) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(answer);
    // Prefer an English voice
    const voices = window.speechSynthesis.getVoices();
    const en = voices.find((v) => /en[-_]AU/i.test(v.lang)) || voices.find((v) => /en/i.test(v.lang));
    if (en) u.voice = en;
    u.rate = 1.0; u.pitch = 1.0;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    utterRef.current = u;
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }

  function startListen() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setError('Voice input not supported in this browser.'); return; }
    if (listening) {
      recogRef.current?.stop();
      return;
    }
    const rec = new SR();
    rec.lang = 'en-AU';
    rec.interimResults = true;
    rec.continuous = false;
    let final = '';
    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t; else interim += t;
      }
      setProblem((problem ? problem + ' ' : '') + (final || interim).trim());
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recogRef.current = rec;
    setListening(true);
    rec.start();
  }

  function reset() {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setProblem('');
    setAnswer('');
    setPhase('idle');
    setError('');
  }

  return (
    <main className="gai-onepage">
      {/* Background ornaments */}
      <div className="gai-hero-bg" aria-hidden="true">
        <div className="gai-blob gai-blob-teal" />
        <div className="gai-blob gai-blob-sun" />
        <div className="gai-blob gai-blob-tomato" />
      </div>

      {/* Top bar — wordmark left, perth chip right */}
      <div className="gai-onepage-top">
        <Wordmark size={22} />
        <span className="gai-perth-chip">PERTH <span>/</span> WA</span>
      </div>

      <div className="gai-onepage-inner">
        {/* Brand mark */}
        <div className="gai-hero-mark">
          <img src="../../assets/logo-mark.svg" alt="Good'ai" />
        </div>

        <Eyebrow color="var(--ocean-600)">Business automations · Perth · WA</Eyebrow>

        <h1 className="gai-hero-h1">
          Knock off early.<br/>
          <em>We&rsquo;ll sort the boring stuff.</em>
        </h1>

        <p className="gai-hero-lede">
          Tell us your problem. We&rsquo;ll figure out how to fix it.
        </p>

        {/* Single intake textbox with mic + send + try-it-out */}
        <form className="gai-intake" onSubmit={ask}>
          <div className="gai-intake-field">
            <textarea
              className="gai-intake-input"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="My Friday invoicing eats 6 hours…"
              rows={3}
              disabled={phase === 'thinking'}
            />
            <div className="gai-intake-toolbar">
              <button type="button" className={cn('gai-tool', listening && 'is-on')} onClick={startListen} title="Speak instead of typing">
                <Icon name="mic" size={16} />
                <span>{listening ? 'Listening…' : 'Speak'}</span>
              </button>
              <div className="gai-intake-spacer" />
              <button type="submit" className="gai-tool gai-tool-send" disabled={phase === 'thinking' || !problem.trim()}>
                {phase === 'thinking' ? (
                  <><span className="gai-spinner" /><span>Thinking…</span></>
                ) : (
                  <><span>Sort it</span><Icon name="arrow-right" size={14} /></>
                )}
              </button>
            </div>
          </div>
          <p className="gai-intake-hint">
            <Icon name="sparkle" size={11} /> One conversation. No sales call until you say so.
          </p>
        </form>

        {error && <div className="gai-error">{error}</div>}

        {/* Answer panel */}
        {phase === 'answered' && (
          <div className="gai-answer">
            <div className="gai-answer-head">
              <span className="gai-answer-tag">
                <span className="gai-answer-dot" />
                Good&rsquo;ai says
              </span>
              <button type="button" className={cn('gai-tool gai-tool-mini', speaking && 'is-on')} onClick={speak}>
                <Icon name={speaking ? 'pause' : 'speaker'} size={14} />
                <span>{speaking ? 'Stop' : 'Hear it'}</span>
              </button>
              <button type="button" className="gai-tool gai-tool-mini" onClick={reset}>
                <Icon name="refresh" size={14} />
                <span>Reset</span>
              </button>
            </div>
            <p className="gai-answer-text">{answer}</p>
            <div className="gai-answer-cta">
              <button type="button" className="gai-btn gai-btn-primary gai-btn-md">
                Get a callback
              </button>
              <span className="gai-answer-cta-help">or keep chatting — your call.</span>
            </div>
          </div>
        )}

        {/* Feature strip — showcases capabilities */}
        <div className="gai-features">
          <FeatureChip icon="mic" label="Voice intake" detail="Speak your problem" />
          <FeatureChip icon="speaker" label="Read it back" detail="Hear our reply" />
          <FeatureChip icon="brain" label="Real reasoning" detail="Powered by Claude" />
          <FeatureChip icon="bolt" label="Sub-second" detail="No waiting room" />
          <FeatureChip icon="lock" label="Yours alone" detail="No data resold" />
        </div>
      </div>

      {/* Marquee — what we automate */}
      <div className="gai-marquee">
        <div className="gai-marquee-track">
          {[...Array(2)].flatMap((_, i) => [
            'Email drafting','Invoice processing','CRM sync','Quote builders','Booking flows','Voice agents','Lead capture','Report generation','Onboarding','Data entry',
          ].map((s, j) => (
            <span key={`${i}-${j}`} className="gai-marquee-item">
              {s}<span className="gai-marquee-sep">/</span>
            </span>
          )))}
        </div>
      </div>
    </main>
  );
}

function FeatureChip({ icon, label, detail }) {
  return (
    <div className="gai-feature">
      <span className="gai-feature-icon"><Icon name={icon} size={16} /></span>
      <div className="gai-feature-text">
        <strong>{label}</strong>
        <span>{detail}</span>
      </div>
    </div>
  );
}

Object.assign(window, { HeroOnePager });
