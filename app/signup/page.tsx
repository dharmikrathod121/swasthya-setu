import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthLayout } from "@/components/auth/auth-layout";

export const metadata: Metadata = {
  title: "Create account — Swasthya Setu",
  description:
    "Create a free Swasthya Setu account to chat on WhatsApp, chat with doctors, and use AI health tools.",
};

function SignupFallback() {
  return (
    <div
      className="animate-pulse rounded-xl border border-border bg-card p-6 sm:p-8"
      aria-hidden
    >
      <div className="h-10 rounded-lg bg-muted" />
      <div className="mt-4 h-10 rounded-lg bg-muted" />
      <div className="mt-4 h-10 rounded-lg bg-muted" />
      <div className="mt-4 h-10 rounded-lg bg-muted" />
    </div>
  );
}

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Free forever. Chat on WhatsApp and manage your health in one place."
    >
      <Suspense fallback={<SignupFallback />}>
        <AuthForm mode="signup" />
      </Suspense>
    </AuthLayout>
  );
}
