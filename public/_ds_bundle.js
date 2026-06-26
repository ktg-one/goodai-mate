/* @ds-bundle: {"format":3,"namespace":"GoodAIDesignSystem_019dfb","components":[],"sourceHashes":{"ui_kits/web/chat-thread.jsx":"a4bde4697e74","ui_kits/web/footer.jsx":"e72ac36a7bb6","ui_kits/web/hero.jsx":"b23e59569d60","ui_kits/web/lead-card.jsx":"f0692d2793bc","ui_kits/web/primitives.jsx":"7ed7b70e093c"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GoodAIDesignSystem_019dfb = window.GoodAIDesignSystem_019dfb || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/web/chat-thread.jsx
try { (() => {
/* global React, Icon, Button, Input, LeadCard */
const {
  useState: useStateChat,
  useEffect: useEffectChat,
  useRef: useRefChat
} = React;

// Fake "AI" reply generator — kit is cosmetic
const REPLIES = ["Yeah that's rough — Friday Xero runs are usually where the bleeding is. What software are you using right now to send them?", "OK got it. And how many invoices roughly per Friday — is it 5 or 50?", "Right — at that volume there's a clean win. Roughly: jobs flow from your job tracker into Xero as drafts, then get checked and sent in batches. Want us to scope it properly? Drop your details below and we'll be in touch."];
function ChatThread({
  initial,
  onBack
}) {
  const [messages, setMessages] = useStateChat([{
    role: 'user',
    text: initial
  }]);
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
      setMessages(m => [...m, {
        role: 'ai',
        text: REPLIES[0]
      }]);
      replyIdx.current = 1;
      setPending(false);
      // show lead card after a beat
      setTimeout(() => setShowLead(true), 1400);
    }, 1100);
    return () => clearTimeout(t);
  }, []);
  useEffectChat(() => {
    endRef.current?.parentElement?.scrollTo({
      top: 99999,
      behavior: 'smooth'
    });
  }, [messages, pending, showLead]);
  function send(e) {
    e.preventDefault();
    if (!input.trim() || pending) return;
    const text = input.trim();
    setMessages(m => [...m, {
      role: 'user',
      text
    }]);
    setInput('');
    setPending(true);
    setTimeout(() => {
      const reply = REPLIES[replyIdx.current] || "Got it. Anything else you want us to look at?";
      replyIdx.current = Math.min(replyIdx.current + 1, REPLIES.length - 1);
      setMessages(m => [...m, {
        role: 'ai',
        text: reply
      }]);
      setPending(false);
    }, 1200 + Math.random() * 600);
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "gai-chat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gai-chat-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gai-chat-inner"
  }, messages.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: cn('gai-bubble-row', m.role === 'user' && 'is-user')
  }, /*#__PURE__*/React.createElement("div", {
    className: cn('gai-bubble', m.role === 'user' ? 'gai-bubble-user' : 'gai-bubble-ai')
  }, m.text))), pending && /*#__PURE__*/React.createElement("div", {
    className: "gai-bubble-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gai-bubble gai-bubble-ai gai-typing"
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null))), showLead && !leadDone && /*#__PURE__*/React.createElement(LeadCard, {
    onDismiss: () => setLeadDone(true),
    onSubmit: () => setLeadDone(true)
  }), /*#__PURE__*/React.createElement("div", {
    ref: endRef,
    style: {
      height: 60
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "gai-chat-bar"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: send,
    className: "gai-chat-bar-inner"
  }, /*#__PURE__*/React.createElement(Input, {
    value: input,
    onChange: e => setInput(e.target.value),
    placeholder: pending ? 'Thinking…' : 'Tell us more.',
    disabled: pending
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: pending || !input.trim(),
    className: "gai-iconbtn-send",
    "aria-label": "Send"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "send",
    size: 16
  })))));
}
Object.assign(window, {
  ChatThread
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/chat-thread.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/footer.jsx
try { (() => {
/* global React */

function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "gai-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gai-footer-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gai-footer-brand"
  }, /*#__PURE__*/React.createElement("img", {
    className: "gai-logo",
    src: "../../assets/logo-wordmark.svg",
    alt: "Good\u2019ai",
    style: {
      height: 32
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "gai-footer-tag"
  }, "Business automations, sorted.")), /*#__PURE__*/React.createElement("div", {
    className: "gai-footer-cols"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "gai-footer-h"
  }, "Work"), /*#__PURE__*/React.createElement("a", {
    className: "gai-footer-link",
    href: "#"
  }, "Invoice flows"), /*#__PURE__*/React.createElement("a", {
    className: "gai-footer-link",
    href: "#"
  }, "CRM sync"), /*#__PURE__*/React.createElement("a", {
    className: "gai-footer-link",
    href: "#"
  }, "Voice agents"), /*#__PURE__*/React.createElement("a", {
    className: "gai-footer-link",
    href: "#"
  }, "Custom builds")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "gai-footer-h"
  }, "Company"), /*#__PURE__*/React.createElement("a", {
    className: "gai-footer-link",
    href: "#"
  }, "How we work"), /*#__PURE__*/React.createElement("a", {
    className: "gai-footer-link",
    href: "#"
  }, "Pricing"), /*#__PURE__*/React.createElement("a", {
    className: "gai-footer-link",
    href: "#"
  }, "Contact")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "gai-footer-h"
  }, "Local"), /*#__PURE__*/React.createElement("p", {
    className: "gai-footer-link"
  }, "Perth, WA \xB7 6000"), /*#__PURE__*/React.createElement("p", {
    className: "gai-footer-link"
  }, "G'day@goodai.au"), /*#__PURE__*/React.createElement("p", {
    className: "gai-footer-link"
  }, "+61 (08) 0000 0000")))), /*#__PURE__*/React.createElement("div", {
    className: "gai-footer-strip"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 Good'ai 2026 \xB7 ABN 00 000 000 000"), /*#__PURE__*/React.createElement("span", {
    className: "gai-footer-strip-r"
  }, "Knock off early. We\u2019ll sort it.")));
}
Object.assign(window, {
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/hero.jsx
try { (() => {
/* global React, Wordmark, LogoSlot, Icon, Button, Input, Eyebrow */
const {
  useState: useStateHero,
  useEffect: useEffectHero,
  useRef: useRefHero
} = React;

// ──────────────────────────────────────────────────────────────
// HeroOnePager — single screen, one textbox, AI features showcase
// ──────────────────────────────────────────────────────────────

function HeroOnePager() {
  const [problem, setProblem] = useStateHero('');
  const [phase, setPhase] = useStateHero('idle'); // idle | thinking | answered
  const [answer, setAnswer] = useStateHero('');
  const [listening, setListening] = useStateHero(false);
  const [error, setError] = useStateHero('');
  const recogRef = useRefHero(null);
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
    /* TTS removed — being reworked */
  }
  function startListen() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setError('Voice input not supported in this browser.');
      return;
    }
    if (listening) {
      recogRef.current?.stop();
      return;
    }
    const rec = new SR();
    rec.lang = 'en-AU';
    rec.interimResults = true;
    rec.continuous = false;
    let final = '';
    rec.onresult = e => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;else interim += t;
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
    setProblem('');
    setAnswer('');
    setPhase('idle');
    setError('');
  }
  return /*#__PURE__*/React.createElement("main", {
    className: "gai-onepage"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gai-onepage-top"
  }, /*#__PURE__*/React.createElement("img", {
    className: "gai-logo",
    src: "../../assets/logo-wordmark.svg",
    alt: "Good\u2019ai"
  }), /*#__PURE__*/React.createElement("span", {
    className: "gai-perth-chip"
  }, "PERTH ", /*#__PURE__*/React.createElement("span", null, "/"), " WA")), /*#__PURE__*/React.createElement("div", {
    className: "gai-onepage-inner"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Business automations \xB7 Perth \xB7 WA"), /*#__PURE__*/React.createElement("h1", {
    className: "gai-hero-h1"
  }, "Knock off early.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "We\u2019ll sort the ", /*#__PURE__*/React.createElement("span", {
    className: "hl"
  }, "boring stuff"), ".")), /*#__PURE__*/React.createElement("p", {
    className: "gai-hero-lede"
  }, "Tell us your problem. We\u2019ll figure out how to fix it."), /*#__PURE__*/React.createElement("form", {
    className: "gai-intake",
    onSubmit: ask
  }, /*#__PURE__*/React.createElement("div", {
    className: "gai-intake-field"
  }, /*#__PURE__*/React.createElement("textarea", {
    className: "gai-intake-input",
    value: problem,
    onChange: e => setProblem(e.target.value),
    placeholder: "My Friday invoicing eats 6 hours\u2026",
    rows: 3,
    disabled: phase === 'thinking'
  }), /*#__PURE__*/React.createElement("div", {
    className: "gai-intake-toolbar"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: cn('gai-tool', listening && 'is-on'),
    onClick: startListen,
    title: "Speak instead of typing"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mic",
    size: 16
  }), /*#__PURE__*/React.createElement("span", null, listening ? 'Listening…' : 'Speak')), /*#__PURE__*/React.createElement("div", {
    className: "gai-intake-spacer"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "gai-tool gai-tool-send",
    disabled: phase === 'thinking' || !problem.trim()
  }, phase === 'thinking' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "gai-spinner"
  }), /*#__PURE__*/React.createElement("span", null, "Thinking\u2026")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "Sort it"), /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 14
  }))))), /*#__PURE__*/React.createElement("p", {
    className: "gai-intake-hint"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkle",
    size: 11
  }), " One conversation. No sales call until you say so.")), error && /*#__PURE__*/React.createElement("div", {
    className: "gai-error"
  }, error), phase === 'answered' && /*#__PURE__*/React.createElement("div", {
    className: "gai-answer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gai-answer-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "gai-answer-tag"
  }, /*#__PURE__*/React.createElement("span", {
    className: "gai-answer-dot"
  }), "Good\u2019ai says"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "gai-tool gai-tool-mini",
    onClick: reset
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "refresh",
    size: 14
  }), /*#__PURE__*/React.createElement("span", null, "Reset"))), /*#__PURE__*/React.createElement("p", {
    className: "gai-answer-text"
  }, answer), /*#__PURE__*/React.createElement("div", {
    className: "gai-answer-cta"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "gai-btn gai-btn-primary gai-btn-md"
  }, "Get a callback"), /*#__PURE__*/React.createElement("span", {
    className: "gai-answer-cta-help"
  }, "or keep chatting \u2014 your call."))))), /*#__PURE__*/React.createElement("div", {
    className: "gai-features"
  }, /*#__PURE__*/React.createElement(FeatureChip, {
    icon: "mic",
    label: "Voice intake",
    detail: "Speak your problem"
  }), /*#__PURE__*/React.createElement(FeatureChip, {
    icon: "brain",
    label: "Real reasoning",
    detail: "Powered by Claude"
  }), /*#__PURE__*/React.createElement(FeatureChip, {
    icon: "bolt",
    label: "Sub-second",
    detail: "No waiting room"
  }), /*#__PURE__*/React.createElement(FeatureChip, {
    icon: "lock",
    label: "Yours alone",
    detail: "No data resold"
  })), /*#__PURE__*/React.createElement("div", {
    className: "gai-marquee"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gai-marquee-track"
  }, [...Array(2)].flatMap((_, i) => ['Email drafting', 'Invoice processing', 'CRM sync', 'Quote builders', 'Booking flows', 'Voice agents', 'Lead capture', 'Report generation', 'Onboarding', 'Data entry'].map((s, j) => /*#__PURE__*/React.createElement("span", {
    key: `${i}-${j}`,
    className: "gai-marquee-item"
  }, s, /*#__PURE__*/React.createElement("span", {
    className: "gai-marquee-sep"
  }, "/")))))));
}
function FeatureChip({
  icon,
  label,
  detail
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "gai-feature"
  }, /*#__PURE__*/React.createElement("span", {
    className: "gai-feature-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    className: "gai-feature-text"
  }, /*#__PURE__*/React.createElement("strong", null, label), /*#__PURE__*/React.createElement("span", null, detail)));
}
Object.assign(window, {
  HeroOnePager
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/lead-card.jsx
try { (() => {
/* global React, Icon, Button */
const {
  useState: useStateLead
} = React;
function LeadCard({
  onDismiss,
  onSubmit
}) {
  const [name, setName] = useStateLead('');
  const [biz, setBiz] = useStateLead('');
  const [phone, setPhone] = useStateLead('');
  const [email, setEmail] = useStateLead('');
  const [submitting, setSubmitting] = useStateLead(false);
  const [done, setDone] = useStateLead(false);
  function submit(e) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      setTimeout(() => onSubmit?.(), 1200);
    }, 800);
  }
  if (done) {
    return /*#__PURE__*/React.createElement("div", {
      className: "gai-bubble-row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "gai-leadcard gai-leadcard-success"
    }, /*#__PURE__*/React.createElement("div", {
      className: "gai-leadcard-checkwrap"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 20
    })), /*#__PURE__*/React.createElement("div", {
      className: "gai-leadcard-success-text"
    }, /*#__PURE__*/React.createElement("strong", null, "Nice one."), " We\u2019ll be in touch within 24 hours.")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "gai-bubble-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gai-leadcard"
  }, /*#__PURE__*/React.createElement("button", {
    className: "gai-leadcard-close",
    onClick: onDismiss,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 14
  })), /*#__PURE__*/React.createElement("div", {
    className: "gai-leadcard-eyebrow"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkle",
    size: 12
  }), " Want us to scope this?"), /*#__PURE__*/React.createElement("h3", {
    className: "gai-leadcard-title"
  }, "Drop your details \u2014 we\u2019ll handle it."), /*#__PURE__*/React.createElement("p", {
    className: "gai-leadcard-help"
  }, "No obligation, no runaround. We\u2019ll come back with what it\u2019d take to fix."), /*#__PURE__*/React.createElement("form", {
    className: "gai-leadcard-form",
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("div", {
    className: "gai-leadcard-row"
  }, /*#__PURE__*/React.createElement("input", {
    className: "gai-input",
    placeholder: "Name",
    required: true,
    value: name,
    onChange: e => setName(e.target.value)
  }), /*#__PURE__*/React.createElement("input", {
    className: "gai-input",
    placeholder: "Business name",
    value: biz,
    onChange: e => setBiz(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "gai-leadcard-row"
  }, /*#__PURE__*/React.createElement("input", {
    className: "gai-input",
    placeholder: "Phone",
    required: true,
    value: phone,
    onChange: e => setPhone(e.target.value)
  }), /*#__PURE__*/React.createElement("input", {
    className: "gai-input",
    placeholder: "Email",
    value: email,
    onChange: e => setEmail(e.target.value)
  })), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    variant: "primary",
    size: "md",
    disabled: submitting
  }, submitting ? 'Sending…' : 'Get a callback'))));
}
Object.assign(window, {
  LeadCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/lead-card.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/primitives.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* global React */
const {
  useState,
  useRef,
  useEffect
} = React;

// ──────────────────────────────────────────────────────────────
// PRIMITIVES — cn, Button, Input, Eyebrow, Wordmark
// ──────────────────────────────────────────────────────────────

const cn = (...xs) => xs.filter(Boolean).join(' ');
function Button({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cn('gai-btn', `gai-btn-${variant}`, `gai-btn-${size}`)
  }, props), children);
}
function Input({
  size = 'md',
  ...props
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    className: cn('gai-input', `gai-input-${size}`)
  }, props));
}
function Eyebrow({
  children,
  color
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "gai-eyebrow",
    style: color ? {
      color
    } : undefined
  }, children);
}
function Wordmark({
  size = 20,
  color = 'var(--ink)'
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "gai-wordmark",
    style: {
      fontSize: size,
      color
    }
  }, "Good", /*#__PURE__*/React.createElement("span", {
    className: "apos"
  }, "\u2019"), "ai");
}

// Placeholder slot — drop the real (Canva) logo here.
function LogoSlot({
  w = 110,
  h = 30,
  label = 'YOUR LOGO'
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "gai-logo-slot",
    style: {
      width: w,
      height: h
    },
    "aria-label": "Logo placeholder"
  }, label);
}

// Icon helpers — Lucide style, 2px stroke, currentColor
function Icon({
  name,
  size = 18
}) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  switch (name) {
    case 'arrow-right':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M5 12h14"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m12 5 7 7-7 7"
      }));
    case 'arrow-left':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "m15 18-6-6 6-6"
      }));
    case 'check':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M20 6 9 17l-5-5"
      }));
    case 'send':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "m22 2-7 20-4-9-9-4z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M22 2 11 13"
      }));
    case 'x':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M18 6 6 18"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m6 6 12 12"
      }));
    case 'sun':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      }));
    case 'sparkle':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"
      }));
    case 'mic':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("rect", {
        x: "9",
        y: "2",
        width: "6",
        height: "12",
        rx: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"
      }));
    case 'speaker':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M11 5 6 9H2v6h4l5 4z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"
      }));
    case 'pause':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("rect", {
        x: "6",
        y: "4",
        width: "4",
        height: "16",
        rx: "1"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "14",
        y: "4",
        width: "4",
        height: "16",
        rx: "1"
      }));
    case 'refresh':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M3 12a9 9 0 0 1 15-6.7L21 8"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M21 3v5h-5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M21 12a9 9 0 0 1-15 6.7L3 16"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 21v-5h5"
      }));
    case 'brain':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"
      }));
    case 'bolt':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M13 2 3 14h9l-1 8 10-12h-9z"
      }));
    case 'lock':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "11",
        width: "18",
        height: "11",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M7 11V7a5 5 0 0 1 10 0v4"
      }));
    default:
      return null;
  }
}
Object.assign(window, {
  cn,
  Button,
  Input,
  Eyebrow,
  Wordmark,
  LogoSlot,
  Icon
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/primitives.jsx", error: String((e && e.message) || e) }); }

})();
