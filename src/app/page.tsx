import type { Metadata } from 'next';

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
}
