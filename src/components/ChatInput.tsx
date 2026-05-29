import { memo, useState } from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  isBusy: boolean;
  onSubmit: (text: string) => void;
}

const ChatInput = memo(function ChatInput({ isBusy, onSubmit }: ChatInputProps) {
  const [input, setInput] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isBusy) return;

    onSubmit(text);
    setInput('');
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-[var(--cream-line)] bg-white p-3">
      <div className="flex items-center gap-2 rounded-[18px] border-2 border-[var(--ink)] bg-[var(--paper)] p-2 shadow-[3px_3px_0_var(--ink)]">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isBusy ? 'Thinking...' : 'My admin mess is...'}
          disabled={isBusy}
          className="h-12 flex-1 border-0 bg-transparent px-4 text-[16px] text-[var(--ink)] shadow-none outline-none placeholder:text-[var(--ink-faint)] focus-visible:border-0 focus-visible:ring-0"
        />
        <button
          type="submit"
          disabled={isBusy || !input.trim()}
          className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border-2 border-[var(--ink)] bg-[var(--orange)] text-[var(--paper)] shadow-[2px_2px_0_var(--ink)] transition-all hover:-translate-x-px hover:-translate-y-px hover:bg-[var(--orange-deep)] disabled:cursor-not-allowed disabled:opacity-45"
          aria-label="Send"
        >
          <Send size={17} />
        </button>
      </div>
    </form>
  );
});

export default ChatInput;
