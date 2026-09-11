"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import type { Doctor } from "@/lib/data/mock-data";

const COLOR_BY_SPECIALTY: Record<string, string> = {
  Cardiologist: "primary",
  Pediatrician: "accent",
  Orthopedic: "ai",
  Dermatologist: "success",
  Neurologist: "primary",
};

const SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "06:00 PM",
];

function initialsOf(name: string) {
  return name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function starRow(rating: number) {
  return [1, 2, 3, 4, 5].map((i) => (
    <span
      key={i}
      className={
        "material-symbols-outlined" + (i <= Math.round(rating) ? "" : " empty")
      }
    >
      star
    </span>
  ));
}

export default function DoctorProfileClient({ doctor }: { doctor: Doctor }) {
  const d = doctor;
  const color = COLOR_BY_SPECIALTY[d.specialty] ?? "primary";
  const avatarStyle = {
    "--doc-color": `var(--color-${color})`,
    "--doc-soft": `var(--color-${color}-soft)`,
  } as CSSProperties;
  const timings = d.clinicTimings
    .map((t) => `${t.day} · ${t.slots.join(", ")}`)
    .join(" | ");

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <PublicHeader />

      <main id="main">
        <div className="profile-wrap">
          <Link href="/doctors" className="profile-back">
            <span className="material-symbols-outlined">arrow_back</span> Back
            to doctors
          </Link>

          <div id="profile-content">
            <div className="profile-layout">
              <div className="profile-main">
                <div className="profile-hero">
                  <div className="profile-avatar" style={avatarStyle}>
                    {initialsOf(d.name)}
                  </div>
                  <div className="profile-hero-id">
                    <h1>{d.name}</h1>
                    <div className="doc-spec">{d.specialty}</div>
                    <div className="profile-hero-tags">
                      <span className="badge badge-primary">
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 14 }}
                        >
                          local_hospital
                        </span>{" "}
                        {d.hospital}
                      </span>
                      <span className="badge badge-warning">
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: 14,
                            fontVariationSettings: "'FILL' 1",
                          }}
                        >
                          star
                        </span>{" "}
                        {d.rating.toFixed(1)} ({d.reviews.length})
                      </span>
                      <span className="badge badge-success">
                        {d.experience} experience
                      </span>
                    </div>
                  </div>
                </div>

                <section className="profile-section">
                  <h2>
                    <span className="material-symbols-outlined">info</span>{" "}
                    About
                  </h2>
                  <p className="profile-bio">{d.bio}</p>
                </section>

                <section className="profile-section">
                  <h2>
                    <span className="material-symbols-outlined">dashboard</span>{" "}
                    Quick info
                  </h2>
                  <div className="info-grid">
                    <div className="info-card">
                      <div className="info-label">
                        <span className="material-symbols-outlined">
                          local_hospital
                        </span>{" "}
                        Hospital
                      </div>
                      <div className="info-value">{d.hospital}</div>
                    </div>
                    <div className="info-card">
                      <div className="info-label">
                        <span className="material-symbols-outlined">
                          work_history
                        </span>{" "}
                        Experience
                      </div>
                      <div className="info-value">{d.experience}</div>
                    </div>
                    <div className="info-card">
                      <div className="info-label">
                        <span className="material-symbols-outlined">
                          payments
                        </span>{" "}
                        Consultation fee
                      </div>
                      <div className="info-value">{"₹" + d.fee}</div>
                    </div>
                    <div className="info-card">
                      <div className="info-label">
                        <span className="material-symbols-outlined">
                          schedule
                        </span>{" "}
                        Clinic timings
                      </div>
                      <div className="info-value">{timings}</div>
                    </div>
                  </div>
                  <div
                    className="doc-langs"
                    style={{ marginTop: "var(--space-3)" }}
                  >
                    {d.languages.map((l) => (
                      <span key={l} className="badge badge-accent">
                        {l}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="profile-section">
                  <h2>
                    <span className="material-symbols-outlined">school</span>{" "}
                    Education
                  </h2>
                  <ul className="profile-list">
                    {d.education.map((e) => (
                      <li key={e}>
                        <span className="material-symbols-outlined">school</span>
                        {e}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="profile-section">
                  <h2>
                    <span className="material-symbols-outlined">category</span>{" "}
                    Specialisations
                  </h2>
                  <div className="spec-chips">
                    {d.specializations.map((s) => (
                      <span key={s} className="badge badge-primary">
                        {s}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="profile-section">
                  <h2>
                    <span className="material-symbols-outlined">reviews</span>{" "}
                    Patient reviews
                  </h2>
                  {d.reviews.map((r) => (
                    <div key={r.author + r.date} className="review-card">
                      <div className="review-head">
                        <div className="review-author">
                          <div className="review-avatar">{r.initials}</div>
                          <div>
                            <div className="ra-name">{r.author}</div>
                            <div className="ra-date">{r.date}</div>
                          </div>
                        </div>
                        <div
                          className="review-stars"
                          aria-label={`${r.rating} out of 5 stars`}
                        >
                          {starRow(r.rating)}
                        </div>
                      </div>
                      <p className="review-text">{r.text}</p>
                    </div>
                  ))}
                </section>
              </div>

              {/* Booking widget (sticky) */}
              <aside className="profile-aside">
                <div className="booking" id="booking-widget">
                  <div className="booking-head">
                    <span className="bk-icon">
                      <span className="material-symbols-outlined">
                        event_available
                      </span>
                    </span>
                    <div>
                      <h3>Book appointment</h3>
                      <p>Pick a date &amp; time slot</p>
                    </div>
                  </div>
                  <div className="booking-fee">
                    <span className="bf-amount">{"₹" + d.fee}</span>
                    <span className="bf-label">consultation</span>
                  </div>

                  <div className="bk-wall" id="bk-wall" hidden>
                    <span className="material-symbols-outlined">lock</span>
                    <span className="bk-wall-text">
                      <strong>Sign in to confirm</strong>
                      <span>
                        You’ll need an account to book this appointment.
                      </span>
                    </span>
                    <Link
                      href="/dashboard"
                      className="btn btn-primary btn-sm"
                      id="bk-wall-signin"
                    >
                      Sign in
                    </Link>
                  </div>

                  <div className="bk-step">
                    <div className="bk-step-label">
                      <span className="bk-num">1</span> Choose date
                    </div>
                    <input
                      type="date"
                      className="bk-date-input"
                      id="bk-date"
                      aria-label="Appointment date"
                    />
                  </div>

                  <div className="bk-step">
                    <div className="bk-step-label">
                      <span className="bk-num">2</span> Select a time slot
                    </div>
                    <div
                      className="slot-grid"
                      id="bk-slots"
                      role="group"
                      aria-label="Time slots"
                    >
                      {SLOTS.map((s) => (
                        <button key={s} type="button" className="slot-btn">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bk-confirm-hint" id="bk-hint">
                    <span className="material-symbols-outlined">info</span>{" "}
                    Select a date and slot to continue.
                  </div>
                  <button
                    className="btn btn-primary btn-lg"
                    id="bk-confirm"
                    type="button"
                    style={{ width: "100%" }}
                    disabled
                  >
                    Confirm booking
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}
