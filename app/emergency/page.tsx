import Link from "next/link";

export default function EmergencyPage() {
  return (
    <div className="vt-page">
      <a href="#vt-main" className="skip-link">Skip to main content</a>

      <div id="vt-offline" className="vt-offline" role="status" aria-live="polite" hidden>
        <span className="material-symbols-outlined">wifi_off</span>
        <span id="vt-offline-text">Offline mode — showing saved emergency contacts &amp; hospitals</span>
      </div>

      <header className="vt-header">
        <div className="vt-brand">
          <span className="vt-brand-icon">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
          </span>
          Swasthya Setu
        </div>
        <div className="vt-lang" role="group" aria-label="Choose language">
          <button type="button" className="vt-lang-btn active" data-lang="en" aria-pressed="true">English</button>
          <button type="button" className="vt-lang-btn" data-lang="hi" aria-pressed="false">हिन्दी</button>
        </div>
      </header>

      <main id="vt-main" className="vt-main">
        <div className="vt-headline">
          <span className="vt-eyebrow">
            <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>priority_high</span>
            Emergency voice triage
          </span>
          <h1 id="vt-title">Tell us what&apos;s wrong</h1>
          <p id="vt-sub">Tap the mic and speak — or type below. We&apos;ll assess urgency and find the nearest help.</p>
        </div>

        <div className="vt-mic-wrap">
          <button id="vt-mic" className="vt-mic" type="button" aria-pressed="false" aria-label="Start voice triage — tap and speak">
            <span className="material-symbols-outlined">mic</span>
          </button>
          <div id="vt-status" className="vt-mic-status" aria-live="polite">Tap and describe the problem</div>
        </div>

        <section className="vt-transcript" aria-label="Live transcript">
          <p id="vt-transcript" className="vt-transcript-text empty">—</p>
        </section>

        <button id="vt-texttoggle" className="vt-text-toggle" type="button" aria-expanded="false">
          Can&apos;t use voice? Type your symptoms instead
        </button>
        <div id="vt-fallback" className="vt-fallback" hidden>
          <label htmlFor="vt-text">Describe the symptoms</label>
          <div className="vt-fallback-row">
            <input id="vt-text" className="vt-input" type="text" autoComplete="off" placeholder="e.g. chest pain and difficulty breathing" aria-label="Type your symptoms" />
            <button id="vt-submit" className="btn btn-primary btn-lg" type="button">Analyze</button>
          </div>
        </div>

        <section id="vt-result" className="vt-result" aria-live="polite" hidden>
          <div id="vt-sev" className="vt-sev" role="status"></div>
          <p id="vt-advice" className="vt-advice"></p>
          <div id="vt-hospital" className="vt-hospital"></div>
          <div className="vt-listed">
            <h3 id="vt-listed-title">Other nearby options</h3>
            <div id="vt-listed-items"></div>
          </div>
          <div className="vt-contacts">
            <h3 id="vt-contacts-title">Emergency contacts</h3>
            <div id="vt-contacts-items"></div>
          </div>
          <div className="vt-actions">
            <a id="vt-call" className="vt-call" href="tel:108" role="button">
              <span className="material-symbols-outlined">call</span>
              <span id="vt-call-label">Call 108</span>
            </a>
            <Link id="vt-book" className="vt-book" href="/appointments">
              <span className="material-symbols-outlined">event_available</span>
              <span id="vt-book-label">Book appointment</span>
            </Link>
          </div>
          <button id="vt-restart" className="vt-restart" type="button">
            <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: -4 }}>refresh</span>
            Start over
          </button>
        </section>
      </main>
    </div>
  );
}
