import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { LandingAiSearch } from "@/components/landing-ai-search";
import { PromptWall } from "@/components/prompt-wall";

export default function LandingPage() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <PublicHeader />

      <main id="main">
        {/* ============ HERO ============ */}
        <section className="landing-hero">
          <div className="hero-inner">
            <span className="hero-eyebrow">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "16px" }}
              >
                verified
              </span>{" "}
              Trusted health companion for Rajkot
            </span>
            <h1>
              One app for every health need in{" "}
              <span className="hl">Rajkot</span>
            </h1>
            <p className="hero-sub">
              Find hospitals, chat with doctors on WhatsApp, and unlock AI health
              tools — voice-first, multilingual, and built for everyone.
            </p>

            <LandingAiSearch />

            <div className="hero-cta">
              <Link href="/dashboard" className="btn btn-primary">
                Sign up free
              </Link>
              <Link href="/chatbot" className="btn-ghost-light">
                Try as guest
              </Link>
            </div>
          </div>
        </section>

        {/* ============ TRUST STRIP (no metrics) ============ */}
        <div className="trust-bar reveal" aria-label="What Swasthya Setu offers">
          <div className="trust-pill">
            <div className="tp-label">
              Government &amp; private hospitals in one place
            </div>
          </div>
          <div className="trust-pill">
            <div className="tp-label">
              Verified doctors on WhatsApp &amp; free AI guidance
            </div>
          </div>
          <div className="trust-pill">
            <div className="tp-label">
              AI health tools with plain-language explanations
            </div>
          </div>
        </div>

        {/* ============ FEATURES ============ */}
        <section className="landing-section">
          <div className="section-head reveal">
            <h2>Everything for your health, in one place</h2>
            <p>
              From finding the nearest ICU to understanding a
              prescription — Swasthya Setu brings it together.
            </p>
          </div>

          <div className="features-grid">
            <Link
              href="/hospitals"
              className="feature-card reveal"
            >
              <div
                className="feature-card-icon"
                style={{
                  background: "var(--color-primary-soft)",
                  color: "var(--color-primary)",
                }}
              >
                <span className="material-symbols-outlined">
                  local_hospital
                </span>
              </div>
              <h3>Find Hospitals</h3>
              <p>
                Government &amp; private hospitals in Rajkot with
                filters, live availability, and patient reviews.
              </p>
            </Link>

            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999"}?text=${encodeURIComponent("Hello, I want to consult a doctor")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="feature-card reveal"
            >
              <div
                className="feature-card-icon"
                style={{
                  background: "var(--color-accent-soft)",
                  color: "var(--color-accent)",
                }}
              >
                <span className="material-symbols-outlined">
                  chat
                </span>
              </div>
              <h3>WhatsApp Care Line</h3>
              <p>
                Chat on WhatsApp with verified specialists in a few
                taps, by specialty and language.
              </p>
            </a>

            <Link
              href="/report-analyzer"
              className="feature-card reveal"
            >
              <div
                className="feature-card-icon"
                style={{
                  background: "var(--color-ai-soft)",
                  color: "var(--color-ai)",
                }}
              >
                <span className="material-symbols-outlined">
                  description
                </span>
              </div>
              <h3>AI Report</h3>
              <p>
                Upload a medical report and get plain-language
                insights and next steps in seconds.
              </p>
            </Link>

            <Link
              href="/medicine-identifier"
              className="feature-card reveal"
            >
              <div
                className="feature-card-icon"
                style={{
                  background: "var(--color-ai-soft)",
                  color: "var(--color-ai)",
                }}
              >
                <span className="material-symbols-outlined">
                  pill
                </span>
              </div>
              <h3>Medicine ID</h3>
              <p>
                Identify any medicine by image or name to check
                usage, dosage, and side effects.
              </p>
            </Link>

            <Link
              href="/chatbot"
              className="feature-card reveal"
            >
              <div
                className="feature-card-icon"
                style={{
                  background: "var(--color-ai-soft)",
                  color: "var(--color-ai)",
                }}
              >
                <span className="material-symbols-outlined">
                  robot_2
                </span>
              </div>
              <h3>Health Chatbot</h3>
              <p>
                Ask the AI assistant about symptoms, medicines, and
                healthy habits — any time of day.
              </p>
            </Link>

            <Link href="/health-tools" className="feature-card reveal">
              <div
                className="feature-card-icon"
                style={{
                  background: "var(--color-success-soft)",
                  color: "var(--color-success)",
                }}
              >
                <span className="material-symbols-outlined">
                  monitor_weight
                </span>
              </div>
              <h3>Everyday Health Tools</h3>
              <p>
                BMI, calories, water and BP trackers — free and
                private, no sign-in needed.
              </p>
            </Link>
          </div>
        </section>

        {/* ============ PROMPT WALL ============ */}
        <PromptWall />
      </main>

      {/* ============ FOOTER ============ */}
      <PublicFooter />

      {/* ============ STICKY EMERGENCY CALL ============ */}
      <a href="tel:108" className="voice-triage-pill" aria-label="Call 108 emergency">
        <span className="vt-emoji">🚨</span> Emergency? Call 108 now
      </a>
    </>
  );
}
