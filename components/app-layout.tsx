"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

const topbarLinks = [
  { href: "/hospitals", label: "Hospitals" },
  { href: "/doctors", label: "Doctors" },
  { href: "/ai-services", label: "AI Tools" },
  { href: "/chat", label: "Doctor Chat" },
  { href: "/about", label: "About" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="app-topbar">
        <div className="topbar-left">
          <button
            className="topbar-burger"
            id="topbar-burger"
            aria-label="Open navigation"
            aria-expanded="false"
            aria-controls="app-sidebar"
            onClick={() => {
              document.body.classList.toggle("sidebar-open");
            }}
          >
            <span className="material-symbols-outlined">menu</span>
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
          <div className="global-search">
            <span className="material-symbols-outlined search-icon">
              search
            </span>
            <input
              type="text"
              placeholder="Search for hospitals, doctors, medicines..."
              aria-label="Global search"
            />
          </div>
        </div>

        <div className="topbar-actions">
          <a href="/appointment" className="topbar-add">
            <span className="material-symbols-outlined">add</span>
            <span className="label">Book</span>
          </a>
          <a href="/chat" className="topbar-icon-btn" aria-label="Messages">
            <span className="material-symbols-outlined">chat</span>
          </a>
          <a href="/emergency" className="topbar-icon-btn" aria-label="Emergency">
            <span className="material-symbols-outlined">emergency</span>
          </a>
          <button className="topbar-icon-btn" aria-label="Settings">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="topbar-user" role="button" tabIndex={0} aria-label="User profile">
            <span className="avatar">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                person
              </span>
            </span>
            <span className="user-meta">
              <span className="user-name">Sign in</span>
            </span>
          </div>
        </div>
      </header>

      <AppSidebar />

      <main id="main-content" className="app-main">
        {children}
        <footer className="app-footer">
          <div>
            &copy; 2024 Swasthya Setu &middot; Ministry of Health &amp; Family
            Welfare, Govt. of India
          </div>
          <nav className="footer-links" aria-label="Footer">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Help Desk</a>
            <a href="#">Accessibility</a>
          </nav>
        </footer>
      </main>
    </>
  );
}
