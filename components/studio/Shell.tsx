"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, Menu, X } from "lucide-react";
import { m, useReducedMotion } from "framer-motion";
import {
  SURVEY_URL,
  PHONE_DISPLAY,
  PHONE_HREF,
  LEAD_EMAIL,
  LEAD_EMAIL_HREF,
  POLICY_EMAIL,
  POLICY_EMAIL_HREF,
  PRIVACY_EMAIL,
  PRIVACY_EMAIL_HREF,
} from "@/lib/links";
export function Brand({ large = false }: { large?: boolean }) {
  return <span className={large ? "wordmark wordmark-large" : "wordmark"}>Good<span className="brand-apostrophe">’</span>Ai<span className="brand-period">.</span></span>;
}
export function StudioHeader() {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLButtonElement>(null);
  // phones dial straight away; with a mouse there is nothing to dial with, so the first click shows the number
  const [showNumber, setShowNumber] = useState(false);
  const callAgent = (e: React.MouseEvent) => { if (!showNumber && window.matchMedia("(pointer: fine)").matches) { e.preventDefault(); setShowNumber(true); } };
  useEffect(() => { if (!open) return; const close = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); menu.current?.focus(); } }; window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close); }, [open]);
  return <header className="site-header"><div className="shell header-inner"><Link className="brand-link" href="/" aria-label="Good'Ai home" onClick={() => setOpen(false)}><Brand /></Link><nav className="desktop-nav" aria-label="Main navigation"><Link href="/#services">What we do</Link><Link href="/#approach">How we work</Link><Link href="/admin-engine">Admin engine</Link><a href={PHONE_HREF} className="header-phone" onClick={callAgent}><span aria-live="polite">{showNumber ? <><span className="sr-only">Call our AI voice agent on </span>{PHONE_DISPLAY}</> : "Call our agent"}</span></a></nav><a href={SURVEY_URL} className="button button-small header-cta">Let’s talk <ArrowUpRight size={17} /></a><button ref={menu} type="button" className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>{open && <nav id="mobile-nav" className="mobile-nav shell" aria-label="Mobile navigation"><Link href="/#services" onClick={() => setOpen(false)}>What we do <ArrowRight /></Link><Link href="/#approach" onClick={() => setOpen(false)}>How we work <ArrowRight /></Link><Link href="/admin-engine" onClick={() => setOpen(false)}>See the admin engine <ArrowRight /></Link><a href={PHONE_HREF} onClick={() => setOpen(false)}>Call our AI agent <ArrowRight /></a><Link href="/#demo" onClick={() => setOpen(false)}>Workflow examples <ArrowRight /></Link><a href={SURVEY_URL}>Tell us what’s eating your week <ArrowUpRight /></a></nav>}</header>;
}
function FooterAnimatedLink({
  href,
  children,
  isAnchor = false,
}: {
  href: string;
  children: React.ReactNode;
  isAnchor?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const isExternal = href.startsWith("http");

  const underlineVariants = {
    initial: { scaleX: 0, opacity: 0 },
    hover: { scaleX: 1, opacity: 1 },
  };

  const transition = {
    duration: 1.0,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  if (isAnchor || isExternal) {
    return (
      <m.a
        href={href}
        className="relative inline-flex items-center gap-1 group"
        initial="initial"
        whileHover="hover"
        whileFocus="hover"
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <span>{children}</span>
        {!shouldReduceMotion && (
          <m.span
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-current origin-left"
            variants={underlineVariants}
            transition={transition}
          />
        )}
      </m.a>
    );
  }

  return (
    <m.div
      className="relative inline-flex items-center group"
      initial="initial"
      whileHover="hover"
      whileFocus="hover"
    >
      <Link href={href} className="relative inline-flex items-center gap-1">
        <span>{children}</span>
        {!shouldReduceMotion && (
          <m.span
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-current origin-left"
            variants={underlineVariants}
            transition={transition}
          />
        )}
      </Link>
    </m.div>
  );
}

export function StudioFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <p>
            Built in Perth.<br />
            Good wherever you work.<br />
            <a href={PHONE_HREF} className="footer-phone">{PHONE_DISPLAY}</a><br />
            <span className="phone-caption">Business line / AI voice agent</span>
          </p>
          <nav aria-label="Footer navigation">
            <FooterAnimatedLink href="/#services">Services</FooterAnimatedLink>
            <FooterAnimatedLink href="/#approach">Our approach</FooterAnimatedLink>
            <FooterAnimatedLink href="/admin-engine">Admin engine</FooterAnimatedLink>
            <FooterAnimatedLink href={SURVEY_URL} isAnchor>
              Get in touch <ArrowUpRight size={14} />
            </FooterAnimatedLink>
          </nav>
        </div>
        <Link href="/" className="footer-wordmark" aria-label="Good'Ai home">
          <Brand large />
        </Link>
        <div className="footer-bottom flex flex-col gap-2 pt-4 text-xs opacity-90 border-t border-brand-paper/20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span>© 2026 Good AI. Perth, Western Australia.</span>
            <div className="flex items-center gap-3">
              <FooterAnimatedLink href="/terms">Terms of Use</FooterAnimatedLink>
              <span>•</span>
              <FooterAnimatedLink href="/privacy">Privacy Policy</FooterAnimatedLink>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs opacity-80">
            <span>Contact: <a href={LEAD_EMAIL_HREF} className="underline hover:text-brand-coral">{LEAD_EMAIL}</a></span>
            <span>•</span>
            <span>Legal &amp; Policy: <a href={POLICY_EMAIL_HREF} className="underline hover:text-brand-coral">{POLICY_EMAIL}</a></span>
            <span>•</span>
            <span>Data &amp; Privacy: <a href={PRIVACY_EMAIL_HREF} className="underline hover:text-brand-coral">{PRIVACY_EMAIL}</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
