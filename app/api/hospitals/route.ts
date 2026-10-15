import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { HOSPITALS, type Facility } from "@/lib/hospitals-data";

function isClinicRow(row: { name?: unknown; location?: unknown }): boolean {
  const hay = `${String(row.name ?? "")} ${String(row.location ?? "")}`.toLowerCase();
  return hay.includes("(clinic)") || hay.includes("clinic)");
}

function inferCity(location: unknown, fallback = "Rajkot"): string {
  const loc = String(location ?? "");
  const known = [
    "Ahmedabad", "Rajkot", "Vadodara", "Surat", "Bhavnagar", "Gondal",
    "New Delhi", "Delhi", "Mumbai", "Bengaluru", "Chennai", "Vellore",
    "Madurai", "Gurugram", "Chandigarh", "Puducherry", "Khanderi", "Kuvadva",
  ];
  for (const c of known) {
    if (loc.toLowerCase().includes(c.toLowerCase())) {
      if (c === "Delhi") return "New Delhi";
      if (c === "Khanderi" || c === "Kuvadva") return "Rajkot";
      return c;
    }
  }
  return fallback;
}

function normalizeDbRow(row: Record<string, unknown>): Facility {
  const name = String(row.name ?? "Hospital");
  const rawType = String(row.type ?? "Private");
  const type = (isClinicRow(row) ? "Clinic" : rawType === "Govt" ? "Govt" : "Private") as Facility["type"];
  const location = String(row.location ?? "");
  const area = location.replace(/\s*\(Clinic\)\s*/gi, "").trim() || location;
  return {
    id: String(row.id ?? name),
    name: name.replace(/\s*\(Clinic\)\s*/gi, "").trim() || name,
    type,
    city: inferCity(row.location),
    area,
    specialties: Array.isArray(row.specialties) ? (row.specialties as string[]) : [],
    emergency: false, // DB has no emergency column — never claim it.
  };
}

function filterStatic(params: {
  type?: string | null;
  specialty?: string | null;
  city?: string | null;
  emergency?: string | null;
  search?: string | null;
}): Facility[] {
  const { type, specialty, city, emergency, search } = params;
  return HOSPITALS.filter((h) => {
    if (type && type !== "all") {
      if (type === "clinic") {
        if (h.type !== "Clinic") return false;
      } else if (h.type !== type) return false;
    }
    if (specialty && specialty !== "all") {
      const s = specialty.toLowerCase();
      if (!h.specialties.some((x) => x.toLowerCase().includes(s))) return false;
    }
    if (city && city !== "all") {
      if (h.city.toLowerCase() !== city.toLowerCase()) return false;
    }
    if (emergency === "true" && !h.emergency) return false;
    if (search) {
      const q = search.toLowerCase();
      const hay = `${h.name} ${h.city} ${h.area} ${h.specialties.join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const specialty = searchParams.get("specialty");
  const city = searchParams.get("city");
  const emergency = searchParams.get("emergency");
  const minRating = searchParams.get("min_rating");
  const available = searchParams.get("available");
  const openNow = searchParams.get("open_now");
  const search = searchParams.get("q") ?? searchParams.get("search");
  const distance = searchParams.get("distance");

  try {
    const supabase = createServiceClient();
    let query = supabase.from("hospitals").select("*");

    if (type && type !== "all") {
      if (type === "clinic") {
        query = query.or("name.ilike.%clinic%,location.ilike.%clinic%");
      } else {
        query = query.eq("type", type);
      }
    }
    if (available === "true") query = query.eq("available", true);
    if (openNow === "true") query = query.eq("open_now", true);
    if (minRating) query = query.gte("rating", parseFloat(minRating));
    if (distance) query = query.lte("distance_km", parseFloat(distance));
    if (city && city !== "all") query = query.ilike("location", `%${city}%`);
    if (search) query = query.ilike("name", `%${search}%`);
    if (specialty && specialty !== "all") query = query.contains("specialties", [specialty]);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    if (data && data.length > 0) {
      let rows = (data as Record<string, unknown>[]).map(normalizeDbRow);
      // Specialty/emergency/city text filters also applied post-hoc so
      // behaviour matches the static fallback exactly.
      if (specialty && specialty !== "all") {
        const s = specialty.toLowerCase();
        rows = rows.filter((h) => h.specialties.some((x) => x.toLowerCase().includes(s)));
      }
      if (city && city !== "all") {
        rows = rows.filter((h) => h.city.toLowerCase() === city.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        rows = rows.filter((h) =>
          `${h.name} ${h.city} ${h.area} ${h.specialties.join(" ")}`.toLowerCase().includes(q)
        );
      }
      return NextResponse.json(rows);
    }
    // DB empty → fall through to curated static dataset.
  } catch {
    // Supabase unreachable → fall through to curated static dataset.
  }

  return NextResponse.json(filterStatic({ type, specialty, city, emergency, search }));
}
