import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text, imageUrl } = await request.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 });

    type ChatContentPart =
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string } };
    const userContent: ChatContentPart[] = [];

    if (text) {
      userContent.push({ type: "text", text: `Analyze this medical report or test result and provide plain-language insights. Identify which values are normal, high, or low, and suggest next steps. Report data: ${text}` });
    }
    if (imageUrl) {
      userContent.push({ type: "image_url", image_url: { url: imageUrl } });
    }

    if (!userContent.length) return NextResponse.json({ error: "No content provided" }, { status: 400 });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a medical report analysis assistant. Analyze lab reports, blood tests, and medical documents. Provide structured JSON output with: summary, tests (array with test name, value, normalRange, unit, interpretation), and recommendations. Keep it concise." },
          { role: "user", content: userContent },
        ],
        max_tokens: 1024,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    if (data.error) return NextResponse.json({ error: data.error.message }, { status: 500 });

    return NextResponse.json({ analysis: data.choices?.[0]?.message?.content || "No analysis generated." });
  } catch {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
