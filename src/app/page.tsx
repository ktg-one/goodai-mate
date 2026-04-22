import type { Metadata } from 'next';
import NoiseOverlay from '@/components/NoiseOverlay';
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
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <NoiseOverlay />
      <HomeClient />
    </>
  );
}
