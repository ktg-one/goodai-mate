'use client';

import dynamic from 'next/dynamic';

const ShaderBackground = dynamic(() => import('@/components/ShaderBackground'), { ssr: false });
const CursorEffects = dynamic(() => import('@/components/CursorEffects'), { ssr: false });
const HeroSection = dynamic(() => import('@/components/HeroSection'), { ssr: false });

export default function HomeClient() {
  return (
    <>
      <ShaderBackground />
      <CursorEffects />
      <HeroSection />
    </>
  );
}
