import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createServiceClient();
  const { id } = await params;
  const { data, error } = await supabase.from("doctors").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  return NextResponse.json(data);
}
