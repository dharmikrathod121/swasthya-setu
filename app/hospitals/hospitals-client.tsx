"use client";

import { useState } from "react";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { useHospitals } from "@/lib/hooks/use-api";
import { SPECIALITIES } from "@/lib/data/mock-data";

function TypeBadge({ type }: { type: string }) {
  const cls = type === "Govt" ? "type-badge-govt" : "type-badge-private";
  const icon = type === "Govt" ? "account_balance" : "business_center";
  return (
    <span className={`type-badge ${cls}`}>
      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{icon}</span>
      {type}
    </span>
  );
}

function QueueBadge({ level }: { level: string }) {
  const map: Record<string, { cls: string; icon: string; label: string }> = {
    low: { cls: "queue-low", icon: "check_circle", label: "Low queue" },
    medium: { cls: "queue-medium", icon: "hourglass_top", label: "Medium queue" },
    busy: { cls: "queue-busy", icon: "priority_high", label: "Busy" },
  };
  const m = map[level] ?? map.low;
  return (
    <span className={`queue-badge ${m.cls}`} title={m.label}>
      <span className="material-symbols-outlined">{m.icon}</span>
      {m.label}
    </span>
  );
}

export default function HospitalsClient() {
  const [filters, setFilters] = useState({ type: "all", specialty: "all", min_rating: "", available: "", open_now: "", distance: "15" });
  const { data: hospitals, isLoading, error } = useHospitals(filters);

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <PublicHeader />

      <main id="main">
        <section className="hero-gradient" style={{ padding: "clamp(40px, 6vw, 72px) var(--space-5)" }}>
          <div className="hero-inner" style={{ maxWidth: 760 }}>
            <span className="eyebrow">Hospitals Directory</span>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
              Find the right hospital in <span style={{ color: "var(--color-primary)" }}>Rajkot</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-lg)", marginTop: "var(--space-3)", marginBottom: "var(--space-6)" }}>
              Government &amp; private hospitals with live queue status, specialities, and patient reviews.
            </p>
          </div>
        </section>

        <div className="directory">
          <div className="directory-head">
            <div>
              <h1>Hospitals near you</h1>
              <p>
                <span className="directory-count" id="result-count">{isLoading ? "..." : hospitals?.length ?? 0}</span>{" "}
                hospitals match your filters
              </p>
            </div>
          </div>

          <div className="directory-layout">
            <aside className="filters" aria-label="Filters">
              <div className="filters-header">
                <h2>Filters</h2>
                <button className="filters-reset" onClick={() => setFilters({ type: "all", specialty: "all", min_rating: "", available: "", open_now: "", distance: "15" })}>Reset</button>
              </div>

              <div className="filter-group">
                <div className="filter-group-title">Type</div>
                <div className="segmented">
                  {["all", "Govt", "Private"].map((v) => (
                    <button key={v} className={filters.type === v ? "active" : ""} onClick={() => setFilters({ ...filters, type: v })}>{v === "all" ? "All" : v}</button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <div className="filter-group-title">Speciality</div>
                <div className="check-list">
                  {SPECIALITIES.map((s) => (
                    <label key={s} className="check-item">
                      <input type="checkbox" checked={filters.specialty === s} onChange={() => setFilters({ ...filters, specialty: filters.specialty === s ? "all" : s })} />
                      {s}
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <div className="filter-group-title">Minimum rating</div>
                <div className="slider-value">
                  <strong>{filters.min_rating || "0"}&amp; up</strong>
                </div>
                <input className="range" type="range" min="0" max="5" step="0.5" value={filters.min_rating || 0} onChange={(e) => setFilters({ ...filters, min_rating: e.target.value })} />
              </div>

              <div className="filter-group">
                <div className="filter-group-title">Availability</div>
                <div className="toggle-row" style={{ marginBottom: "var(--space-3)" }}>
                  <span className="toggle-label"><span className="material-symbols-outlined">event_available</span> Available now</span>
                  <button className={`switch ${filters.available === "true" ? "on" : ""}`} onClick={() => setFilters({ ...filters, available: filters.available === "true" ? "" : "true" })} role="switch" aria-checked={filters.available === "true"} />
                </div>
                <div className="toggle-row">
                  <span className="toggle-label"><span className="material-symbols-outlined">schedule</span> Open now</span>
                  <button className={`switch ${filters.open_now === "true" ? "on" : ""}`} onClick={() => setFilters({ ...filters, open_now: filters.open_now === "true" ? "" : "true" })} role="switch" aria-checked={filters.open_now === "true"} />
                </div>
              </div>
            </aside>

            <section className="results" aria-label="Hospital results">
              {error && <div className="results-empty"><p>Error loading hospitals: {error}</p></div>}
              {isLoading && <div className="results-empty"><p>Loading hospitals...</p></div>}
              <div className="results-grid" id="results-grid">
                {hospitals?.map((h: {
                  id: string;
                  name: string;
                  type: string;
                  rating?: number;
                  distance_km?: number;
                  logo_color?: string;
                  queue_status: string;
                  specialties?: string[];
                }) => (
                  <article key={h.id} className="hcard reveal">
                    <div className="hcard-top">
                      <div className="hcard-logo" style={{ background: h.logo_color }}>
                        <span className="material-symbols-outlined">local_hospital</span>
                      </div>
                      <div className="hcard-id">
                        <div className="hcard-name">{h.name}</div>
                      </div>
                    </div>
                    <div className="hcard-meta-row">
                      <TypeBadge type={h.type} />
                      <span className="rating-pill">
                        <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>star</span>
                        {h.rating?.toFixed(1)}
                      </span>
                      <span className="distance-pill">
                        <span className="material-symbols-outlined">near_me</span>
                        {h.distance_km?.toFixed(1)} km
                      </span>
                    </div>
                    <div className="hcard-chips">
                      {(h.specialties || []).slice(0, 4).map((s: string) => (
                        <span key={s} className="specialty-chip">{s}</span>
                      ))}
                    </div>
                    <div className="hcard-foot">
                      <QueueBadge level={h.queue_status} />
                      <div className="hcard-actions">
                        <a href={`/hospitals/${h.id}`} className="hcard-view">
                          View <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}
