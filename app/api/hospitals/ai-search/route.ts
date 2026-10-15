import { NextResponse } from "next/server";
import { HOSPITALS, datasetSummary } from "@/lib/hospitals-data";
import {
  MISSING_KEY_MESSAGE,
  TIMEOUT_MESSAGE,
  getGroqApiKey,
  groqChat,
} from "@/app/api/_lib/groq";

const SYSTEM_PROMPT = `You are a hospital-directory matcher. You are given a FIXED list of hospitals/clinics, one per line, in this format:
id | name | type (Govt/Private/Clinic) | city (area) | specialties | emergency:yes/no

RULES (follow strictly):
- Only recommend entries from the provided list. NEVER invent, rename, or add hospitals, clinics, cities, addresses, phone numbers, or ratings.
- Match the user's need (specialty, city/area, govt vs private vs clinic, emergency) against the list.
- Reply with STRICT JSON only, no other text: {"ids": ["id1", "id2"], "reply": "one or two short sentences explaining the picks"}
- "ids" must contain only ids copied exactly from the list. Max 8 ids. Empty array if nothing matches.
- "reply" must not mention any facility that is not in the list.

FACILITY LIST:
${datasetSummary()}`;

function extractJson(text: string): { ids: string[]; reply: string } | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    const parsed = JSON.parse(text.slice(start, end + 1) as string) as {
      ids?: unknown;
      reply?: unknown;
    };
    const validIds = HOSPITALS.map((h) => h.id);
    const ids = Array.isArray(parsed.ids)
      ? (parsed.ids as unknown[]).filter((x): x is string => typeof x === "string" && validIds.includes(x))
      : [];
    const reply = typeof parsed.reply === "string" ? parsed.reply.slice(0, 600) : "";
    return { ids: ids.slice(0, 8), reply };
  } catch {
    return null;
  }
}

/** Local keyword fallback when Groq is unreachable — same no-hallucination guarantee. */
function keywordFallback(query: string): { ids: string[]; reply: string } {
  const q = query.toLowerCase();
  const scored = HOSPITALS.map((h) => {
    const hay = `${h.name} ${h.city} ${h.area} ${h.type} ${h.specialties.join(" ")}`.toLowerCase();
    let score = 0;
    for (const word of q.split(/[^a-z]+/).filter((w) => w.length > 2)) {
      if (hay.includes(word)) score += 1;
    }
    if (q.includes("emergency") && h.emergency) score += 2;
    if (q.includes("govt") || q.includes("government")) score += h.type === "Govt" ? 2 : 0;
    return { h, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
  return {
    ids: scored.map((s) => s.h.id),
    reply:
      scored.length > 0
        ? "AI service was unreachable, so these are keyword matches from the verified directory."
        : "No matches in the verified directory for that query. Try a specialty (e.g. Cardiology) or a city (e.g. Rajkot).",
  };
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { query?: unknown };
  const query = typeof body.query === "string" ? body.query.trim().slice(0, 500) : "";
  if (!query) {
    return NextResponse.json({ error: "Provide { query: string }." }, { status: 400 });
  }

  const apiKey = getGroqApiKey();
  if (!apiKey) {
    const fb = keywordFallback(query);
    return NextResponse.json({
      ...fb,
      model: "keyword-fallback",
      warning: MISSING_KEY_MESSAGE,
    });
  }

  const result = await groqChat({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: query },
    ],
    maxTokens: 400,
    temperature: 0.2,
    json: true,
  });

  if (result.ok) {
    const parsed = extractJson(result.content);
    if (parsed) {
      return NextResponse.json({ ...parsed, model: result.model });
    }
  }

  if (!result.ok && (result.timedOut || result.missingKey)) {
    const fb = keywordFallback(query);
    console.error("[hospitals/ai-search]", result.detail);
    return NextResponse.json({
      ...fb,
      model: "keyword-fallback",
      warning: result.timedOut ? TIMEOUT_MESSAGE : MISSING_KEY_MESSAGE,
    });
  }

  const fb = keywordFallback(query);
  if (!result.ok) console.error("[hospitals/ai-search]", result.detail);
  return NextResponse.json({
    ...fb,
    model: "keyword-fallback",
    warning: result.ok ? "AI returned an unreadable answer" : "AI service is busy. Please try again in a minute.",
  });
}
