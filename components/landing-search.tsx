"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

type SearchPreview = {
  hospitals?: { name?: string }[];
  doctors?: { name?: string }[];
  medicines?: { name?: string }[];
  total?: number;
};

const SUGGESTIONS = [
  "Cardiologist in Rajkot",
  "Maternity hospital",
  "Civil Hospital Rajkot",
];

export function LandingSearch() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [preview, setPreview] = React.useState<SearchPreview | null>(null);
  const [focused, setFocused] = React.useState(false);
  const [loadingPreview, setLoadingPreview] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K focuses the search input.
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleQueryChange(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      setPreview(null);
      setLoadingPreview(false);
    }
  }

  // Live preview against the existing GET /api/search?q=... endpoint.
  // Best-effort only: failures silently clear the dropdown, submit still routes.
  // State updates happen inside the debounced callback (not the effect body).
  React.useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const t = window.setTimeout(async () => {
      setLoadingPreview(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error("search failed");
        const data = (await res.json()) as SearchPreview;
        setPreview(data);
      } catch {
        setPreview(null);
      } finally {
        setLoadingPreview(false);
      }
    }, 350);
    return () => window.clearTimeout(t);
  }, [query]);

  function goToSearch(q: string) {
    const trimmed = q.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  const previewItems: { label: string; kind: string }[] = React.useMemo(() => {
    if (!preview) return [];
    const items: { label: string; kind: string }[] = [];
    for (const h of preview.hospitals?.slice(0, 3) ?? [])
      if (h?.name) items.push({ label: h.name, kind: "Hospital" });
    for (const d of preview.doctors?.slice(0, 3) ?? [])
      if (d?.name) items.push({ label: d.name, kind: "Doctor" });
    for (const m of preview.medicines?.slice(0, 2) ?? [])
      if (m?.name) items.push({ label: m.name, kind: "Medicine" });
    return items;
  }, [preview]);

  const showDropdown =
    focused && query.trim().length >= 2 && (loadingPreview || previewItems.length > 0);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <form
        className="hero-search"
        role="search"
        aria-label="Search hospitals, doctors and medicines"
        style={{ position: "relative" }}
        onSubmit={(e) => {
          e.preventDefault();
          goToSearch(query);
        }}
      >
        <label className="sr-only" htmlFor="landing-search-q">
          Search hospitals, doctors, or medicines
        </label>
        <div className="hs-field">
          <span
            className="material-symbols-outlined"
            aria-hidden
            style={{ color: "var(--color-primary)" }}
          >
            search
          </span>
          <input
            ref={inputRef}
            id="landing-search-q"
            type="text"
            name="q"
            autoComplete="off"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => window.setTimeout(() => setFocused(false), 150)}
            placeholder="Search hospitals, doctors, medicines in Rajkot…"
            aria-label="Search hospitals, doctors, medicines"
          />
          <kbd
            title="Press ⌘K to focus"
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text-tertiary)",
              background: "var(--color-base, #f3f4f6)",
              border: "1px solid var(--border-subtle, #e5e7eb)",
              borderRadius: 6,
              padding: "2px 7px",
              whiteSpace: "nowrap",
            }}
          >
            ⌘K
          </kbd>
        </div>
        <button type="submit" className="btn btn-primary">
          <span
            className="material-symbols-outlined"
            aria-hidden
            style={{ fontSize: 18, marginRight: 4 }}
          >
            search
          </span>
          Search
        </button>

        {/* Live preview dropdown from existing /api/search */}
        {showDropdown && (
          <div
            role="listbox"
            aria-label="Search suggestions"
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              background: "var(--color-surface, #fff)",
              border: "1px solid var(--border-subtle, #e5e7eb)",
              borderRadius: 14,
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden",
              zIndex: 20,
              textAlign: "left",
            }}
          >
            {loadingPreview && previewItems.length === 0 ? (
              <div
                style={{
                  padding: "12px 16px",
                  fontSize: 13,
                  color: "var(--text-secondary)",
                }}
              >
                Searching hospitals, doctors, medicines…
              </div>
            ) : (
              <>
                {previewItems.map((item, i) => (
                  <button
                    key={`${item.kind}-${i}`}
                    type="button"
                    role="option"
                    aria-selected="false"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => goToSearch(item.label)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      padding: "10px 16px",
                      fontSize: 13,
                      color: "var(--text-primary)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--color-primary)",
                        background: "var(--color-primary-soft)",
                        borderRadius: 999,
                        padding: "1px 8px",
                        flexShrink: 0,
                      }}
                    >
                      {item.kind}
                    </span>
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.label}
                    </span>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </form>

      {/* Example searches */}
      <div className="hero-chips" role="list" aria-label="Try an example search">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            className="hero-chip"
            role="listitem"
            onClick={() => {
              setQuery(s);
              goToSearch(s);
            }}
            style={{ cursor: "pointer" }}
            title={`Search: ${s}`}
          >
            {s}
          </button>
        ))}
      </div>
      <p
        style={{
          marginTop: 10,
          fontSize: 12,
          color: "rgba(255,255,255,0.75)",
          textAlign: "center",
        }}
      >
        Press <kbd style={{ opacity: 0.9 }}>Enter ↵</kbd> for results · No sign-in
        needed to search.
      </p>
    </div>
  );
}
