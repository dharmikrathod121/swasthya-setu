"use client";

import Link from "next/link";
import { useAuth } from "@/components/shared/auth-provider";

/**
 * Sign-in target for gated tools. The canonical sign-in route is /login;
 * /signin is an alias that forwards `next`/`redirect`. Keeping the same
 * redirect param the middleware uses means sign-in lands back on /ai-services
 * with the analyzers unlocked.
 */
const SIGN_IN_HREF = "/login?redirect=%2Fai-services";

interface AnalyzerCardProps {
  title: string;
  description: string;
  icon: string;
  iconModifier?: string;
  href: string;
  locked: boolean;
}

function AnalyzerCard({
  title,
  description,
  icon,
  iconModifier,
  href,
  locked,
}: AnalyzerCardProps) {
  return (
    <article className={locked ? "ais-card is-locked reveal" : "ais-card reveal"}>
      <div className="ais-card-head">
        <span
          className={iconModifier ? `ais-card-icon ${iconModifier}` : "ais-card-icon"}
          aria-hidden="true"
        >
          <span className="material-symbols-outlined">{icon}</span>
        </span>
        {locked ? (
          <span className="badge badge-warning">
            <span className="material-symbols-outlined ais-badge-icon" aria-hidden="true">lock</span> Sign in to use
          </span>
        ) : (
          <span className="badge badge-success">Open</span>
        )}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {locked ? (
        <Link href={SIGN_IN_HREF} className="btn btn-primary btn-sm ais-open-btn" aria-label={`Open ${title} — sign in required`}>
          <span className="material-symbols-outlined ais-btn-icon" aria-hidden="true">lock</span> Open
        </Link>
      ) : (
        <Link href={href} className="btn btn-ai btn-sm ais-open-btn" aria-label={`Open ${title}`}>
          Open <span className="material-symbols-outlined ais-btn-icon" aria-hidden="true">arrow_forward</span>
        </Link>
      )}
    </article>
  );
}

/**
 * The AI tools grid. Rendered on the server in its locked/anonymous state so
 * hydration always matches, then flips the two analyzers to "Open" once the
 * Supabase session is known (AuthProvider subscribes to onAuthStateChange).
 */
export function AiServicesGrid() {
  const { isLoggedIn, loading } = useAuth();
  // Until the session resolves, stay in the locked (anonymous) view.
  const locked = loading || !isLoggedIn;

  return (
    <div className="ais-grid">
      {/*1. Report Analyzer — gated by sign-in*/}
      <AnalyzerCard
        title="Report Analyzer"
        description="Upload blood tests and lab reports to get plain-language explanations of your results and what they mean."
        icon="description"
        href="/report-analyzer"
        locked={locked}
      />

      {/*2. Prescription Analyzer — gated by sign-in*/}
      <AnalyzerCard
        title="Prescription Analyzer"
        description="Scan a prescription to understand dosages, timing, possible interactions and simple guidance for each medicine."
        icon="receipt_long"
        iconModifier="accent"
        href="/prescription-analyzer"
        locked={locked}
      />

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
  );
}
