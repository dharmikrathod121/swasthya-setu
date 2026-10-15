import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { DOCTORS, HOSPITALS } from "@/lib/hospitals-data";

function filterStatic(params: {
  specialty?: string | null;
  hospital?: string | null;
  search?: string | null;
}) {
  const { specialty, hospital, search } = params;
  return DOCTORS.filter((d) => {
    if (specialty && specialty !== "all") {
      if (!d.specialty.toLowerCase().includes(specialty.toLowerCase())) return false;
    }
    if (hospital && hospital !== "all") {
      const h = hospital.toLowerCase();
      const linked = d.hospitalId?.toLowerCase() === h || d.hospitalName.toLowerCase().includes(h);
      // Also allow matching by facility name from the dataset.
      const facility = HOSPITALS.find(
        (f) => f.id.toLowerCase() === h || f.name.toLowerCase().includes(h)
      );
      const viaFacility =
        facility != null && (d.hospitalId === facility.id || d.hospitalName === facility.name);
      if (!linked && !viaFacility) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (!`${d.name} ${d.specialty} ${d.hospitalName}`.toLowerCase().includes(q)) return false;
    }
    return true;
  }).map((d) => ({
    id: d.id,
    name: d.name,
    specialty: d.specialty,
    hospital_id: d.hospitalId,
    hospital_name: d.hospitalName,
    verified: true,
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const specialty = searchParams.get("specialty");
  const hospital = searchParams.get("hospital");
  const language = searchParams.get("language");
  const minRating = searchParams.get("min_rating");
  const search = searchParams.get("q") ?? searchParams.get("search");

  try {
    const supabase = createServiceClient();
    let query = supabase.from("doctors").select("*, hospitals(name)");

    if (specialty && specialty !== "all") query = query.eq("specialty", specialty);
    if (hospital && hospital !== "all") query = query.eq("hospital_id", hospital);
    if (language && language !== "all") query = query.contains("languages", [language]);
    if (minRating) query = query.gte("rating", parseFloat(minRating));
    if (search) query = query.or(`name.ilike.%${search}%,specialty.ilike.%${search}%`);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    if (data && data.length > 0) return NextResponse.json(data);
  } catch {
    // Supabase unreachable → curated static fallback below.
  }

  return NextResponse.json(filterStatic({ specialty, hospital, search }));
}
