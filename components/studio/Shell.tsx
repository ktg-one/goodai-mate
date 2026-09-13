"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, Menu, X } from "lucide-react";
import { SURVEY_URL } from "@/lib/links";
export function Brand({ large = false }: { large?: boolean }) {
  return <span className={large ? "wordmark wordmark-large" : "wordmark"}>Good<span className="brand-apostrophe">’</span>Ai<span className="brand-period">.</span></span>;
}
export function StudioHeader() {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (!open) return; const close = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); menu.current?.focus(); } }; window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close); }, [open]);
  return <header className="site-header"><div className="shell header-inner"><Link className="brand-link" href="/" aria-label="Good'Ai home" onClick={() => setOpen(false)}><Brand /></Link><nav className="desktop-nav" aria-label="Main navigation"><Link href="/#services">What we do</Link><Link href="/#approach">How we work</Link><Link href="/#voice">Try the voice agent <ArrowUpRight size={14} /></Link></nav><a href={SURVEY_URL} className="button button-small header-cta">Let’s talk <ArrowUpRight size={17} /></a><button ref={menu} type="button" className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>{open && <nav id="mobile-nav" className="mobile-nav shell" aria-label="Mobile navigation"><Link href="/#services" onClick={() => setOpen(false)}>What we do <ArrowRight /></Link><Link href="/#approach" onClick={() => setOpen(false)}>How we work <ArrowRight /></Link><Link href="/#voice" onClick={() => setOpen(false)}>Try the voice agent <ArrowRight /></Link><Link href="/demo" onClick={() => setOpen(false)}>Workflow examples <ArrowRight /></Link><a href={SURVEY_URL}>Tell us what’s eating your week <ArrowUpRight /></a></nav>}</header>;
}
export function StudioFooter() {
  return <footer className="site-footer"><div className="shell"><div className="footer-top"><p>Built in Perth.<br />Good wherever you work.</p><nav aria-label="Footer navigation"><Link href="/#services">Services</Link><Link href="/#approach">Our approach</Link><a href="https://goodai.up.railway.app/">Field notes <ArrowUpRight size={14} /></a><a href={SURVEY_URL}>Get in touch <ArrowUpRight size={14} /></a></nav></div><Link href="/" className="footer-wordmark" aria-label="Good'Ai home"><Brand large /></Link><div className="footer-bottom"><span>© {new Date().getFullYear()} Good’Ai</span><span>Less busywork. More living.</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div></div></footer>;
}
