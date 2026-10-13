import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const specialty = searchParams.get("specialty");
  const minRating = searchParams.get("min_rating");
  const available = searchParams.get("available");
  const openNow = searchParams.get("open_now");
  const search = searchParams.get("q");
  const distance = searchParams.get("distance");

  const supabase = createServiceClient();
  let query = supabase.from("hospitals").select("*");

  if (type && type !== "all") query = query.eq("type", type);
  if (available === "true") query = query.eq("available", true);
  if (openNow === "true") query = query.eq("open_now", true);
  if (minRating) query = query.gte("rating", parseFloat(minRating));
  if (distance) query = query.lte("distance_km", parseFloat(distance));
  if (search) query = query.ilike("name", `%${search}%`);
  if (specialty && specialty !== "all") query = query.contains("specialties", [specialty]);

  query = query.order("rating", { ascending: false });

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
