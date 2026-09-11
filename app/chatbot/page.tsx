import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export default function ChatbotPage() {
  return (
    <>
      <PublicHeader />
      <main id="main">
        <section className="ais-section" style={{ paddingTop: "var(--space-8)" }}>
          <div className="ais-banner" role="note" aria-label="Medical disclaimer">
            <span className="ais-banner-icon material-symbols-outlined" aria-hidden="true">warning</span>
            <p>Not medical advice — for emergencies call <strong>108</strong>. This assistant offers general guidance only.</p>
          </div>

          <div className="ais-chat-wrap">
            <div className="chat-container">
              <div className="ais-chat-head">
                <div className="ais-chat-head-info">
                  <span className="ais-chat-avatar material-symbols-outlined" aria-hidden="true">smart_toy</span>
                  <div>
                    <div className="ais-chat-title">Swasthya AI Assistant</div>
                    <div className="ais-chat-status"><span className="pulse-dot" aria-hidden="true"></span> Online</div>
                  </div>
                </div>
                <span className="ais-free-pill" id="free-pill">
                  <span className="material-symbols-outlined ais-badge-icon" aria-hidden="true">chat</span>
                  <span id="free-count">3</span> free messages
                </span>
              </div>

              <div className="chat-messages" id="ais-chat-log" role="log" aria-live="polite" aria-label="Conversation">
                <div className="chat-bubble chat-bubble-ai">
                  Hello! I&apos;m your AI health assistant. Ask me about symptoms, nutrition, sleep or general wellness. What would you like to know today?
                </div>
              </div>

              <div className="ais-gate" id="chat-gate" role="region" aria-label="Sign in to continue chatting" hidden>
                <div className="ais-gate-head">
                  <span className="ais-gate-icon material-symbols-outlined" aria-hidden="true">lock</span>
                  <div>
                    <h3>You&apos;ve used your 3 free messages</h3>
                    <p>Sign in to keep chatting with the AI assistant. No real account is created — this is a demo.</p>
                  </div>
                </div>
                <div className="ais-gate-actions">
                  <button className="btn btn-primary" id="chat-gate-btn" type="button">Sign in to continue</button>
                  <Link className="btn btn-ghost" href="/ai-services">Back to AI Tools</Link>
                </div>
              </div>

              <div className="ais-quick-row" id="quick-row">
                <button className="ais-quick" type="button">Symptoms of dengue?</button>
                <button className="ais-quick" type="button">How much water daily?</button>
                <button className="ais-quick" type="button">Exercise with a cold?</button>
                <button className="ais-quick" type="button">Sleep hygiene tips</button>
              </div>

              <div className="chat-input-area">
                <label htmlFor="ais-chat-input" className="sr-only">Type your health question</label>
                <input type="text" id="ais-chat-input" className="chat-input ais-chat-input" placeholder="Ask a health question..." autoComplete="off" />
                <button id="ais-chat-send" className="btn btn-ai btn-icon ais-chat-send" type="button" aria-label="Send message">
                  <span className="material-symbols-outlined" aria-hidden="true">send</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
