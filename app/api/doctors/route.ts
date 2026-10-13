import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const specialty = searchParams.get("specialty");
  const hospital = searchParams.get("hospital");
  const language = searchParams.get("language");
  const minRating = searchParams.get("min_rating");
  const search = searchParams.get("q");

  const supabase = createServiceClient();
  let query = supabase.from("doctors").select("*, hospitals(name)");

  if (specialty && specialty !== "all") query = query.eq("specialty", specialty);
  if (hospital && hospital !== "all") query = query.eq("hospital_id", hospital);
  if (language && language !== "all") query = query.contains("languages", [language]);
  if (minRating) query = query.gte("rating", parseFloat(minRating));
  if (search) query = query.or(`name.ilike.%${search}%,specialty.ilike.%${search}%`);

  query = query.order("rating", { ascending: false });

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
