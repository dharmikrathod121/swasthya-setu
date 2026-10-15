import type { Metadata } from "next";
import { AiServicesGrid } from "./ai-services-grid";

export const metadata: Metadata = {
  title: "AI Health Tools | Swasthya Setu",
  description: "Understand your reports, prescriptions, medicines and food with AI health tools.",
};

export default function Page() {
  return (
    <div id="main">
      {/*Hero*/}
      <section className="ais-hero">
        <div className="ais-hero-inner">
          <span className="section-eyebrow">AI-Powered Health</span>
          <h1>AI Health Tools</h1>
          <p>Understand your reports, prescriptions, medicines and food — and chat with a health assistant. Preview the open tools below; sign in for full access to the analyzers.</p>
        </div>
      </section>

      {/*Tool grid*/}
      <section className="ais-section">
        <div className="section-header">
          <h2>Browse the tools</h2>
          <p>Five AI tools to help you make sense of your health information. Two require sign-in; the rest are open for a quick preview.</p>
        </div>

        <AiServicesGrid />
      </section>
    </div>
  );
}
