import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { ingredients, imageUrl, language } = await request.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 });
    if (!ingredients && !imageUrl) return NextResponse.json({ error: "No ingredients or image provided" }, { status: 400 });

    const userContent: Array<Record<string, unknown>> = [];
    if (ingredients) {
      userContent.push({ type: "text", text: `Analyze these food ingredients: ${ingredients}` });
    }
    if (imageUrl) {
      userContent.push({ type: "image_url", image_url: { url: imageUrl } });
    }

    const langHint =
      language === "gu" || language === "gujarati"
        ? "Respond in Gujarati (with English nutrients in brackets)."
        : "Respond in the same language the user used (English, Gujarati, or Hindi).";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: `You are a nutrition and food safety assistant for an Indian healthcare app. Analyze the given food ingredients and provide: macros estimate (calories, protein, carbs, fat), allergen warnings, health flags (high sugar, high sodium, preservatives, etc.), and a brief assessment. Respond in structured JSON: { macros: { calories, protein, carbs, fat }, allergens: [], healthFlags: [], assessment: string }. ${langHint}` },
          { role: "user", content: userContent },
        ],
        max_tokens: 512,
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    if (data.error) return NextResponse.json({ error: data.error.message }, { status: 500 });

    return NextResponse.json({ analysis: data.choices?.[0]?.message?.content || "No analysis generated." });
  } catch {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
