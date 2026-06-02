'use client';

import { useEffect } from 'react';

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

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-[var(--paper)] p-6 text-[var(--ink)]">
          <div className="w-full max-w-md rounded-[18px] border-2 border-[var(--ink)] bg-white p-8 text-center shadow-[4px_4px_0_var(--ink)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ocean-600)]">Good&apos;ai</p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-[-0.03em]">Something went sideways</h1>
            <p className="mt-3 text-[15px] text-[var(--ink-soft)]">We hit a snag. Try refreshing the page.</p>
            <button
              onClick={() => reset()}
              className="gai-btn gai-btn-primary gai-btn-md mt-6"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
