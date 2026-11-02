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

function LabelCard({ label }: { label: MachineLabel }) {
  const body = (
    <>
      <span className="stack-card-station">{label.tag}</span>
      <strong>
        {label.title} {label.href && <ArrowUpRight size={14} aria-hidden="true" />}
      </strong>
      <span>{label.detail}</span>
    </>
  );
  return label.href ? (
    <Link href={label.href} className="stack-card">
      {body}
    </Link>
  ) : (
    <div className="stack-card">{body}</div>
  );
}

export function StackPanel({
  on,
  onToggle,
}: {
  on: StackState;
  onToggle?: (layer: StackLayer) => void;
}) {
  const shown = shownLayer(on);
  return (
    <section className="stack-panel" aria-label="What is under the hood" aria-live="polite">
      <div className="stack-controls" role="group" aria-label="Inspect machine layers">
        <span className="stack-controls-label">Inspect a layer:</span>
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
        <p className="stack-hint">Press Labels, Cut away or Explode on the machine, or tap a layer above.</p>
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
                  <LabelCard key={label.title} label={label} />
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
