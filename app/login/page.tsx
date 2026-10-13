"use client";

import { AuthModal } from "@/components/shared/auth-modal";
import { AppLayout } from "@/components/app-layout";
import { useState } from "react";

export default function LoginPage() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <AppLayout>
      <div className="container section" style={{ paddingTop: "var(--space-8)" }}>
        <div className="max-w-md mx-auto text-center reveal" style={{ marginBottom: "var(--space-8)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 64, color: "var(--color-primary)" }}>
            health_and_safety
          </span>
          <h1 style={{ marginTop: "var(--space-4)" }}>Welcome to Swasthya Setu</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "var(--space-3)" }}>
            Sign in to book appointments, chat with doctors, and access AI health tools.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => setShowAuth(true)} style={{ marginTop: "var(--space-4)" }}>
            Sign in to continue
          </button>
          <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
        </div>
      </div>
    </AppLayout>
  );
}
