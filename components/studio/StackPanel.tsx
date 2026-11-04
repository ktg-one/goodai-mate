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
} from "@/lib/stack";

export type StackState = Record<StackLayer, boolean>;

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
      <strong>
        {label.title} {label.href && <ArrowUpRight size={14} aria-hidden="true" />}
      </strong>
      <span>{label.detail}</span>
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
