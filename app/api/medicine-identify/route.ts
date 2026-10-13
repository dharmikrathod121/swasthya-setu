import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { query, imageUrl } = await request.json();
    const supabase = createServiceClient();

    let medicines: Record<string, unknown>[] = [];

    if (query) {
      const { data } = await supabase
        .from("medicines")
        .select("*")
        .or(`name.ilike.%${query}%,generic.ilike.%${query}%,uses.ilike.%${query}%`)
        .limit(10);
      medicines = data || [];
    }

    if (imageUrl) {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (apiKey) {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages: [
              { role: "system", content: "Identify the medicine from the image. Provide: name, generic name, likely category, common uses. Respond in JSON." },
              { role: "user", content: [{ type: "image_url", image_url: { url: imageUrl } }] },
            ],
            max_tokens: 256,
          }),
        });
        const data = await response.json();
        const identified = data.choices?.[0]?.message?.content;
        if (identified) medicines.unshift({ ...JSON.parse(identified), identified_from_image: true });
      }
    }

    return NextResponse.json({ medicines });
  } catch {
    return NextResponse.json({ error: "Identification failed" }, { status: 500 });
  }
}
