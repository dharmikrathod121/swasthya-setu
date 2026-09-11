import Link from "next/link";
import { AppLayout } from "@/components/app-layout";

export default function ChatPage() {
  return (
    <AppLayout>
      <div className="container section" style={{ paddingTop: "var(--space-8)" }}>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/dashboard">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <span>Free Doctor Chat</span>
        </nav>

        <div className="section-header reveal">
          <div className="section-eyebrow">Free Guidance</div>
          <h1>Chat with a Doctor</h1>
          <p>Get free medical guidance from certified doctors. No appointment needed — just ask your question.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 reveal">
            <div className="chat-container">
              <div className="card-header flex items-center justify-between" style={{ background: "var(--color-surface-elevated)", borderBottom: "1px solid var(--border-subtle)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--color-primary-soft)" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--color-primary)" }}>person</span>
                  </div>
                  <div>
                    <div className="font-bold text-sm">Dr. R. K. Sharma</div>
                    <div className="flex items-center gap-1 text-xs" style={{ color: "var(--color-success)" }}>
                      <span className="pulse-dot"></span> Online now
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-icon btn-ghost btn-sm" aria-label="Voice call">
                    <span className="material-symbols-outlined">call</span>
                  </button>
                  <button className="btn btn-icon btn-ghost btn-sm" aria-label="End chat">
                    <span className="material-symbols-outlined">call_end</span>
                  </button>
                </div>
              </div>

              <div className="chat-messages" id="chat-messages">
                <div className="chat-message chat-message-doctor">
                  <div className="chat-message-avatar" style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)" }}>Dr</div>
                  <div className="chat-message-content">
                    Hello! I&apos;m Dr. Sharma. How can I help you today? Please describe your symptoms or concerns, and I&apos;ll do my best to guide you.
                  </div>
                </div>
              </div>

              <div className="chat-input-area">
                <button className="btn btn-icon btn-ghost" aria-label="Attach file">
                  <span className="material-symbols-outlined">attach_file</span>
                </button>
                <input type="text" id="chat-input" className="chat-input" placeholder="Type your message..." aria-label="Chat message" />
                <button id="chat-send" className="btn btn-primary btn-icon" aria-label="Send message">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky" style={{ top: "calc(var(--nav-height) + var(--space-6))" }}>
              <div className="sidebar-widget mb-6 reveal">
                <div className="sidebar-widget-header">
                  <h4 className="font-bold">Doctor Info</h4>
                </div>
                <div className="sidebar-widget-body flex flex-col items-center text-center">
                  <div className="doctor-avatar-placeholder mb-3" style={{ width: 96, height: 96 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48 }}>person</span>
                  </div>
                  <h3 className="text-lg font-bold">Dr. R. K. Sharma</h3>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>Cardiologist</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>AIIMS, New Delhi</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#F59E0B", fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-sm font-bold">4.9</span>
                    <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>(128 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="sidebar-widget reveal">
                <div className="sidebar-widget-header">
                  <h4 className="font-bold">Quick Actions</h4>
                </div>
                <div className="sidebar-widget-body flex flex-col gap-2">
                  <Link href="/appointment" className="btn btn-secondary w-full">
                    <span className="material-symbols-outlined">event</span> Book Appointment
                  </Link>
                  <button className="btn btn-ghost w-full">
                    <span className="material-symbols-outlined">phone</span> Voice Call
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}
