"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { useAuth } from "@/components/shared/auth-provider";

const topbarLinks = [
  { href: "/hospitals", label: "Hospitals" },
  { href: "/hospitals?tab=doctors", label: "Doctors" },
  { href: "/ai-services", label: "AI Tools" },
  { href: "/about", label: "About" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, loading, logout } = useAuth();
  const router = useRouter();
  // Open by default on tablet/desktop (icon rail / full rail), closed on
  // phones where it is a slide-in drawer. The burger toggles both ways.
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768
  );
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  void topbarLinks;

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", sidebarOpen);
  }, [sidebarOpen]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await logout();
      setUserMenuOpen(false);
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  // Guests (not signed in/up) get the exact same public header as every
  // other page — Hospitals, Doctors, AI Tools, About — and no sidebar.
  // Signed-in users keep the full app shell below.
  if (!loading && !isLoggedIn) {
    return (
      <>
        <PublicHeader />
        <main id="main">{children}</main>
        <PublicFooter />
      </>
    );
  }

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    user?.email ??
    "Account";
  const initial = (displayName.trim().charAt(0) || "U").toUpperCase();

  return (
    <>
      <header className="app-topbar">
        <div className="topbar-left">
          <button
            className="topbar-burger"
            id="topbar-burger"
            aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={sidebarOpen}
            aria-controls="app-sidebar"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <span className="material-symbols-outlined">{sidebarOpen ? "close" : "menu"}</span>
          </button>
          <a href="/dashboard" className="topbar-logo">
            <span className="topbar-logo-icon">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                health_and_safety
              </span>
            </span>
            Swasthya Setu
          </a>
        </div>

        <div className="topbar-search">
          <form
            className="global-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
            }}
          >
            <span className="material-symbols-outlined search-icon">
              search
            </span>
            <input
              type="text"
              placeholder="Search for hospitals, doctors, medicines..."
              aria-label="Global search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
        </div>

        <div className="topbar-actions">
          <a
            href={waNumber ? `https://wa.me/${waNumber}` : "https://wa.me/"}
            target="_blank"
            rel="noopener noreferrer"
            className="topbar-add"
            aria-label="Chat on WhatsApp"
          >
            <span className="material-symbols-outlined">chat</span>
            <span className="label">WhatsApp</span>
          </a>
          <a href="tel:108" className="topbar-icon-btn" aria-label="Emergency — call 108">
            <span className="material-symbols-outlined">emergency</span>
          </a>
          <div style={{ position: "relative" }}>
            {loading ? (
              <span
                className="topbar-user animate-pulse"
                aria-hidden="true"
                style={{ minWidth: 120, minHeight: 36, borderRadius: 999 }}
              >
                &nbsp;
              </span>
            ) : (
              <div
                className="topbar-user"
                role="button"
                tabIndex={0}
                aria-label="User profile"
                aria-expanded={userMenuOpen}
                onClick={() => setUserMenuOpen((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setUserMenuOpen((v) => !v);
                  } else if (e.key === "Escape") {
                    setUserMenuOpen(false);
                  }
                }}
              >
                <span className="avatar" aria-hidden="true">
                  {initial}
                </span>
                <span className="user-meta">
                  <span className="user-name">{displayName}</span>
                </span>
              </div>
            )}
            {userMenuOpen && !loading && (
              <div
                role="menu"
                aria-label="Account"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  minWidth: 220,
                  background: "var(--color-surface)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-lg)",
                  padding: 12,
                  zIndex: 60,
                }}
              >
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    margin: "0 0 8px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.email ?? displayName}
                </p>
                <button
                  type="button"
                  role="menuitem"
                  className="btn btn-ghost btn-sm"
                  style={{ width: "100%" }}
                  disabled={signingOut}
                  onClick={handleSignOut}
                >
                  {signingOut ? "Signing out…" : "Sign out"}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main id="main-content" className="app-main">
        {children}
        <footer className="app-footer">
          <div>
            © 2026 Swasthya Setu · For informational purposes only. Not medical advice.
          </div>
          <nav className="footer-links" aria-label="Footer">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/about">About</a>
            <a href="/emergency">Emergency</a>
          </nav>
        </footer>
      </main>
    </>
  );
}
