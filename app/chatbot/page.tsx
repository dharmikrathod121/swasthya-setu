import { Suspense } from "react";
import { AppLayout } from "@/components/app-layout";
import { ChatbotPageInner } from "./chatbot-inner";

export default function ChatbotPage() {
  // NOTE: no PublicHeader here — AppLayout renders the signed-in topbar +
  // sidebar when logged in, and the public header for guests.
  return (
    <AppLayout>
      <div id="main">
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
      </div>
    </AppLayout>
  );
}
