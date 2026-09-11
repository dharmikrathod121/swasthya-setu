"use client";

import React from "react";
import Link from "next/link";

const EXAMPLE_PROMPTS = [
  {
    icon: "chat_bubble",
    label: "What should I do for a fever of 102\u00B0F?",
    reply:
      "For a fever of 102\u00B0F (38.9\u00B0C): rest, sip fluids, and take paracetamol if suitable. Seek care if it lasts over 3 days, or if you have trouble breathing, a rash, or confusion. This is general info, not a diagnosis.",
  },
  {
    icon: "chat_bubble",
    label: "Which hospitals near me have an ICU?",
    reply:
      "Open the Hospitals page and filter by ICU availability to see major facilities in Rajkot with live status and distance. For an emergency, call 108 immediately.",
  },
  {
    icon: "chat_bubble",
    label: "Is this medicine safe during pregnancy?",
    reply:
      "Pregnancy safety depends on the medicine and trimester. Use the Medicine ID tool by name or photo, and always confirm with your doctor or a free doctor chat before taking anything.",
  },
];

const MAX_FREE_MESSAGES = 3;

export function PromptWall() {
  return (
    <section className="landing-section prompt-wall">
      <div className="section-head reveal">
        <h2>Try the AI — no sign up needed</h2>
        <p>
          Tap a question to see how Swasthya AI helps. You get 3 free
          messages, then we&apos;ll ask you to sign up.
        </p>
      </div>

      <div className="pw-card reveal">
        <div className="pw-head">
          <span className="pw-bot-avatar">
            <span className="material-symbols-outlined">robot_2</span>
          </span>
          <div>
            <h3>Swasthya AI Assistant</h3>
            <p>Demo preview &middot; not a substitute for a doctor</p>
          </div>
        </div>
        <div className="pw-body">
          <PromptWallChat />
        </div>
      </div>
    </section>
  );
}

function PromptWallChat() {
  return (
    <PromptWallChatInner examples={EXAMPLE_PROMPTS} maxFree={MAX_FREE_MESSAGES} />
  );
}

interface PromptWallChatInnerProps {
  examples: typeof EXAMPLE_PROMPTS;
  maxFree: number;
}

function PromptWallChatInner({
  examples,
  maxFree,
}: PromptWallChatInnerProps) {
  const [used, setUsed] = React.useState(0);
  const [messages, setMessages] = React.useState<
    { id: number; text: string; sender: "user" | "ai" }[]
  >([]);
  const [gateVisible, setGateVisible] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesEndRef.current && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, gateVisible]);

  function handleExampleClick(
    label: string,
    reply: string,
    idx: number
  ) {
    if (used >= maxFree) return;

    const newUserMsg = {
      id: Date.now() + idx,
      text: label,
      sender: "user" as const,
    };
    const newAiMsg = {
      id: Date.now() + idx + 1,
      text: reply,
      sender: "ai" as const,
    };

    setMessages((prev) => [...prev, newUserMsg, newAiMsg]);
    const nextUsed = used + 1;
    setUsed(nextUsed);
    if (nextUsed >= maxFree) {
      setGateVisible(true);
    }
  }

  return (
    <>
      <div
        className="pw-messages"
        ref={containerRef}
        aria-live="polite"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`pw-msg ${msg.sender}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="pw-examples">
        {examples.map((ex, idx) => (
          <PromptWallExampleButton
            key={idx}
            example={ex}
            index={idx}
            disabled={used >= maxFree}
            onClick={handleExampleClick}
          />
        ))}
      </div>

      {gateVisible && (
        <div className="pw-gate" aria-live="polite">
          <p>
            You&apos;ve used your {maxFree} free messages. Sign up free
            to keep chatting.
          </p>
          <Link href="/dashboard" className="btn btn-primary btn-sm">
            Sign up free
          </Link>
        </div>
      )}
    </>
  );
}

interface PromptWallExampleButtonProps {
  example: {
    icon: string;
    label: string;
    reply: string;
  };
  index: number;
  disabled: boolean;
  onClick: (label: string, reply: string, idx: number) => void;
}

function PromptWallExampleButton({
  example,
  index,
  disabled,
  onClick,
}: PromptWallExampleButtonProps) {
  return (
    <button
      type="button"
      className="pw-example"
      disabled={disabled}
      onClick={() => onClick(example.label, example.reply, index)}
    >
      <span className="material-symbols-outlined">
        {example.icon}
      </span>{" "}
      {example.label}
    </button>
  );
}
