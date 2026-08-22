'use client';

import { useState, useRef, useEffect } from 'react';
// CRITICAL (AGENTS.md): direct imports, no barrels
import { GemVoice } from '@/components/voice-agent/gem-voice';
import ChatInterface from '@/components/ChatInterface';
import LeadCaptureCard from '@/components/LeadCaptureCard';
// Direct imports (AGENTS.md) — stamp primitives for mail docket surfaces
import StampButton from '@/components/StampButton';
import StampCard from '@/components/StampCard';
// Framer for declarative whileInView stamp-clack on dynamic filed dockets (in-tray).
// Pure entry variance + light scroll-linked life. Does not fight GSAP mailBoard timelines.
import { motion, useReducedMotion } from 'motion/react';

// Marketing sections (sourced from public/ design system as the single source of truth)
import WhyGoodAI from '@/components/marketing/WhyGoodAI';
import Manifest from '@/components/marketing/Manifest';
import AISolutions from '@/components/marketing/AISolutions';
import VoiceAgentDemo from '@/components/marketing/VoiceAgentDemo';
import BuzzCTA from '@/components/marketing/BuzzCTA';
import { BrandShapesStamp } from '@/components/brand/BrandWordmark';


// GSAP for mail-stack composition (per gsap-awwwards-website + gsap-scrolltrigger skills)
// useGSAP auto-cleans; mechanical 60fps ScrollTrigger timelines for ribbons + pinned notices + page reactions
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Good'ai Marketing Site — Main Page
 *
 * Structure (per latest brief):
 * - HERO - TTS / Voice feature (the product)
 * - Why GoodAI?
 * - Manifest
 * - Voice Agents Tiers (blank for now)
 * - AI solutions
 * - Voice agent demo + CTA
 *
 * Design system: public/ is the source of truth.
 */
export default function HomeClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const [showTextMode, setShowTextMode] = useState(false);
  const [leadData, setLeadData] = useState<{ problem: string; answer: string } | null>(null);

  interface FiledMail { transcript: string; response: string; ts: number }

  // Live leaked mail from VoiceAgentHero conversations — "files" into the persistent docket strip
  const [filedMails, setFiledMails] = useState<FiledMail[]>([]);

  const prefersReducedMotion = useReducedMotion();

  const handleMailFiled = (transcript: string, response: string) => {
    setFiledMails(prev => {
      const next = [...prev, { transcript, response, ts: Date.now() }].slice(-3); // keep last 3 physical "in tray"
      return next;
    });

    // === PHYSICAL RIBBON "TEAR SNAP" ON NEW DOCKET (stamp clack impulse) ===
    // Real tape: slow pull then quick release shear + flutter decay. Not smooth.
    // Mirrors award-config "tearing forward with shear, flutter, and lag variance".
    const snap = (ref: React.RefObject<HTMLDivElement | null>, baseShear: number) => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        '--tape-shear': baseShear * 2.6,
        '--tape-flutter': `${(baseShear > 0 ? 4.2 : -3.8)}px`,
        duration: 0.07,
        ease: 'power2.out',
      });
      gsap.to(ref.current, {
        '--tape-shear': baseShear,
        '--tape-flutter': '0px',
        duration: 0.38,
        ease: 'power3.out',
        delay: 0.05,
      });
    };
    snap(ribbon1Ref, 0.9);
    snap(ribbon2Ref, 1.35);
    snap(ribbon3Ref, -0.6);
  };

  // Refs for mail-stack GSAP orchestration (ribbons, board depth, pinned notices)
  const mailBoardRef = useRef<HTMLDivElement>(null);
  const ribbon1Ref = useRef<HTMLDivElement>(null); // hero -> WhyGoodAI
  const ribbon2Ref = useRef<HTMLDivElement>(null); // Why -> Manifest
  const ribbon3Ref = useRef<HTMLDivElement>(null); // Manifest -> DocketFlow
  const docketFlowRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  // === MAIL STACK GSAP TIMELINES (concrete, per gsap-awwwwards-website SPYLT physical feel) ===
  // Full-page rhythm: ribbons advance/tear on scrub. Non-uniform pinned cards (rot + edge offset variance).
  // Hero filing amplified to page grain + edge shadow via CSS var + data attr.
  // Reduced motion: all timelines killed + static docket imprints (pre-set physical variance).
  // Listener for live OS pref change (a11y). No layout thrash — transforms/shadows only.
  useGSAP(() => {
    if (!mounted || !mailBoardRef.current) return;

    const mm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduced = mm.matches;
    if (reduced) {
      // Static physical imprints for pinned notices (real board variance, no motion)
      // COMPLETE: all stamps/pins/rots/perforations + letter micro assets visible
      if (docketFlowRef.current) {
        const cards = docketFlowRef.current.querySelectorAll('.pinned-notice');
        const rots = [-2.1, 1.65, -0.95, 2.45];
        const oxs = [-4, 5, -3, 4];
        const oys = [3, -4, 5, -2];
        cards.forEach((card, idx) => {
          const el = card as HTMLElement;
          el.style.transform = `rotate(${rots[idx % rots.length]}deg) translate(${oxs[idx % oxs.length]}px, ${oys[idx % oys.length]}px)`;
          el.style.opacity = '1';
          el.style.boxShadow = '3px 3px 0 var(--ink)';
          // static letter micro for docket (anti under-use)
          const letter = el.querySelector('.docket-letter') as HTMLElement | null;
          if (letter) letter.style.opacity = '0.35';
        });
      }
      return;
    }

    // Live kill on preference flip (production a11y)
    const killAll = () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      gsap.globalTimeline.clear();
    };
    const handleMotionPreferenceChange = (e: MediaQueryListEvent) => {
      if (e.matches) killAll();
    };
    mm.addEventListener?.('change', handleMotionPreferenceChange);

    const ctx = gsap.context(() => {
      // 1. HERO FILING AMPLIFIED — secondary page reactions (grain shift + edge shadow on whole canvas)
      // Drive a CSS var and data-depth for .mail-board as the hero "files" deeper into the stack.
      const heroProgress = { value: 0 };
      ScrollTrigger.create({
        trigger: mailBoardRef.current,
        start: 'top 25%',
        end: '+=620',
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          heroProgress.value = p;
          // Subtle grain "settle" + deeper pile shadow on the board itself.
          // ALSO feed --hero-filing-progress so ALL stamp surfaces + ribbons
          // get unified ink transfer + shadow compression (Framer hero + GSAP board = one physical mail stack).
          if (mailBoardRef.current) {
            mailBoardRef.current.style.setProperty('--hero-filing-progress', p.toFixed(3)); // bridge for full participation
            mailBoardRef.current.dataset.depth = p > 0.55 ? 'deep' : '';
          }
        },
      });

      // 2. AGGRESSIVE RIBBON BRIDGES — real perforated tape with shear + tear physics (SPYLT mail)
      // Each has independent lag + shear for paper buckle/tear feel on scrub. Feeds forward continuously.
      // Enhanced flutter amp for more "wind on paper" mechanical.
      const ribbons = [
        { ref: ribbon1Ref, advance: 1.08, shear: 0.9 },
        { ref: ribbon2Ref, advance: 1.22, shear: 1.35 },
        { ref: ribbon3Ref, advance: 0.97, shear: -0.6 }, // tear bridge opposing shear for physical rip
      ];

      ribbons.forEach(({ ref, advance, shear }, i) => {
        if (!ref.current) return;
        const el = ref.current;
        const baseScrub = 0.8 + i * 0.09;

        // Master timeline for progress + shear (real tape torque)
        const tl = gsap.timeline({ defaults: { ease: 'none' } });
        tl.to(el, { '--tape-progress': advance, duration: 1 }, 0);
        tl.to(el, { '--tape-shear': shear, duration: 1 }, 0);

        ScrollTrigger.create({
          trigger: el,
          start: 'top 81%',
          end: 'bottom 19%',
          scrub: baseScrub,
          animation: tl,
          invalidateOnRefresh: true,
          onUpdate(self) {
            // Live micro flutter — physical paper in breeze + lag, NOT regular electric sine.
            // Lower freqs + incommensurate for organic tear/flutter. Matches award-config "shear, flutter, lag variance".
            const p = self.progress;
            const lag = i * 0.7; // each ribbon has slight phase lag for real tape weight
            const flutter = (Math.sin(p * 4.8 + lag) * 3.1 + Math.cos(p * 7.1 + lag * 1.3) * 1.9) * (0.55 + p * 0.55);
            el.style.setProperty('--tape-flutter', `${(flutter * (0.5 + p * 0.45)).toFixed(1)}px`);
          },
        });
      });

      // 3. THE DOCKET — four pinned narrative cards telling the post-conversation story.
      // REAL MAIL VARIANCE: stronger individual rots/offsets + edge wear + stamp imprint participation.
      // Hard clack settle, non-uniform micro-timing. Feels like real notices on a 1978 board.
      // Letters integrated as micro stamped elements (anti under-use).
      if (docketFlowRef.current) {
        const cards = docketFlowRef.current.querySelectorAll('.pinned-notice');
        cards.forEach((card, idx) => {
          const rots = [-2.1, 1.65, -0.95, 2.45];
          const oxs = [-4, 5, -3, 4];
          const oys = [3, -4, 5, -2];
          const wears = [false, true, false, true];
          const rot = rots[idx % rots.length];
          const ox = oxs[idx % oxs.length];
          const oy = oys[idx % oys.length];

          gsap.set(card, {
            rotate: rot,
            x: ox,
            y: oy + 22,
            opacity: 0,
            boxShadow: '2px 2px 0 var(--ink)',
            '--stamp-depth': 0.15,
          });
          if (wears[idx % wears.length]) (card as HTMLElement).dataset.wear = 'true';

          let isSettled = false;
          ScrollTrigger.create({
            trigger: card,
            start: `top ${80 + (idx % 4) * 1.8}%`,
            end: '+=95',
            scrub: 0.42,
            onUpdate: (self) => {
              const p = self.progress;
              const settleY = (1 - p) * 22;
              const settleRot = rot * (1 - p * 0.72);
              const nowSettled = p > 0.68;
              if (nowSettled !== isSettled) {
                isSettled = nowSettled;
                gsap.set(card, {
                  boxShadow: isSettled ? '6.1px 6.1px 0 var(--ink)' : '2.5px 2.5px 0 var(--ink)',
                });
              }
              gsap.set(card, {
                y: oy + settleY,
                rotate: settleRot,
                opacity: Math.min(1, p * 1.12),
                '--stamp-depth': Math.min(0.95, p * 1.05),
              });
            },
          });
        });
      }

      // 4. DEFINITIVE CLOSING STAMPED FOOTER RITUAL — the last heavy docket stamped into the tray.
      // GSAP-driven heavy clack, wonk max, red imprint lock, board reaction. Only fully settles on scroll end.
      if (footerRef.current) {
        const wonk = footerRef.current.querySelector('.wonk-line');
        const red = footerRef.current.querySelector('.red-accent');

        if (wonk) {
          gsap.fromTo(
            wonk,
            { '--wonk': 0.18, opacity: 0.55 },
            {
              '--wonk': 0.86,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: footerRef.current,
                start: 'top 72%',
                end: 'bottom 32%',
                scrub: 0.85,
              },
            }
          );
        }

        // Heavy mechanical ritual scrub + final pin clack lock + board settle propagation.
        // PIN: the last thick docket "clacks home" and stays locked while the rest of the tray rifles past.
        // This is the signature "1978 mail board being rifled" moment — footer pins, wonk + red lock, ribbons tear final.
        ScrollTrigger.create({
          trigger: footerRef.current,
          start: 'top 68%',
          end: 'bottom 18%',
          scrub: 0.7,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (footerRef.current) {
              footerRef.current.style.setProperty('--stamp-depth', (p * 0.95).toFixed(2));
            }
          },
          onLeave: () => {
            // SAVAGE FINAL STAMPED DOCKET CLACK RITUAL (the last heavy pin).
            // 120ms hard mechanical (no float). Adds .stamp-clack-red to red accent + full board settle.
            // Ribbons get one last tear shear. This is the "mail board is full, docket locked" artifact.
            const f = footerRef.current;
            if (f) {
              f.classList.add('stamp-clack-red');
              // Heavy shadow slam + wonk lock
              gsap.to(f, {
                '--stamp-depth': 1.0,
                duration: 0.12,
                ease: 'none',
                onComplete: () => f.classList.remove('stamp-clack-red'),
              });
            }
            // Final ribbon3 tear shear clack (real perforated snap)
            if (ribbon3Ref.current) {
              gsap.to(ribbon3Ref.current, {
                '--tape-shear': -2.8,
                '--tape-flutter': '5.5px',
                duration: 0.085,
                ease: 'none',
                onComplete: () => {
                  if (ribbon3Ref.current) gsap.to(ribbon3Ref.current, { '--tape-flutter': '0px', duration: 0.18, ease: 'none' });
                },
              });
            }
          },
        });

        if (red) {
          ScrollTrigger.create({
            trigger: red,
            start: 'top 79%',
            once: true,
            onEnter: () => {
              // One final hard red stamp clack (no power2 float)
              red.classList.add('stamp-clack-red');
              setTimeout(() => red.classList.remove('stamp-clack-red'), 145);
            },
          });
        }
      }
    }, mailBoardRef);

    return () => {
      mm.removeEventListener?.('change', handleMotionPreferenceChange);
      ctx.revert();
    }; // cleanup on unmount / reduced motion change
  }, { scope: mailBoardRef, dependencies: [mounted] });

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--paper)] flex items-center justify-center font-mono text-xs uppercase tracking-[0.16em]">
        Compiling docket board...
      </div>
    );
  }

  return (
    <div ref={mailBoardRef} className="mail-board overflow-x-hidden">
      {/* HERO - TTS feature (the Voice Agent as the product) — descent files into the stack */}
      <GemVoice 
        onMailFiled={handleMailFiled}
      />

      {/* RIBBON 1: hero visualizer language → WhyGoodAI (paper tape bridge) */}
      <div ref={ribbon1Ref} className="mail-ribbon w-full" aria-hidden="true" />

      {/* Why GoodAI? */}
      <WhyGoodAI />

      {/* RIBBON 2: Why → Manifest (perforated docket strip) */}
      <div ref={ribbon2Ref} className="mail-ribbon w-full" aria-hidden="true" />

      {/* Manifest */}
      <Manifest />

      {/* RIBBON 3: Manifest → strong Docket Flow (receipt bridge with tear) */}
      <div ref={ribbon3Ref} className="mail-ribbon-tear w-full" aria-hidden="true" />

      {/* Voice Agents Tiers — REPLACED: strong narrative "Docket Flow" (pinned mail rhythm, non-uniform) */}
      <section ref={docketFlowRef} className="py-20 md:py-28 border-t-2 border-[var(--ink)] bg-[var(--paper)]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-9">
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--coral)]">FILED · MAIL</span>
            <h2 className="font-display text-5xl md:text-6xl tracking-[-0.03em] leading-none mt-2">
              What happens after you <span className="hl">speak</span>.
            </h2>
            <p className="mt-3 max-w-md text-xl text-[var(--ink)]/80">
              We turn the conversation into a real docket. No portals. No logins. Just work that gets done.
            </p>
          </div>

          {/* Non-uniform staggered pinned notices (real mail variance: rot + offsets, individual GSAP landing) */}
          {/* Letters integrated as micro stamped elements (anti under-use of letter-*.svg) */}
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl">
            {([
              { title: 'We listen once.', body: 'You speak the mess. Invoicing, follow-ups, quotes, the lot. The Voice Agent catches it locally.', variant: 'gold' },
              { title: 'We build the system.', body: 'Our team turns it into live automations in the tools you already use. Xero, ServiceM8, Tradify, whatever.', variant: 'navy' },
              { title: 'It just runs.', body: 'You get time back. We keep the boring stuff off your plate every week. Perth mate, not a dashboard.', variant: 'gold' },
              { title: 'You knock off early.', body: 'The docket is closed. Kids, footy, whatever matters. We sorted the systems.', variant: 'navy' },
            ] as const).map((item, i) => (
              <StampCard
                key={i}
                variant={item.variant}
                pin
                className="p-7 relative"
                style={({
                  '--rot': `${[-2.0, 1.55, -0.85, 2.3][i % 4]}deg`,
                  '--ox': `${[-3, 4, -2, 3][i % 4]}px`,
                  '--oy': `${[2, -3, 4, -1][i % 4]}px`,
                } as React.CSSProperties)}
                data-wear={i % 2 === 1 ? 'true' : undefined}
              >
                <BrandShapesStamp
                  className="docket-letter pointer-events-none absolute bottom-3 right-3 h-5 w-auto"
                  style={{ transform: `rotate(${[-8, 6, -4, 9][i % 4]}deg)` }}
                />
                <h3 className="font-bold text-2xl tracking-[-0.015em] mb-3">{item.title}</h3>
                <p className="opacity-85 text-[15px] leading-snug">{item.body}</p>
                {i === 3 && <div className="mt-3 inline-block text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--coral)] border-b border-[var(--coral)]">LAST PIN • DOCKET CLOSED</div>}
              </StampCard>
            ))}
          </div>
        </div>
      </section>

      {/* Systems section — participates in unified mailBoard GSAP non-uniform pinned variance (real docket board) */}
      <AISolutions />

      {/* PERSISTENT PHYSICAL IN-TRAY — conversation state leaks as real filed paper dockets on the board.
          Receipt tape / pinned strip aesthetic. New mails can visually "clack" in. */}
      {filedMails.length > 0 && (
        <div className="in-tray-physical py-5 sticky bottom-0 z-40">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex items-center gap-3 mb-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--coral)]">MAIL RECEIVED — IN TRAY</span>
              <div className="flex-1 h-px bg-[var(--ink)]/30" />
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              {filedMails.map((mail, idx) => {
                // Physical mail variance for each newly filed docket (non-uniform like real tray)
                const rot = [-0.8, 1.1, -0.4, 0.9][idx % 4];
                const ox = [-1, 2, -2, 1][idx % 4];
                return (
                  <motion.div 
                    key={mail.ts} 
                    className="filed-docket px-4 py-2 max-w-[320px] text-[var(--ink)]/90 stamp-press relative"
                    initial={prefersReducedMotion ? { opacity: 1, rotate: rot, x: ox, boxShadow: '3px 3px 0 var(--ink)' } : { opacity: 0, y: 8, rotate: rot - 1.5, x: ox - 3, boxShadow: '1px 1px 0 var(--ink)' }}
                    whileInView={prefersReducedMotion ? { opacity: 1 } : { 
                      opacity: 1, 
                      y: 0, 
                      rotate: rot, 
                      x: ox,
                      boxShadow: '3px 3px 0 var(--ink)',
                      transition: { duration: 0.125, ease: [0.23, 1, 0.32, 1] } // exact stamp clack timing (90-160ms canon)
                    }}
                    viewport={{ once: true, margin: '-20px' }}
                    style={{ transformOrigin: '40% 20%' }}
                  >
                    {/* letter micro on filed docket */}
                    <BrandShapesStamp className="absolute top-1 right-1 h-3 w-auto opacity-25" />
                    <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--ink)]/50 mb-0.5">YOU SAID</div>
                    <div className="line-clamp-1">“{mail.transcript.slice(0, 82)}”</div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--navy)] mt-1.5 mb-0.5"><span className="normal-case">Good<span style={{ color: 'var(--coral)' }}>&apos;</span>ai</span> FILED</div>
                    <div className="line-clamp-1 text-[var(--ink)]">“{mail.response.slice(0, 78)}”</div>
                  </motion.div>
                );
              })}
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--ink)]/40 mt-2">These conversations stay on your machine. Last few dockets filed into the tray.</p>
          </div>
        </div>
      )}

      {/* Voice agent demo (enhanced) + strong CTA */}
      <VoiceAgentDemo />

      {/* Fallback text mode (temporary) */}
      <section className="py-20 md:py-28 border-t-2 border-[var(--ink)] bg-[var(--paper)]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-6">
            <StampButton
              variant="paper"
              size="sm"
              onClick={() => setShowTextMode(!showTextMode)}
              className="font-mono uppercase tracking-[0.16em]"
            >
              {showTextMode ? 'HIDE TEXT MODE' : 'OR JUST TYPE IT'}
            </StampButton>
          </div>

          {showTextMode && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <ChatInterface
                initialMessage="I'd like to describe my admin problem in text."
                onFirstResponse={() => {}}
              />
              {leadData && (
                <LeadCaptureCard
                  firstMessage={leadData.problem}
                  conversationTranscript={leadData.answer}
                  onDismiss={() => setLeadData(null)}
                />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Website Analyzer — BLOCKED OUT until ready.
          To restore: re-add `import WebsiteAnalyzer from '@/components/marketing/WebsiteAnalyzer';`
          and a <section className="py-20 md:py-28 border-t-2 border-[var(--ink)] bg-[var(--paper)]"><WebsiteAnalyzer /></section> here. */}

      {/* Single buzz CTA — frontend only; wire onSubmit when backend is ready */}
      <section
        id="buzz-cta"
        className="py-16 md:py-20 border-t-2 border-[var(--ink)] bg-[var(--paper)]"
      >
        <div className="mx-auto max-w-3xl px-6">
          <BuzzCTA />
        </div>
      </section>

      {/* POWERFUL CLOSING RITUAL — final thick ink navy stamped footer docket */}
      {/* Contains core promise + minimal contact + "we'll sort the boring stuff" in Fraunces WONK */}
      <footer
        ref={footerRef}
        className="mail-docket-footer bg-[var(--navy)] border-t-4 border-[var(--ink)] py-14 px-6 text-[var(--paper)]"
      >
        <div className="mx-auto max-w-4xl text-center">
          <div className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--gold-tint)] mb-4">
            <span className="normal-case">Good<span style={{ color: 'var(--coral)' }}>&apos;</span>ai</span> — PERTH
          </div>

          <div className="core-promise text-4xl md:text-5xl tracking-[-0.025em] leading-none mb-6">
            You didn&apos;t start this to do admin.<br />We&apos;ll sort the boring stuff.
          </div>

          {/* The ritual line — Fraunces WONK axis, gold-tint, thick ink stamp feel */}
          <div className="wonk-line text-3xl md:text-[42px] tracking-[-0.01em] mb-8">
            we&apos;ll sort the boring stuff
          </div>

          <div className="max-w-xs mx-auto text-sm text-[var(--paper)]/70 mb-8">
            Built in Perth for tradies, makers and small operators who just want their evenings back.
          </div>

          {/* Minimal contact + one red accent CTA (enforced — full stamp-btn physics) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:hello@goodai.au"
              className="red-accent stamp-btn stamp-btn-red inline-flex items-center justify-center font-bold text-lg px-9 py-3.5"
            >
              DROP US A LINE
            </a>
            <div className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--paper)]/50 sm:ml-2">
              goodai.au • 08 0000 0000
            </div>
          </div>

          <div className="mt-10 text-[10px] font-mono tracking-[0.16em] text-[var(--paper)]/40">
            No dashboards. No portals. Just systems that run.
          </div>
        </div>
      </footer>
    </div>
  );
}
