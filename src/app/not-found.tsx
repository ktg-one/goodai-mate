export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-[520px] rounded-[24px] border-2 border-[var(--ink)] bg-white px-8 py-10 text-center shadow-[4px_4px_0_var(--ink)]">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--ocean-600)]">Good&apos;ai</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2.5rem,8vw,4rem)] font-semibold leading-none tracking-[-0.03em] text-[var(--ink)]">
          404
        </h1>
        <p className="mt-4 text-[17px] leading-7 text-[var(--ink-soft)]">
          That page has knocked off early. Head back and we&apos;ll sort the right one.
        </p>
      </div>
    </div>
  );
}
