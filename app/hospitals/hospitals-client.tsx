"use client";

import { useEffect, useMemo, useState } from "react";
import { useHospitals, useDoctors } from "@/lib/hooks/use-api";
import { AppLayout } from "@/components/app-layout";
import {
  HOSPITALS,
  DOCTORS,
  SPECIALTIES,
  CITIES,
  type Facility,
  type DoctorEntry,
} from "@/lib/hospitals-data";

type Tab = "hospitals" | "doctors" | "clinics";

interface Filters {
  tab: Tab;
  q: string;
  type: string;
  specialty: string;
  city: string;
  emergency: boolean;
}

const DEFAULT_FILTERS: Filters = {
  tab: "hospitals",
  q: "",
  type: "all",
  specialty: "all",
  city: "all",
  emergency: false,
};

function readInitialFilters(): Filters {
  if (typeof window === "undefined") return DEFAULT_FILTERS;
  const sp = new URLSearchParams(window.location.search);
  const tab = sp.get("tab");
  return {
    tab: tab === "doctors" || tab === "clinics" || tab === "hospitals" ? tab : "hospitals",
    q: sp.get("q") ?? "",
    type: sp.get("type") ?? "all",
    specialty: sp.get("specialty") ?? "all",
    city: sp.get("city") ?? "all",
    emergency: sp.get("emergency") === "true",
  };
}

function TypeBadge({ type }: { type: string }) {
  const cls =
    type === "Govt" ? "type-badge-govt" : type === "Clinic" ? "type-badge-clinic" : "type-badge-private";
  const icon = type === "Govt" ? "account_balance" : type === "Clinic" ? "stethoscope" : "business_center";
  return (
    <span className={`type-badge ${cls}`}>
      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{icon}</span>
      {type}
    </span>
  );
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

function normalizeHospitalRow(row: Record<string, unknown>): Facility {
  const name = String(row.name ?? row.hospital_name ?? "Hospital");
  const rawType = String(row.type ?? "Private");
  const hay = `${name} ${String(row.location ?? "")}`.toLowerCase();
  const type = (hay.includes("clinic") ? "Clinic" : rawType === "Govt" ? "Govt" : "Private") as Facility["type"];
  return {
    id: String(row.id ?? name),
    name,
    type,
    city: String(row.city ?? row.location ?? "Rajkot"),
    area: String(row.area ?? row.location ?? ""),
    specialties: Array.isArray(row.specialties) ? (row.specialties as string[]) : [],
    emergency: Boolean(row.emergency ?? false),
    address: typeof row.address === "string" ? row.address : undefined,
    phone: typeof row.phone === "string" ? row.phone : undefined,
    hours: typeof row.hours === "string" ? row.hours : undefined,
    rating: typeof row.rating === "number" ? row.rating : undefined,
    reviewCount: typeof row.reviews_count === "number" ? row.reviews_count : typeof row.reviewCount === "number" ? (row.reviewCount as number) : undefined,
  };
}

function normalizeDoctorRow(row: Record<string, unknown>, index: number): DoctorEntry {
  const hospitals = row.hospitals as { name?: unknown } | undefined;
  return {
    id: String(row.id ?? `db-${index}`),
    name: String(row.name ?? "Doctor"),
    specialty: String(row.specialty ?? "General Medicine"),
    hospitalId: typeof row.hospital_id === "string" ? row.hospital_id : null,
    hospitalName: String(hospitals?.name ?? row.hospital_name ?? "Contact via hospital"),
  };
}

export default function HospitalsClient() {
  const [filters, setFilters] = useState<Filters>(readInitialFilters);
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [aiIds, setAiIds] = useState<string[] | null>(null);

  const { data: apiHospitals, isLoading: hospitalsLoading } = useHospitals();
  const { data: apiDoctors, isLoading: doctorsLoading } = useDoctors();

  const isLoading = hospitalsLoading || doctorsLoading;

  // Keep URL query params in sync so filters are shareable/back-button safe.
  useEffect(() => {
    const sp = new URLSearchParams();
    sp.set("tab", filters.tab);
    if (filters.q) sp.set("q", filters.q);
    if (filters.type !== "all") sp.set("type", filters.type);
    if (filters.specialty !== "all") sp.set("specialty", filters.specialty);
    if (filters.city !== "all") sp.set("city", filters.city);
    if (filters.emergency) sp.set("emergency", "true");
    const qs = sp.toString();
    window.history.replaceState(null, "", `/hospitals${qs ? `?${qs}` : ""}`);
  }, [filters]);

  const facilities: Facility[] = useMemo(() => {
    if (Array.isArray(apiHospitals) && apiHospitals.length > 0) {
      return (apiHospitals as Record<string, unknown>[]).map(normalizeHospitalRow);
    }
    return HOSPITALS;
  }, [apiHospitals]);

  const doctors: DoctorEntry[] = useMemo(() => {
    if (Array.isArray(apiDoctors) && apiDoctors.length > 0) {
      return (apiDoctors as Record<string, unknown>[]).map(normalizeDoctorRow);
    }
    return DOCTORS;
  }, [apiDoctors]);

  const hospitalCity = useMemo(() => {
    const map = new Map<string, string>();
    for (const f of facilities) map.set(f.id, f.city);
    for (const f of HOSPITALS) {
      if (!map.has(f.id)) map.set(f.id, f.city);
      map.set(f.name, f.city);
    }
    return map;
  }, [facilities]);

  const matchesCommon = (name: string, extra: string) => {
    if (!filters.q) return true;
    return `${name} ${extra}`.toLowerCase().includes(filters.q.toLowerCase());
  };

  const filteredFacilities = useMemo(() => {
    const wantClinic = filters.tab === "clinics";
    return facilities.filter((h) => {
      if (wantClinic ? h.type !== "Clinic" : h.type === "Clinic") return false;
      if (!wantClinic && filters.type !== "all" && h.type !== filters.type) return false;
      if (filters.specialty !== "all") {
        const s = filters.specialty.toLowerCase();
        if (!h.specialties.some((x) => x.toLowerCase().includes(s))) return false;
      }
      if (filters.city !== "all" && !h.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters.emergency && !h.emergency) return false;
      if (!matchesCommon(h.name, `${h.city} ${h.area} ${h.specialties.join(" ")}`)) return false;
      if (aiIds !== null && !aiIds.includes(h.id)) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facilities, filters, aiIds]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((d) => {
      // The shared specialty filter applies to doctors too.
      if (filters.specialty !== "all") {
        if (!d.specialty.toLowerCase().includes(filters.specialty.toLowerCase())) return false;
      }
      if (filters.city !== "all") {
        const city = hospitalCity.get(d.hospitalId ?? "") ?? hospitalCity.get(d.hospitalName) ?? "";
        if (!city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      }
      if (!matchesCommon(d.name, `${d.specialty} ${d.hospitalName}`)) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors, filters, hospitalCity]);

  const runAiSearch = async () => {
    const query = aiQuery.trim();
    if (!query) return;
    setAiLoading(true);
    setAiError("");
    try {
      const res = await fetch("/api/hospitals/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = (await res.json()) as { ids?: string[]; reply?: string; error?: string };
      if (!res.ok) {
        setAiError(data.error ?? "AI search failed. Try the manual filters.");
        return;
      }
      setAiIds(Array.isArray(data.ids) ? data.ids : []);
      setAiReply(typeof data.reply === "string" ? data.reply : "");
      if (filters.tab === "doctors") setFilters((f) => ({ ...f, tab: "hospitals" }));
    } catch {
      setAiError("AI search failed. Try the manual filters.");
    } finally {
      setAiLoading(false);
    }
  };

  const clearAi = () => {
    setAiIds(null);
    setAiReply("");
    setAiQuery("");
    setAiError("");
  };

  const resetAll = () => {
    setFilters({ ...DEFAULT_FILTERS, tab: filters.tab });
    clearAi();
  };

  const results = filters.tab === "doctors" ? filteredDoctors : filteredFacilities;

  return (
    <AppLayout>
      <a href="#main" className="skip-link">Skip to main content</a>

      <div id="main">
        <section className="hero-gradient" style={{ padding: "clamp(40px, 6vw, 72px) var(--space-5)" }}>
          <div className="hero-inner" style={{ maxWidth: 760 }}>
            <span className="eyebrow">Hospitals Directory</span>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
              Find care across <span style={{ color: "var(--color-primary)" }}>Gujarat &amp; India</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-lg)", marginTop: "var(--space-3)", marginBottom: "var(--space-6)" }}>
              Verified government hospitals, private hospitals and clinics — no fake ratings, no invented distances.
            </p>
            <div className="input-search" style={{ maxWidth: 560 }}>
              <span className="material-symbols-outlined search-bar-icon">search</span>
              <input
                type="text"
                className="search-bar-input"
                placeholder="Search by name, area, city or specialty…"
                aria-label="Search hospitals, doctors and clinics"
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              />
            </div>
            <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-4)", flexWrap: "wrap" }}>
              <div className="input-search" style={{ flex: "1 1 280px", maxWidth: 420 }}>
                <span className="material-symbols-outlined search-bar-icon">auto_awesome</span>
                <input
                  type="text"
                  className="search-bar-input"
                  placeholder='AI search — e.g. "govt cardiac hospital in Ahmedabad"'
                  aria-label="AI search hospitals"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") runAiSearch();
                  }}
                />
              </div>
              <button className="btn btn-ai btn-sm" type="button" onClick={runAiSearch} disabled={aiLoading}>
                <span className="material-symbols-outlined">auto_awesome</span>
                {aiLoading ? "Searching…" : "AI Search"}
              </button>
              {aiIds !== null && (
                <button className="btn btn-ghost btn-sm" type="button" onClick={clearAi}>
                  Clear AI results
                </button>
              )}
            </div>
            {aiError && <p role="alert" style={{ color: "var(--color-danger)", marginTop: "var(--space-3)" }}>{aiError}</p>}
            {aiReply && (
              <p style={{ color: "var(--text-secondary)", marginTop: "var(--space-3)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: "-3px" }}>auto_awesome</span> {aiReply}
              </p>
            )}
          </div>
        </section>

        <div className="directory">
          <div className="directory-head">
            <div>
              <div className="detail-tabs" role="tablist" aria-label="Directory sections" style={{ marginBottom: "var(--space-3)" }}>
                {(["hospitals", "doctors", "clinics"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={filters.tab === t}
                    className={`detail-tab${filters.tab === t ? " active" : ""}`}
                    type="button"
                    onClick={() => setFilters({ ...filters, tab: t })}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <p>
                <span className="directory-count" id="result-count">{isLoading ? "…" : results.length}</span>{" "}
                {filters.tab === "doctors" ? "doctors" : filters.tab === "clinics" ? "clinics" : "hospitals"} match your filters
              </p>
            </div>
          </div>

          <div className="directory-layout">
            <aside className="filters" aria-label="Filters">
              <div className="filters-header">
                <h2>Filters</h2>
                <button className="filters-reset" onClick={resetAll}>Reset</button>
              </div>

              {filters.tab === "hospitals" && (
                <div className="filter-group">
                  <div className="filter-group-title">Type</div>
                  <div className="segmented">
                    {["all", "Govt", "Private"].map((v) => (
                      <button key={v} className={filters.type === v ? "active" : ""} onClick={() => setFilters({ ...filters, type: v })}>
                        {v === "all" ? "All" : v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="filter-group">
                <div className="filter-group-title">Speciality</div>
                <div className="check-list">
                  {SPECIALTIES.map((s) => (
                    <label key={s} className="check-item">
                      <input
                        type="checkbox"
                        checked={filters.specialty === s}
                        onChange={() => setFilters({ ...filters, specialty: filters.specialty === s ? "all" : s })}
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <div className="filter-group-title">City</div>
                <select
                  className="doc-filter-select"
                  aria-label="Filter by city"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                >
                  <option value="all">All cities</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {filters.tab !== "doctors" && (
                <div className="filter-group">
                  <div className="filter-group-title">Availability</div>
                  <div className="toggle-row">
                    <span className="toggle-label">
                      <span className="material-symbols-outlined">emergency</span> Emergency care
                    </span>
                    <button
                      className={`switch ${filters.emergency ? "on" : ""}`}
                      onClick={() => setFilters({ ...filters, emergency: !filters.emergency })}
                      role="switch"
                      aria-checked={filters.emergency}
                      aria-label="Only show facilities with emergency care"
                    />
                  </div>
                </div>
              )}
            </aside>

            <section className="results" aria-label="Directory results">
              {isLoading && <div className="results-empty"><p>Loading directory…</p></div>}
              {!isLoading && results.length === 0 && (
                <div className="results-empty">
                  <p>No matches. Try widening the city, clearing the specialty, or using AI search.</p>
                </div>
              )}
              {filters.tab === "doctors" ? (
                <div className="results-grid" id="results-grid">
                  {filteredDoctors.map((d) => (
                    <article key={d.id} className="hcard reveal">
                      <div className="hcard-top">
                        <div className="hcard-logo doc-avatar">{initialsOf(d.name)}</div>
                        <div className="hcard-id">
                          <div className="hcard-name">{d.name}</div>
                          <div className="doc-spec">{d.specialty}</div>
                        </div>
                      </div>
                      <div className="hcard-meta-row">
                        <span className="badge badge-success">
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified</span>
                          Verified listing
                        </span>
                      </div>
                      <div className="hcard-chips">
                        <span className="specialty-chip">{d.specialty}</span>
                      </div>
                      <div className="hcard-foot">
                        <span className="doc-hospital">
                          <span className="material-symbols-outlined">local_hospital</span>
                          {d.hospitalName}
                        </span>
                        <div className="hcard-actions">
                          {d.hospitalId ? (
                            <a href={`/hospitals/${d.hospitalId}`} className="hcard-view">
                              Hospital <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                            </a>
                          ) : (
                            <span className="doc-next">Contact via hospital</span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="results-grid" id="results-grid">
                  {filteredFacilities.map((h) => (
                    <article key={h.id} className="hcard reveal">
                      <div className="hcard-top">
                        <div className="hcard-logo">
                          <span className="material-symbols-outlined">local_hospital</span>
                        </div>
                        <div className="hcard-id">
                          <div className="hcard-name">{h.name}</div>
                          <div className="doc-hospital">
                            <span className="material-symbols-outlined">location_on</span>
                            {h.area}{h.city && h.area !== h.city ? `, ${h.city}` : ""}
                          </div>
                        </div>
                      </div>
                      <div className="hcard-meta-row">
                        <TypeBadge type={h.type} />
                        <span className="badge badge-success">
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified</span>
                          Verified listing
                        </span>
                        {h.emergency && (
                          <span className="badge badge-primary">
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>emergency</span>
                            Emergency
                          </span>
                        )}
                      </div>
                      <div className="hcard-chips">
                        {h.specialties.slice(0, 4).map((s: string) => (
                          <span key={s} className="specialty-chip">{s}</span>
                        ))}
                      </div>
                      <div className="hcard-foot">
                        <span className="doc-next">Contact via hospital</span>
                        <div className="hcard-actions">
                          <a href={`/hospitals/${h.id}`} className="hcard-view">
                            View <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
