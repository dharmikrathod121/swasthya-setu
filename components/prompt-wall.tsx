"use client";

import { ChatbotPreview } from "@/components/chatbot-preview";

export function PromptWall() {
  return (
    <section className="landing-section prompt-wall">
      <div className="section-head reveal">
        <h2>Try the AI - no sign up needed</h2>
        <p>Ask anything live. You get 3 free messages, then we will ask you to sign up.</p>
      </div>
      <div className="pw-card reveal">
        <div className="pw-head">
          <span className="pw-bot-avatar">
            <span className="material-symbols-outlined">robot_2</span>
          </span>
          <div>
            <h3>Swasthya AI Assistant</h3>
            <p>Live AI - not a substitute for a doctor</p>
          </div>
        </div>
        <div className="pw-body">
          <ChatbotPreview />
        </div>
      </div>
    </section>
  );
}
