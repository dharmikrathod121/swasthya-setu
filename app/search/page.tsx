import Link from "next/link";
import { AppLayout } from "@/components/app-layout";

export default function SearchPage() {
  return (
    <AppLayout>
      <div className="container section" style={{ paddingTop: "var(--space-8)" }}>
        <div className="reveal" style={{ marginBottom: "var(--space-8)" }}>
          <div className="search-bar" style={{ maxWidth: "100%", marginBottom: "var(--space-4)" }}>
            <span className="material-symbols-outlined search-bar-icon">search</span>
            <input type="text" className="search-bar-input" placeholder="Search hospitals, doctors, clinics, medicines..." defaultValue="Cardiologist in Delhi" aria-label="Search" />
            <button className="search-bar-clear visible" id="search-clear" aria-label="Clear search">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
            </button>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Showing results for <strong>&quot;Cardiologist in Delhi&quot;</strong> — 12 results
            </p>
            <div className="filter-bar">
              <button className="filter-pill active" data-group="type">All</button>
              <button className="filter-pill" data-group="type">Hospitals</button>
              <button className="filter-pill" data-group="type">Doctors</button>
              <button className="filter-pill" data-group="type">Clinics</button>
              <button className="filter-pill" data-group="sort">Relevance</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <article className="card reveal">
              <div className="card-body flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-48 h-32 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--color-primary-soft) 0%, var(--color-base) 100%)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 48, color: "var(--color-primary)" }}>local_hospital</span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <span className="badge badge-primary mb-2">Hospital</span>
                      <h3 className="text-lg font-bold">AIIMS Delhi</h3>
                    </div>
                    <div className="hospital-card-rating">
                      <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>star</span>
                      4.8
                    </div>
                  </div>
                  <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>Ansari Nagar, New Delhi, Delhi 110029</p>
                  <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>Premier multi-speciality government hospital with dedicated cardiology department, 24/7 emergency, and advanced cardiac care facilities.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge badge-success">Emergency</span>
                    <span className="badge badge-primary">Cardiology</span>
                    <span className="badge badge-primary">Pharmacy</span>
                  </div>
                </div>
              </div>
            </article>

            <article className="card reveal">
              <div className="card-body flex flex-col md:flex-row gap-4">
                <div className="flex-shrink-0">
                  <div className="doctor-avatar-placeholder" style={{ width: 96, height: 96 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48 }}>person</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <span className="badge badge-accent mb-2">Doctor</span>
                      <h3 className="text-lg font-bold">Dr. R. K. Sharma</h3>
                      <p className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>Cardiologist · AIIMS Delhi</p>
                    </div>
                    <div className="hospital-card-rating">
                      <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>star</span>
                      4.9
                    </div>
                  </div>
                  <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>15+ years experience · Hindi, English, Marathi</p>
                  <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>Specializes in interventional cardiology, heart failure management, and preventive cardiology. Over 5,000 successful procedures.</p>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary btn-sm">View Profile</button>
                    <Link href="/appointment" className="btn btn-primary btn-sm">Book</Link>
                  </div>
                </div>
              </div>
            </article>

            <article className="card reveal">
              <div className="card-body flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-48 h-32 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--color-accent-soft) 0%, var(--color-base) 100%)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 48, color: "var(--color-accent)" }}>medical_services</span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <span className="badge badge-warning mb-2">Clinic</span>
                      <h3 className="text-lg font-bold">Heart Care Clinic</h3>
                    </div>
                    <div className="hospital-card-rating">
                      <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>star</span>
                      4.6
                    </div>
                  </div>
                  <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>Lajpat Nagar, New Delhi</p>
                  <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>Specialized cardiac clinic offering ECG, stress testing, and echocardiogram. Led by Dr. R. K. Sharma.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge badge-success">Open Today</span>
                    <span className="badge badge-primary">ECG</span>
                    <span className="badge badge-primary">2D Echo</span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <aside>
            <div className="sticky" style={{ top: "calc(var(--nav-height) + var(--space-6))" }}>
              <div className="sidebar-widget mb-6 reveal">
                <div className="sidebar-widget-header">
                  <h4 className="font-bold">Filters</h4>
                </div>
                <div className="sidebar-widget-body flex flex-col gap-4">
                  <div>
                    <label className="input-label mb-2">Distance</label>
                    <select className="input-field" defaultValue="Within 5 km">
                      <option>Within 5 km</option>
                      <option>Within 10 km</option>
                      <option>Within 25 km</option>
                      <option>Any distance</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label mb-2">Rating</label>
                    <select className="input-field" defaultValue="4+ Stars">
                      <option>4+ Stars</option>
                      <option>3+ Stars</option>
                      <option>Any rating</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label mb-2">Availability</label>
                    <select className="input-field" defaultValue="Available Today">
                      <option>Available Today</option>
                      <option>Available This Week</option>
                      <option>Any time</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="sidebar-widget reveal">
                <div className="sidebar-widget-header">
                  <h4 className="font-bold">Nearby Locations</h4>
                </div>
                <div className="sidebar-widget-body flex flex-col gap-2">
                  {["Connaught Place", "Lajpat Nagar", "Rajouri Garden"].map((loc) => (
                    <Link key={loc} href="/search" className="flex items-center gap-2 p-2 rounded-lg text-sm transition-colors" style={{ color: "var(--text-secondary)" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18, color: "var(--color-primary)" }}>location_on</span> {loc}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}
