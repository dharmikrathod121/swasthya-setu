"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export function PublicHeader() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/hospitals", label: "Hospitals" },
    { href: "/doctors", label: "Doctors" },
    { href: "/ai-services", label: "AI Tools" },
    { href: "/chat", label: "Doctor Chat" },
    { href: "/about", label: "About" },
  ];

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
          <Link href="/dashboard" className="btn btn-primary btn-sm">
            Sign up free
          </Link>
        </div>
      </div>
    </header>
  );
}
