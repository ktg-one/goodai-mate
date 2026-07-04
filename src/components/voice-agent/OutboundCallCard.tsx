'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Phone, Terminal, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import StampButton from '@/components/StampButton';

export default function OutboundCallCard() {
  const [phone, setPhone] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<'darl' | 'robokev'>('darl');
  const [isDialing, setIsDialing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  const agents = [
    {
      id: 'darl' as const,
      name: 'Darl',
      role: 'My Assistant',
      desc: 'Assists with invoices, schedules, and quotes. Preset: 0877414191.',
      defaultPhone: '0877414191',
      color: 'bg-[var(--gold-tint)] border-[var(--gold)] text-[var(--ink)]'
    },
    {
      id: 'robokev' as const,
      name: 'Robokev',
      role: 'My Voice Clone',
      desc: 'My custom voice assistant. Enter your number to have Robokev call you.',
      defaultPhone: '',
      color: 'bg-[var(--red-tint)] border-[var(--red)] text-[var(--ink)]'
    }
  ];

  // ⚡ Bolt: Memoize expensive array mapping
  // This array map is in the same component as a controlled input.
  // Without useMemo, typing a single character forces the O(N) array mapping
  // and DOM recreation to run again, causing input lag.
  const memoizedLogs = useMemo(() => {
    return logs.map((log, index) => {
      let color = 'text-[var(--paper)]/80';
      if (log.startsWith('[ERROR]')) color = 'text-[var(--red-tint)] font-bold';
      if (log.startsWith('[SERVER]')) color = 'text-[var(--gold-tint)]';
      if (log.includes('RINGING') || log.includes('CONNECTED')) color = 'text-[var(--gold)] font-bold';
      return (
        <div key={index} className={color}>
          {log}
        </div>
      );
    });
  }, [logs]);

  // Prefill phone input whenever the selected agent changes
  useEffect(() => {
    const selectedAgentObj = agents.find(a => a.id === selectedAgent);
    if (selectedAgentObj) {
      setPhone(selectedAgentObj.defaultPhone);
    }
    // Only run when selectedAgent changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAgent]);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleCallbackTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || isDialing) return;

    setIsDialing(true);
    setError(null);
    setSuccess(false);
    setLogs([
      `[DIALER] Initializing outbound sequence...`,
      `[DIALER] Selected Voice Agent: ${selectedAgent === 'darl' ? 'Darl' : 'Robokev'}`
    ]);

    // Dialing step 1
    await new Promise(resolve => setTimeout(resolve, 600));
    setLogs(prev => [...prev, `[DIALER] Connecting to local dialer gateway...`]);

    // Dialing step 2
    await new Promise(resolve => setTimeout(resolve, 700));
    setLogs(prev => [...prev, `[DIALER] Placing call request to: ${phone.trim()}...`]);

    try {
      const response = await fetch('/api/trigger-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          agent: selectedAgent
        })
      });

      const data = await response.json();

      if (data.logs) {
        setLogs(prev => [...prev, ...data.logs.map((log: string) => `[SERVER] ${log}`)]);
      }

      if (response.ok && data.success) {
        setSuccess(true);
        // Dialing step 3 (simulated phone ringing success)
        await new Promise(resolve => setTimeout(resolve, 800));
        setLogs(prev => [...prev, `[DIALER] Call state: RINGING... Check your handset!`]);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLogs(prev => [...prev, `[DIALER] Call state: CONNECTED. Have a chat with ${selectedAgent === 'darl' ? 'Darl' : 'Robokev'}!`]);
      } else {
        throw new Error(data.error || 'Outbound call connection rejected.');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown connection error';
      setError(errorMessage);
      setLogs(prev => [...prev, `[ERROR] Dialer aborted: ${errorMessage}`]);
    } finally {
      setIsDialing(false);
    }
  };

  return (
    <div className="stamp-card stamp-card-paper p-6 relative w-full text-left" data-pin="true">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--red)] mb-4">
        <Phone size={12} /> Outbound Agent Dialer
      </div>

      <h3 className="font-display text-2xl font-bold tracking-tight text-[var(--ink)] mb-1">
        Have the Voice Agent <span className="hl">Call You</span>.
      </h3>
      <p className="text-xs text-[var(--ink)]/75 mb-6">
        Enter your mobile number and select which persona dials you. The agent will call your phone and speak with you live.
      </p>

      <form onSubmit={handleCallbackTrigger} className="space-y-5">
        {/* Agent Selector Card Grid */}
        <div className="space-y-2">
          <label id="agent-selector-label" className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink)]/60 block">
            1. Select Agent Persona
          </label>
          <div className="grid sm:grid-cols-2 gap-3" role="group" aria-labelledby="agent-selector-label">
            {agents.map(agent => {
              const isSelected = selectedAgent === agent.id;
              return (
                <button
                  key={agent.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedAgent(agent.id)}
                  className={`border-2 p-3 text-left rounded-xs cursor-pointer select-none transition-all flex flex-col justify-between h-28 relative focus-visible:outline-2 focus-visible:outline-[var(--red)] ${
                    isSelected
                      ? `${agent.color} border-[var(--ink)] shadow-[2px_2px_0_var(--ink)] scale-[0.99] translate-y-[1px]`
                      : 'bg-[var(--paper)] border-[var(--ink)]/20 hover:border-[var(--ink)]/40 hover:bg-[var(--paper-deep)] shadow-none'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base">{agent.name}</span>
                      {isSelected && <UserCheck size={14} className="text-[var(--ink)]" />}
                    </div>
                    <span className="text-[9px] font-mono text-[var(--ink)]/60 block">{agent.role}</span>
                  </div>
                  <p className="text-[10px] text-[var(--ink)]/80 leading-tight mt-2">{agent.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Phone Input */}
        <div className="space-y-2">
          <label htmlFor="callback-phone" className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink)]/60 block">
            2. Target Phone Number
          </label>
          <div className="relative">
            <input
              id="callback-phone"
              type="tel"
              className="gai-input w-full pr-12 text-sm"
              placeholder="+61 400 000 000"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              aria-describedby="phone-help"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink)]/40 pointer-events-none">
              <Phone size={16} />
            </div>
          </div>
          <p id="phone-help" className="text-[9px] font-mono text-[var(--ink)]/50">
            Perth local dialer. Defaults to preset target for Darl.
          </p>
        </div>

        {/* Trigger Button */}
        <StampButton
          variant="red"
          size="sm"
          type="submit"
          disabled={isDialing || !phone.trim()}
          className="w-full flex items-center justify-center gap-2 py-3.5"
        >
          {isDialing ? 'Dialing Handset...' : `Speak to ${selectedAgent === 'darl' ? 'Darl' : 'Robokev'} on My Phone`}
        </StampButton>
      </form>

      {/* Dialer Output logs */}
      {(logs.length > 0 || error || success) && (
        <div className="mt-5 space-y-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--ink)]/60 flex items-center gap-1">
            <Terminal size={10} /> Dialer log
          </span>

          <div className="border-2 border-[var(--ink)] bg-[var(--navy)] text-[var(--paper)] rounded-xs p-3 font-mono text-[11px] h-[130px] overflow-y-auto shadow-[inset_1px_1px_0_rgba(0,0,0,0.5)]">
            <div className="space-y-1">
              {memoizedLogs}
              {isDialing && (
                <div className="text-[var(--paper)]/40 animate-pulse">● Dialing gateway...</div>
              )}
              <div ref={consoleEndRef} />
            </div>
          </div>

          {success && (
            <div className="border-2 border-[var(--ink)] bg-[var(--ok)]/10 text-[var(--ok)] p-2.5 rounded-xs flex items-center gap-2 text-xs font-mono">
              <CheckCircle2 size={14} className="shrink-0" />
              <span>Dialer triggered! Pick up when your phone rings.</span>
            </div>
          )}

          {error && (
            <div className="border-2 border-[var(--ink)] bg-[var(--warn)]/10 text-[var(--warn)] p-2.5 rounded-xs flex items-center gap-2 text-xs font-mono">
              <AlertCircle size={14} className="shrink-0" />
              <span>Failed: {error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
