"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchResults {
  hospitals: Array<{ id: string; name: string; city?: string; area?: string; type?: string }>;
  doctors: Array<{ id: string; name: string; specialty?: string; hospitalName?: string }>;
  medicines: Array<{ id?: string; name: string }>;
  total: number;
}

function SearchInner() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") ?? "";
  const [input, setInput] = React.useState(q);
  const [data, setData] = React.useState<SearchResults | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => setInput(q), [q]);

  React.useEffect(() => {
    if (!q.trim()) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`Search failed (${r.status})`);
        return r.json();
      })
      .then((j) => {
        if (!cancelled) setData(j);
      })
      .catch((e) => {
        if (cancelled) return;
        if (e instanceof Error && e.name === "AbortError") {
          setError("Search timed out. Please try again.");
        } else {
          setError(e instanceof Error ? e.message : "Search failed");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [q]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(input.trim())}`);
  }

  return (
    <div className="container section" style={{ paddingTop: "var(--space-8)" }}>
      <form onSubmit={submit} className="search-bar" style={{ display: "flex", alignItems: "center", gap: 8, maxWidth: "100%", marginBottom: "var(--space-4)", position: "relative" }}>
        <span className="material-symbols-outlined search-bar-icon" style={{ position: "absolute", left: 12 }}>search</span>
        <input
          type="text"
          className="search-bar-input"
          style={{ flex: 1, paddingLeft: 40 }}
          placeholder="AI search — try 'cardiologist in Ahmedabad' or 'fever what to do?'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Search"
        />
        <button type="submit" className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>Search</button>
      </form>

      <div className="flex items-center justify-between flex-wrap gap-2" style={{ marginBottom: "var(--space-6)" }}>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {loading ? (
            <>Searching for <strong>&quot;{q}&quot;</strong>…</>
          ) : !q ? (
            <>Type above to search hospitals, doctors and clinics.</>
          ) : data ? (
            <>Showing results for <strong>&quot;{q}&quot;</strong> — {data.total} results</>
          ) : null}
          {error && (
            <span style={{ color: "red" }}>
              {" "}{error}{" "}
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => router.refresh()}
              >
                Retry
              </button>
            </span>
          )}
        </p>
        <div className="flex gap-2">
          <Link href="/hospitals" className="btn btn-secondary btn-sm">Hospitals</Link>
          <Link href={`/chatbot?q=${encodeURIComponent(q)}`} className="btn btn-secondary btn-sm">Ask AI</Link>
        </div>
      </div>

      {data && (
        <div className="flex flex-col gap-4">
          {data.hospitals.map((h) => (
            <Link key={h.id} href={`/hospitals/${h.id}`} className="card">
              <div className="card-body">
                <span className="badge badge-primary">Hospital</span>
                <h3 className="text-lg font-bold">{h.name}</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {[h.area, h.city].filter(Boolean).join(", ")}
                </p>
              </div>
            </Link>
          ))}
          {data.doctors.map((d) => (
            <Link key={d.id} href={`/hospitals?tab=doctors&q=${encodeURIComponent(d.name)}`} className="card">
              <div className="card-body">
                <span className="badge badge-accent">Doctor</span>
                <h3 className="text-lg font-bold">{d.name}</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {[d.specialty, d.hospitalName].filter(Boolean).join(" · ")}
                </p>
              </div>
            </Link>
          ))}
          {data.medicines.map((m, i) => (
            <div key={m.id ?? i} className="card">
              <div className="card-body">
                <span className="badge badge-warning">Medicine</span>
                <h3 className="text-lg font-bold">{m.name}</h3>
              </div>
            </div>
          ))}
          {data.total === 0 && (
            <div className="card">
              <div className="card-body">
                <p>No matches found. Try a specialty (e.g. cardiology), a city, or <Link href={`/chatbot?q=${encodeURIComponent(q)}`}>ask the AI assistant</Link>.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  // NOTE: app/search/layout.tsx already wraps this page in <AppLayout />.
  // Do NOT wrap again here — double-wrapping renders the header/footer twice.
  return (
    <Suspense fallback={<div className="container section">Loading search…</div>}>
      <SearchInner />
    </Suspense>
  );
}
