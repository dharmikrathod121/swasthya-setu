"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="auth-modal" role="dialog" aria-modal="true">
      <div className="auth-backdrop" onClick={onClose} />
      <div className="auth-card">
        <button className="auth-close" onClick={onClose} aria-label="Close">
          <X className="h-5 w-5" />
        </button>
        <div className="auth-logo">
          <span className="auth-logo-icon">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              health_and_safety
            </span>
          </span>
          Swasthya Setu
        </div>
        <h2>Sign in</h2>
        <p className="auth-sub">
          Demo mode — no real account is created.
        </p>
        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSuccess();
            onClose();
          }}
        >
          <label>
            Phone / Email
            <input type="text" placeholder="+91 98765 43210" required />
          </label>
          <label>
            Password
            <input type="password" placeholder="••••••••" required />
          </label>
          <Button type="submit" className="btn btn-primary w-full">
            Sign in
          </Button>
        </form>
        <button className="auth-guest" onClick={() => { onSuccess(); onClose(); }}>
          Continue as guest
        </button>
      </div>
    </div>
  );
}
