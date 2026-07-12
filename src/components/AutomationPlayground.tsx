'use client';

import { useState, useRef, useMemo } from 'react';
import { Sparkles, Terminal, FileText, Calendar, Mail, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';
import StampButton from '@/components/StampButton';

const CHECKBOX_LABEL_CLASSES = "flex items-center gap-2 border-2 border-[var(--ink)] bg-[var(--paper)] p-2 rounded-xs cursor-pointer select-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--coral)]";
const CHECKBOX_INPUT_CLASSES = "accent-[var(--coral)] outline-none focus-visible:outline-none";

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

  const toggleAction = (key: keyof typeof actions) => {
    setActions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ⚡ Bolt: Memoize expensive array mapping
  // This array map is in the same component as multiple controlled inputs.
  // Without useMemo, typing a single character forces the O(N) array mapping
  // and DOM recreation to run again, causing input lag.
  const memoizedLogs = useMemo(() => logs.map((log, index) => {
    let colorClass = 'text-[var(--paper)]/90';
    if (log.startsWith('[ERROR]')) colorClass = 'text-[var(--coral)] font-bold';
    if (log.startsWith('[SYSTEM]')) colorClass = 'text-[var(--gold-tint)] font-bold';
    return (
      <div key={index} className={colorClass}>
        {log}
      </div>
    );
  }), [logs]);

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
    <div className="stamp-card stamp-card-gold p-6 md:p-8 w-full">
      <div className="gai-leadcard-eyebrow flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--coral)] mb-3">
        <Sparkles size={14} /> Live Workspace Playground
      </div>
      
      <h3 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.025em] leading-none text-[var(--ink)] mb-4">
        Run real <span className="hl">Workspace Automations</span>.
      </h3>
      <p className="text-sm md:text-base text-[var(--ink)]/80 mb-6 max-w-2xl leading-relaxed">
        Run a live Workspace demo — Sheets, Docs, Calendar, and Gmail wired into one intake docket.
      </p>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <form onSubmit={runAutomation} className="lg:col-span-5 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="sticker-label sticker-label-navy">CONTACT</span>
            <input
              className="gai-input w-full"
              placeholder="Demo Contact Name"
              aria-label="Demo Contact Name"
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              className="gai-input w-full"
              placeholder="Business Name (Optional)"
              aria-label="Business Name (Optional)"
              value={business}
              onChange={e => setBusiness(e.target.value)}
            />
            <input
              className="gai-input w-full"
              placeholder="Phone Number"
              aria-label="Phone Number"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <input
              className="gai-input w-full"
              placeholder="Email (Required for Gmail demo)"
              aria-label="Email (Required for Gmail demo)"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              className="gai-input w-full"
              placeholder="n8n Webhook URL (Optional)"
              aria-label="n8n Webhook URL (Optional)"
              value={n8nUrl}
              onChange={e => setN8nUrl(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="sticker-label sticker-label-navy">THE CHORE</span>
            <textarea
              className="gai-input w-full min-h-[70px] text-sm resize-y"
              placeholder="Define a chore or task..."
              aria-label="Define a chore or task..."
              value={problem}
              onChange={e => setProblem(e.target.value)}
              required
            />
          </div>

          {/* Checklist of actions */}
          <div className="flex flex-col gap-2">
            <span id="services-group-label" className="sticker-label sticker-label-navy">SERVICES</span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono" role="group" aria-labelledby="services-group-label">
              <label className={CHECKBOX_LABEL_CLASSES}>
                <input
                  type="checkbox"
                  checked={actions.sheet}
                  onChange={() => toggleAction('sheet')}
                  className={CHECKBOX_INPUT_CLASSES}
                />
                <span>Append Sheet</span>
              </label>
              
              <label className={CHECKBOX_LABEL_CLASSES}>
                <input
                  type="checkbox"
                  checked={actions.doc}
                  onChange={() => toggleAction('doc')}
                  className={CHECKBOX_INPUT_CLASSES}
                />
                <span>Generate Doc</span>
              </label>
              
              <label className={CHECKBOX_LABEL_CLASSES}>
                <input
                  type="checkbox"
                  checked={actions.emailNotification}
                  onChange={() => toggleAction('emailNotification')}
                  disabled={!email}
                  className={CHECKBOX_INPUT_CLASSES}
                />
                <span className={!email ? 'opacity-40' : ''}>Gmail Send</span>
              </label>
              
              <label className={CHECKBOX_LABEL_CLASSES}>
                <input
                  type="checkbox"
                  checked={actions.calendar}
                  onChange={() => toggleAction('calendar')}
                  className={CHECKBOX_INPUT_CLASSES}
                />
                <span>Schedule Call</span>
              </label>

              <label className={CHECKBOX_LABEL_CLASSES}>
                <input
                  type="checkbox"
                  checked={actions.n8n}
                  onChange={() => toggleAction('n8n')}
                  className={CHECKBOX_INPUT_CLASSES}
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
              {memoizedLogs}
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
            <div className="stamp-card stamp-card-navy p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--coral)] font-bold mb-3 flex items-center gap-1">
                <Check size={12} /> LIVE WORKSPACE DOCKETS FILED:
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-xs font-mono">
                {results.sheetUrl && (
                  <a
                    href={results.sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border-2 border-[var(--ink)] bg-[var(--gold-tint)] p-2 hover:bg-[var(--paper)] hover:translate-y-[-1px] transition-all"
                  >
                    <FileSpreadsheet size={16} className="text-[var(--ok)]" />
                    <span className="underline truncate">Google Sheet Lead Board</span>
                  </a>
                )}
                {results.docUrl && (
                  <a
                    href={results.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border-2 border-[var(--ink)] bg-[var(--gold-tint)] p-2 hover:bg-[var(--paper)] hover:translate-y-[-1px] transition-all"
                  >
                    <FileText size={16} className="text-[var(--navy)]" />
                    <span className="underline truncate">Google Doc Proposal</span>
                  </a>
                )}
                {results.emailId && (
                  <div className="flex items-center gap-2 border-2 border-[var(--ink)] bg-[var(--gold-tint)] p-2">
                    <Mail size={16} className="text-[var(--coral)]" />
                    <span className="truncate">Email Sent (ID: {results.emailId.slice(0,8)}...)</span>
                  </div>
                )}
                {results.calendarUrl && (
                  <a
                    href={results.calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border-2 border-[var(--ink)] bg-[var(--gold-tint)] p-2 hover:bg-[var(--paper)] hover:translate-y-[-1px] transition-all"
                  >
                    <Calendar size={16} className="text-[var(--gold-tint)]" />
                    <span className="underline truncate">Scheduled Calendar Call</span>
                  </a>
                )}
                {results.n8nStatus && (
                  <div className="flex items-center gap-2 border-2 border-[var(--ink)] bg-[var(--gold-tint)] p-2">
                    <Sparkles size={16} className="text-[var(--navy)]" />
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
