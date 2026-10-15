"use client";

import React from "react";
import Link from "next/link";
import { Markdown } from "@/components/shared/markdown";

const MAX_FREE_MESSAGES = 3;

interface PreviewMsg {
  id: number;
  sender: "user" | "ai";
  text: string;
}

/**
 * Landing preview widget — REAL API version. Free-form chatbox (type any
 * question) with the 3-free-messages gate; calls POST /api/chatbot for live
 * answers with loading / error / empty states. Never exposes the API key.
 */
export function ChatbotPreview() {
  const [used, setUsed] = React.useState(0);
  const [messages, setMessages] = React.useState<PreviewMsg[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const idRef = React.useRef(1);

  const gated = used >= MAX_FREE_MESSAGES;

  React.useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, gated]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || gated || loading) return;
    setError(null);
    const userMsg: PreviewMsg = { id: idRef.current++, sender: "user", text: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Backend only accepts role "user" (prompt-injection guard);
          // map full history to user turns to preserve context.
          messages: next.map((m) => ({
            role: "user",
            content: m.text,
          })),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
      const reply: string = data?.reply || "Sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { id: idRef.current++, sender: "ai", text: reply }]);
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
    setInput("");
  }

  return (
    <>
      <div
        className="pw-messages"
        ref={containerRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation"
      >
        {messages.length === 0 && !loading && (
          <div className="pw-msg ai">
            Ask me anything about symptoms, nutrition, medicines or hospitals — I reply live.
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`pw-msg ${msg.sender}`}>
            {msg.sender === "ai" ? <Markdown text={msg.text} /> : msg.text}
          </div>
        ))}
        {loading && <div className="pw-msg ai">Typing…</div>}
        {error && (
          <div className="pw-msg ai" role="alert">
            {error}{" "}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setError(null);
                const lastUser = [...messages].reverse().find((m) => m.sender === "user");
                if (lastUser) {
                  setMessages((prev) => prev.filter((m) => m.id !== lastUser.id));
                  void send(lastUser.text);
                }
              }}
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {gated ? (
        <div className="pw-gate" aria-live="polite">
          <p>You&apos;ve used your {MAX_FREE_MESSAGES} free messages. Sign up free to keep chatting.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/dashboard" className="btn btn-primary btn-sm">
              Sign up free
            </Link>
            <Link href="/chatbot" className="btn btn-ghost btn-sm">
              Open full chat
            </Link>
          </div>
        </div>
      ) : (
        <form className="pw-input-area" onSubmit={handleSubmit}>
          <label htmlFor="pw-chat-input" className="sr-only">
            Type your health question
          </label>
          <input
            id="pw-chat-input"
            className="pw-input"
            type="text"
            autoComplete="off"
            placeholder="Ask a health question…"
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="btn btn-ai btn-icon pw-send"
            type="submit"
            aria-label="Send message"
            disabled={loading || !input.trim()}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              send
            </span>
          </button>
        </form>
      )}
    </>
  );
}
