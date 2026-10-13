"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { doctors as fallbackDoctors } from "@/lib/data/mock-data";
import { useDoctors } from "@/lib/hooks/use-api";

const COLOR_BY_SPECIALTY: Record<string, string> = {
  Cardiologist: "primary",
  Pediatrician: "accent",
  Orthopedic: "ai",
  Dermatologist: "success",
  Neurologist: "primary",
};

function colorFor(specialty: string, index: number) {
  if (COLOR_BY_SPECIALTY[specialty]) return COLOR_BY_SPECIALTY[specialty];
  const fallback = ["primary", "accent", "ai", "success"];
  return fallback[index % fallback.length];
}

function initialsOf(name: string) {
  return name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DoctorsPage() {
  const { data: apiDoctors } = useDoctors();
  const doctors = (Array.isArray(apiDoctors) && apiDoctors.length > 0
    ? apiDoctors.map((d: Record<string, unknown>, i: number) => ({
        id: String(d.id ?? `db-${i}`),
        name: String(d.name ?? "Doctor"),
        specialty: String(d.specialty ?? "General Physician"),
        hospital: String((d as { hospitals?: { name?: unknown }; hospital_name?: unknown }).hospitals?.name ?? (d as { hospital_name?: unknown }).hospital_name ?? "Rajkot"),
        rating: Number(d.rating ?? 4.3),
        experience: String(d.experience ?? "10+ years"),
        languages: (Array.isArray(d.languages) ? d.languages : ["English", "Hindi", "Gujarati"]) as string[],
        fee: Number(d.fee ?? 300),
        nextAvailable: String(d.next_available ?? "Mon-Sat"),
        reviews: [] as { author: string; rating: number; text: string }[],
      }))
    : fallbackDoctors) as typeof fallbackDoctors;
  const specialties = [...new Set(doctors.map((d) => d.specialty))].sort();
  const hospitalOptions = [...new Set(doctors.map((d) => d.hospital))].sort();
  const languageOptions = [...new Set(doctors.flatMap((d) => d.languages))].sort();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <PublicHeader />

      <main id="main">
        {/* Hero */}
        <section className="doc-hero">
          <div className="doc-hero-inner">
            <span className="eyebrow">Verified Specialists</span>
            <h1>
              Find the right doctor in <span style={{ color: "#FFE3C2" }}>Rajkot</span>
            </h1>
            <p>
              Browse certified specialists, read patient reviews, check live
              availability and book in minutes.
            </p>
          </div>
        </section>

        <div className="doc-wrap">
          {/* Toolbar */}
          <div className="doc-toolbar reveal">
            <form className="doc-search" role="search" id="doc-search-form">
              <span className="material-symbols-outlined">search</span>
              <input
                type="text"
                id="doc-search"
                name="q"
                placeholder="Search by doctor name or specialty…"
                aria-label="Search doctors"
              />
            </form>

            <div className="doc-toolbar-row">
              <span className="doc-result-count">
                <strong id="doc-count">{doctors.length}</strong> doctors match
                your filters
              </span>
              <button
                className="btn btn-secondary btn-sm doc-filter-trigger"
                id="doc-open-filters"
                type="button"
              >
                <span className="material-symbols-outlined">tune</span> Filters
              </button>
            </div>

            {/* Filters: specialty chips + hospital/language/rating selects */}
            <aside className="doc-filters" id="doc-filters" aria-label="Filters">
              <div className="doc-filters-drawer-head">
                <h2>Filters</h2>
                <button
                  className="icon-close-btn"
                  id="doc-close-filters"
                  aria-label="Close filters"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="doc-filter-group" style={{ flex: "1 1 100%" }}>
                <span className="doc-filter-label">Specialty</span>
                <div
                  className="doc-filter-pills"
                  id="doc-spec-pills"
                  role="group"
                  aria-label="Filter by specialty"
                >
                  {specialties.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="filter-pill"
                      aria-pressed="false"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="doc-filter-group">
                <label className="doc-filter-label" htmlFor="doc-filter-hospital">
                  Hospital
                </label>
                <select
                  className="doc-filter-select"
                  id="doc-filter-hospital"
                  aria-label="Filter by hospital"
                  defaultValue="all"
                >
                  <option value="all">All hospitals</option>
                  {hospitalOptions.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div className="doc-filter-group">
                <label className="doc-filter-label" htmlFor="doc-filter-language">
                  Language
                </label>
                <select
                  className="doc-filter-select"
                  id="doc-filter-language"
                  aria-label="Filter by language"
                  defaultValue="all"
                >
                  <option value="all">All languages</option>
                  {languageOptions.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div className="doc-filter-group">
                <label className="doc-filter-label" htmlFor="doc-filter-rating">
                  Minimum rating
                </label>
                <select
                  className="doc-filter-select"
                  id="doc-filter-rating"
                  aria-label="Filter by minimum rating"
                  defaultValue="0"
                >
                  <option value="0">Any rating</option>
                  <option value="4">4.0 &amp; up</option>
                  <option value="4.5">4.5 &amp; up</option>
                  <option value="4.8">4.8 &amp; up</option>
                </select>
              </div>

              <button
                className="btn btn-ghost doc-filters-reset"
                id="doc-reset"
                type="button"
              >
                Reset filters
              </button>

              <div className="doc-filters-drawer-foot">
                <button
                  className="btn btn-ghost"
                  id="doc-drawer-reset"
                  type="button"
                >
                  Reset
                </button>
                <button
                  className="btn btn-primary"
                  id="doc-drawer-apply"
                  type="button"
                >
                  Show results
                </button>
              </div>
            </aside>
          </div>

          {/* Results */}
          <section className="doc-grid" id="doc-grid" aria-live="polite">
            {doctors.map((d, i) => {
              const color = colorFor(d.specialty, i);
              const avatarStyle = {
                "--doc-color": `var(--color-${color})`,
                "--doc-soft": `var(--color-${color}-soft)`,
              } as CSSProperties;
              return (
                <article
                  key={d.id}
                  className="doctor-card doc-card reveal"
                  data-id={d.id}
                >
                  <div className="doc-card-head">
                    <div className="doc-avatar" style={avatarStyle}>
                      {initialsOf(d.name)}
                    </div>
                    <div className="doc-card-id">
                      <h3>{d.name}</h3>
                      <div className="doc-spec">{d.specialty}</div>
                      <div className="doc-hospital">
                        <span className="material-symbols-outlined">
                          local_hospital
                        </span>
                        {d.hospital}
                      </div>
                    </div>
                    <div className="doc-rating">
                      <span className="material-symbols-outlined">star</span>
                      {d.rating.toFixed(1)}
                      <span>({d.reviews.length})</span>
                    </div>
                  </div>
                  <div className="doc-meta">
                    <span className="doc-meta-item">
                      <span className="material-symbols-outlined">
                        work_history
                      </span>
                      {d.experience} exp
                    </span>
                    <span className="doc-meta-item">
                      <span className="material-symbols-outlined">translate</span>
                      {d.languages.join(", ")}
                    </span>
                    <span className="doc-meta-item">
                      <span className="material-symbols-outlined">payments</span>
                      {"₹" + d.fee}
                    </span>
                  </div>
                  <div className="doc-next">
                    <span className="material-symbols-outlined">
                      event_available
                    </span>
                    Next available: <span>{d.nextAvailable}</span>
                  </div>
                  <div className="doc-langs">
                    {d.languages.map((l) => (
                      <span key={l} className="badge badge-primary">
                        {l}
                      </span>
                    ))}
                  </div>
                  <div className="doc-card-actions">
                    <Link
                      href={`/doctors/${d.id}`}
                      className="btn btn-primary btn-sm doc-book"
                    >
                      Book
                    </Link>
                    <Link
                      href="/chat"
                      className="btn btn-secondary btn-sm doc-chat-toggle"
                      aria-expanded="false"
                    >
                      <span className="material-symbols-outlined">chat</span>{" "}
                      Free Chat
                    </Link>
                  </div>
                  <div className="doc-chat" hidden>
                    <div
                      className="doc-chat-messages"
                      aria-live="polite"
                    ></div>
                    <form
                      className="doc-chat-form"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <input
                        className="doc-chat-input"
                        type="text"
                        placeholder="Type a message…"
                        aria-label={`Message ${d.name}`}
                      />
                      <button
                        className="btn btn-ai btn-sm"
                        type="submit"
                        aria-label="Send"
                      >
                        <span className="material-symbols-outlined">send</span>
                      </button>
                    </form>
                    <div className="doc-chat-note"></div>
                    <div className="doc-chat-wall" hidden>
                      <span className="material-symbols-outlined">lock</span>
                      <span>
                        You’ve used your 3 free messages.{" "}
                        <strong>Sign in</strong> to keep chatting.
                      </span>
                      <Link
                        href="/dashboard"
                        className="btn btn-primary btn-sm doc-chat-signin"
                      >
                        Sign in
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <div className="empty-state" id="doc-empty" hidden>
            <div className="empty-state-icon">
              <span className="material-symbols-outlined">search_off</span>
            </div>
            <h3>No doctors found</h3>
            <p>Try adjusting your filters or search term.</p>
          </div>
        </div>
      </main>

      <PublicFooter />

      <div className="doc-filters-backdrop" id="doc-filters-backdrop"></div>
    </>
  );
}
