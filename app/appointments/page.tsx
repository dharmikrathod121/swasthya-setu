"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { useAuth } from "@/components/shared/auth-provider";
import { useAppointments } from "@/lib/hooks/use-api";
import Link from "next/link";

type Status = "upcoming" | "completed" | "cancelled";

function ApptCard({ id, name, meta, date, time, reason, status, rx }: {
  id: string; name: string; meta: string;
  date: string; time: string; reason: string; status: Status; rx?: boolean;
}) {
  const badgeClass = status === "upcoming" ? "badge-primary" : status === "completed" ? "badge-success" : "badge-error";
  const badge = status.charAt(0).toUpperCase() + status.slice(1);
  const initials = name.split(" ").slice(1).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || name.slice(0, 2);

  return (
    <article className={`appt-card is-${status}`} data-id={id}>
      <div className="appt-avatar" aria-hidden="true">{initials}</div>
      <div className="appt-main">
        <div className="appt-top">
          <div>
            <div className="appt-doc-name">{name}</div>
            <div className="appt-doc-meta"><span className="material-symbols-outlined">local_hospital</span>{meta}</div>
          </div>
          <span className={`badge ${badgeClass}`}>{badge}</span>
        </div>
        <div className="appt-datetime"><span className="material-symbols-outlined">event</span>{date} · <span className="material-symbols-outlined">schedule</span>{time}</div>
        <div className="appt-reason">Reason: {reason}</div>
        <div className="appt-actions">
          <button type="button" className="btn btn-ghost btn-sm"><span className="material-symbols-outlined">edit_calendar</span> {status === "cancelled" ? "Rebook" : "Reschedule"}</button>
          {status === "upcoming" && (<button type="button" className="btn btn-ghost btn-sm"><span className="material-symbols-outlined">close</span> Cancel</button>)}
          {rx && (<button type="button" className="btn btn-secondary btn-sm"><span className="material-symbols-outlined">description</span> View prescription</button>)}
        </div>
      </div>
    </article>
  );
}

export default function AppointmentsPage() {
  const { user, loading: authLoading, isLoggedIn } = useAuth();
  const [filter, setFilter] = useState<Status | "all">("all");
  const { data: appointments, isLoading, error } = useAppointments(user?.id);

  if (authLoading) return <AppLayout><div className="container" style={{ padding: "var(--space-8)" }}>Loading...</div></AppLayout>;

  if (!isLoggedIn) {
    return (
      <AppLayout>
        <div className="container section" style={{ paddingTop: "var(--space-8)" }}>
          <div className="login-wall" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "var(--space-10)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 64, color: "var(--color-primary)" }}>lock</span>
            <h1>Sign in to view appointments</h1>
            <p>Your appointments, prescriptions and bookings are private. Please sign in to continue.</p>
            <Link href="/login" className="btn btn-primary btn-lg" style={{ marginTop: "var(--space-4)" }}>
              <span className="material-symbols-outlined">login</span> Sign in to continue
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  interface AppointmentRow {
    id: string;
    patient_name?: string;
    hospital_id?: string | null;
    date: string;
    time: string;
    reason?: string;
    status: Status;
  }

  const list = (appointments ?? []) as AppointmentRow[];
  const filtered = filter === "all" ? list : list.filter((a) => a.status === filter);

  const upcoming = list.filter((a) => a.status === "upcoming").length || 0;
  const completed = list.filter((a) => a.status === "completed").length || 0;
  const cancelled = list.filter((a) => a.status === "cancelled").length || 0;

  return (
    <AppLayout>
      <div className="container" style={{ maxWidth: 1180, padding: 0 }}>
        <section className="page-header reveal">
          <div className="page-header-text">
            <div className="section-eyebrow">Your health, scheduled</div>
            <h1>Appointments</h1>
            <p>Manage your upcoming visits, track your history, and book new consultations.</p>
          </div>
          <Link href="/appointment" className="btn btn-primary">
            <span className="material-symbols-outlined">add</span> Book new
          </Link>
        </section>

        <section className="stats-bar appt-stats" aria-label="Appointment statistics">
          <div className="stat-item"><div className="stat-value">{appointments?.length || 0}</div><div className="stat-label">Total booked</div></div>
          <div className="stat-item"><div className="stat-value" style={{ color: "var(--color-primary)" }}>{upcoming}</div><div className="stat-label">Upcoming</div></div>
          <div className="stat-item"><div className="stat-value" style={{ color: "var(--color-success)" }}>{completed}</div><div className="stat-label">Completed</div></div>
          <div className="stat-item"><div className="stat-value" style={{ color: "var(--color-error)" }}>{cancelled}</div><div className="stat-label">Cancelled</div></div>
        </section>

        <section className="appointments-grid">
          <div className="appointments-col">
            <div className="appt-toolbar">
              <h2 className="appt-col-title">Your appointments</h2>
              <span className="appt-count">{filtered?.length || 0} visits</span>
            </div>
            <div className="filter-bar appt-filters" role="group" aria-label="Filter appointments">
              {["all", "upcoming", "completed", "cancelled"].map((f) => (
                <button key={f} className={`filter-pill ${filter === f ? "active" : ""}`} onClick={() => setFilter(f as Status | "all")}>{f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}</button>
              ))}
            </div>
            <div className="appointment-list" aria-live="polite">
              {isLoading && <p>Loading appointments...</p>}
              {error && <p className="text-error">Error: {error}</p>}
              {filtered?.length === 0 && <p>No appointments found.</p>}
              {filtered?.map((a) => (
                <ApptCard key={a.id} id={a.id} name={a.patient_name || "Patient"} meta={a.hospital_id ? "Hospital" : "Clinic"} date={a.date} time={a.time} reason={a.reason || "Consultation"} status={a.status} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
