import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getFacilityById } from "@/lib/hospitals-data";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from("hospitals").select("*").eq("id", id).single();
    if (!error && data) return NextResponse.json(data);
  } catch {
    // Fall through to curated static dataset.
  }

  const facility = getFacilityById(id);
  if (facility) {
    // Shape mirrors the DB row closely enough for the detail client.
    return NextResponse.json({
      id: facility.id,
      name: facility.name,
      type: facility.type,
      location: `${facility.area}, ${facility.city}`,
      specialties: facility.specialties,
      emergency: facility.emergency,
      address: facility.address ?? `${facility.area}, ${facility.city}`,
      phone: null,
      hours: facility.emergency ? "Emergency 24/7 (verify with hospital)" : null,
      opd_timing: null,
      verified: true,
    });
  }

  return NextResponse.json({ error: "Hospital not found" }, { status: 404 });
}
