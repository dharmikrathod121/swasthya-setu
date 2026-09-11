import { AppLayout } from "@/components/app-layout";

function ApptCard({ id, initials, name, meta, badgeClass, badge, date, time, reason, status, rx }: {
  id: string; initials: string; name: string; meta: string; badgeClass: string; badge: string;
  date: string; time: string; reason: string; status: "upcoming" | "completed" | "cancelled"; rx?: boolean;
}) {
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
  return (
    <AppLayout>
      <div className="container" style={{ maxWidth: 1180, padding: 0 }}>
        <section id="login-wall" className="login-wall" hidden>
          <div className="login-wall-icon">
            <span className="material-symbols-outlined">lock</span>
          </div>
          <h1>Sign in to view appointments</h1>
          <p>Your appointments, prescriptions and bookings are private. Please sign in to continue.</p>
          <button type="button" className="btn btn-primary btn-lg" id="login-wall-btn">
            <span className="material-symbols-outlined">login</span> Sign in to continue
          </button>
        </section>

        <div id="app-content">
          <section className="page-header reveal">
            <div className="page-header-text">
              <div className="section-eyebrow">Your health, scheduled</div>
              <h1>Appointments</h1>
              <p>Manage your upcoming visits, track your history, and book new consultations.</p>
            </div>
            <button type="button" className="btn btn-primary" id="book-new-btn">
              <span className="material-symbols-outlined">add</span> Book new
            </button>
          </section>

          <section className="stats-bar appt-stats" aria-label="Appointment statistics">
            <div className="stat-item">
              <div className="stat-value" id="stat-total">7</div>
              <div className="stat-label">Total booked</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" id="stat-upcoming" style={{ color: "var(--color-primary)" }}>4</div>
              <div className="stat-label">Upcoming</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" id="stat-completed" style={{ color: "var(--color-success)" }}>2</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" id="stat-cancelled" style={{ color: "var(--color-error)" }}>1</div>
              <div className="stat-label">Cancelled</div>
            </div>
          </section>

          <section className="appointments-grid">
            <div className="appointments-col">
              <div className="appt-toolbar">
                <h2 className="appt-col-title">Your appointments</h2>
                <span className="appt-count" id="appt-count">3 visits</span>
              </div>

              <div className="filter-bar appt-filters" role="group" aria-label="Filter appointments">
                <button className="filter-pill active" data-filter="all">All</button>
                <button className="filter-pill" data-filter="upcoming">Upcoming</button>
                <button className="filter-pill" data-filter="completed">Completed</button>
                <button className="filter-pill" data-filter="cancelled">Cancelled</button>
              </div>

              <div id="appointment-list" className="appointment-list" aria-live="polite">
                <ApptCard id="a4" initials="RM" name="Dr. Rohan Mehta" meta="Apollo Hospitals · Pediatrician" badgeClass="badge-primary" badge="Upcoming" date="15 Aug 2026" time="10:00 AM" reason="Child vaccination" status="upcoming" />
                <ApptCard id="a1" initials="KR" name="Dr. Kavya Reddy" meta="Manipal Hospitals · General Physician" badgeClass="badge-success" badge="Completed" date="3 Aug 2026" time="4:00 PM" reason="Fever & fatigue" status="completed" rx />
                <ApptCard id="a3" initials="AS" name="Dr. Ananya Sharma" meta="AIIMS Delhi · Cardiologist" badgeClass="badge-error" badge="Cancelled" date="10 Aug 2026" time="9:30 AM" reason="Routine heart checkup" status="cancelled" />
              </div>
            </div>

            <div className="appointments-col">
              <div className="calendar-card card">
                <div className="card-header cal-header">
                  <h2 className="cal-title">Activity calendar</h2>
                  <span className="badge badge-primary" id="cal-month">August 2026</span>
                </div>
                <div className="card-body">
                  <div className="cal-weekdays" aria-hidden="true">
                    <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                  </div>
                  <div className="cal-grid" id="cal-grid" role="list" aria-label="Appointment activity by day">
                    <span className="cal-cell empty"></span>
                    <span className="cal-cell empty"></span>
                    <span className="cal-cell empty"></span>
                    <span className="cal-cell empty"></span>
                    <span className="cal-cell empty"></span>
                    <span className="cal-cell empty"></span>
                    <span className="cal-cell cal-l0">1</span>
                    <span className="cal-cell cal-l0">2</span>
                    <span className="cal-cell cal-l1 has-count">3</span>
                    <span className="cal-cell cal-l0">4</span>
                    <span className="cal-cell cal-l1 has-count">5</span>
                    <span className="cal-cell cal-l0">6</span>
                    <span className="cal-cell cal-l0">7</span>
                    <span className="cal-cell cal-l0">8</span>
                    <span className="cal-cell cal-l0">9</span>
                    <span className="cal-cell cal-l1 has-count">10</span>
                    <span className="cal-cell cal-l0">11</span>
                    <span className="cal-cell cal-l0">12</span>
                    <span className="cal-cell cal-l0">13</span>
                    <span className="cal-cell cal-l0">14</span>
                    <span className="cal-cell cal-l3 has-count">15</span>
                  </div>
                  <div className="cal-legend">
                    <span className="cal-legend-label">Less</span>
                    <span className="cal-cell cal-l0"></span>
                    <span className="cal-cell cal-l1"></span>
                    <span className="cal-cell cal-l2"></span>
                    <span className="cal-cell cal-l3"></span>
                    <span className="cal-legend-label">More</span>
                  </div>
                  <p className="cal-hint" id="cal-hint">3 days with appointments this month.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="book-modal" id="book-modal" role="dialog" aria-modal="true" aria-labelledby="book-title" hidden>
          <div className="book-backdrop" data-book-close></div>
          <div className="book-card">
            <div className="book-header">
              <h2 id="book-title" className="book-title">Book an appointment</h2>
              <button className="book-close" data-book-close aria-label="Close booking">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <ol className="book-steps" id="book-steps" aria-hidden="true">
              <li className="book-step active" data-step="1"><span className="book-step-num">1</span> Doctor</li>
              <li className="book-step" data-step="2"><span className="book-step-num">2</span> Date &amp; time</li>
              <li className="book-step" data-step="3"><span className="book-step-num">3</span> Reason</li>
              <li className="book-step" data-step="4"><span className="book-step-num">4</span> Confirm</li>
            </ol>
            <div className="book-body">
              <div className="book-panel" data-panel="1">
                <label className="input-label" htmlFor="doc-search">Search for a doctor</label>
                <div className="input-search book-field">
                  <span className="input-search-icon material-symbols-outlined">search</span>
                  <input type="text" id="doc-search" className="input-field" placeholder="Name or specialty e.g. Cardio..." autoComplete="off" />
                </div>
                <div className="doc-results" id="doc-results" role="listbox" aria-label="Doctor results"></div>
              </div>
              <div className="book-panel" data-panel="2" hidden>
                <div className="input-group book-field">
                  <label className="input-label" htmlFor="book-date">Select date</label>
                  <input type="date" id="book-date" className="input-field" min="" />
                </div>
                <label className="input-label">Select a time slot</label>
                <div className="slot-grid" id="slot-grid" role="group" aria-label="Time slots"></div>
              </div>
              <div className="book-panel" data-panel="3" hidden>
                <div className="input-group book-field">
                  <label className="input-label" htmlFor="book-reason">Reason for visit</label>
                  <input type="text" id="book-reason" className="input-field" placeholder="e.g. Routine checkup" autoComplete="off" />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="book-notes">Notes (optional)</label>
                  <textarea id="book-notes" className="input-field" rows={4} placeholder="Anything the doctor should know..."></textarea>
                </div>
              </div>
              <div className="book-panel" data-panel="4" hidden>
                <div className="book-summary" id="book-summary"></div>
              </div>
            </div>
            <div className="book-footer">
              <button className="btn btn-ghost" id="book-back" type="button">Back</button>
              <button className="btn btn-primary" id="book-next" type="button">Next</button>
            </div>
          </div>
        </div>

        <div className="rx-modal" id="rx-modal" role="dialog" aria-modal="true" aria-labelledby="rx-title" hidden>
          <div className="book-backdrop" data-rx-close></div>
          <div className="rx-card">
            <div className="book-header">
              <h2 id="rx-title" className="book-title">Prescription</h2>
              <button className="book-close" data-rx-close aria-label="Close prescription">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="rx-body" id="rx-body"></div>
          </div>
        </div>

        <div className="toast" id="toast" role="status" aria-live="polite" hidden></div>
      </div>
    </AppLayout>
  );
}
