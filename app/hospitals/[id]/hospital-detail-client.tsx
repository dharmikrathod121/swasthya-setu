"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { getHospitalById } from "@/lib/data/mock-data";

function starGlyph(filled: boolean) {
  return (
    <span
      className="material-symbols-outlined"
      style={{
        fontSize: 14,
        ...(filled ? { fontVariationSettings: "'FILL' 1" } : {}),
      }}
    >
      star
    </span>
  );
}

function TypeBadge({ type }: { type: "Govt" | "Private" }) {
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

function QueueBadge({ level }: { level: "low" | "medium" | "busy" }) {
  const map = {
    low: { cls: "queue-low", icon: "check_circle", label: "Low queue" },
    medium: { cls: "queue-medium", icon: "hourglass_top", label: "Medium queue" },
    busy: { cls: "queue-busy", icon: "priority_high", label: "Busy" },
  } as const;
  const m = map[level] ?? map.low;
  return (
    <span className={`queue-badge ${m.cls}`} title={m.label}>
      <span className="material-symbols-outlined">{m.icon}</span>
      {m.label}
    </span>
  );
}

function initials(name: string) {
  if (!name) return "U";
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function timeAgo(ts: number) {
  const diff = Math.max(0, Date.now() - ts);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

type TabKey = "specialities" | "doctors" | "reviews" | "queue";

export default function HospitalDetailClient({ id }: { id: string }) {
  const hospital = getHospitalById(id);
  const [activeTab, setActiveTab] = useState<TabKey>("specialities");
  const [toast, setToast] = useState("");
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [queueFormOpen, setQueueFormOpen] = useState(false);
  // Local UI-only copies so review/queue submits update the view
  const [extraReviews, setExtraReviews] = useState<
    { name: string; date: string; rating: number; text: string }[]
  >([]);
  const [queueWaits, setQueueWaits] = useState<number[] | null>(null);

  const showToast = (msg: string) => setToast(msg);

  if (!hospital) {
    return (
      <>
        <PublicHeader />
        <main id="main">
          <div className="detail" id="detail-root">
            <Link href="/hospitals" className="detail-back">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                arrow_back
              </span>{" "}
              All hospitals
            </Link>
            <div id="detail-content">
              <div className="results-empty">
                <span className="material-symbols-outlined">local_hospital</span>
                <h3>Hospital not found</h3>
                <p>
                  <Link
                    href="/hospitals"
                    style={{ color: "var(--color-primary)", fontWeight: 600 }}
                  >
                    Back to directory
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>
        <PublicFooter />
        <div id="toast" className="toast" role="status" aria-live="polite" />
      </>
    );
  }

  const h = hospital;
  const reviews = [...extraReviews, ...h.reviews];
  const queueData = h.queueData.map((d, i) => ({
    ...d,
    wait: queueWaits?.[i] ?? d.wait,
  }));
  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;
  const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    dist[r.rating] = (dist[r.rating] ?? 0) + 1;
  });
  const maxScale = Math.max(60, ...queueData.map((d) => d.wait));

  const tiles = [
    { icon: "location_on", label: "Address", value: h.address },
    { icon: "call", label: "Phone", value: h.phone },
    { icon: "schedule", label: "Hours", value: h.hours },
    { icon: "event_available", label: "OPD Timing", value: h.opdTiming },
  ];

  const submitReview = () => {
    if (!reviewText.trim()) {
      showToast("Please write a few words.");
      return;
    }
    setExtraReviews((prev) => [
      { name: "You", date: "Just now", rating: reviewRating, text: reviewText.trim() },
      ...prev,
    ]);
    setReviewFormOpen(false);
    setReviewRating(5);
    setReviewText("");
    showToast("Thanks! Your review was posted.");
  };

  const submitQueue = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const next = queueData.map((d, i) => {
      const v = parseInt(String(data.get(`q-${i}`) ?? d.wait), 10);
      if (Number.isNaN(v) || v < 0) return d.wait;
      return Math.min(v, 180);
    });
    setQueueWaits(next);
    setQueueFormOpen(false);
    showToast("Queue updated. Thanks for helping the community!");
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "specialities", label: "Specialities" },
    { key: "doctors", label: "Doctors" },
    { key: "reviews", label: "Reviews" },
    { key: "queue", label: "Live Queue" },
  ];

  return (
    <>
      <PublicHeader />
      <main id="main">
        <div className="detail" id="detail-root">
          <Link href="/hospitals" className="detail-back">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              arrow_back
            </span>{" "}
            All hospitals
          </Link>

          <div id="detail-content">
            {/* Hero */}
            <div className="detail-hero reveal">
              <div className="detail-hero-banner">
                <span className="material-symbols-outlined">local_hospital</span>
              </div>
              <div className="detail-hero-overlay">
                <div className="detail-hero-logo" style={{ background: h.logoColor }}>
                  <span className="material-symbols-outlined">local_hospital</span>
                </div>
                <div className="detail-hero-info">
                  <h1>{h.name}</h1>
                  <div className="detail-sub">
                    <TypeBadge type={h.type} />
                    <span className="rating-pill">
                      {starGlyph(true)}
                      {h.rating.toFixed(1)}{" "}
                      <span style={{ fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>
                        ({h.reviewsCount + extraReviews.length})
                      </span>
                    </span>
                    <span className="distance-pill">
                      <span className="material-symbols-outlined">near_me</span>
                      {h.distanceKm.toFixed(1)} km
                    </span>
                    <QueueBadge level={h.queue} />
                  </div>
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="info-grid reveal">
              {tiles.map((t) => (
                <div className="info-tile" key={t.label}>
                  <div className="info-tile-icon">
                    <span className="material-symbols-outlined">{t.icon}</span>
                  </div>
                  <div className="info-tile-label">{t.label}</div>
                  <div className="info-tile-value">{t.value}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="cta-bar reveal" id="book">
              <div className="cta-bar-text">
                <h3>Book an OPD appointment</h3>
                <p>Choose a department and slot. Sign in to book and get reminders.</p>
              </div>
              <button
                className="btn btn-primary"
                id="book-opd"
                type="button"
                onClick={() =>
                  showToast("Appointment booking opened (demo). We’ll remind you before your slot.")
                }
              >
                <span className="material-symbols-outlined">calendar_month</span> Book OPD
              </button>
            </div>

            {/* Tabs */}
            <div className="detail-tabs reveal" role="tablist">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  className={`detail-tab${activeTab === t.key ? " active" : ""}`}
                  data-tab={t.key}
                  role="tab"
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Specialities */}
            <section
              className={`tab-panel${activeTab === "specialities" ? " active" : ""}`}
              id="tab-specialities"
              role="tabpanel"
            >
              <div className="speciality-list">
                {h.specialties.map((s) => (
                  <div className="speciality-item" key={s}>
                    <span className="material-symbols-outlined">medical_services</span>
                    <div>
                      <strong>{s}</strong>
                      <span>Dedicated unit &amp; specialists</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Doctors */}
            <section
              className={`tab-panel${activeTab === "doctors" ? " active" : ""}`}
              id="tab-doctors"
              role="tabpanel"
            >
              <div className="doctors-list">
                {h.doctors.map((d) => {
                  const availCls = d.avail === "Today" ? "badge-success" : "badge-warning";
                  return (
                    <div className="doctor-row" key={d.name}>
                      <Link
                        className="doctor-row-link"
                        href="/doctors"
                        aria-label={`View profile of ${d.name}`}
                      >
                        <div className="doctor-row-avatar">
                          <span className="material-symbols-outlined">person</span>
                        </div>
                        <div className="doctor-row-body">
                          <h4>{d.name}</h4>
                          <p>{d.dept}</p>
                          <div className="doctor-row-meta">
                            <span>
                              <span
                                className="material-symbols-outlined"
                                style={{ fontSize: 14, verticalAlign: "-2px" }}
                              >
                                work_history
                              </span>{" "}
                              {d.exp}
                            </span>
                            <span>
                              <span
                                className="material-symbols-outlined"
                                style={{ fontSize: 14, verticalAlign: "-2px" }}
                              >
                                language
                              </span>{" "}
                              {d.lang}
                            </span>
                          </div>
                        </div>
                      </Link>
                      <div className="doctor-row-actions">
                        <span className={`badge ${availCls}`}>{d.avail}</span>
                        <button
                          className="btn btn-primary btn-sm"
                          data-book-doctor
                          type="button"
                          onClick={() =>
                            showToast(
                              "Appointment booking opened (demo). We’ll remind you before your slot."
                            )
                          }
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Reviews */}
            <section
              className={`tab-panel${activeTab === "reviews" ? " active" : ""}`}
              id="tab-reviews"
              role="tabpanel"
            >
              <div className="reviews-summary">
                <div className="reviews-score">
                  <div className="score-num">{avg.toFixed(1)}</div>
                  <div className="score-stars">{starGlyph(true)}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
                    {reviews.length} reviews
                  </div>
                </div>
                <div className="reviews-bars">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = reviews.length
                      ? Math.round(((dist[star] ?? 0) / reviews.length) * 100)
                      : 0;
                    return (
                      <div className="review-bar-row" key={star}>
                        <span>
                          {star} {starGlyph(true)}
                        </span>
                        <span className="review-bar-track">
                          <span className="review-bar-fill" style={{ width: `${pct}%` }} />
                        </span>
                        <span>{dist[star] ?? 0}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {!reviewFormOpen ? (
                <div className="review-add-card" id="review-gate">
                  <p>Share your experience to help others choose the right care.</p>
                  <button
                    className="btn btn-primary"
                    id="write-review"
                    type="button"
                    onClick={() => setReviewFormOpen(true)}
                  >
                    Write a review
                  </button>
                </div>
              ) : (
                <div className="review-card review-form" id="review-gate">
                  <div className="input-group">
                    <label className="input-label">Your rating</label>
                    <div className="review-rating-select" id="review-stars">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className={`material-symbols-outlined${i <= reviewRating ? " active" : ""}`}
                          data-star={i}
                          role="button"
                          tabIndex={0}
                          onClick={() => setReviewRating(i)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") setReviewRating(i);
                          }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="review-text">
                      Your review
                    </label>
                    <textarea
                      className="input-field"
                      id="review-text"
                      placeholder="How was your experience?"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "var(--space-3)" }}>
                    <button
                      className="btn btn-primary"
                      id="submit-review"
                      style={{ flex: 1 }}
                      type="button"
                      onClick={submitReview}
                    >
                      Post review
                    </button>
                    <button
                      className="btn btn-ghost"
                      id="cancel-review"
                      type="button"
                      onClick={() => {
                        setReviewFormOpen(false);
                        setReviewRating(5);
                        setReviewText("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <div id="review-list">
                {reviews.map((r, i) => {
                  let stars = "";
                  for (let s = 1; s <= 5; s++) stars += s <= r.rating ? "★" : "☆";
                  return (
                    <div className="review-card" key={`${r.name}-${r.date}-${i}`}>
                      <div className="review-head">
                        <div className="review-avatar">{initials(r.name)}</div>
                        <div>
                          <div className="review-name">{r.name}</div>
                          <div className="review-date">{r.date}</div>
                        </div>
                        <div className="review-stars" style={{ marginLeft: "auto" }}>
                          {stars}
                        </div>
                      </div>
                      <p className="review-text">{r.text}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Live Queue */}
            <section
              className={`tab-panel${activeTab === "queue" ? " active" : ""}`}
              id="tab-queue"
              role="tabpanel"
            >
              <div className="queue-panel">
                <div className="queue-updated">
                  <span className="pulse-dot" /> Last updated{" "}
                  <strong id="queue-updated">{timeAgo(h.lastUpdated)}</strong>
                </div>
                <div className="bar-chart" id="queue-chart">
                  {queueData.map((d, i) => {
                    const pct = Math.round((d.wait / maxScale) * 100);
                    const cls = d.wait <= 20 ? "" : d.wait <= 40 ? " medium" : " busy";
                    return (
                      <div className="bar-row" key={d.dept}>
                        <div className="bar-label">{d.dept}</div>
                        <div className="bar-track">
                          <div
                            className={`bar-fill${cls}`}
                            style={{ width: `${pct}%` }}
                            data-w={pct}
                            data-queue-bar={i}
                          />
                        </div>
                        <div className="bar-value">
                          {d.wait} <small>min</small>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="queue-legend">
                  <span>
                    <i style={{ background: "var(--color-primary)" }} /> Short (&le;20 min)
                  </span>
                  <span>
                    <i style={{ background: "var(--color-warning)" }} /> Moderate (21–40 min)
                  </span>
                  <span>
                    <i style={{ background: "var(--color-error)" }} /> Long (&gt;40 min)
                  </span>
                </div>
                <div style={{ marginTop: "var(--space-5)", display: "flex", justifyContent: "flex-end" }}>
                  {!queueFormOpen && (
                    <button
                      className="btn btn-secondary"
                      id="update-queue"
                      type="button"
                      onClick={() => setQueueFormOpen(true)}
                    >
                      <span className="material-symbols-outlined">cloud_upload</span> Update queue
                    </button>
                  )}
                </div>
                <div id="queue-form-slot">
                  {queueFormOpen && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        submitQueue(e.currentTarget);
                      }}
                    >
                      <div className="review-card" style={{ marginTop: "var(--space-4)" }}>
                        <label className="input-label">
                          Report current waiting time (minutes)
                        </label>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "var(--space-3)",
                            marginTop: "var(--space-3)",
                          }}
                        >
                          {queueData.map((d, i) => (
                            <div
                              className="input-group"
                              style={{ flex: 1, margin: 0 }}
                              key={d.dept}
                            >
                              <label className="input-label" htmlFor={`q-${i}`}>
                                {d.dept}
                              </label>
                              <input
                                className="input-field"
                                id={`q-${i}`}
                                name={`q-${i}`}
                                type="number"
                                min={0}
                                max={180}
                                defaultValue={d.wait}
                              />
                            </div>
                          ))}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "var(--space-3)",
                            marginTop: "var(--space-4)",
                          }}
                        >
                          <button
                            className="btn btn-primary"
                            id="submit-queue"
                            style={{ flex: 1 }}
                            type="submit"
                          >
                            Submit update
                          </button>
                          <button
                            className="btn btn-ghost"
                            id="cancel-queue"
                            type="button"
                            onClick={() => setQueueFormOpen(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <PublicFooter />
      <div id="toast" className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}
