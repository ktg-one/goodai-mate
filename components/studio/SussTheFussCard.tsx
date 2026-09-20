"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Sparkles, PhoneCall, Receipt, MessageSquareReply, CopySlash, Clock, Mail } from "lucide-react";

const HEADACHES = [
  { id: "calls", label: "Missed Calls & Voicemails", icon: PhoneCall },
  { id: "invoices", label: "9 PM Invoices & Receipts", icon: Receipt },
  { id: "quotes", label: "Chasing Quotes & Follow-ups", icon: MessageSquareReply },
  { id: "copypaste", label: "Copy-Pasting Between Systems", icon: CopySlash },
  { id: "approvals", label: "Waiting Days on Sign-offs", icon: Clock },
  { id: "inbox", label: "Drowning in the Inbox", icon: Mail },
];

export function SussTheFussCard() {
  const [selected, setSelected] = useState<string[]>([]);
  const [fussNote, setFussNote] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleChip = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    setSubmitting(true);
    // Simulate swift receipt
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 450);
  };

  return (
    <div className="suss-card" id="suss-the-fuss">
      <div className="suss-header">
        <div className="suss-badge">
          <Sparkles size={14} className="text-rust" />
          <span>We’ll Suss the Fuss</span>
        </div>
        <h2>
          Admin? <em>Give us the work.</em>
          <br />
          Go see the kids.
        </h2>
        <p className="suss-intro">
          Knock off early. We’ll sort it. Tap whatever’s doing your head in or
          write a quick note—no tech jargon required.
        </p>
      </div>

      {submitted ? (
        <div className="suss-success">
          <div className="suss-success-icon" aria-hidden="true">
            <Check size={28} />
          </div>
          <h3>Too easy, mate. We’ve got it.</h3>
          <p>
            Knock off early. We’ll take a proper look at what’s eating your week
            and get back to you today.
          </p>
          <button
            type="button"
            className="text-link suss-reset"
            onClick={() => {
              setSubmitted(false);
              setSelected([]);
              setFussNote("");
              setContact("");
            }}
          >
            Submit another note ←
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="suss-body">
          {/* Step 1: Headache Chips */}
          <div className="suss-step">
            <span className="step-label">
              <strong>1.</strong> What’s taking up your afternoons?
            </span>
            <div className="suss-chips" role="group" aria-label="Common business headaches">
              {HEADACHES.map((h) => {
                const isSelected = selected.includes(h.id);
                const Icon = h.icon;
                return (
                  <button
                    type="button"
                    key={h.id}
                    onClick={() => toggleChip(h.id)}
                    className={`suss-chip ${isSelected ? "is-selected" : ""}`}
                    aria-pressed={isSelected}
                  >
                    <Icon size={15} />
                    <span>{h.label}</span>
                    {isSelected && <Check size={13} className="chip-check" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Plain-English Scratchpad */}
          <div className="suss-step">
            <label htmlFor="fuss-note" className="step-label">
              <strong>2.</strong> Tell us what you’re being fussy about{" "}
              <span className="step-optional">(optional)</span>
            </label>
            <textarea
              id="fuss-note"
              rows={3}
              value={fussNote}
              onChange={(e) => setFussNote(e.target.value)}
              placeholder="e.g. 'I spend two hours every Sunday entering receipts into Xero instead of heading down the beach with the kids...'"
              className="suss-textarea"
            />
          </div>

          {/* Step 3: Direct Hand-off */}
          <div className="suss-step">
            <label htmlFor="fuss-contact" className="step-label">
              <strong>3.</strong> Where can we send the fix?
            </label>
            <div className="suss-contact-row">
              <input
                id="fuss-contact"
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Mobile number or email"
                className="suss-input"
              />
              <button
                type="submit"
                disabled={submitting || !contact.trim()}
                className="button suss-submit"
              >
                {submitting ? "Sorting..." : "We’ll Suss the Fuss"}
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>

          {/* Mate-ship Trust Bar */}
          <div className="suss-trust">
            <span>✓ No corporate sales reps</span>
            <span>✓ No lock-in contracts</span>
            <span>✓ Just practical systems that work</span>
          </div>
        </form>
      )}
    </div>
  );
}

