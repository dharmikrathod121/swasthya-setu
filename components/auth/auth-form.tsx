"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/lib/hooks/use-supabase";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "signin" | "signup";

interface FieldErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Only allow same-origin relative redirects (protects against open redirects). */
function resolveNext(raw: string | null): string {
  if (raw) {
    try {
      const decoded = decodeURIComponent(raw);
      if (
        decoded.startsWith("/") &&
        !decoded.startsWith("//") &&
        !decoded.startsWith("/\\")
      ) {
        return decoded;
      }
    } catch {
      // fall through to default
    }
  }
  return "/dashboard";
}

/** Map Supabase error messages to user-friendly copy. */
function friendlyError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) {
    return "Incorrect email or password. Please try again.";
  }
  if (m.includes("email not confirmed")) {
    return "Please confirm your email first — check your inbox for the verification link.";
  }
  if (m.includes("user already registered") || m.includes("already registered")) {
    return "An account with this email already exists. Try signing in instead.";
  }
  return message;
}

function validate(email: string, password: string, confirm: string, mode: AuthMode): FieldErrors {
  const errors: FieldErrors = {};
  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  if (mode === "signup") {
    if (!confirm) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (confirm !== password) {
      errors.confirmPassword = "Passwords do not match.";
    }
  }
  return errors;
}

const cardStyle: CSSProperties = {
  background: "var(--color-surface)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "var(--radius-xl)",
  boxShadow: "var(--shadow-lg)",
  padding: 28,
};

const eyeBtnStyle: CSSProperties = {
  position: "absolute",
  right: 10,
  top: "50%",
  transform: "translateY(-50%)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  borderRadius: 8,
  color: "var(--text-tertiary)",
};

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: sessionLoading } = useUser();

  const rawNext = searchParams?.get("next") ?? searchParams?.get("redirect") ?? null;
  const next = resolveNext(rawNext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsEmailConfirm, setNeedsEmailConfirm] = useState(false);

  const isSignup = mode === "signup";

  // Already signed in (e.g. middleware missed /signup) — bounce to destination.
  useEffect(() => {
    if (!sessionLoading && user) {
      router.replace(next);
    }
  }, [sessionLoading, user, router, next]);

  const switchHref = isSignup
    ? `/login${rawNext ? `?next=${encodeURIComponent(rawNext)}` : ""}`
    : `/signup${rawNext ? `?next=${encodeURIComponent(rawNext)}` : ""}`;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setNeedsEmailConfirm(false);

    const fieldErrors = validate(email, password, confirmPassword, mode);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const cleanEmail = email.trim();

      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (error) {
          const message = friendlyError(error.message);
          setFormError(message);
          toast.error("Sign-up failed", { description: message });
          return;
        }
        if (data.session) {
          toast.success("Account created", {
            description: "Welcome to Swasthya Setu!",
          });
          router.push(next);
          router.refresh();
        } else {
          // Email confirmation required — no session yet.
          setNeedsEmailConfirm(true);
          toast.success("Check your inbox", {
            description: "We sent a confirmation link to verify your email.",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (error) {
          const message = friendlyError(error.message);
          setFormError(message);
          toast.error("Sign-in failed", { description: message });
          return;
        }
        toast.success("Welcome back!");
        router.push(next);
        router.refresh();
      }
    } catch {
      const message = "Something went wrong. Please check your connection and try again.";
      setFormError(message);
      toast.error("Request failed", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (needsEmailConfirm) {
    return (
      <div style={{ ...cardStyle, textAlign: "center" }}>
        <span
          className="material-symbols-outlined"
          aria-hidden
          style={{ fontSize: 44, color: "var(--color-primary)" }}
        >
          mark_email_read
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            margin: "12px 0 0",
          }}
        >
          Verify your email
        </h2>
        <p style={{ marginTop: 8, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          We sent a confirmation link to <strong>{email.trim()}</strong>.
          Click it to activate your account, then sign in.
        </p>
        <Link
          href={`/login${rawNext ? `?next=${encodeURIComponent(rawNext)}` : ""}`}
          className="btn btn-primary btn-lg btn-block"
          style={{ marginTop: 20, display: "inline-flex", textDecoration: "none" }}
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  const fieldErr = (msg?: string) =>
    msg ? (
      <p role="alert" style={{ fontSize: "0.82rem", color: "var(--color-error)", margin: "6px 0 0" }}>
        {msg}
      </p>
    ) : null;

  return (
    <div style={cardStyle}>
      <form onSubmit={handleSubmit} noValidate className="grid gap-5">
        <div>
          <label className="input-label" htmlFor={`${mode}-email`}>
            Email
          </label>
          <input
            id={`${mode}-email`}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
            }}
            aria-invalid={!!errors.email}
            disabled={isSubmitting}
            className="input-field"
            style={{ marginTop: 8 }}
          />
          {fieldErr(errors.email)}
        </div>

        <div>
          <label className="input-label" htmlFor={`${mode}-password`}>
            Password
          </label>
          <div style={{ position: "relative", marginTop: 8 }}>
            <input
              id={`${mode}-password`}
              type={showPassword ? "text" : "password"}
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
              }}
              aria-invalid={!!errors.password}
              disabled={isSubmitting}
              className="input-field"
              style={{ paddingRight: 46 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={eyeBtnStyle}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
          {fieldErr(errors.password)}
        </div>

        {isSignup && (
          <div>
            <label className="input-label" htmlFor="signup-confirm">
              Confirm password
            </label>
            <div style={{ position: "relative", marginTop: 8 }}>
              <input
                id="signup-confirm"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((p) => ({ ...p, confirmPassword: undefined }));
                }}
                aria-invalid={!!errors.confirmPassword}
                disabled={isSubmitting}
                className="input-field"
                style={{ paddingRight: 46 }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                style={eyeBtnStyle}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  {showConfirm ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            {fieldErr(errors.confirmPassword)}
          </div>
        )}

        {formError && (
          <p
            role="alert"
            style={{
              borderRadius: "var(--radius-md)",
              background: "var(--color-error-soft)",
              border: "1px solid var(--color-error)",
              padding: "10px 12px",
              fontSize: "0.87rem",
              color: "var(--color-error)",
              margin: 0,
            }}
          >
            {formError}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-lg btn-block"
          disabled={isSubmitting}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
            opacity: isSubmitting ? 0.75 : 1,
          }}
        >
          {isSubmitting && (
            <span
              className="material-symbols-outlined animate-spin"
              aria-hidden
              style={{ fontSize: 20 }}
            >
              progress_activity
            </span>
          )}
          {isSubmitting
            ? isSignup
              ? "Creating account…"
              : "Signing in…"
            : isSignup
              ? "Create account"
              : "Sign in"}
        </button>
      </form>

      <p style={{ marginTop: 20, textAlign: "center", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
        {isSignup ? "Already have an account? " : "No account yet? "}
        <Link href={switchHref} style={{ fontWeight: 600, color: "var(--color-primary)" }}>
          {isSignup ? "Sign in" : "Create one"}
        </Link>
      </p>
    </div>
  );
}
