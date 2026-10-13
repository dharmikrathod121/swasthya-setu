"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { useReviews, useQueue } from "@/lib/hooks/use-api";
import { AuthModal } from "@/components/shared/auth-modal";

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
  const map: Record<string, { cls: string; icon: string; label: string }> = { low: { cls: "queue-low", icon: "check_circle", label: "Low queue" }, medium: { cls: "queue-medium", icon: "hourglass_top", label: "Medium queue" }, busy: { cls: "queue-busy", icon: "priority_high", label: "Busy" } };
  const m = map[level] ?? map.low;
  return (
    <span className={`queue-badge ${m.cls}`} title={m.label}>
      <span className="material-symbols-outlined">{m.icon}</span>
      {m.label}
    </span>
  );
}

interface HospitalDetail {
  id: string;
  name: string;
  type: string;
  rating?: number;
  reviews_count?: number;
  distance_km?: number;
  logo_color?: string;
  queue_status: string;
  address?: string;
  phone?: string;
  hours?: string;
  opd_timing?: string;
  last_updated?: string;
}

interface ReviewRow {
  id: string;
  name?: string;
  date?: string;
  rating: number;
  text: string;
}

interface QueueRow {
  dept: string;
  wait_time: number;
}

export default function HospitalDetailClient({ id }: { id: string }) {
  const [hospital, setHospital] = useState<HospitalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [queueFormOpen, setQueueFormOpen] = useState(false);
  const tabs = ["specialities", "doctors", "reviews", "queue"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const { data: reviewsData, mutate: mutateReviews } = useReviews(id);
  const { data: queueData, mutate: mutateQueue } = useQueue(id);

  useEffect(() => {
    fetch(`/api/hospitals/${id}`)
      .then((r) => r.json())
      .then((data) => { setHospital(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const submitReview = async () => {
    if (!reviewText.trim()) { setToast("Please write a few words."); return; }
    const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ hospital_id: id, text: reviewText.trim(), rating: reviewRating, name: "You" }) });
    if (res.ok) { mutateReviews(); setReviewFormOpen(false); setReviewRating(5); setReviewText(""); setToast("Thanks! Your review was posted."); }
    else setToast("Failed to post review.");
  };

  const submitQueue = async (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const dept = formData.get("dept") as string;
    const waitTime = parseInt(formData.get("wait_time") as string);
    const res = await fetch("/api/queue", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ hospital_id: id, dept, wait_time: waitTime || 0 }) });
    if (res.ok) { mutateQueue(); setQueueFormOpen(false); setToast("Queue updated. Thanks!"); }
    else setToast("Failed to update queue.");
  };

  if (loading) return <div className="container" style={{ padding: "var(--space-8)" }}>Loading...</div>;
  if (!hospital) return <div className="container" style={{ padding: "var(--space-8)" }}>Hospital not found</div>;

  return (
    <>
      <PublicHeader />
      <main id="main">
        <div className="detail" id="detail-root">
          <Link href="/hospitals" className="detail-back"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span> All hospitals</Link>

          <div id="detail-content">
            <div className="detail-hero reveal">
              <div className="detail-hero-banner"><span className="material-symbols-outlined">local_hospital</span></div>
              <div className="detail-hero-overlay">
                <div className="detail-hero-logo" style={{ background: hospital.logo_color }}>
                  <span className="material-symbols-outlined">local_hospital</span>
                </div>
                <div className="detail-hero-info">
                  <h1>{hospital.name}</h1>
                  <div className="detail-sub">
                    <TypeBadge type={hospital.type} />
                    <span className="rating-pill">⭐ {hospital.rating?.toFixed(1)} ({hospital.reviews_count || 0})</span>
                    <span className="distance-pill">📍 {hospital.distance_km?.toFixed(1)} km</span>
                    <QueueBadge level={hospital.queue_status} />
                  </div>
                </div>
              </div>
            </div>

            <div className="info-grid reveal">
              {[
                { icon: "location_on", label: "Address", value: hospital.address },
                { icon: "call", label: "Phone", value: hospital.phone },
                { icon: "schedule", label: "Hours", value: hospital.hours },
                { icon: "event_available", label: "OPD Timing", value: hospital.opd_timing },
              ].map((t) => (
                <div className="info-tile" key={t.label}>
                  <div className="info-tile-icon"><span className="material-symbols-outlined">{t.icon}</span></div>
                  <div className="info-tile-label">{t.label}</div>
                  <div className="info-tile-value">{t.value}</div>
                </div>
              ))}
            </div>

            <div className="cta-bar reveal" id="book">
              <div className="cta-bar-text">
                <h3>Book an OPD appointment</h3>
                <p>Choose a department and slot. Sign in to book and get reminders.</p>
              </div>
              <button className="btn btn-primary" type="button" onClick={() => setShowAuth(true)}>
                <span className="material-symbols-outlined">calendar_month</span> Book OPD
              </button>
            </div>

            <div className="detail-tabs reveal" role="tablist">
              {tabs.map((t) => (
                <button key={t} className={`detail-tab${activeTab === t ? " active" : ""}`} onClick={() => setActiveTab(t)} role="tab" type="button">{t.charAt(0).toUpperCase() + t.slice(1)}</button>
              ))}
            </div>

            {activeTab === "reviews" && (
              <section className="tab-panel active" id="tab-reviews" role="tabpanel">
                <div className="reviews-summary">...</div>
                {!reviewFormOpen ? (
                  <div className="review-add-card" id="review-gate">
                    <p>Share your experience to help others choose the right care.</p>
                    <button className="btn btn-primary" type="button" onClick={() => setReviewFormOpen(true)}>Write a review</button>
                  </div>
                ) : (
                  <div className="review-card review-form">
                    <div className="input-group">
                      <label className="input-label">Your rating</label>
                      <div className="review-rating-select">{[1, 2, 3, 4, 5].map((i) => (
                        <span key={i} className={`material-symbols-outlined${i <= reviewRating ? " active" : ""}`} onClick={() => setReviewRating(i)} role="button" tabIndex={0}>star</span>
                      ))}</div>
                    </div>
                    <div className="input-group">
                      <label className="input-label" htmlFor="review-text">Your review</label>
                      <textarea className="input-field" id="review-text" value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="How was your experience?" />
                    </div>
                    <div style={{ display: "flex", gap: "var(--space-3)" }}>
                      <button className="btn btn-primary" style={{ flex: 1 }} type="button" onClick={submitReview}>Post review</button>
                      <button className="btn btn-ghost" type="button" onClick={() => { setReviewFormOpen(false); setReviewRating(5); setReviewText(""); }}>Cancel</button>
                    </div>
                  </div>
                )}
                <div id="review-list">{(reviewsData as ReviewRow[] | undefined)?.map((r) => (
                  <div key={r.id} className="review-card">
                    <div className="review-head">
                      <div className="review-avatar">{r.name?.charAt(0) || "U"}</div>
                      <div><div className="review-name">{r.name}</div><div className="review-date">{r.date}</div></div>
                      <div className="review-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                    </div>
                    <p className="review-text">{r.text}</p>
                  </div>
                ))}</div>
              </section>
            )}

            {activeTab === "queue" && (
              <section className="tab-panel active" id="tab-queue" role="tabpanel">
                <div className="queue-panel">
                  <div className="queue-updated"><span className="pulse-dot" /> Last updated <strong>{new Date(hospital.last_updated ?? Date.now()).toLocaleString()}</strong></div>
                  <div className="bar-chart">
                    {((queueData ?? []) as QueueRow[]).slice(0, 5).map((q, i: number) => {
                      const maxScale = Math.max(60, ...((queueData ?? []) as QueueRow[]).map((d) => d.wait_time));
                      const pct = Math.round((q.wait_time / maxScale) * 100);
                      const cls = q.wait_time <= 20 ? "" : q.wait_time <= 40 ? " medium" : " busy";
                      return (
                        <div key={i} className="bar-row">
                          <div className="bar-label">{q.dept}</div>
                          <div className="bar-track"><div className={`bar-fill${cls}`} style={{ width: `${pct}%` }} /></div>
                          <div className="bar-value">{q.wait_time} <small>min</small></div>
                        </div>
                      );
                    })}
                  </div>
                  {!queueFormOpen && (
                    <button className="btn btn-secondary" type="button" onClick={() => setQueueFormOpen(true)} style={{ marginTop: "var(--space-4)" }}>
                      <span className="material-symbols-outlined">cloud_upload</span> Update queue
                    </button>
                  )}
                  {queueFormOpen && (
                    <form onSubmit={(e) => { e.preventDefault(); submitQueue(e.currentTarget); }} style={{ marginTop: "var(--space-4)" }}>
                      <div className="review-card">
                        <label className="input-label">Report current waiting time (minutes)</label>
                        <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-3)" }}>
                          <div className="input-group" style={{ flex: 1 }}>
                            <label className="input-label" htmlFor="q-dept">Department</label>
                            <input className="input-field" id="q-dept" name="dept" defaultValue="General Medicine" />
                          </div>
                          <div className="input-group" style={{ flex: 1 }}>
                            <label className="input-label" htmlFor="q-wait">Wait time (min)</label>
                            <input className="input-field" id="q-wait" name="wait_time" type="number" min={0} max={180} defaultValue={0} />
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                          <button className="btn btn-primary" style={{ flex: 1 }} type="submit">Submit update</button>
                          <button className="btn btn-ghost" type="button" onClick={() => setQueueFormOpen(false)}>Cancel</button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
      <PublicFooter />
      <div id="toast" className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">{toast}</div>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
