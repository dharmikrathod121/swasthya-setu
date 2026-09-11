import Link from "next/link";
import { AppLayout } from "@/components/app-layout";

export default function BookAppointmentPage() {
  return (
    <AppLayout>
      <div className="container section" style={{ paddingTop: "var(--space-8)" }}>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/dashboard">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link href="/doctors">Doctors</Link>
          <span className="breadcrumb-separator">/</span>
          <span>Book Appointment</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="section-header reveal">
              <div className="section-eyebrow">Schedule</div>
              <h1>Book an Appointment</h1>
              <p>Choose your preferred consultation type and time slot.</p>
            </div>

            <div className="doctor-card mb-6 reveal" style={{ padding: "var(--space-4) var(--space-5)" }}>
              <div className="doctor-avatar-placeholder" style={{ width: 64, height: 64 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 32 }}>person</span>
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold">Dr. R. K. Sharma</h3>
                <p className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>Cardiologist · AIIMS Delhi</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>15+ years experience · Hindi, English, Marathi</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold font-mono" style={{ color: "var(--color-primary)" }}>₹800</div>
                <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>per consultation</div>
              </div>
            </div>

            <form className="card reveal" action="#">
              <div className="card-body flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="input-group">
                    <label className="input-label" htmlFor="apt-type">Consultation Type</label>
                    <select id="apt-type" className="input-field" defaultValue="In-Person Visit">
                      <option>In-Person Visit</option>
                      <option>Video Consultation</option>
                      <option>Chat Consultation</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="apt-date">Preferred Date</label>
                    <input type="date" id="apt-date" className="input-field" />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Preferred Time Slot</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { t: "9:00", p: "AM", checked: true },
                      { t: "11:00", p: "AM", checked: false },
                      { t: "2:00", p: "PM", checked: false },
                      { t: "4:00", p: "PM", checked: false },
                    ].map((s) => (
                      <label key={s.t} className="cursor-pointer">
                        <input type="radio" name="time" className="sr-only peer" defaultChecked={s.checked} />
                        <div className="text-center py-3 rounded-lg border-2 border-outline peer-checked:border-primary peer-checked:bg-primary-soft transition-all" style={{ borderColor: "var(--border-default)" }}>
                          <div className="text-sm font-bold">{s.t}</div>
                          <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{s.p}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="apt-symptoms">Symptoms / Reason for Visit</label>
                  <textarea id="apt-symptoms" rows={3} className="input-field" placeholder="Briefly describe your symptoms or reason for consultation..."></textarea>
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="apt-phone">Contact Number</label>
                  <input type="tel" id="apt-phone" className="input-field" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div className="card-footer flex justify-end gap-3">
                <Link href="/doctors" className="btn btn-ghost">Cancel</Link>
                <button type="submit" className="btn btn-primary">
                  <span className="material-symbols-outlined">event</span> Confirm Booking
                </button>
              </div>
            </form>
          </div>

          <aside>
            <div className="sticky" style={{ top: "calc(var(--nav-height) + var(--space-6))" }}>
              <div className="sidebar-widget mb-6 reveal">
                <div className="sidebar-widget-header">
                  <h4 className="font-bold">Booking Summary</h4>
                </div>
                <div className="sidebar-widget-body flex flex-col gap-3">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--text-secondary)" }}>Doctor</span>
                    <span className="font-semibold">Dr. R. K. Sharma</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--text-secondary)" }}>Specialty</span>
                    <span className="font-semibold">Cardiologist</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--text-secondary)" }}>Consultation</span>
                    <span className="font-semibold">In-Person</span>
                  </div>
                  <hr className="divider" />
                  <div className="flex justify-between text-sm font-bold">
                    <span>Total</span>
                    <span style={{ color: "var(--color-primary)" }}>₹800</span>
                  </div>
                </div>
              </div>

              <div className="sidebar-widget reveal">
                <div className="sidebar-widget-body">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined mt-0.5" style={{ color: "var(--color-primary)" }}>info</span>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      Please arrive 15 minutes before your appointment. Bring a valid ID and any previous medical records.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}
