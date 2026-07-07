'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Terminal, ClipboardCheck, Sparkles, AlertCircle } from 'lucide-react';
import StampButton from '@/components/StampButton';

export default function WebsiteAnalyzer() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    businessType: string;
    automations: string[];
    summaryProposal: string;
  } | null>(null);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Without useMemo, typing a single character forces the O(N) array mapping
  // and full DOM element recreation for the terminal logs.
  const memoizedLogs = useMemo(() => logs.map((log, index) => {
    let colorClass = 'text-[var(--paper)]/80';
    if (log.startsWith('[ERROR]')) colorClass = 'text-[var(--red-tint)] font-bold';
    if (log.startsWith('[SERVER]')) colorClass = 'text-[var(--gold-tint)]';
    return (
      <div key={index} className={colorClass}>
        {log}
      </div>
    );
  }), [logs]);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setLogs([
      `[CRAWLER] Connecting to URL: ${url.trim()}...`,
      `[CRAWLER] Starting business analysis engine...`
    ]);

    // Simulated crawling step 1
    await new Promise(resolve => setTimeout(resolve, 500));
    setLogs(prev => [...prev, `[CRAWLER] Loading home page and parsing elements...`]);

    // Simulated crawling step 2
    await new Promise(resolve => setTimeout(resolve, 500));
    setLogs(prev => [...prev, `[CRAWLER] Running semantic business-model classification...`]);

    try {
      const response = await fetch('/api/analyze-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: url.trim()
        })
      });

      const data = await response.json();

      if (data.logs) {
        setLogs(prev => [...prev, ...data.logs.map((log: string) => `[SERVER] ${log}`)]);
      }

      if (response.ok && data.success) {
        setResult(data.results);
        setLogs(prev => [...prev, `[CRAWLER] Analysis docket generated successfully.`]);
      } else {
        throw new Error(data.error || 'Website analysis failed.');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown connection error';
      setError(errorMessage);
      setLogs(prev => [...prev, `[ERROR] Analysis aborted: ${errorMessage}`]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 border-t-2 border-dashed border-[var(--ink)]/30">
      <div className="text-center mb-6">
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--red)]">
          SITE AUDIT
        </span>
        <h2 className="font-display text-4xl md:text-5xl tracking-[-0.025em] leading-none mt-2 mb-2">
          Try our <span className="hl">Website Analyzer</span>.
        </h2>
        <p className="max-w-md mx-auto text-base text-[var(--ink)]/80">
          Enter your business website and see exactly what chores we can take off your hands.
        </p>
      </div>

      <div className="stamp-card stamp-card-navy p-6 md:p-8 relative">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="website-url" className="sticker-label sticker-label-gold">
              YOUR SITE
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  id="website-url"
                  type="text"
                  className="gai-input w-full pr-10 text-sm"
                  placeholder="e.g. www.perthplumbing.com.au"
                  required
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  aria-describedby="url-help"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink)]/40 pointer-events-none">
                  <Search size={16} />
                </div>
              </div>
              <StampButton
                variant="red"
                size="sm"
                type="submit"
                disabled={isAnalyzing || !url.trim()}
                className="w-full sm:w-fit font-bold whitespace-nowrap"
              >
                {isAnalyzing ? 'Analyzing...' : 'Audit My Business Opportunity'}
              </StampButton>
            </div>
            <p id="url-help" className="text-[9px] font-mono text-[var(--ink)]/50">
              Paste your business URL. The system will scan your landing page, find your contact email, and send the audit report.
            </p>
          </div>
        </form>

        {/* Live crawling log terminal */}
        {(logs.length > 0 || isAnalyzing || error) && (
          <div className="mt-6 space-y-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--ink)]/60 flex items-center gap-1.5">
              <Terminal size={12} /> Crawl logs
            </span>
            <div className="border-2 border-[var(--ink)] bg-[var(--navy)] text-[var(--paper)] rounded-xs p-3 font-mono text-xs h-[120px] overflow-y-auto shadow-[inset_1px_1px_0_rgba(0,0,0,0.5)]">
              <div className="space-y-1">
                {memoizedLogs}
                {isAnalyzing && (
                  <div className="text-[var(--paper)]/40 animate-pulse">● Mapping sitemap elements...</div>
                )}
                <div ref={consoleEndRef} />
              </div>
            </div>
          </div>
        )}

        {/* Audit Report Docket Results */}
        {result && (
          <div className="mt-6 stamp-card stamp-card-gold p-5 space-y-4 text-left animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between border-b border-[var(--ink)]/20 pb-2">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--red)] font-bold flex items-center gap-1">
                <ClipboardCheck size={14} /> CUSTOM SYSTEMS AUDIT
              </div>
              <span className="text-[9px] font-mono bg-[var(--navy-tint)] text-[var(--navy-deep)] px-2 py-0.5 rounded-sm">
                {result.businessType}
              </span>
            </div>

            <div className="space-y-3">
              <div className="font-bold text-sm tracking-tight text-[var(--ink)]">
                Three Administrative Chores We Can Automate:
              </div>
              <ul className="space-y-2.5 text-xs leading-relaxed">
                {result.automations.map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <span className="sticker-label sticker-label-navy shrink-0 text-[9px] py-0.5">
                      {['INTAKE', 'CHASE', 'FILE'][idx] ?? 'TASK'}
                    </span>
                    <span className="text-[var(--ink)]/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-[var(--ink)]/20">
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--ink)]/50 mb-1.5 flex items-center gap-1">
                <Sparkles size={10} /> Good&apos;ai Recommendation
              </div>
              <p className="text-xs italic text-[var(--ink)]/80 leading-normal">
                &ldquo;{result.summaryProposal}&rdquo;
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-5 border-2 border-[var(--ink)] bg-[var(--warn)]/10 text-[var(--warn)] p-3 rounded-xs flex items-start gap-2 text-xs font-mono">
            <AlertCircle size={16} className="shrink-0" />
            <div>
              <strong>Audit failed:</strong>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
