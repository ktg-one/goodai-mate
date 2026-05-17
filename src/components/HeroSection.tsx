import Image from 'next/image';
import { Mic, ShieldCheck, Volume2, WandSparkles, Zap } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';

const brandMarkSrc = '/assets/logo-mark.svg';

const featureChips = [
  {
    icon: Mic,
    label: 'Voice-ready intake',
    detail: 'Start with the messy version',
    iconClassName: 'bg-[var(--ocean-100)] text-[var(--ocean-600)]',
  },
  {
    icon: Volume2,
    label: 'Plain-language replies',
    detail: 'No hype, just what would help',
    iconClassName: 'bg-[var(--sun-100)] text-[var(--sun-500)]',
  },
  {
    icon: WandSparkles,
    label: 'Workflow thinking',
    detail: 'Focused on the boring bits',
    iconClassName: 'bg-[var(--orange-50)] text-[var(--orange-500)]',
  },
  {
    icon: Zap,
    label: 'Fast first pass',
    detail: 'Straight into the problem',
    iconClassName: 'bg-[rgba(26,63,168,0.12)] text-[var(--trust-blue)]',
  },
  {
    icon: ShieldCheck,
    label: 'Private by default',
    detail: 'No data resold',
    iconClassName: 'bg-[rgba(46,110,62,0.12)] text-[var(--ok)]',
  },
];

const serviceMarquee = [
  'Email drafting',
  'Invoice processing',
  'CRM sync',
  'Quote builders',
  'Booking flows',
  'Voice agents',
  'Lead capture',
  'Report generation',
  'Onboarding',
  'Data entry',
];

export default function HeroSection() {
  return (
    <main className="relative min-h-screen overflow-hidden px-5 pb-0 pt-6 text-[var(--fg)] sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-28 -top-20 size-[360px] rounded-full bg-[rgba(0,107,143,0.14)] blur-3xl" />
        <div className="absolute -right-16 top-0 size-[320px] rounded-full bg-[rgba(255,212,0,0.18)] blur-3xl" />
        <div className="absolute bottom-6 right-[12%] size-[300px] rounded-full bg-[rgba(242,92,43,0.14)] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1100px] items-center justify-between gap-4">
        <span className="gai-wordmark text-[1.45rem] text-[var(--ink)] sm:text-[1.7rem]">
          Good<span className="apos">&rsquo;</span>ai
        </span>
        <span className="rounded-full border-2 border-[var(--ink)] bg-white px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--ink)] shadow-[3px_3px_0_var(--ink)]">
          Perth <span className="px-1 text-[var(--orange)]">/</span> WA
        </span>
      </div>

      <section className="relative z-10 mx-auto mt-10 max-w-[760px] text-center">
        <div className="mx-auto flex h-[88px] w-[88px] items-center justify-center rounded-[22px] border-2 border-[var(--ink)] bg-[var(--bg-ocean)] shadow-[4px_4px_0_var(--ink)]">
          <Image
            src={brandMarkSrc}
            alt="Good'ai brand mark"
            width={44}
            height={76}
            priority
            className="h-[60px] w-auto"
          />
        </div>

        <span className="mt-6 inline-block font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--ocean-600)]">
          Business automations · Perth · WA
        </span>

        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--ink)] [font-variation-settings:'opsz'_144]">
          Knock off early.
          <br />
          <em className="relative z-0 inline-block font-semibold italic text-[var(--orange)] after:absolute after:inset-x-[-0.04em] after:bottom-[0.08em] after:z-[-1] after:h-[0.22em] after:-skew-x-6 after:rounded-[4px] after:bg-[var(--sun-200)]">
            We&apos;ll sort the boring stuff.
          </em>
        </h1>

        <p className="mx-auto mt-5 max-w-[500px] text-[clamp(1.05rem,1.7vw,1.25rem)] leading-[1.55] text-[var(--ink-soft)]">
          Tell us your problem. We&apos;ll figure out how to fix it.
        </p>

        <div className="mt-8">
          <ChatInterface />
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-10 flex max-w-[980px] flex-wrap justify-center gap-3">
        {featureChips.map(({ icon: Icon, label, detail, iconClassName }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-full border-2 border-[var(--ink)] bg-white px-3 py-2 shadow-[3px_3px_0_var(--ink)] transition-transform duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_var(--ink)]"
          >
            <span className={`flex size-8 items-center justify-center rounded-full ${iconClassName}`}>
              <Icon size={16} />
            </span>
            <span className="text-left leading-[1.1]">
              <strong className="block text-[13px] text-[var(--ink)]">{label}</strong>
              <span className="block pt-0.5 text-[11px] text-[var(--ink-mute)]">{detail}</span>
            </span>
          </div>
        ))}
      </section>

      <div className="relative z-10 mt-10 -mx-5 overflow-hidden border-y border-[var(--line)] bg-[rgba(248,248,246,0.72)] py-3 backdrop-blur-sm sm:-mx-8 lg:-mx-12">
        <div className="flex w-max animate-[gai-scroll_36s_linear_infinite] whitespace-nowrap">
          {[...Array(2)].flatMap((_, group) =>
            serviceMarquee.map((service) => (
              <span key={`${group}-${service}`} className="font-mono text-[13px] tracking-[0.04em] text-[var(--ink-soft)]">
                {service}
                <span className="px-4 text-[var(--orange-300)]">/</span>
              </span>
            ))
          )}
        </div>
      </div>

      <footer className="relative z-10 mt-14 -mx-5 bg-[var(--ink)] px-5 py-10 text-[var(--paper)] sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
        <div className="mx-auto grid max-w-[1100px] gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div>
            <span className="gai-wordmark text-[2rem] text-[var(--paper)]">
              Good<span className="apos">&rsquo;</span>ai
            </span>
            <p className="mt-3 max-w-[26rem] text-[15px] leading-7 text-[rgba(248,248,246,0.76)]">
              Business automations, sorted. We help Perth operators get the boring stuff off their desk.
            </p>
            <div className="mt-5 inline-flex rounded-full border border-[rgba(248,248,246,0.22)] bg-[rgba(255,255,255,0.06)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--sun-200)]">
              Knock off early. We&apos;ll sort it.
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[rgba(248,248,246,0.56)]">Work</h2>
              <div className="mt-3 space-y-2 text-[15px] text-[rgba(248,248,246,0.82)]">
                <p>Invoice flows</p>
                <p>CRM sync</p>
                <p>Voice agents</p>
                <p>Custom builds</p>
              </div>
            </div>
            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[rgba(248,248,246,0.56)]">Company</h2>
              <div className="mt-3 space-y-2 text-[15px] text-[rgba(248,248,246,0.82)]">
                <p>How we work</p>
                <p>Pricing</p>
                <p>Contact</p>
              </div>
            </div>
            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[rgba(248,248,246,0.56)]">Local</h2>
              <div className="mt-3 space-y-2 text-[15px] text-[rgba(248,248,246,0.82)]">
                <p>Perth, WA</p>
                <p>gday@goodai.au</p>
                <p>+61 (08) 0000 0000</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-[1100px] items-center justify-between gap-4 border-t border-[rgba(248,248,246,0.14)] pt-5 text-[12px] text-[rgba(248,248,246,0.56)]">
          <span>© Good&apos;ai 2026</span>
          <span>Built for Perth businesses that want their time back.</span>
        </div>
      </footer>
    </main>
  );
}
