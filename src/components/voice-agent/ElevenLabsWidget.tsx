'use client';

import { useEffect, useState } from 'react';

interface ElevenLabsWidgetProps {
  agentId?: string;
  onMailFiled?: (docket: { transcript: string; response: string; ts: number }) => void;
}

export function ElevenLabsWidget({ agentId = 'agent_8501m0h2hvh0edr99jkqzr4rw53n', onMailFiled: _onMailFiled }: ElevenLabsWidgetProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex flex-col items-center justify-center py-20 bg-[var(--paper)]">
      <div className="w-full max-w-4xl px-6 text-center">
        <h1 className="font-display text-4xl md:text-6xl mb-6">Voice Intake</h1>
        <p className="text-[var(--ink)]/80 text-xl mb-12">
          Speak to the agent and it will file a docket directly.
        </p>
        <div className="w-full h-[600px] rounded-lg overflow-hidden border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] relative bg-[var(--paper-deep)]">
          <elevenlabs-convai agent-id={agentId}></elevenlabs-convai>
          <script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
        </div>
      </div>
    </div>
  );
}
