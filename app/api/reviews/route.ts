import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hospitalId = searchParams.get("hospital_id");

  const supabase = createServiceClient();
  let query = supabase.from("reviews").select("*");

  if (hospitalId) query = query.eq("hospital_id", hospitalId);
  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("reviews")
      .insert([{ ...body, date: "Just now" }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Update hospital review count and average rating
    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("hospital_id", body.hospital_id);

    if (reviews && reviews.length > 0) {
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await supabase
        .from("hospitals")
        .update({ reviews_count: reviews.length, rating: Math.round(avg * 10) / 10 })
        .eq("id", body.hospital_id);
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
