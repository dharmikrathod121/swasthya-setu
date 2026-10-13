"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { useAuth } from "@/components/shared/auth-provider";
import { AuthModal } from "@/components/shared/auth-modal";

const SLOTS = ["09:00 AM", "09:30 AM", "10:00 AM", "11:00 AM", "11:30 AM", "12:00 PM", "04:00 PM", "04:30 PM", "05:00 PM", "06:00 PM"];

interface DoctorDetail {
  id: string;
  name: string;
  specialty: string;
  hospital_id?: string | null;
  rating?: number;
  experience?: string;
  languages?: string[];
  fee?: number;
  bio?: string;
  education?: string[];
  specializations?: string[];
  reviews?: { author: string; rating: number; text: string }[];
  clinic_timings?: { day: string; slots?: string[] }[];
}

function initialsOf(name: string) {
  return name.replace(/^Dr\.\s*/, "").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default function DoctorProfileClient({ doctor }: { doctor: DoctorDetail }) {
  const d = doctor;
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const { isLoggedIn } = useAuth();
  const timings = d.clinic_timings?.map((t) => `${t.day} · ${t.slots?.join(", ")}`).join(" | ") || "";

  const handleBook = () => {
    if (!isLoggedIn) { setShowAuth(true); return; }
    if (!selectedDate || !selectedSlot) { alert("Please select a date and time slot."); return; }
    router.push(`/appointment?doctor=${d.id}&date=${selectedDate}&time=${selectedSlot}`);
  };

  return (
    <>
      <PublicHeader />
      <main id="main">
        <div className="profile-wrap">
          <Link href="/doctors" className="profile-back"><span className="material-symbols-outlined">arrow_back</span> Back to doctors</Link>

          <div id="profile-content">
            <div className="profile-layout">
              <div className="profile-main">
                <div className="profile-hero">
                  <div className="profile-avatar" style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)" }}>{initialsOf(d.name)}</div>
                  <div className="profile-hero-id">
                    <h1>{d.name}</h1>
                    <div className="doc-spec">{d.specialty}</div>
                    <div className="profile-hero-tags">
                      <span className="badge badge-primary"><span className="material-symbols-outlined" style={{ fontSize: 14 }}>local_hospital</span> {d.hospital_id || "Hospital"}</span>
                      <span className="badge badge-warning"><span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>star</span> {d.rating?.toFixed(1)} ({d.reviews?.length || 0})</span>
                      <span className="badge badge-success">{d.experience} experience</span>
                    </div>
                  </div>
                </div>

                <section className="profile-section">
                  <h2><span className="material-symbols-outlined">info</span> About</h2>
                  <p className="profile-bio">{d.bio}</p>
                </section>

                <section className="profile-section">
                  <h2><span className="material-symbols-outlined">dashboard</span> Quick info</h2>
                  <div className="info-grid">
                    <div className="info-card"><div className="info-label"><span className="material-symbols-outlined">local_hospital</span> Hospital</div><div className="info-value">{d.hospital_id || "N/A"}</div></div>
                    <div className="info-card"><div className="info-label"><span className="material-symbols-outlined">work_history</span> Experience</div><div className="info-value">{d.experience}</div></div>
                    <div className="info-card"><div className="info-label"><span className="material-symbols-outlined">payments</span> Fee</div><div className="info-value">₹{d.fee}</div></div>
                    <div className="info-card"><div className="info-label"><span className="material-symbols-outlined">schedule</span> Timings</div><div className="info-value">{timings || "Contact hospital"}</div></div>
                  </div>
                  <div className="doc-langs" style={{ marginTop: "var(--space-3)" }}>
                    {(d.languages || []).map((l: string) => <span key={l} className="badge badge-accent">{l}</span>)}
                  </div>
                </section>

                <section className="profile-section">
                  <h2><span className="material-symbols-outlined">school</span> Education</h2>
                  <ul className="profile-list">{(d.education || []).map((e: string) => <li key={e}><span className="material-symbols-outlined">school</span>{e}</li>)}</ul>
                </section>

                <section className="profile-section">
                  <h2><span className="material-symbols-outlined">category</span> Specialisations</h2>
                  <div className="spec-chips">{(d.specializations || []).map((s: string) => <span key={s} className="badge badge-primary">{s}</span>)}</div>
                </section>
              </div>

              <aside className="profile-aside">
                <div className="booking" id="booking-widget">
                  <div className="booking-head">
                    <span className="bk-icon"><span className="material-symbols-outlined">event_available</span></span>
                    <div><h3>Book appointment</h3><p>Pick a date &amp; time slot</p></div>
                  </div>
                  <div className="booking-fee"><span className="bf-amount">₹{d.fee}</span><span className="bf-label">consultation</span></div>

                  <div className="bk-step">
                    <div className="bk-step-label"><span className="bk-num">1</span> Choose date</div>
                    <input type="date" className="bk-date-input" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                  </div>

                  <div className="bk-step">
                    <div className="bk-step-label"><span className="bk-num">2</span> Select a time slot</div>
                    <div className="slot-grid" role="group" aria-label="Time slots">
                      {SLOTS.map((s) => (
                        <button key={s} type="button" className={`slot-btn ${selectedSlot === s ? "selected" : ""}`} onClick={() => setSelectedSlot(s)}>{s}</button>
                      ))}
                    </div>
                  </div>

                  <button className="btn btn-primary btn-lg" id="bk-confirm" type="button" style={{ width: "100%" }} onClick={handleBook} disabled={!selectedDate || !selectedSlot}>
                    Confirm booking
                  </button>
                  <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
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
