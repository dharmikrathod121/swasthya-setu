import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const category = searchParams.get("category");

  const supabase = createServiceClient();
  let query = supabase.from("medicines").select("*");

  if (q) query = query.or(`name.ilike.%${q}%,generic.ilike.%${q}%,uses.ilike.%${q}%`);
  if (category && category !== "all") query = query.eq("category", category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
