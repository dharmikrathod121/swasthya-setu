"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/shared/auth-provider";

export function PublicHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, loading, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const navLinks = [
    { href: "/hospitals", label: "Hospitals" },
    { href: "/hospitals?tab=doctors", label: "Doctors" },
    { href: "/ai-services", label: "AI Tools" },
    { href: "/chatbot", label: "AI Assistant" },
    { href: "/about", label: "About" },
  ];

  // signOut() triggers onAuthStateChange, so the header flips back to the
  // logged-out CTA on its own — we only send the user somewhere sensible.
  const handleSignOut = useCallback(async () => {
    setSigningOut(true);
    try {
      await logout();
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }, [logout, router]);

  return (
    <header className="landing-header">
      <div className="lh-inner">
        <Link href="/" className="lh-logo" aria-label="Swasthya Setu home">
          <span className="lh-logo-icon">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              health_and_safety
            </span>
          </span>
          Swasthya Setu
        </Link>
        <nav className="lh-nav" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "active" : ""}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="lh-actions">
          <ThemeToggle />
          {loading ? (
            /* Neutral placeholder sized like the CTA — never flashes a label. */
            <span
              className="btn btn-primary btn-sm animate-pulse"
              style={{ minWidth: 92 }}
              aria-hidden="true"
            >
              &nbsp;
            </span>
          ) : isLoggedIn ? (
            <>
              <Link href="/dashboard" className="btn btn-ghost btn-sm">
                Dashboard
              </Link>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </>
          ) : (
            <Link href="/signup" className="btn btn-primary btn-sm">
              Sign up free
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
