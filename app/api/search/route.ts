import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { HOSPITALS, DOCTORS } from "@/lib/hospitals-data";

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Levenshtein distance for typo tolerance (e.g. "wakhardt" vs "wockhardt"). */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[] = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const cur = dp[j];
      dp[j] = Math.min(
        dp[j] + 1,
        dp[j - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      prev = cur;
    }
  }
  return dp[n];
}

/** True if query matches target by substring or a 1-char typo (never a
 *  different word — e.g. "dermatologist" must NOT match "hematologist"). */
function fuzzyMatch(query: string, target: string): boolean {
  const q = normalize(query);
  const t = normalize(target);
  if (!q || !t) return false;
  if (t.includes(q) || q.includes(t)) return true;
  // Single-character typo tolerance on whole words only (min 5 chars):
  // "dermatologst" still finds "dermatologist", but "hematologist" (3 edits
  // away) correctly does not match.
  const words = target.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const qWords = query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  for (const qw of qWords) {
    const nqw = normalize(qw);
    if (nqw.length < 5) continue;
    for (const w of words) {
      const nw = normalize(w);
      if (nw.length < 5 || Math.abs(nw.length - nqw.length) > 1) continue;
      if (levenshtein(nqw, nw) <= 1) return true;
    }
  }
  return false;
}

/**
 * Maps "who" words to the specialty vocabulary used in the directory, so
 * "dermatologist" finds Dermatology listings instead of nothing (or worse,
 * a false fuzzy hit like Hematology).
 */
const SPECIALTY_DERIVATIONS: Record<string, string> = {
  dermatologist: "dermatology",
  cardiologist: "cardiology",
  neurologist: "neurology",
  pediatrician: "pediatrics",
  gynecologist: "gynecology",
  obstetrician: "obstetrics",
  oncologist: "oncology",
  hematologist: "hematology",
  urologist: "urology",
  nephrologist: "nephrology",
  ophthalmologist: "ophthalmology",
  psychiatrist: "psychiatry",
  gastroenterologist: "gastroenterology",
  pulmonologist: "pulmonology",
  orthopedist: "orthopedics",
  radiologist: "radiology",
  dentist: "dental",
};

/** Extra specialty terms derived from the raw query (e.g. ologist → ology). */
function derivedSpecialties(q: string): string[] {
  const out = new Set<string>();
  for (const raw of q.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)) {
    if (SPECIALTY_DERIVATIONS[raw]) out.add(SPECIALTY_DERIVATIONS[raw]);
    const m = raw.match(/^([a-z]{4,})ologist$/);
    if (m) out.add(`${m[1]}ology`);
  }
  return [...out];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) return NextResponse.json({ error: "Missing query parameter q" }, { status: 400 });

  try {
    const supabase = createServiceClient();
    const derived = derivedSpecialties(q);
    const titleCase = derived.map((d) => d.charAt(0).toUpperCase() + d.slice(1));

    const hospOr = [`name.ilike.%${q}%`, `specialties.cs.{${q}}`, ...titleCase.map((t) => `specialties.cs.{${t}}`)].join(",");
    const docOr = [`name.ilike.%${q}%,specialty.ilike.%${q}%`, ...derived.map((d) => `specialty.ilike.%${d}%`)].join(",");

    const [hospRes, docRes, medRes] = await withTimeout(
      Promise.all([
        supabase
          .from("hospitals")
          .select("*")
          .or(hospOr)
          .limit(5),
        supabase
          .from("doctors")
          .select("*")
          .or(docOr)
          .limit(5),
        supabase
          .from("medicines")
          .select("*")
          .or(`name.ilike.%${q}%,generic.ilike.%${q}%,uses.ilike.%${q}%`)
          .limit(5),
      ]),
      5000,
      "Supabase search"
    );

    const hospitals = hospRes.data ?? [];
    const doctors = docRes.data ?? [];
    const medicines = medRes.data ?? [];
    const total = hospitals.length + doctors.length + medicines.length;
    if (total > 0) {
      return NextResponse.json({ hospitals, doctors, medicines, total });
    }
    // DB reachable but empty → fall through to curated static directory.
  } catch {
    // Supabase unreachable/slow → curated static fallback below.
  }

  const needle = q.toLowerCase();
  const derived = derivedSpecialties(q);
  const hospitals = HOSPITALS.filter((h) => {
    const hay = `${h.name} ${h.city} ${h.area} ${h.specialties.join(" ")}`.toLowerCase();
    if (hay.includes(needle)) return true;
    if (derived.some((d) => hay.includes(d))) return true;
    return fuzzyMatch(q, `${h.name} ${h.city} ${h.area}`);
  }).slice(0, 5);
  const doctors = DOCTORS.filter((d) => {
    const hay = `${d.name} ${d.specialty} ${d.hospitalName}`.toLowerCase();
    if (hay.includes(needle)) return true;
    if (derived.some((x) => d.specialty.toLowerCase().includes(x))) return true;
    return fuzzyMatch(q, `${d.name} ${d.specialty} ${d.hospitalName}`);
  }).slice(0, 5);

  return NextResponse.json({
    hospitals,
    doctors,
    medicines: [],
    total: hospitals.length + doctors.length,
    source: "curated-static-directory",
  });
}
