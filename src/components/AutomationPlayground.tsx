'use client';

import { useState, useRef, useMemo } from 'react';
import { Sparkles, Terminal, FileText, Calendar, Mail, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';
import StampButton from '@/components/StampButton';

const CHECKBOX_LABEL_CLASS = "flex items-center gap-2 border-2 border-[var(--ink)] bg-[var(--paper)] p-2 rounded-xs cursor-pointer focus-within:ring-2 focus-within:ring-[var(--red)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--paper)] select-none";

export default function AutomationPlayground() {
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [problem, setProblem] = useState("I need to reconcile invoices from SMS transcripts and update my spreadsheets automatically.");
  
  const [actions, setActions] = useState({
    sheet: true,
    doc: true,
    emailNotification: false,
    calendar: false,
    n8n: false,
  });

  const [n8nUrl, setN8nUrl] = useState('');

  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    sheetUrl?: string;
    docUrl?: string;
    emailId?: string;
    calendarUrl?: string;
    n8nStatus?: string;
  } | null>(null);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // ⚡ Bolt Performance Optimization: Memoize rendered logs
  // Prevents O(N) array iteration and element recreation on every keystroke
  // in the controlled form inputs (e.g., name, email).
  const renderedLogs = useMemo(() => {
    return logs.map((log, index) => {
      let colorClass = 'text-[var(--paper)]/90';
      if (log.startsWith('[ERROR]')) colorClass = 'text-[var(--red)] font-bold';
      if (log.startsWith('[SYSTEM]')) colorClass = 'text-[var(--gold)] font-bold';
      return (
        <div key={index} className={colorClass}>
          {log}
        </div>
      );
    });
  }, [logs]);

  const toggleAction = (key: keyof typeof actions) => {
    setActions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const runAutomation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || isRunning) return;

    setIsRunning(true);
    setError(null);
    setResults(null);
    setLogs(['[SYSTEM] Initializing Good\'ai local automation pipeline...']);

    try {
      const response = await fetch('/api/demo-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          business: business.trim(),
          phone: phone.trim(),
          email: email.trim(),
          problem: problem.trim(),
          actions,
          n8nUrl: n8nUrl.trim()
        })
      });

      const data = await response.json();
      
      if (data.logs) {
        setLogs(prev => [...prev, ...data.logs]);
      }

      if (response.ok && data.success) {
        setResults(data.results);
        setLogs(prev => [...prev, '[SYSTEM] Pipeline completed successfully! Live Workspace links populated below.']);
      } else {
        throw new Error(data.error || 'Pipeline execution failed.');
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong during execution.';
      setError(errorMessage);
      setLogs(prev => [...prev, `[ERROR] Execution aborted: ${errorMessage}`]);
    } finally {
      setIsRunning(false);
      setTimeout(() => {
        consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="gai-leadcard border-2 border-[var(--ink)] bg-[var(--paper-raised)] p-6 md:p-8 rounded-sm shadow-[4px_4px_0_var(--ink)] w-full">
      <div className="gai-leadcard-eyebrow flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--red)] mb-3">
        <Sparkles size={14} /> Live Workspace Playground
      </div>
      
      <h3 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.025em] leading-none text-[var(--ink)] mb-4">
        Run real <span className="hl">Workspace Automations</span>.
      </h3>
      <p className="text-sm md:text-base text-[var(--ink)]/80 mb-6 max-w-2xl leading-relaxed">
        Test our integration pipeline. Since the Google Workspace CLI is now fully authenticated on your machine, you can run actual Sheets, Docs, Calendar, and Gmail scripts directly from this dashboard.
      </p>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <form onSubmit={runAutomation} className="lg:col-span-5 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink)]/60">1. ENTER DEMO DETAILS</span>
            <input
              className="gai-input w-full"
              placeholder="Demo Contact Name"
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              className="gai-input w-full"
              placeholder="Business Name (Optional)"
              value={business}
              onChange={e => setBusiness(e.target.value)}
            />
            <input
              className="gai-input w-full"
              placeholder="Phone Number"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <input
              className="gai-input w-full"
              placeholder="Email (Required for Gmail demo)"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              className="gai-input w-full"
              placeholder="n8n Webhook URL (Optional)"
              value={n8nUrl}
              onChange={e => setN8nUrl(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink)]/60">2. DESCRIBE AUTOMATION JOB</span>
            <textarea
              className="gai-input w-full min-h-[70px] text-sm resize-y"
              placeholder="Define a chore or task..."
              value={problem}
              onChange={e => setProblem(e.target.value)}
              required
            />
          </div>

          {/* Checklist of actions */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink)]/60">3. SELECT GOOGLE SERVICES</span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <label className={CHECKBOX_LABEL_CLASS}>
                <input
                  type="checkbox"
                  checked={actions.sheet}
                  onChange={() => toggleAction('sheet')}
                  className="accent-[var(--red)] outline-none focus-visible:outline-none"
                />
                <span>Append Sheet</span>
              </label>
              
              <label className={CHECKBOX_LABEL_CLASS}>
                <input
                  type="checkbox"
                  checked={actions.doc}
                  onChange={() => toggleAction('doc')}
                  className="accent-[var(--red)] outline-none focus-visible:outline-none"
                />
                <span>Generate Doc</span>
              </label>
              
              <label className={CHECKBOX_LABEL_CLASS}>
                <input
                  type="checkbox"
                  checked={actions.emailNotification}
                  onChange={() => toggleAction('emailNotification')}
                  disabled={!email}
                  className="accent-[var(--red)] outline-none focus-visible:outline-none"
                />
                <span className={!email ? 'opacity-40' : ''}>Gmail Send</span>
              </label>
              
              <label className={CHECKBOX_LABEL_CLASS}>
                <input
                  type="checkbox"
                  checked={actions.calendar}
                  onChange={() => toggleAction('calendar')}
                  className="accent-[var(--red)] outline-none focus-visible:outline-none"
                />
                <span>Schedule Call</span>
              </label>

              <label className={CHECKBOX_LABEL_CLASS}>
                <input
                  type="checkbox"
                  checked={actions.n8n}
                  onChange={() => toggleAction('n8n')}
                  className="accent-[var(--red)] outline-none focus-visible:outline-none"
                />
                <span>n8n Webhook</span>
              </label>
            </div>
          </div>

          <StampButton
            variant="red"
            size="lg"
            type="submit"
            disabled={isRunning || (!actions.sheet && !actions.doc && !actions.emailNotification && !actions.calendar && !actions.n8n)}
            className="w-full mt-2"
          >
            {isRunning ? 'Running Pipeline...' : 'Trigger Workspace Pipeline'}
          </StampButton>
        </form>

        {/* Terminal logs column */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink)]/60 flex items-center gap-1.5">
            <Terminal size={12} /> Live execution log
          </span>
          
          <div className="border-2 border-[var(--ink)] bg-[var(--navy)] text-[var(--paper)] rounded-xs p-4 font-mono text-xs h-[240px] overflow-y-auto shadow-[inset_1px_1px_0_rgba(0,0,0,0.5)]">
            <div className="space-y-2">
              {logs.length === 0 && (
                <div className="text-[var(--paper)]/40 italic">Waiting to trigger pipeline... Details will compile here in real time.</div>
              )}
              {renderedLogs}
              {isRunning && (
                <div className="flex items-center gap-1.5 text-[var(--paper)]/50 animate-pulse mt-1">
                  <span>●</span><span>Executing GWS scripts...</span>
                </div>
              )}
              <div ref={consoleEndRef} />
            </div>
          </div>

          {/* Results dashboard */}
          {results && (
            <div className="border-2 border-[var(--ink)] bg-[var(--paper)] p-4 rounded-xs shadow-[2px_2px_0_var(--ink)]">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--red)] font-bold mb-3 flex items-center gap-1">
                <Check size={12} /> LIVE WORKSPACE DOCKETS FILED:
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-xs font-mono">
                {results.sheetUrl && (
                  <a
                    href={results.sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-[var(--ink)]/20 hover:border-[var(--ink)] bg-[var(--paper-raised)] p-2 hover:bg-[var(--gold-tint)] hover:translate-y-[-1px] transition-all"
                  >
                    <FileSpreadsheet size={16} className="text-emerald-700" />
                    <span className="underline truncate">Google Sheet Lead Board</span>
                  </a>
                )}
                {results.docUrl && (
                  <a
                    href={results.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-[var(--ink)]/20 hover:border-[var(--ink)] bg-[var(--paper-raised)] p-2 hover:bg-[var(--gold-tint)] hover:translate-y-[-1px] transition-all"
                  >
                    <FileText size={16} className="text-blue-700" />
                    <span className="underline truncate">Google Doc Proposal</span>
                  </a>
                )}
                {results.emailId && (
                  <div className="flex items-center gap-2 border border-[var(--ink)]/20 bg-[var(--paper-raised)] p-2">
                    <Mail size={16} className="text-[var(--red)]" />
                    <span className="truncate">Email Sent (ID: {results.emailId.slice(0,8)}...)</span>
                  </div>
                )}
                {results.calendarUrl && (
                  <a
                    href={results.calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-[var(--ink)]/20 hover:border-[var(--ink)] bg-[var(--paper-raised)] p-2 hover:bg-[var(--gold-tint)] hover:translate-y-[-1px] transition-all"
                  >
                    <Calendar size={16} className="text-amber-700" />
                    <span className="underline truncate">Scheduled Calendar Call</span>
                  </a>
                )}
                {results.n8nStatus && (
                  <div className="flex items-center gap-2 border border-[var(--ink)]/20 bg-[var(--paper-raised)] p-2">
                    <Sparkles size={16} className="text-purple-700" />
                    <span className="truncate">n8n Webhook: {results.n8nStatus}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="border-2 border-[var(--ink)] bg-[var(--warn)] text-[var(--paper)] p-3 rounded-xs flex items-start gap-2 text-xs font-mono shadow-[2px_2px_0_var(--ink)]">
              <AlertCircle size={16} className="shrink-0" />
              <div>
                <strong>Error running pipeline:</strong>
                <p className="mt-1 text-[var(--paper)]/90">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
