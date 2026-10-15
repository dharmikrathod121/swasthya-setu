import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import {
  MISSING_KEY_MESSAGE,
  TIMEOUT_MESSAGE,
  getGroqApiKey,
  groqChat,
  normalizeImageUrl,
  safeJsonParse,
} from "@/app/api/_lib/groq";

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

    const normalizedImage = normalizeImageUrl(imageUrl);

    if (imageUrl && !normalizedImage) {
      return NextResponse.json(
        { error: "Invalid image: send an http(s) URL or a base64 data URL in imageUrl." },
        { status: 400 }
      );
    }

    if (normalizedImage) {
      const apiKey = getGroqApiKey();
      if (!apiKey) {
        return NextResponse.json({ error: MISSING_KEY_MESSAGE }, { status: 500 });
      }

      const result = await groqChat({
        messages: [
          {
            role: "system",
            content:
              "Identify the medicine from the image. Provide: name, generic name, likely category, common uses. Respond in JSON.",
          },
          {
            role: "user",
            content: [{ type: "image_url", image_url: { url: normalizedImage } }],
          },
        ],
        maxTokens: 256,
        json: true,
      });

      if (!result.ok) {
        console.error("[medicine-identify]", result.detail);
        return NextResponse.json(
          {
            error: result.timedOut ? TIMEOUT_MESSAGE : "AI service is busy. Please try again in a minute.",
          },
          { status: result.timedOut ? 504 : result.status }
        );
      }

      // A slightly-off model response must never 500 the route: keep whatever
      // text came back as the medicine name.
      const parsed = safeJsonParse<Record<string, unknown>>(result.content);
      const identified =
        parsed && typeof parsed === "object" && !Array.isArray(parsed)
          ? parsed
          : { name: result.content.trim() };

      medicines.unshift({ ...identified, identified_from_image: true });
    }

    return NextResponse.json({ medicines });
  } catch {
    return NextResponse.json({ error: "Identification failed" }, { status: 500 });
  }
}
