'use client';

import dynamic from 'next/dynamic';
import NoiseOverlay from '@/components/NoiseOverlay';
import HeroSection from '@/components/HeroSection';

const ShaderBackground = dynamic(() => import('@/components/ShaderBackground'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-10 bg-[var(--bg)]" />,
});

const CursorEffects = dynamic(() => import('@/components/CursorEffects'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <ShaderBackground />
      <NoiseOverlay />
      <CursorEffects />
      <HeroSection />
    </>
  );
}
