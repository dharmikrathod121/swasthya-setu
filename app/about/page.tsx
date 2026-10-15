import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <main id="main">
        <div className="landing-section" style={{ paddingTop: "var(--space-8)" }}>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <span>About</span>
          </nav>

          <section className="text-center py-12 reveal">
            <div className="section-eyebrow justify-center" style={{ display: "inline-flex" }}>About Us</div>
            <h1 className="mb-4">Swasthya Setu</h1>
            <p className="text-lg mx-auto" style={{ color: "var(--text-secondary)", maxWidth: 700 }}>
              A next-generation national healthcare infrastructure, prioritizing institutional trust, universal accessibility, and modern efficiency for every citizen of India.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="card reveal">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: "var(--color-primary-soft)" }}>
                    <span className="material-symbols-outlined text-primary" style={{ color: "var(--color-primary)", fontVariationSettings: "'FILL' 1" }}>flag</span>
                  </div>
                  <h2 className="text-2xl">Mission</h2>
                </div>
                <div style={{ borderTop: "1px solid var(--border-subtle)" }} className="pt-4">
                  <p style={{ color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>
                    To empower every citizen with secure, seamless, and comprehensive digital access to their health records, facilitating proactive healthcare management and fostering a transparent, efficient healthcare ecosystem across the nation.
                  </p>
                </div>
              </div>
            </div>

            <div className="card reveal">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: "var(--color-success-soft)" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--color-success)", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                  <h2 className="text-2xl">Objectives</h2>
                </div>
                <div style={{ borderTop: "1px solid var(--border-subtle)" }} className="pt-4">
                  <ul className="flex flex-col gap-3">
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined mt-0.5" style={{ color: "var(--color-success)", fontVariationSettings: "'FILL' 1" }}>done</span>
                      <span style={{ color: "var(--text-secondary)" }}>Universal Digital Identity for Healthcare</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined mt-0.5" style={{ color: "var(--color-success)", fontVariationSettings: "'FILL' 1" }}>done</span>
                      <span style={{ color: "var(--text-secondary)" }}>Interoperable Health Records Exchange</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined mt-0.5" style={{ color: "var(--color-success)", fontVariationSettings: "'FILL' 1" }}>done</span>
                      <span style={{ color: "var(--text-secondary)" }}>Empowering Telemedicine &amp; AI Diagnostics</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="section-header reveal">
            <div className="section-eyebrow">Features</div>
            <h2>Key Features</h2>
            <p>What makes Swasthya Setu different from any other health platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="feature-card reveal">
              <div className="feature-card-icon" style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)" }}>
                <span className="material-symbols-outlined">shield_locked</span>
              </div>
              <h3>Data Security</h3>
              <p>End-to-end encryption ensures that personal health information remains confidential and is shared only with explicit consent.</p>
              <div className="feature-card-action">Learn more <span className="material-symbols-outlined">arrow_forward</span></div>
            </div>

            <div className="feature-card reveal">
              <div className="feature-card-icon" style={{ background: "var(--color-success-soft)", color: "var(--color-success)" }}>
                <span className="material-symbols-outlined">diversity_1</span>
              </div>
              <h3>Interoperability</h3>
              <p>Seamless integration across different healthcare providers, laboratories, and insurance agencies via unified APIs.</p>
              <div className="feature-card-action" style={{ color: "var(--color-success)" }}>Learn more <span className="material-symbols-outlined">arrow_forward</span></div>
            </div>

            <div className="feature-card reveal">
              <div className="feature-card-icon" style={{ background: "var(--color-ai-soft)", color: "var(--color-ai)" }}>
                <span className="material-symbols-outlined">smart_toy</span>
              </div>
              <h3>AI Diagnostics</h3>
              <p>Leveraging advanced machine learning models to assist medical professionals in early detection and personalized treatment plans.</p>
              <div className="feature-card-action" style={{ color: "var(--color-ai)" }}>Learn more <span className="material-symbols-outlined">arrow_forward</span></div>
            </div>
          </div>

          <div className="section-header reveal">
            <div className="section-eyebrow">Our Journey</div>
            <h2>Development Roadmap</h2>
          </div>

          <div className="max-w-2xl mx-auto reveal">
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4 className="font-bold mb-1">Phase 1: Foundation</h4>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Authentication, RBAC dashboards, and protected routes. Core infrastructure for patients, doctors, and admins.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4 className="font-bold mb-1">Phase 2: Discovery</h4>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Hospital and doctor search with filters, geolocation, and verified reviews. Chat on WhatsApp to consult.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4 className="font-bold mb-1">Phase 3: Intelligence</h4>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>AI chatbot, free doctor chat, voice-first triage, and real-time hospital queue management.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4 className="font-bold mb-1">Phase 4: Wellness</h4>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>AI report analyzer, prescription analyzer, food scanner, medicine identifier, and comprehensive health tools.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-12 reveal">
            <div className="card-body">
              <h3 className="text-xl font-bold mb-4">Technology Stack</h3>
              <p className="mb-4" style={{ color: "var(--text-secondary)" }}>Built on a robust, scalable Digital Public Infrastructure framework.</p>
              <div className="flex flex-wrap gap-2">
                <span className="chip">Microservices Architecture</span>
                <span className="chip">Blockchain Consent Ledgers</span>
                <span className="chip">FHIR Health Data Standards</span>
                <span className="chip">Cloud-Native Deployment</span>
                <span className="chip">PostgreSQL + PostGIS</span>
                <span className="chip">Next.js 14</span>
                <span className="chip">OpenAI GPT-4o</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
