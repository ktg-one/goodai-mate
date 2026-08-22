'use client';

import { useEffect } from 'react';

export const dynamic = 'force-dynamic';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // Ultra-minimal client component using only design tokens (paper/ink/red/stamp from public/ + globals.css).
  // No motion, no StampButton (which may register contexts), no GSAP — to minimize surface for the known
  // useContext null during Next 16 Turbopack isolated prerender of /_global-error (pre-existing, client-heavy tree).
  return (
    <html lang="en">
      <body className="bg-[var(--paper)] text-[var(--ink)]">
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md border-2 border-[var(--ink)] bg-[var(--paper-deep)] p-8 text-center shadow-[4px_4px_0_var(--ink)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--navy)]">Good&apos;ai</p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.03em]">Something went sideways</h1>
            <p className="mt-3 text-[15px] text-[var(--ink-soft)]">We hit a snag. Try refreshing the page.</p>
            <button
              onClick={() => reset()}
              className="mt-6 red-accent stamp-btn stamp-btn-red inline-flex items-center justify-center font-bold text-lg px-9 py-3.5 border-2 border-[var(--ink)]"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
