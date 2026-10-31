import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  STACK_ARCHITECTURE,
  STACK_ARMS,
  STACK_COPY,
  STACK_ETHICS,
  STACK_FOOTNOTE,
  STACK_LAYERS,
  STACK_MODELS,
  STACK_RUNTIME,
  STACK_VOICES,
  type StackLayer,
  type Vendor,
} from "@/lib/stack";

export type StackState = Record<StackLayer, boolean>;

function VendorChip({ vendor }: { vendor: Vendor }) {
  return (
    <a className="stack-chip" href={vendor.href} target="_blank" rel="noopener noreferrer">
      {vendor.icon && (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d={vendor.icon} />
        </svg>
      )}
      <b>{vendor.name}</b>
      {vendor.note && <small>{vendor.note}</small>}
      <ArrowUpRight size={12} aria-hidden="true" />
    </a>
  );
}

function LayerBody({ layer }: { layer: StackLayer }) {
  if (layer === "labels") {
    return (
      <div className="stack-cards">
        {STACK_ARMS.map((arm) => (
          <Link key={arm.name} href={arm.href} className="stack-card">
            <span className="stack-card-station">{arm.station}</span>
            <strong>
              {arm.name} <ArrowUpRight size={14} aria-hidden="true" />
            </strong>
            <span>{arm.detail}</span>
          </Link>
        ))}
      </div>
    );
  }

  if (layer === "explode") {
    return (
      <div className="stack-cards">
        {STACK_ETHICS.map((item) => (
          <div key={item.title} className="stack-card">
            <strong>{item.title}</strong>
            <span>{item.detail}</span>
          </div>
        ))}
      </div>
    );
  }

  if (layer === "cut") {
    return (
      <div className="stack-cut-group">
        <div className="stack-cards">
          {STACK_ARCHITECTURE.map((item) => (
            <div key={item.title} className="stack-card">
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </div>
          ))}
        </div>
        <div className="stack-chips">
          {STACK_MODELS.map((v) => (
            <VendorChip key={v.name} vendor={v} />
          ))}
        </div>
      </div>
    );
  }

  const vendors = layer === "xray" ? STACK_VOICES : STACK_RUNTIME;
  return (
    <div className="stack-chips">
      {vendors.map((v) => (
        <VendorChip key={v.name} vendor={v} />
      ))}
    </div>
  );
}

export function StackPanel({
  on,
  onToggle,
}: {
  on: StackState;
  onToggle?: (layer: StackLayer) => void;
}) {
  const active = STACK_LAYERS.filter((l) => on[l]);
  return (
    <section className="stack-panel" aria-label="What is under the hood" aria-live="polite">
      <div className="stack-controls" role="group" aria-label="Inspect machine layers">
        <span className="stack-controls-label">Inspect a layer:</span>
        {STACK_LAYERS.map((layer) => (
          <button
            key={layer}
            type="button"
            className="stack-toggle"
            aria-pressed={on[layer]}
            onClick={() => onToggle?.(layer)}
          >
            {STACK_COPY[layer].button}
          </button>
        ))}
      </div>
      {active.length === 0 ? (
        <p className="stack-hint">
          Press any button on the machine — or tap a layer above — to open our services, ethics, underlying architecture, voices, and where it runs.
        </p>
      ) : (
        <div className="stack-layer">
          {active.map((layer) => (
            <div key={layer} className="stack-row">
              <div className="stack-row-head">
                <p className="stack-kicker">{STACK_COPY[layer].title}</p>
                <p className="stack-body">{STACK_COPY[layer].body}</p>
              </div>
              <div className="stack-row-content">
                <LayerBody layer={layer} />
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="stack-footnote">{STACK_FOOTNOTE}</p>
    </section>
  );
}
