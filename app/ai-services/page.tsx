import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export const metadata = {
  title: "AI Health Tools | Swasthya Setu",
  description: "Understand your reports, prescriptions, medicines and food with AI health tools.",
};

export default function Page() {
  return (
    <>
      <PublicHeader />
      <main id="main">
          {/*Hero*/}
          <section className="ais-hero">
            <div className="ais-hero-inner">
              <span className="section-eyebrow">AI-Powered Health</span>
              <h1>AI Health Tools</h1>
              <p>Understand your reports, prescriptions, medicines and food — and chat with a health assistant. Preview the open tools below; sign in for full access to the analyzers.</p>
            </div>
          </section>

          {/*Tool grid*/}
          <section className="ais-section">
            <div className="section-header">
              <h2>Browse the tools</h2>
              <p>Five AI tools to help you make sense of your health information. Two require sign-in; the rest are open for a quick preview.</p>
            </div>

            <div className="ais-grid">
              {/*1. Report Analyzer — LOCKED*/}
              <article className="ais-card is-locked reveal">
                <div className="ais-card-head">
                  <span className="ais-card-icon" aria-hidden="true">
                    <span className="material-symbols-outlined">description</span>
                  </span>
                  <span className="badge badge-warning">
                    <span className="material-symbols-outlined ais-badge-icon" aria-hidden="true">lock</span> Sign in to use
                  </span>
                </div>
                <h3>Report Analyzer</h3>
                <p>Upload blood tests and lab reports to get plain-language explanations of your results and what they mean.</p>
                <Link href="/report-analyzer" className="btn btn-primary btn-sm ais-open-btn" aria-label="Open Report Analyzer — sign in required">
                  <span className="material-symbols-outlined ais-btn-icon" aria-hidden="true">lock</span> Open
                </Link>
              </article>

              {/*2. Prescription Analyzer — LOCKED*/}
              <article className="ais-card is-locked reveal">
                <div className="ais-card-head">
                  <span className="ais-card-icon accent" aria-hidden="true">
                    <span className="material-symbols-outlined">receipt_long</span>
                  </span>
                  <span className="badge badge-warning">
                    <span className="material-symbols-outlined ais-badge-icon" aria-hidden="true">lock</span> Sign in to use
                  </span>
                </div>
                <h3>Prescription Analyzer</h3>
                <p>Scan a prescription to understand dosages, timing, possible interactions and simple guidance for each medicine.</p>
                <Link href="/prescription-analyzer" className="btn btn-primary btn-sm ais-open-btn" aria-label="Open Prescription Analyzer — sign in required">
                  <span className="material-symbols-outlined ais-btn-icon" aria-hidden="true">lock</span> Open
                </Link>
              </article>

              {/*3. Medicine Identifier — OPEN*/}
              <article className="ais-card reveal">
                <div className="ais-card-head">
                  <span className="ais-card-icon ai" aria-hidden="true">
                    <span className="material-symbols-outlined">pill</span>
                  </span>
                  <span className="badge badge-success">Open preview</span>
                </div>
                <h3>Medicine Identifier</h3>
                <p>Search or describe a pill to identify it, check its uses, dosage and common side effects.</p>
                <Link href="/medicine-identifier" className="btn btn-ai btn-sm ais-open-btn" aria-label="Open Medicine Identifier">
                  Open <span className="material-symbols-outlined ais-btn-icon" aria-hidden="true">arrow_forward</span>
                </Link>
              </article>

              {/*4. Food Analyzer — OPEN*/}
              <article className="ais-card reveal">
                <div className="ais-card-head">
                  <span className="ais-card-icon success" aria-hidden="true">
                    <span className="material-symbols-outlined">nutrition</span>
                  </span>
                  <span className="badge badge-success">Open preview</span>
                </div>
                <h3>Food Ingredient Analyzer</h3>
                <p>Check a food or ingredient for hidden allergens, additives and a quick nutritional summary.</p>
                <Link href="/food-analyzer" className="btn btn-ai btn-sm ais-open-btn" aria-label="Open Food Ingredient Analyzer">
                  Open <span className="material-symbols-outlined ais-btn-icon" aria-hidden="true">arrow_forward</span>
                </Link>
              </article>

              {/*5. Health Chatbot — OPEN*/}
              <article className="ais-card reveal">
                <div className="ais-card-head">
                  <span className="ais-card-icon ai" aria-hidden="true">
                    <span className="material-symbols-outlined">smart_toy</span>
                  </span>
                  <span className="badge badge-ai">3 messages free</span>
                </div>
                <h3>Health Chatbot</h3>
                <p>Ask general health questions and get instant, AI-generated guidance. Free for 3 messages — then sign in to continue.</p>
                <Link href="/chatbot" className="btn btn-ai btn-sm ais-open-btn" aria-label="Open Health Chatbot">
                  Open <span className="material-symbols-outlined ais-btn-icon" aria-hidden="true">arrow_forward</span>
                </Link>
              </article>
            </div>
          </section>
        </main>
      <PublicFooter />
    </>
  );
}
