/**
 * Shared Groq (OpenAI-compatible) chat-completions helpers for the API routes.
 * Route handlers import from here so model ids, timeouts and the missing-key
 * message stay consistent. Never log the API key.
 */

export const GROQ_CHAT_COMPLETIONS_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Text-only models, tried in this order (Groq production tier).
 * `qwen/qwen3-32b` / `openai/gpt-oss-20b` were removed: qwen3-32b is no longer
 * served by Groq (404) and the Meta production models come first.
 */
export const TEXT_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "openai/gpt-oss-120b",
] as const;

/**
 * Vision models, tried in this order — used whenever an image is attached.
 * Groq deprecated the Llama 4 vision family (llama-4-scout / llama-4-maverick),
 * which now answers 404, so `qwen/qwen3.8-27b` is the only vision model left on
 * GroqCloud (27B multimodal, 20 MB request cap, max 3 images, JSON mode OK).
 */
export const VISION_MODELS = ["qwen/qwen3.8-27b"] as const;

/** 100% free, no-key fallback (OpenAI-compatible). Tried after Groq is exhausted. */
export const POLLINATIONS_URL = "https://text.pollinations.ai/openai";

/** Hard cap on a single Groq request so the UI fails fast instead of hanging. */
export const GROQ_TIMEOUT_MS = 30_000;

export const MISSING_KEY_MESSAGE =
  "Groq API key not configured. Set GROQ_API_KEY in .env.local and restart the dev server (Ctrl+C, then npm run dev) — env changes require a restart.";

export const TIMEOUT_MESSAGE = "AI service timed out, please retry";

export type ChatRole = "system" | "user" | "assistant";

export interface TextPart {
  type: "text";
  text: string;
}

export interface ImagePart {
  type: "image_url";
  image_url: { url: string };
}

export type ChatContentPart = TextPart | ImagePart;

export type ChatContent = string | ChatContentPart[];

export interface ChatMessage {
  role: ChatRole;
  content: ChatContent;
}

export type GroqResult =
  | { ok: true; content: string; model: string }
  | {
      ok: false;
      status: number;
      error: string;
      detail: string;
      timedOut: boolean;
      missingKey: boolean;
    };

export interface GroqChatOptions {
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  /** Ask Groq for strict JSON (only when the system prompt demands JSON). */
  json?: boolean;
  /** Override the model list; defaults to vision/text detection. */
  models?: readonly string[];
}

/** Reads the key from the environment; never logs or returns it to clients. */
export function getGroqApiKey(): string | null {
  const key = process.env.GROQ_API_KEY;
  return key && key.trim() ? key.trim() : null;
}

/** True when any message carries an image (image_url part or data URL text). */
export function hasImageContent(messages: readonly ChatMessage[]): boolean {
  for (const message of messages) {
    if (typeof message.content === "string") {
      if (message.content.trimStart().startsWith("data:image/")) return true;
      continue;
    }
    if (Array.isArray(message.content)) {
      for (const part of message.content) {
        if (part && part.type === "image_url") return true;
      }
    }
  }
  return false;
}

/**
 * Accepts an http(s) URL, a base64 data URL, or raw base64 (which is wrapped
 * into a JPEG data URL). Returns null when the value cannot be an image.
 */
export function normalizeImageUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("data:")) return trimmed;
  const base64 = trimmed.replace(/\s+/g, "");
  if (base64.length > 200 && /^[A-Za-z0-9+/]+={0,2}$/.test(base64)) {
    return `data:image/jpeg;base64,${base64}`;
  }
  return null;
}

/** Vision models for image input, text models otherwise. */
export function pickModels(messages: readonly ChatMessage[]): readonly string[] {
  return hasImageContent(messages) ? VISION_MODELS : TEXT_MODELS;
}

/** Groq returns a plain string for `content`; some responses use parts. */
export function extractText(content: unknown): string | null {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    const text = content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part) {
          const value = (part as { text?: unknown }).text;
          return typeof value === "string" ? value : "";
        }
        return "";
      })
      .join("")
      .trim();
    return text || null;
  }
  return null;
}

/**
 * Retryable statuses: model missing/decommissioned (404), request timeout (408),
 * rate limit (429) and Groq-side failures (5xx). Groq reports some unknown-model
 * errors as 400 too, so model-shaped 400 bodies are also retried.
 */
export function shouldFallback(status: number, body: string): boolean {
  if (status === 404 || status === 408 || status === 429) return true;
  if (status >= 500 && status <= 599) return true;
  if (status === 400 && /model|endpoint|decommission/i.test(body)) return true;
  return false;
}

function truncate(text: string, max = 300): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

/**
 * Calls Groq with a 30s timeout, walking the model list on retryable failures.
 * Client-safe: `error` is always generic (never leaks model ids); `detail`
 * is server-log only. After Groq models are exhausted, tries the free
 * no-key Pollinations fallback (OpenAI-compatible) once.
 */
export async function groqChat(options: GroqChatOptions): Promise<GroqResult> {
  const GENERIC_BUSY = "AI service is busy. Please try again in a minute.";
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    return {
      ok: false,
      status: 500,
      error: MISSING_KEY_MESSAGE,
      detail: "GROQ_API_KEY is not set in the server environment",
      timedOut: false,
      missingKey: true,
    };
  }

  const models = options.models ?? pickModels(options.messages);
  let lastError = GENERIC_BUSY;
  let lastDetail = "No model produced a completion";
  let lastStatus = 503;
  let timedOut = false;

  for (const model of models) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);
    try {
      const response = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: options.messages,
          max_tokens: options.maxTokens ?? 1024,
          temperature: options.temperature ?? 0.4,
          ...(options.json ? { response_format: { type: "json_object" } } : {}),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        lastError = GENERIC_BUSY;
        lastDetail = `Model ${model} failed (${response.status}): ${truncate(errText)}`;
        lastStatus = response.status;
        timedOut = false;
        if (shouldFallback(response.status, errText)) continue;
        return {
          ok: false,
          status: response.status,
          error: lastError,
          detail: lastDetail,
          timedOut: false,
          missingKey: false,
        };
      }

      const data = (await response.json().catch(() => null)) as {
        choices?: { message?: { content?: unknown } }[];
        error?: { message?: string };
      } | null;

      if (data?.error) {
        lastError = GENERIC_BUSY;
        lastDetail = `Model ${model} error: ${truncate(data.error.message ?? "unknown error")}`;
        lastStatus = 502;
        timedOut = false;
        continue;
      }

      const content = extractText(data?.choices?.[0]?.message?.content);
      if (!content || !content.trim()) {
        lastError = GENERIC_BUSY;
        lastDetail = `Model ${model} returned no content`;
        lastStatus = 502;
        timedOut = false;
        continue;
      }

      return { ok: true, content, model };
    } catch (err) {
      const aborted = controller.signal.aborted;
      timedOut = aborted;
      lastStatus = aborted ? 504 : 502;
      lastError = aborted ? TIMEOUT_MESSAGE : GENERIC_BUSY;
      lastDetail = aborted
        ? `Model ${model} timed out`
        : `Model ${model} network error: ${err instanceof Error ? err.message : "fetch failed"}`;
      // A timeout means Groq is unreachable; retrying the next model only delays.
      if (aborted) break;
    } finally {
      clearTimeout(timer);
    }
  }

  // Free no-key fallback: Pollinations (OpenAI-compatible). Tried once after
  // Groq is exhausted or unreachable, so vision/text still works with no key.
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);
    try {
      const response = await fetch(POLLINATIONS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai",
          messages: options.messages,
          max_tokens: options.maxTokens ?? 1024,
          temperature: options.temperature ?? 0.4,
          ...(options.json ? { response_format: { type: "json_object" } } : {}),
        }),
        signal: controller.signal,
      });
      if (response.ok) {
        const data = (await response.json().catch(() => null)) as {
          choices?: { message?: { content?: unknown } }[];
        } | null;
        const content = extractText(data?.choices?.[0]?.message?.content);
        if (content && content.trim()) {
          return { ok: true, content, model: "pollinations-openai" };
        }
        lastDetail = "Pollinations fallback returned no content";
      } else {
        const errText = await response.text().catch(() => "");
        lastDetail = `Pollinations fallback failed (${response.status}): ${truncate(errText)}`;
      }
    } finally {
      clearTimeout(timer);
    }
  } catch (err) {
    lastDetail =
      `Pollinations fallback network error: ${err instanceof Error ? err.message : "fetch failed"}`;
  }

  return {
    ok: false,
    status: lastStatus,
    error: timedOut ? TIMEOUT_MESSAGE : lastError,
    detail: lastDetail,
    timedOut,
    missingKey: false,
  };
}

/** Removes ```json / ``` fences and stray prose so JSON.parse has a chance. */
export function stripJsonFences(text: string): string {
  const fenced = text.match(/```(?:json|JSON)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text;
  const trimmed = body.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) return trimmed.slice(start, end + 1);
  const listStart = trimmed.indexOf("[");
  const listEnd = trimmed.lastIndexOf("]");
  if (listStart !== -1 && listEnd !== -1 && listEnd > listStart) {
    return trimmed.slice(listStart, listEnd + 1);
  }
  return trimmed;
}

/** JSON.parse that never throws — returns null instead. */
export function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(stripJsonFences(text)) as T;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ *
 * Response hygiene
 * ------------------------------------------------------------------ */

/** Table header words the models keep echoing from their own templates. */
const TABLE_HEADER_CELL =
  /^(symptoms?|possible causes?|causes?|severity|urgency|risks?|advice|recommendations?|next steps?|notes?|details?|item|field|value|test|unit|interpretation|status|medicine|dosage|timing|purpose|when to see a doctor|key points?|summary)$/i;

/** `|---|`, `|--|`, `---|---`, `| :--: |`, `---`. */
const TABLE_SEPARATOR_LINE = /^[\s|:]*(?:-{2,}[\s|:]*)+$/;

/** Lines that echo the route's own instruction template back at the user. */
const INSTRUCTION_ECHO_LINE =
  /^\s*(system (prompt|message|instructions?)|instructions?|output format|template|prompt template|safety rules?)\s*[:\-–]/i;

function isTableSeparator(line: string): boolean {
  return TABLE_SEPARATOR_LINE.test(line);
}

function isHeaderRow(line: string): boolean {
  if (!line.includes("|")) return false;
  const cells = line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
  return cells.length > 1 && cells.every((cell) => cell !== "" && TABLE_HEADER_CELL.test(cell));
}

/**
 * Reads the contiguous run of pipe/separator lines starting at `start`.
 * Returns null when the run is not a markdown table (fewer than two pipe
 * lines and no separator row / header row).
 */
function readPipeRun(lines: string[], start: number): { end: number; rows: string[] } | null {
  let i = start;
  let pipeLines = 0;
  let sawSeparator = false;
  while (i < lines.length) {
    const line = lines[i];
    if (line === "") break;
    if (isTableSeparator(line)) {
      sawSeparator = true;
      i += 1;
      continue;
    }
    if (line.includes("|")) {
      pipeLines += 1;
      i += 1;
      continue;
    }
    break;
  }
  if (pipeLines < 2) return null;
  const rows = lines.slice(start, i);
  const firstPipeRow = rows.find((line) => line.includes("|")) ?? "";
  if (!sawSeparator && !isHeaderRow(firstPipeRow)) return null;
  return { end: i, rows };
}

/** `| Dolo 650 | 2 times a day |` -> `Dolo 650 — 2 times a day`. */
function tableRowToText(row: string): string {
  return row
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim())
    .filter((cell) => cell !== "")
    .join(" — ");
}

/**
 * Strips template artifacts from a model reply before it is stored or rendered:
 * markdown table scaffolding (separator rows, stray `| Symptom |` header rows),
 * echoed instruction lines, and runs of blank lines. Table *values* survive —
 * they are re-emitted as plain "cell — cell" lines. Plain paragraphs, bullets
 * and headings are left untouched.
 */
export function sanitizeReply(text: string): string {
  if (!text) return "";
  const lines = text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim());
  const out: string[] = [];
  let blankPending = false;

  const push = (line: string) => {
    if (line === "") {
      // Collapse any run of blank lines into a single one, and drop leading blanks.
      if (out.length === 0 || blankPending) return;
      blankPending = true;
      out.push("");
      return;
    }
    blankPending = false;
    out.push(line);
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const run = readPipeRun(lines, i);
    if (run) {
      // Markdown table block: drop separator/header rows, keep the values.
      for (const row of run.rows) {
        if (isTableSeparator(row) || isHeaderRow(row)) continue;
        const text = tableRowToText(row);
        if (text) push(text);
      }
      i = run.end - 1;
      continue;
    }
    if (
      line === "" ||
      !(isTableSeparator(line) || isHeaderRow(line) || INSTRUCTION_ECHO_LINE.test(line))
    ) {
      push(line);
    }
  }

  return out.join("\n").trim();
}
