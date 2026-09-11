import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
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
              Find hospitals, book verified doctors, and unlock AI health
              tools — voice-first, multilingual, and built for everyone.
            </p>

            <form
              className="hero-search"
              action="/search"
              method="get"
              role="search"
            >
              <label className="sr-only" htmlFor="hero-q">
                Search hospitals, doctors, medicines
              </label>
              <div className="hs-field">
                <span className="material-symbols-outlined">
                  search
                </span>
                <input
                  id="hero-q"
                  type="text"
                  name="q"
                  placeholder="Search hospitals, doctors, medicines..."
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>

            <div className="hero-chips">
              <Link href="/hospitals" className="hero-chip">
                🏥 Hospitals
              </Link>
              <Link href="/doctors" className="hero-chip">
                👨‍⚕️ Doctors
              </Link>
              <Link href="/medicine-identifier" className="hero-chip">
                💊 Medicines
              </Link>
            </div>

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

        {/* ============ TRUST BAR ============ */}
        <div className="trust-bar reveal">
          <div className="trust-pill">
            <div className="tp-num">240+</div>
            <div className="tp-label">Hospitals listed</div>
          </div>
          <div className="trust-pill">
            <div className="tp-num">1,800+</div>
            <div className="tp-label">Verified doctors</div>
          </div>
          <div className="trust-pill">
            <div className="tp-num">52,000+</div>
            <div className="tp-label">AI reports analyzed</div>
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

            <Link
              href="/appointment"
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
                  event_available
                </span>
              </div>
              <h3>Book Doctors</h3>
              <p>
                Book appointments with verified specialists in a few
                taps, by specialty and language.
              </p>
            </Link>

            <Link
              href="/ai-services"
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

            <Link href="/chat" className="feature-card reveal">
              <div
                className="feature-card-icon"
                style={{
                  background: "var(--color-success-soft)",
                  color: "var(--color-success)",
                }}
              >
                <span className="material-symbols-outlined">
                  forum
                </span>
              </div>
              <h3>Free Doctor Chat</h3>
              <p>
                Chat with verified doctors for free guidance and
                second opinions, no appointment needed.
              </p>
            </Link>
          </div>
        </section>

        {/* ============ PROMPT WALL ============ */}
        <PromptWall />
      </main>

      {/* ============ FOOTER ============ */}
      <PublicFooter />

      {/* ============ STICKY VOICE TRIAGE ============ */}
      <Link href="/emergency" className="voice-triage-pill">
        <span className="vt-emoji">🎙</span> Voice Triage — tap to speak
      </Link>
    </>
  );
}
