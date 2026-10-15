"use client";

import React from "react";
import Link from "next/link";
import { Markdown } from "@/components/shared/markdown";

type Role = "user" | "assistant";
interface UIMessage {
  id: number;
  role: Role;
  content: string;
  imageUrl?: string;
}

const DEFAULT_SUGGESTIONS = [
  "Symptoms of dengue?",
  "How much water daily?",
  "Exercise with a cold?",
  "Sleep hygiene tips",
];

const WELCOME = "Hello! I'm your AI health assistant. Ask me about symptoms, nutrition, sleep or general wellness. What would you like to know today?";

interface ChatbotChatProps {
  suggestions?: string[];
  /** Number of free guest messages before showing the sign-in gate. Use Infinity for unlimited. */
  maxFree?: number;
  compact?: boolean;
  initialQuery?: string;
}

export function ChatbotChat({ suggestions = DEFAULT_SUGGESTIONS, maxFree = 3, initialQuery }: ChatbotChatProps) {
  const [messages, setMessages] = React.useState<UIMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [used, setUsed] = React.useState(0);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const logRef = React.useRef<HTMLDivElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const idRef = React.useRef(1);

  /** Downscale to max 1024px (JPEG) so vision payloads stay small; falls back to original. */
  function compressImage(dataUrl: string): Promise<string> {
    return new Promise((resolve) => {
      try {
        const img = new Image();
        img.onload = () => {
          try {
            const max = 1024;
            const scale = Math.min(1, max / Math.max(img.width, img.height));
            if (scale >= 1) {
              resolve(dataUrl);
              return;
            }
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              resolve(dataUrl);
              return;
            }
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", 0.8));
          } catch {
            resolve(dataUrl);
          }
        };
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
      } catch {
        resolve(dataUrl);
      }
    });
  }

  function pickImage(file: File | undefined | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const raw = String(reader.result || "");
      if (!raw) return;
      const compressed = await compressImage(raw);
      setImageUrl(compressed);
    };
    reader.readAsDataURL(file);
  }

  const gated = used >= maxFree;
  const sentInitialRef = React.useRef(false);

  React.useEffect(() => {
    if (!sentInitialRef.current && initialQuery && initialQuery.trim()) {
      sentInitialRef.current = true;
      void send(initialQuery.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  React.useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function send(text: string, imageOverride?: string | null) {
    const trimmed = text.trim();
    const attached = imageOverride !== undefined ? imageOverride : imageUrl;
    if ((!trimmed && !attached) || loading || gated) return;
    setError(null);
    const userMsg: UIMessage = {
      id: idRef.current++,
      role: "user",
      content: trimmed || (attached ? "Please analyze this image." : ""),
      ...(attached ? { imageUrl: attached } : {}),
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setImageUrl(null);
    setLoading(true);
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => {
            // Send images as OpenAI-style parts; backend picks vision models.
            if (m.role === "user" && m.imageUrl) {
              return {
                role: "user",
                content: [
                  ...(m.content ? [{ type: "text", text: m.content }] : []),
                  { type: "image_url", image_url: { url: m.imageUrl } },
                ],
              };
            }
            return { role: "user", content: m.content };
          }),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }
      const reply: string = data?.reply || "Sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { id: idRef.current++, role: "assistant", content: reply }]);
      setUsed((u) => u + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void send(input);
  }

  const remaining = Math.max(0, maxFree - used);

  return (
    <div className="chat-container">
      <div className="ais-chat-head">
        <div className="ais-chat-head-info">
          <span className="ais-chat-avatar material-symbols-outlined" aria-hidden="true">
            smart_toy
          </span>
          <div>
            <div className="ais-chat-title">Swasthya AI Assistant</div>
            <div className="ais-chat-status">
              <span className="pulse-dot" aria-hidden="true"></span> Online
            </div>
          </div>
        </div>
        {Number.isFinite(maxFree) && (
          <span className="ais-free-pill">
            <span className="material-symbols-outlined ais-badge-icon" aria-hidden="true">
              chat
            </span>
            <span>{remaining}</span> free messages
          </span>
        )}
      </div>

      <div className="chat-messages" ref={logRef} role="log" aria-live="polite" aria-label="Conversation">
        {messages.length === 0 && !loading && (
          <div className="chat-bubble chat-bubble-ai">{WELCOME}</div>
        )}
        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="chat-bubble chat-bubble-user">
              {m.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.imageUrl}
                  alt="Attached"
                  style={{ maxWidth: 180, borderRadius: 8, marginBottom: m.content ? 6 : 0 }}
                />
              )}
              {m.content}
            </div>
          ) : (
            <div key={m.id} className="chat-bubble chat-bubble-ai">
              <Markdown text={m.content} />
            </div>
          )
        )}
        {loading && (
          <div className="chat-bubble chat-bubble-ai" aria-label="Assistant is typing">
            Typing…
          </div>
        )}
        {error && (
          <div className="chat-bubble chat-bubble-ai" role="alert">
            {error}{" "}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setError(null);
                const lastUser = [...messages].reverse().find((m) => m.role === "user");
                if (lastUser) {
                  // Retry: drop the failed turn's trailing state and resend.
                  setMessages((prev) => prev.filter((m) => m.id !== lastUser.id));
                  void send(lastUser.content, lastUser.imageUrl ?? null);
                }
              }}
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {gated ? (
        <div className="ais-gate" role="region" aria-label="Sign in to continue chatting">
          <div className="ais-gate-head">
            <span className="ais-gate-icon material-symbols-outlined" aria-hidden="true">
              lock
            </span>
            <div>
              <h3>You&apos;ve used your {maxFree} free messages</h3>
              <p>Sign in to keep chatting with the AI assistant. No real account is created — this is a demo.</p>
            </div>
          </div>
          <div className="ais-gate-actions">
            <Link className="btn btn-primary" href="/dashboard">
              Sign in to continue
            </Link>
            <Link className="btn btn-ghost" href="/ai-services">
              Back to AI Tools
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="ais-quick-row">
            {suggestions.map((s) => (
              <button
                key={s}
                className="ais-quick"
                type="button"
                disabled={loading}
                onClick={() => void send(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <form className="chat-input-area" onSubmit={handleSubmit}>
            <label htmlFor="ais-chat-input" className="sr-only">
              Type your health question
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              aria-label="Attach an image"
              onChange={(e) => {
                pickImage(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <button
              className="btn btn-ghost btn-icon"
              type="button"
              aria-label="Attach an image"
              disabled={loading}
              onClick={() => fileRef.current?.click()}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                attach_file
              </span>
            </button>
            {imageUrl && (
              <span style={{ position: "relative", display: "inline-flex" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Attachment preview"
                  style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 8 }}
                />
                <button
                  type="button"
                  aria-label="Remove attachment"
                  onClick={() => setImageUrl(null)}
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                    lineHeight: "20px",
                  }}
                >
                  ×
                </button>
              </span>
            )}
            <input
              type="text"
              id="ais-chat-input"
              className="chat-input ais-chat-input"
              placeholder="Ask a health question..."
              autoComplete="off"
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="btn btn-ai btn-icon ais-chat-send"
              type="submit"
              aria-label="Send message"
              disabled={loading || (!input.trim() && !imageUrl)}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                send
              </span>
            </button>
          </form>
        </>
      )}
    </div>
  );
}
