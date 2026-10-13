"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/shared/auth-provider";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = isSignUp ? await signup(email, password) : await login(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
  };

  return (
    <div className="auth-modal" role="dialog" aria-modal="true">
      <div className="auth-backdrop" onClick={onClose} />
      <div className="auth-card">
        <button className="auth-close" onClick={onClose} aria-label="Close">
          <X className="h-5 w-5" />
        </button>
        <div className="auth-logo">
          <span className="auth-logo-icon">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              health_and_safety
            </span>
          </span>
          Swasthya Setu
        </div>
        <h2>{isSignUp ? "Create account" : "Sign in"}</h2>
        <p className="auth-sub">
          {isSignUp ? "Sign up to book appointments and save your health data." : "Welcome back! Sign in to continue."}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <Button type="submit" className="btn btn-primary w-full">
            {isSignUp ? "Sign up" : "Sign in"}
          </Button>
        </form>

        <button className="auth-guest" onClick={() => { setIsSignUp(!isSignUp); setError(""); }}>
          {isSignUp ? "Already have an account? Sign in" : "No account? Sign up"}
        </button>
      </div>
    </div>
  );
}
