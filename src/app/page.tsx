import type { Metadata } from 'next';
<<<<<<< HEAD
import HomeClient from '@/components/HomeClient';

export const metadata: Metadata = {
  title: "Good'ai — Business Automations, Sorted",
  description: "Perth-based business automations for SMEs. Tell us your problem, we'll fix it.",
  openGraph: {
    title: "Good'ai — Business Automations, Sorted",
    description: "Stop working. Start living. Automated relief for Perth SMEs.",
    url: 'https://goodai.au',
    siteName: "Good'ai",
    locale: 'en_AU',
    type: 'website',
  },
};

export default function Home() {
  return <HomeClient />;
=======

export const metadata: Metadata = {
  title: "Good'ai — Maintenance",
  description: "We're currently performing maintenance. A working template is coming soon.",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl space-y-8">
        <h1 className="h1">
          <span className="hl">Good&apos;ai</span> is taking a short break.
        </h1>
        <p className="lede">
          We&apos;re putting a maintenance page over the site for now. We&apos;ve got a working template coming up soon.
        </p>
      </div>
    </main>
  );
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
}
