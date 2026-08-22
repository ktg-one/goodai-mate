/* global React */

function Footer() {
  return (
    <footer className="gai-footer">
      <div className="gai-footer-inner">
        <div className="gai-footer-brand">
          <img className="gai-logo" src="../../assets/logo-wordmark.svg" alt="Good&rsquo;ai" style={{ height: 32 }} />
          <p className="gai-footer-tag">Business automations, sorted.</p>
        </div>
        <div className="gai-footer-cols">
          <div>
            <div className="gai-footer-h">Work</div>
            <a className="gai-footer-link" href="#">Invoice flows</a>
            <a className="gai-footer-link" href="#">CRM sync</a>
            <a className="gai-footer-link" href="#">Voice agents</a>
            <a className="gai-footer-link" href="#">Custom builds</a>
          </div>
          <div>
            <div className="gai-footer-h">Company</div>
            <a className="gai-footer-link" href="#">How we work</a>
            <a className="gai-footer-link" href="#">Pricing</a>
            <a className="gai-footer-link" href="#">Contact</a>
          </div>
          <div>
            <div className="gai-footer-h">Local</div>
            <p className="gai-footer-link">Perth, WA · 6000</p>
            <p className="gai-footer-link">G&apos;day@goodai.au</p>
            <p className="gai-footer-link">+61 (08) 0000 0000</p>
          </div>
        </div>
      </div>
      <div className="gai-footer-strip">
        <span>© Good'ai 2026 · ABN 00 000 000 000</span>
        <span className="gai-footer-strip-r">Knock off early. We&rsquo;ll sort it.</span>
      </div>
    </footer>
  );
}

Object.assign(window, { Footer });
