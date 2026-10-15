import Link from "next/link";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const HIGHLIGHTS = [
  {
    icon: "calendar_check",
    title: "Chat on WhatsApp",
    text: "Find hospitals and doctors in Rajkot and book in minutes.",
  },
  {
    icon: "forum",
    title: "Free doctor chat",
    text: "Chat with doctors and keep your health history in one place.",
  },
  {
    icon: "auto_awesome",
    title: "AI health tools",
    text: "Report analysis, medicine ID, and voice triage on demand.",
  },
];

/**
 * Split-screen shell for /login + /signup.
 * Colors come ONLY from the Swasthya Setu theme vars (--color-*, --text-*)
 * so the pages match the landing page in every color mode. (The generic
 * shadcn tokens invert in dark mode while the site theme does not —
 * that's what made the old pages look broken.)
 */
export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <main
      className="grid min-h-svh lg:grid-cols-2"
      style={{ background: "var(--color-base)" }}
    >
      {/* Brand panel — desktop only */}
      <aside
        className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex"
        style={{
          color: "#fff",
          background:
            "linear-gradient(135deg, #0D7377 0%, #0A5E61 55%, #084B4E 100%)",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: -96,
            top: -96,
            width: 384,
            height: 384,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: -64,
            bottom: -128,
            width: 384,
            height: 384,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.18)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <Link
          href="/"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--font-display)",
            fontSize: "1.15rem",
            fontWeight: 700,
            color: "#fff",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 12,
              background: "rgba(255,255,255,0.18)",
            }}
          >
            <span className="material-symbols-outlined" aria-hidden>
              health_and_safety
            </span>
          </span>
          Swasthya Setu
        </Link>

        <div className="relative grid gap-8">
          <div className="grid gap-3">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2rem",
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                color: "#fff",
                margin: 0,
              }}
            >
              One app for every health need.
            </h2>
            <p
              style={{
                maxWidth: 420,
                fontSize: "0.925rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.82)",
                margin: 0,
              }}
            >
              Sign in to chat on WhatsApp, chat with doctors, and use AI
              health tools — all synced to your account.
            </p>
          </div>
          <ul className="grid gap-5" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {HIGHLIGHTS.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 38,
                    height: 38,
                    flexShrink: 0,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.16)",
                  }}
                >
                  <span className="material-symbols-outlined" aria-hidden>
                    {item.icon}
                  </span>
                </span>
                <span>
                  <span style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#fff" }}>
                    {item.title}
                  </span>
                  <span style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
                    {item.text}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative" style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)", margin: 0 }}>
          Trusted by families across Rajkot for everyday healthcare.
        </p>
      </aside>

      {/* Form column */}
      <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:py-12">
        <div className="grid w-full gap-5" style={{ maxWidth: 440 }}>
          <Link
            href="/"
            className="flex items-center gap-2 lg:hidden"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: 11,
                background: "var(--color-primary-soft)",
                color: "var(--color-primary)",
              }}
            >
              <span className="material-symbols-outlined" aria-hidden>
                health_and_safety
              </span>
            </span>
            Swasthya Setu
          </Link>

          <div className="grid gap-2">
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.75rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p style={{ fontSize: "0.925rem", color: "var(--text-secondary)", margin: 0 }}>
              {subtitle}
            </p>
          </div>

          {children}

          <p style={{ fontSize: "0.78rem", textAlign: "center", color: "var(--text-tertiary)", margin: 0 }}>
            <Link href="/" style={{ color: "var(--color-primary)", fontWeight: 600 }}>
              ← Back to home
            </Link>
            {" · "}For emergencies call <strong>108</strong>
          </p>
        </div>
      </section>
    </main>
  );
}
