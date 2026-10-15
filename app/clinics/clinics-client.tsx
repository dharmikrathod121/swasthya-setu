"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useHospitals } from "@/lib/hooks/use-api";
import { waLink } from "@/lib/whatsapp";

interface ClinicRow {
  id: string;
  name: string;
  area?: string;
  location?: string;
  city?: string;
  specialties?: string[];
  phone?: string | null;
  hours?: string | null;
  rating?: number;
  reviews_count?: number;
  reviewCount?: number;
}

const ICONS = ["medical_services", "dental_care", "healing", "ophthalmology", "child_care", "local_hospital"];
const COLORS = ["var(--color-primary)", "var(--color-accent)", "var(--color-success)"];

export default function ClinicsClient() {
  const { data, error, isLoading } = useHospitals({ type: "clinic" });
  const [q, setQ] = useState("");
  const [specialty, setSpecialty] = useState("All");

  const clinics: ClinicRow[] = Array.isArray(data) ? data : [];

  const pillOptions = useMemo(() => {
    const counts = new Map<string, number>();
    clinics.forEach((c) =>
      (c.specialties ?? []).forEach((s) => counts.set(s, (counts.get(s) ?? 0) + 1))
    );
    return ["All", ...[...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7).map(([s]) => s)];
  }, [clinics]);

  const filtered = clinics.filter((c) => {
    const hay = `${c.name} ${c.area ?? ""} ${c.location ?? ""} ${(c.specialties ?? []).join(" ")}`.toLowerCase();
    if (q.trim() && !hay.includes(q.trim().toLowerCase())) return false;
    if (specialty !== "All" && !(c.specialties ?? []).includes(specialty)) return false;
    return true;
  });

  return (
    <div className="container section" style={{ paddingTop: "var(--space-8)" }}>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/dashboard">Home</Link>
        <span className="breadcrumb-separator">/</span>
        <Link href="/hospitals">Hospitals</Link>
        <span className="breadcrumb-separator">/</span>
        <span>Clinics</span>
      </nav>

      <div className="section-header reveal">
        <div className="section-eyebrow">Specialized Care</div>
        <h1>Clinics Near You</h1>
        <p>
          {isLoading
            ? "Loading clinics…"
            : `${filtered.length} clinic${filtered.length === 1 ? "" : "s"} across Rajkot — diagnostics, dental, physio, eye care and more.`}
        </p>
      </div>

      <div className="reveal" style={{ marginBottom: "var(--space-10)" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="input-search">
            <span className="material-symbols-outlined search-bar-icon">search</span>
            <input
              type="text"
              className="search-bar-input"
              placeholder="Search clinics..."
              aria-label="Search clinics"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="input-search">
            <span className="material-symbols-outlined search-bar-icon">stethoscope</span>
            <input
              type="text"
              className="search-bar-input"
              placeholder="Specialty..."
              aria-label="Specialty"
              value={specialty === "All" ? "" : specialty}
              onChange={(e) => setSpecialty(e.target.value || "All")}
            />
          </div>
          <div className="input-search">
            <span className="material-symbols-outlined search-bar-icon">location_on</span>
            <input type="text" className="search-bar-input" placeholder="Rajkot" aria-label="Location" disabled />
          </div>
        </div>

        <div className="filter-bar mt-4">
          {pillOptions.map((p) => (
            <button
              key={p}
              type="button"
              className={`filter-pill${specialty === p ? " active" : ""}`}
              onClick={() => setSpecialty(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p role="alert" style={{ color: "var(--color-error)" }}>
          Couldn&apos;t load clinics. Please refresh and try again.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c, i) => {
          const rating = typeof c.rating === "number" ? c.rating : 0;
          const area = c.area || c.location || "Rajkot";
          const specs = c.specialties ?? [];
          return (
            <article key={c.id} className="hospital-card reveal">
              <div
                className="hospital-card-image-placeholder"
                style={{ background: "linear-gradient(135deg, var(--color-primary-soft) 0%, var(--color-base) 100%)" }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 64, color: COLORS[i % COLORS.length] }}
                >
                  {ICONS[i % ICONS.length]}
                </span>
              </div>
              <div className="hospital-card-body">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="hospital-card-title">{c.name}</h3>
                  {rating > 0 && (
                    <div className="hospital-card-rating">
                      <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>star</span>
                      {rating.toFixed(1)}
                    </div>
                  )}
                </div>
                <div className="hospital-card-meta">
                  <div className="hospital-card-meta-item">
                    <span className="material-symbols-outlined">location_on</span>
                    <span>{area}</span>
                  </div>
                  <div className="hospital-card-meta-item">
                    <span className="material-symbols-outlined">schedule</span>
                    <span style={{ color: "var(--color-success)", fontWeight: 600 }}>
                      {c.hours || "Contact for hours"}
                    </span>
                  </div>
                  {specs.length > 0 && (
                    <div className="hospital-card-meta-item">
                      <span className="material-symbols-outlined">category</span>
                      <span>{specs.slice(0, 3).join(" · ")}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {specs.slice(0, 3).map((s) => (
                    <span key={s} className="badge badge-primary">{s}</span>
                  ))}
                </div>
              </div>
              <div className="hospital-card-actions">
                <a
                  className="btn btn-primary btn-sm w-full"
                  href={waLink(`Hello, I want to chat about ${c.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat on WhatsApp
                </a>
                {c.phone ? (
                  <a className="btn btn-secondary btn-sm w-full" href={`tel:${c.phone.replace(/\s/g, "")}`}>
                    Call
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      {!isLoading && filtered.length === 0 && (
        <p style={{ color: "var(--text-secondary)" }}>
          No clinics match. Try a different search or specialty.
        </p>
      )}
    </div>
  );
}
