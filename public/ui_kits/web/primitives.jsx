/* global React */
const { useState, useRef, useEffect } = React;

// ──────────────────────────────────────────────────────────────
// PRIMITIVES — cn, Button, Input, Eyebrow, Wordmark
// ──────────────────────────────────────────────────────────────

const cn = (...xs) => xs.filter(Boolean).join(' ');

function Button({ variant = 'primary', size = 'md', children, ...props }) {
  return (
    <button className={cn('gai-btn', `gai-btn-${variant}`, `gai-btn-${size}`)} {...props}>
      {children}
    </button>
  );
}

function Input({ size = 'md', ...props }) {
  return <input className={cn('gai-input', `gai-input-${size}`)} {...props} />;
}

function Eyebrow({ children, color }) {
  return (
    <span className="gai-eyebrow" style={color ? { color } : undefined}>
      {children}
    </span>
  );
}

function Wordmark({ size = 20, color = 'var(--ink)' }) {
  return (
    <span className="gai-wordmark" style={{ fontSize: size, color }}>
      Good<span className="apos">&rsquo;</span>ai
    </span>
  );
}

// Placeholder slot — drop the real (Canva) logo here.
function LogoSlot({ w = 110, h = 30, label = 'YOUR LOGO' }) {
  return (
    <span className="gai-logo-slot" style={{ width: w, height: h }} aria-label="Logo placeholder">
      {label}
    </span>
  );
}

// Icon helpers — Lucide style, 2px stroke, currentColor
function Icon({ name, size = 18 }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  switch (name) {
    case 'arrow-right': return <svg {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
    case 'arrow-left': return <svg {...props}><path d="m15 18-6-6 6-6"/></svg>;
    case 'check': return <svg {...props}><path d="M20 6 9 17l-5-5"/></svg>;
    case 'send': return <svg {...props}><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>;
    case 'x': return <svg {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
    case 'sun': return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>;
    case 'sparkle': return <svg {...props}><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/></svg>;
    case 'mic': return <svg {...props}><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/></svg>;
    case 'speaker': return <svg {...props}><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>;
    case 'pause': return <svg {...props}><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>;
    case 'refresh': return <svg {...props}><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>;
    case 'brain': return <svg {...props}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/></svg>;
    case 'bolt': return <svg {...props}><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></svg>;
    case 'lock': return <svg {...props}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    default: return null;
  }
}

Object.assign(window, { cn, Button, Input, Eyebrow, Wordmark, LogoSlot, Icon });
