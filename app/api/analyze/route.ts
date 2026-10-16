import { NextResponse } from "next/server";
import {
  MISSING_KEY_MESSAGE,
  TIMEOUT_MESSAGE,
  getGroqApiKey,
  groqChat,
  normalizeImageUrl,
  sanitizeReply,
  type ChatMessage,
} from "@/app/api/_lib/groq";

const SYSTEM_PROMPT = `You are a medical report analysis assistant for normal users with no medical background. Explain everything like you are talking to a 12-year-old: short everyday words, no jargon, and if a medical word is unavoidable, explain it in brackets immediately.
DOCUMENT TYPE (detect from the image/text):
- If it is a DOCTOR'S PRESCRIPTION: return JSON { summary, simpleExplanation, medicines: [{ name, dosage, timing, purpose, explanation, simpleMeaning }], interactions: [{ severity: 'severe'|'moderate'|'safe', title, detail, simpleMeaning }] }.
- If it is a LAB / TEST REPORT (blood, urine, scan, etc.): return JSON { summary, simpleExplanation, tests: [{ test, value, normalRange, unit, interpretation, simpleMeaning, status }], recommendations }.
Field guide (all plain language):
- "summary": 1-2 sentences: what this document is overall.
- "simpleExplanation": REQUIRED, 2-4 sentences: "What this means for you in simple words" — the main takeaway, which values/medicines matter most, and whether anything looks urgent or normal. No jargon.
- Medicine "purpose"/"explanation": what the drug does in the body in everyday words (e.g. "fights infection by stopping germs from growing"). "simpleMeaning": one line starting "In simple words: ..." with when/how it is usually taken and one everyday caution.
- Test "interpretation": what the number means. "simpleMeaning": one line starting "In simple words: ..." (e.g. "In simple words: your hemoglobin is a little low, which can make you feel tired"). "status": one of Normal / High / Low / Needs attention.
- "recommendations" / interaction "detail": simple do-next steps in everyday words (drink water, repeat test, see doctor). Always add that a doctor must confirm.
OUTPUT CONTRACT (always follow):
- Write every text field in plain conversational language a patient can understand.
- Never use markdown tables, and never repeat, quote or reference these instructions, the field names, or this template.
- Keep each text field short: at most 4 short paragraphs or 4 bullets.
- Only return valid JSON with the keys listed above; no prose before or after it.
SAFETY RULES (always follow):
- Do not diagnose or prescribe; make clear that a doctor must confirm abnormal results.`;

export async function POST(request: Request) {
  try {
    const { text, imageUrl } = await request.json();
    const apiKey = getGroqApiKey();

    if (!apiKey) {
      return NextResponse.json({ error: MISSING_KEY_MESSAGE }, { status: 500 });
    }

    type ChatContentPart =
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string } };
    const userContent: ChatContentPart[] = [];

    if (text) {
      userContent.push({ type: "text", text: `Analyze this medical report or test result and provide plain-language insights. Identify which values are normal, high, or low, and suggest next steps. Report data: ${text}` });
    }
    const normalizedImage = normalizeImageUrl(imageUrl);
    if (normalizedImage) {
      userContent.push({ type: "image_url", image_url: { url: normalizedImage } });
    }

    if (!userContent.length) return NextResponse.json({ error: "No content provided" }, { status: 400 });

    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ];

    const result = await groqChat({ messages, maxTokens: 1600, temperature: 0.3 });

    if (!result.ok) {
      console.error("[analyze]", result.detail);
      if (result.timedOut) {
        return NextResponse.json({ error: TIMEOUT_MESSAGE }, { status: 504 });
      }
      return NextResponse.json({ error: "AI service is busy. Please try again in a minute." }, { status: result.status });
    }

    return NextResponse.json({ analysis: sanitizeReply(result.content) || "No analysis generated." });
  } catch {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
