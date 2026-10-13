import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) return NextResponse.json({ error: "Missing query parameter q" }, { status: 400 });

  const supabase = createServiceClient();

  const { data: hospitals } = await supabase
    .from("hospitals")
    .select("*")
    .or(`name.ilike.%${q}%,specialties.cs.{${q}}`)
    .limit(5);

  const { data: doctors } = await supabase
    .from("doctors")
    .select("*")
    .or(`name.ilike.%${q}%,specialty.ilike.%${q}%`)
    .limit(5);

  const { data: medicines } = await supabase
    .from("medicines")
    .select("*")
    .or(`name.ilike.%${q}%,generic.ilike.%${q}%,uses.ilike.%${q}%`)
    .limit(5);

  return NextResponse.json({
    hospitals: hospitals || [],
    doctors: doctors || [],
    medicines: medicines || [],
    total: (hospitals?.length || 0) + (doctors?.length || 0) + (medicines?.length || 0),
  });
}
