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

/** True if query matches target by substring, subsequence, or small edit distance. */
function fuzzyMatch(query: string, target: string): boolean {
  const q = normalize(query);
  const t = normalize(target);
  if (!q || !t) return false;
  if (t.includes(q) || q.includes(t)) return true;
  // Subsequence check (handles missing/extra chars)
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  if (qi === q.length) return true;
  // Word-level edit distance (handles substitutions like a->o)
  const words = target.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const qWords = query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  for (const qw of qWords) {
    const nqw = normalize(qw);
    if (nqw.length < 4) continue;
    for (const w of words) {
      const nw = normalize(w);
      if (Math.abs(nw.length - nqw.length) > 3) continue;
      const threshold = Math.max(2, Math.floor(nqw.length / 4));
      if (levenshtein(nqw, nw) <= threshold) return true;
    }
  }
  return false;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) return NextResponse.json({ error: "Missing query parameter q" }, { status: 400 });

  try {
    const supabase = createServiceClient();

    const [hospRes, docRes, medRes] = await withTimeout(
      Promise.all([
        supabase
          .from("hospitals")
          .select("*")
          .or(`name.ilike.%${q}%,specialties.cs.{${q}}`)
          .limit(5),
        supabase
          .from("doctors")
          .select("*")
          .or(`name.ilike.%${q}%,specialty.ilike.%${q}%`)
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
  const hospitals = HOSPITALS.filter(
    (h) =>
      `${h.name} ${h.city} ${h.area} ${h.specialties.join(" ")}`
        .toLowerCase()
        .includes(needle) ||
      fuzzyMatch(q, `${h.name} ${h.city} ${h.area}`)
  ).slice(0, 5);
  const doctors = DOCTORS.filter(
    (d) =>
      `${d.name} ${d.specialty} ${d.hospitalName}`.toLowerCase().includes(needle) ||
      fuzzyMatch(q, `${d.name} ${d.specialty} ${d.hospitalName}`)
  ).slice(0, 5);

  return NextResponse.json({
    hospitals,
    doctors,
    medicines: [],
    total: hospitals.length + doctors.length,
    source: "curated-static-directory",
  });
}
