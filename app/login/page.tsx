import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthLayout } from "@/components/auth/auth-layout";

export const metadata: Metadata = {
  title: "Sign in — Swasthya Setu",
  description:
    "Sign in to Swasthya Setu to chat on WhatsApp, chat with doctors, and use AI health tools.",
};

function SigninFallback() {
  return (
    <div
      className="animate-pulse rounded-xl border border-border bg-card p-6 sm:p-8"
      aria-hidden
    >
      <div className="h-10 rounded-lg bg-muted" />
      <div className="mt-4 h-10 rounded-lg bg-muted" />
      <div className="mt-4 h-10 rounded-lg bg-muted" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your health dashboard."
    >
      <Suspense fallback={<SigninFallback />}>
        <AuthForm mode="signin" />
      </Suspense>
    </AuthLayout>
  );
}
