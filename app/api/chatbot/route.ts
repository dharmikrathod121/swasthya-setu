import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 });

    const messages = [
      { role: "system", content: "You are a helpful health assistant for Swasthya Setu, an Indian healthcare app for Rajkot. You provide general wellness guidance, symptom triage suggestions, and health tips. Always remind users to consult a real doctor for serious issues. Keep responses concise and friendly. IMPORTANT: Detect the user's language and respond in the SAME language — English, Gujarati (ગુજરાતી), or Hindi. If the user writes in Gujarati, answer fully in Gujarati." },
      ...(history || []),
      { role: "user", content: message },
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages,
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (data.error) return NextResponse.json({ error: data.error.message }, { status: 500 });

    return NextResponse.json({ reply: data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response." });
  } catch {
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
