/* global React, Icon, Button */
const { useState: useStateLead } = React;

function LeadCard({ onDismiss, onSubmit }) {
  const [name, setName] = useStateLead('');
  const [biz, setBiz] = useStateLead('');
  const [phone, setPhone] = useStateLead('');
  const [email, setEmail] = useStateLead('');
  const [submitting, setSubmitting] = useStateLead(false);
  const [done, setDone] = useStateLead(false);

  function submit(e) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      setTimeout(() => onSubmit?.(), 1200);
    }, 800);
  }

  if (done) {
    return (
      <div className="gai-bubble-row">
        <div className="gai-leadcard gai-leadcard-success">
          <div className="gai-leadcard-checkwrap">
            <Icon name="check" size={20} />
          </div>
          <div className="gai-leadcard-success-text">
            <strong>Nice one.</strong> We&rsquo;ll be in touch within 24 hours.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gai-bubble-row">
      <div className="gai-leadcard">
        <button className="gai-leadcard-close" onClick={onDismiss} aria-label="Close">
          <Icon name="x" size={14} />
        </button>
        <div className="gai-leadcard-eyebrow">
          <Icon name="sparkle" size={12} /> Want us to scope this?
        </div>
        <h3 className="gai-leadcard-title">Drop your details — we&rsquo;ll handle it.</h3>
        <p className="gai-leadcard-help">
          No obligation, no runaround. We&rsquo;ll come back with what it&rsquo;d take to fix.
        </p>
        <form className="gai-leadcard-form" onSubmit={submit}>
          <div className="gai-leadcard-row">
            <input className="gai-input" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} />
            <input className="gai-input" placeholder="Business name" value={biz} onChange={(e) => setBiz(e.target.value)} />
          </div>
          <div className="gai-leadcard-row">
            <input className="gai-input" placeholder="Phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input className="gai-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" variant="primary" size="md" disabled={submitting}>
            {submitting ? 'Sending…' : 'Get a callback'}
          </Button>
        </form>
      </div>
    </div>
  );
}

Object.assign(window, { LeadCard });
