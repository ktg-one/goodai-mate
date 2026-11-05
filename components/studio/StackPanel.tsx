import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  LAYER_BUTTONS,
  LAYER_COPY,
  MACHINE_LABELS,
  STACK_FOOTNOTE,
  shownLayer,
  type MachineLabel,
  type StackLayer,
  type StackLogoId,
} from "@/lib/stack";

export type StackState = Record<StackLayer, boolean>;

function BrandLogo({ id }: { id: StackLogoId }) {
  switch (id) {
    case "elevenlabs":
      return (
        <span className="stack-logo-badge" title="ElevenLabs">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <rect x="6.5" y="4" width="3.5" height="16" rx="1" />
            <rect x="14" y="4" width="3.5" height="16" rx="1" />
          </svg>
        </span>
      );
    case "openai":
      return (
        <span className="stack-logo-badge" title="OpenAI">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3.2c2.2 0 4.1 1.4 4.7 3.5 2 .4 3.5 2.2 3.5 4.3 0 1.2-.5 2.3-1.3 3.1.3 2.1-.9 4.2-2.9 4.9-1 .4-2.1.3-3-.2-1 1.3-2.6 2-4.3 1.7-1.9-.3-3.4-1.8-3.7-3.7-1.6-1-2.4-2.9-1.9-4.8.3-1.1 1-2.1 2-2.7-.1-2.1 1.2-4.1 3.3-4.6.5-.2 1.1-.3 1.6-.3Z" />
            <circle cx="12" cy="12" r="2.6" />
          </svg>
        </span>
      );
    case "gemini":
      return (
        <span className="stack-logo-badge" title="Google Gemini">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M12 2c0 5.52 4.48 10 10 10-5.52 0-10 4.48-10 10 0-5.52-4.48-10-10-10 5.52 0 10-4.48 10-10Z" />
          </svg>
        </span>
      );
    case "xai":
      return (
        <span className="stack-logo-badge" title="xAI">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M4.2 4h3.9l4.8 6.8L17.6 4h2.2l-5.8 8.2L20.2 20h-3.9l-5.1-7.2L6.2 20H4l6.1-8.6L4.2 4Z" />
          </svg>
        </span>
      );
    case "n8n":
      return (
        <span className="stack-logo-badge stack-logo-badge-coral" title="n8n">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="5" cy="12" r="2.3" />
            <circle cx="12" cy="7.5" r="2.3" />
            <circle cx="19" cy="7.5" r="2.3" />
            <circle cx="19" cy="16.5" r="2.3" />
            <path d="M7.2 11.2 9.9 8.6M14.3 7.5h2.4M7.2 12.8l9.6 3.1" />
          </svg>
        </span>
      );
    case "googlecloud":
      return (
        <span className="stack-logo-badge" title="Google Cloud">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7.2 18.5h9.8a4.2 4.2 0 0 0 .5-8.37A5.8 5.8 0 0 0 6.2 8.7 4.9 4.9 0 0 0 7.2 18.5Z" />
          </svg>
        </span>
      );
  }
}

function LabelCard({
  label,
  onHover,
}: {
  label: MachineLabel;
  onHover?: (title: string | null) => void;
}) {
  const body = (
    <>
      <span className="stack-card-station">{label.tag}</span>
      {label.logos && label.logos.length > 0 && (
        <div className="stack-card-logos" aria-hidden="true">
          {label.logos.map((id) => (
            <BrandLogo key={id} id={id} />
          ))}
        </div>
      )}
      <strong>
        {label.title} {label.href && <ArrowUpRight size={14} aria-hidden="true" />}
      </strong>
      {label.detail ? <span>{label.detail}</span> : null}
    </>
  );
  const events = {
    onMouseEnter: () => onHover?.(label.title),
    onMouseLeave: () => onHover?.(null),
    onFocus: () => onHover?.(label.title),
    onBlur: () => onHover?.(null),
  };
  return label.href ? (
    <Link href={label.href} className="stack-card" {...events}>
      {body}
    </Link>
  ) : (
    <div className="stack-card" {...events}>
      {body}
    </div>
  );
}

export function StackPanel({
  on,
  onToggle,
  onHoverLabel,
}: {
  on: StackState;
  onToggle?: (layer: StackLayer) => void;
  onHoverLabel?: (title: string | null) => void;
}) {
  const shown = shownLayer(on);
  return (
    <section className="stack-panel" aria-label="What is under the hood" aria-live="polite">
      <div className="stack-controls" role="group" aria-label="Inspect machine layers">
        <span className="stack-controls-label">Layer:</span>
        {LAYER_BUTTONS.map((b) => (
          <button
            key={b.layer}
            type="button"
            className="stack-toggle"
            aria-pressed={shown === b.shows}
            onClick={() => onToggle?.(b.layer)}
          >
            {b.label}
          </button>
        ))}
      </div>
      {shown === null ? (
        <p className="stack-hint">Select Labels, Cut away, or Explode to inspect a layer.</p>
      ) : (
        <div className="stack-layer">
          <div className="stack-row">
            <div className="stack-row-head">
              <p className="stack-kicker">{LAYER_COPY[shown].title}</p>
              <p className="stack-body">{LAYER_COPY[shown].body}</p>
            </div>
            <div className="stack-row-content">
              <div className="stack-cards">
                {MACHINE_LABELS[shown].map((label) => (
                  <LabelCard key={label.title} label={label} onHover={onHoverLabel} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <p className="stack-footnote">{STACK_FOOTNOTE}</p>
    </section>
  );
}
