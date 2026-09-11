"use client";

import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { hospitals, SPECIALITIES } from "@/lib/data/mock-data";

// 100% faithful port of Swasthyasetuhtml/hospitals.html (UI-only).
// Uses original class names verbatim: hero-gradient, directory,
// directory-head, mobile-filter-bar, directory-layout, filters-backdrop,
// filters, segmented, check-list, check-item, slider-value, range,
// toggle-row, switch, results-grid, hcard, etc.
// Static render — no filtering state yet (per UI-only scope).
// Reveal animation handled globally by RevealProvider.

function TypeBadge({ type }: { type: string }) {
  const cls = type === "Govt" ? "type-badge-govt" : "type-badge-private";
  const icon = type === "Govt" ? "account_balance" : "business_center";
  return (
    <span className={`type-badge ${cls}`}>
      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
        {icon}
      </span>
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
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <PublicHeader />

      <main id="main">
        <section
          className="hero-gradient"
          style={{ padding: "clamp(40px, 6vw, 72px) var(--space-5)" }}
        >
          <div className="hero-inner" style={{ maxWidth: 760 }}>
            <span className="eyebrow">Hospitals Directory</span>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
              Find the right hospital in{" "}
              <span style={{ color: "var(--color-primary)" }}>Rajkot</span>
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "var(--text-lg)",
                marginTop: "var(--space-3)",
                marginBottom: "var(--space-6)",
              }}
            >
              Government &amp; private hospitals with live queue status,
              specialities, and patient reviews.
            </p>
            <form
              className="hero-search"
              id="dir-search-form"
              role="search"
              style={{
                background: "var(--color-surface)",
                boxShadow: "var(--shadow-md)",
              }}
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="hs-field">
                <span className="material-symbols-outlined">search</span>
                <input
                  id="dir-search"
                  type="text"
                  name="q"
                  placeholder="Search hospital name or speciality..."
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>
          </div>
        </section>

        <div className="directory">
          <div className="directory-head">
            <div>
              <h1>Hospitals near you</h1>
              <p>
                <span className="directory-count" id="result-count">
                  {hospitals.length}
                </span>{" "}
                hospitals match your filters
              </p>
            </div>
          </div>

          <div className="mobile-filter-bar">
            <button
              className="btn btn-secondary"
              id="open-filters"
              type="button"
            >
              <span className="material-symbols-outlined">tune</span> Filters
            </button>
            <button
              className="btn btn-ghost"
              id="mobile-sort"
              type="button"
              aria-label="Sort hospitals"
            >
              <span className="material-symbols-outlined">swap_vert</span>{" "}
              <span id="sort-label">Relevance</span>
            </button>
          </div>

          <div className="directory-layout">
            <div className="filters-backdrop" id="filters-backdrop"></div>

            <aside className="filters" id="filters" aria-label="Filters">
              <div className="filters-drawer-header">
                <h2>Filters</h2>
                <button
                  className="icon-close-btn"
                  id="close-filters"
                  aria-label="Close filters"
                  type="button"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="filters-header">
                <h2>Filters</h2>
                <button
                  className="filters-reset"
                  id="reset-filters"
                  type="button"
                >
                  Reset
                </button>
              </div>

              <div className="filter-group">
                <div className="filter-group-title">Type</div>
                <div className="segmented" id="filter-type">
                  <button type="button" className="active" data-value="all">
                    All
                  </button>
                  <button type="button" data-value="Govt">
                    Govt
                  </button>
                  <button type="button" data-value="Private">
                    Private
                  </button>
                </div>
              </div>

              <div className="filter-group">
                <div className="filter-group-title">Speciality</div>
                <div className="check-list" id="filter-speciality">
                  {SPECIALITIES.map((s) => (
                    <label key={s} className="check-item">
                      <input type="checkbox" value={s} />
                      {s}
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <div className="filter-group-title">Minimum rating</div>
                <div className="slider-value">
                  <span className="star-line" id="rating-stars"></span>
                  <strong id="rating-label">&amp; up</strong>
                </div>
                <input
                  className="range"
                  type="range"
                  id="filter-rating"
                  min={0}
                  max={5}
                  step={0.5}
                  defaultValue={0}
                />
              </div>

              <div className="filter-group">
                <div className="filter-group-title">Distance from me</div>
                <div className="slider-value">
                  <span>Within</span>
                  <strong id="distance-label">15 km</strong>
                </div>
                <input
                  className="range"
                  type="range"
                  id="filter-distance"
                  min={1}
                  max={15}
                  step={1}
                  defaultValue={15}
                />
              </div>

              <div className="filter-group">
                <div className="filter-group-title">Availability</div>
                <div
                  className="toggle-row"
                  style={{ marginBottom: "var(--space-3)" }}
                >
                  <span className="toggle-label">
                    <span className="material-symbols-outlined">
                      event_available
                    </span>{" "}
                    Available now
                  </span>
                  <button
                    className="switch"
                    id="toggle-available"
                    role="switch"
                    aria-checked="false"
                    aria-label="Available now"
                    type="button"
                  ></button>
                </div>
                <div className="toggle-row">
                  <span className="toggle-label">
                    <span className="material-symbols-outlined">schedule</span>{" "}
                    Open now
                  </span>
                  <button
                    className="switch"
                    id="toggle-open"
                    role="switch"
                    aria-checked="false"
                    aria-label="Open now"
                    type="button"
                  ></button>
                </div>
              </div>

              <div className="filters-drawer-footer">
                <button className="btn btn-ghost" id="drawer-reset" type="button">
                  Reset
                </button>
                <button
                  className="btn btn-primary"
                  id="drawer-apply"
                  type="button"
                >
                  Show results
                </button>
              </div>
            </aside>

            <section className="results" aria-label="Hospital results">
              <div className="results-grid" id="results-grid">
                {hospitals.map((h) => (
                  <article key={h.id} className="hcard reveal">
                    <div className="hcard-top">
                      <div
                        className="hcard-logo"
                        style={{ background: h.logoColor }}
                      >
                        <span className="material-symbols-outlined">
                          local_hospital
                        </span>
                      </div>
                      <div className="hcard-id">
                        <div className="hcard-name">{h.name}</div>
                      </div>
                    </div>
                    <div className="hcard-meta-row">
                      <TypeBadge type={h.type} />
                      <span className="rating-pill">
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: 14,
                            fontVariationSettings: "'FILL' 1",
                          }}
                        >
                          star
                        </span>
                        {h.rating.toFixed(1)}
                      </span>
                      <span className="distance-pill">
                        <span className="material-symbols-outlined">
                          near_me
                        </span>
                        {h.distanceKm.toFixed(1)} km
                      </span>
                    </div>
                    <div className="hcard-chips">
                      {h.specialties.slice(0, 4).map((s) => (
                        <span key={s} className="specialty-chip">
                          {s}
                        </span>
                      ))}
                      {h.specialties.length > 4 && (
                        <span className="specialty-chip">
                          +{h.specialties.length - 4} more
                        </span>
                      )}
                    </div>
                    <div className="hcard-foot">
                      <QueueBadge level={h.queue} />
                      <div className="hcard-actions">
                        <button
                          className="btn btn-primary btn-sm"
                          data-book={h.id}
                          type="button"
                        >
                          Book
                        </button>
                        <Link
                          className="hcard-view"
                          href={`/hospitals/${h.id}`}
                        >
                          View{" "}
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 16 }}
                          >
                            arrow_forward
                          </span>
                        </Link>
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
