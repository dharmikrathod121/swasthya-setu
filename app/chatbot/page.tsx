import { Suspense } from "react";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { ChatbotPageInner } from "./chatbot-inner";

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
            <Suspense fallback={<div>Loading chat…</div>}>
              <ChatbotPageInner />
            </Suspense>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
