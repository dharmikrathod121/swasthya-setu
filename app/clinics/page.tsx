import Link from "next/link";
import { AppLayout } from "@/components/app-layout";

const CLINICS = [
  { name: "City Diagnostic Centre", rating: "4.6", loc: "Connaught Place, New Delhi", hours: "Open till 9 PM", cat: "Diagnostics · Lab · Imaging", badges: [["badge-primary", "Home Collection"], ["badge-success", "Reports in 4hrs"]], grad: "linear-gradient(135deg, var(--color-primary-soft) 0%, var(--color-base) 100%)", icon: "medical_services", color: "var(--color-primary)", cta: "Book Test" },
  { name: "Smile Dental Clinic", rating: "4.8", loc: "Rajouri Garden, New Delhi", hours: "Open till 8 PM", cat: "Dental · Orthodontics", badges: [["badge-success", "Emergency"], ["badge-primary", "Root Canal"]], grad: "linear-gradient(135deg, var(--color-accent-soft) 0%, var(--color-base) 100%)", icon: "dental_care", color: "var(--color-accent)", cta: "Book" },
  { name: "Active Physio Care", rating: "4.5", loc: "Hauz Khas, New Delhi", hours: "Open till 7 PM", cat: "Physiotherapy · Rehab", badges: [["badge-primary", "Home Visits"], ["badge-success", "Insurance"]], grad: "linear-gradient(135deg, var(--color-success-soft) 0%, var(--color-base) 100%)", icon: "healing", color: "var(--color-success)", cta: "Book" },
];

export default function ClinicsPage() {
  return (
    <AppLayout>
      <div className="container section" style={{ paddingTop: "var(--space-8)" }}>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/dashboard">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link href="/hospitals">Hospitals</Link>
          <span className="breadcrumb-separator">/</span>
          <span>Clinics</span>
        </nav>

        <div className="section-header reveal">
          <div className="section-eyebrow">Specialized Care</div>
          <h1>Clinics Near You</h1>
          <p>Find specialized clinics for diagnostics, physiotherapy, dental care, and more.</p>
        </div>

        <div className="reveal" style={{ marginBottom: "var(--space-10)" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="input-search">
              <span className="material-symbols-outlined search-bar-icon">search</span>
              <input type="text" className="search-bar-input" placeholder="Search clinics..." aria-label="Search clinics" />
            </div>
            <div className="input-search">
              <span className="material-symbols-outlined search-bar-icon">stethoscope</span>
              <input type="text" className="search-bar-input" placeholder="Specialty..." aria-label="Specialty" />
            </div>
            <div className="input-search">
              <span className="material-symbols-outlined search-bar-icon">location_on</span>
              <input type="text" className="search-bar-input" placeholder="Location..." aria-label="Location" />
            </div>
          </div>

          <div className="filter-bar mt-4">
            <button className="filter-pill active" data-group="type">All</button>
            <button className="filter-pill" data-group="type">Diagnostic</button>
            <button className="filter-pill" data-group="type">Dental</button>
            <button className="filter-pill" data-group="type">Physiotherapy</button>
            <button className="filter-pill" data-group="type">Eye Care</button>
            <button className="filter-pill" data-group="type">Maternity</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CLINICS.map((c) => (
            <article key={c.name} className="hospital-card reveal">
              <div className="hospital-card-image-placeholder" style={{ background: c.grad }}>
                <span className="material-symbols-outlined" style={{ fontSize: 64, color: c.color }}>{c.icon}</span>
              </div>
              <div className="hospital-card-body">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="hospital-card-title">{c.name}</h3>
                  <div className="hospital-card-rating">
                    <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>star</span>
                    {c.rating}
                  </div>
                </div>
                <div className="hospital-card-meta">
                  <div className="hospital-card-meta-item">
                    <span className="material-symbols-outlined">location_on</span>
                    <span>{c.loc}</span>
                  </div>
                  <div className="hospital-card-meta-item">
                    <span className="material-symbols-outlined">schedule</span>
                    <span style={{ color: "var(--color-success)", fontWeight: 600 }}>{c.hours}</span>
                  </div>
                  <div className="hospital-card-meta-item">
                    <span className="material-symbols-outlined">category</span>
                    <span>{c.cat}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {c.badges.map(([cls, label]) => (
                    <span key={label} className={`badge ${cls}`}>{label}</span>
                  ))}
                </div>
              </div>
              <div className="hospital-card-actions">
                <button className="btn btn-primary btn-sm w-full">{c.cta}</button>
                <button className="btn btn-secondary btn-sm w-full">Call</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
