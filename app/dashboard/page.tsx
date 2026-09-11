"use client";

import { AppLayout } from "@/components/app-layout";
import { useState, useEffect } from "react";

const featureCards = [
  {
    href: "/hospitals",
    icon: "local_hospital",
    title: "View Hospitals",
    desc: "Government & private hospitals with filters, live availability, and patient reviews.",
    color: "primary",
  },
  {
    href: "/clinics",
    icon: "apartment",
    title: "Clinics Directory",
    desc: "Browse nearby clinics by specialty, timings, and the services they offer.",
    color: "accent",
  },
  {
    href: "/doctors",
    icon: "badge",
    title: "Doctors Directory",
    desc: "Search verified doctors by specialty, experience, language, and patient ratings.",
    color: "success",
  },
  {
    href: "/appointment",
    icon: "event_available",
    title: "Doctor Appointment Booking",
    desc: "Book appointments with hospitals and doctors in a few simple taps.",
    color: "primary",
  },
  {
    href: "/chat",
    icon: "forum",
    title: "Free Doctor Chat Guidance",
    desc: "Chat with verified doctors for free guidance and second opinions.",
    color: "accent",
  },
  {
    href: "/search",
    icon: "search",
    title: "Search Engine",
    desc: "Full-text search across hospitals, doctors, clinics, and medicines with filters, reviews, and location.",
    color: "ai",
  },
];

const emergencyCards = [
  {
    href: "/emergency",
    icon: "graphic_eq",
    title: "Voice-First Triage",
    desc: "Describe symptoms by speaking in your own language. Built for low-literacy and elderly users, and works offline.",
    color: "error",
  },
  {
    href: "/hospitals",
    icon: "groups",
    title: "Real-Time Hospital Queue",
    desc: "See live waiting times from crowdsourced reports and an official hospital API stub.",
    color: "error",
  },
];

const aiCards = [
  {
    href: "/ai-services",
    icon: "description",
    title: "AI Medical Report Analyzer",
    desc: "Upload a report and get OCR-powered, plain-language insights and clear next steps.",
    color: "ai",
  },
  {
    href: "/prescription-analyzer",
    icon: "receipt",
    title: "AI Prescription Analyzer",
    desc: "Understand dosages, interactions, and warnings from any handwritten or printed prescription.",
    color: "accent",
  },
  {
    href: "/food-analyzer",
    icon: "nutrition",
    title: "Smart Food Ingredients Analyzer",
    desc: "Scan food labels to reveal hidden allergens, additives, and nutritional information.",
    color: "success",
  },
  {
    href: "/health-tools",
    icon: "monitor_weight",
    title: "BMI Calculator + Health Tools",
    desc: "Calculate BMI and access everyday health calculators and trackers.",
    color: "primary",
  },
  {
    href: "/medicine-identifier",
    icon: "pill",
    title: "AI Medicine Identifier",
    desc: "Identify medicines by image or name to check usage, dosage, and side effects.",
    color: "ai",
  },
  {
    href: "/chatbot",
    icon: "robot_2",
    title: "AI Health Chatbot",
    desc: "Ask the AI assistant about symptoms, medicines, and healthy habits, any time of day.",
    color: "ai",
  },
];

const colorMap: Record<string, { bg: string; text: string }> = {
  primary: { bg: "var(--color-primary-soft)", text: "var(--color-primary)" },
  accent: { bg: "var(--color-accent-soft)", text: "var(--color-accent)" },
  success: { bg: "var(--color-success-soft)", text: "var(--color-success)" },
  error: { bg: "var(--color-error-soft)", text: "var(--color-error)" },
  ai: { bg: "var(--color-ai-soft)", text: "var(--color-ai)" },
};

function FeatureCard({ href, icon, title, desc, color }: (typeof featureCards)[0]) {
  const { bg, text } = colorMap[color] || colorMap.primary;
  return (
    <a href={href} className="feature-card reveal">
      <div className="feature-card-icon" style={{ background: bg, color: text }}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <div className="feature-card-action">
        Open <span className="material-symbols-outlined">arrow_forward</span>
      </div>
    </a>
  );
}

export default function DashboardPage() {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id) {
              setRevealedIds((prev) => {
                const next = new Set(prev);
                next.add(id);
                return next;
              });
            }
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const isRevealed = (id: string) => revealedIds.has(id);

  return (
    <AppLayout>
      <div className="container" style={{ paddingTop: "var(--space-8)" }}>
        {/* Hero / Section header */}
        <section className="section-header reveal" id="hero" style={{ marginBottom: "var(--space-10)" }}>
          <div className="section-eyebrow">Swasthya Setu</div>
          <h1>One app for every health need</h1>
          <p>Find care near you, talk to doctors, and use AI tools to understand your health — all in one place.</p>
        </section>

        {/* Find & Book Care */}
        <section className="reveal" id="find-book" style={{ marginBottom: "var(--space-10)" }}>
          <div
            className="flex items-center justify-between mb-6 pb-2"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <h2 className="text-2xl" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Find &amp; Book Care
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        {/* Live & Emergency */}
        <section className="reveal" id="live-emergency" style={{ marginBottom: "var(--space-10)" }}>
          <div
            className="flex items-center justify-between mb-6 pb-2"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <h2 className="text-2xl" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Live &amp; Emergency
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyCards.map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        {/* AI Health Tools */}
        <section className="reveal" id="ai-tools">
          <div
            className="flex items-center justify-between mb-6 pb-2"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <h2 className="text-2xl" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
              AI Health Tools
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiCards.map((card, idx) => (
              <a
                key={card.title}
                href={card.href}
                className={`feature-card reveal ${card.color === "ai" ? "bento-icon-ai" : ""}`}
                id={`ai-card-${idx}`}
              >
                <div className="feature-card-icon" style={{ background: colorMap[card.color]?.bg, color: colorMap[card.color]?.text }}>
                  <span className="material-symbols-outlined">{card.icon}</span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <div className="feature-card-action">
                  Open <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
