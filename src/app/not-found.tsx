export const dynamic = 'force-dynamic';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--paper)] p-6 text-[var(--ink)]">
      <div className="w-full max-w-md border-2 border-[var(--ink)] bg-[var(--paper-deep)] p-8 text-center shadow-[4px_4px_0_var(--ink)]">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--navy)]">Good&apos;ai</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.03em]">Page not found</h1>
        <p className="mt-3 text-[15px] text-[var(--ink-soft)]">The docket you&apos;re looking for isn&apos;t here.</p>
        <Link href="/" className="mt-6 red-accent stamp-btn stamp-btn-red inline-flex items-center justify-center font-bold text-lg px-9 py-3.5 border-2 border-[var(--ink)]">Go home</Link>
      </div>
    </div>
  );
}
