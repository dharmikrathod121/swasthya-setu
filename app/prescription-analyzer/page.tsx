import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export const metadata = {
  title: "AI Prescription Analyzer | Swasthya Setu",
  description: "Scan a prescription to understand dosages, timing and interactions.",
};

export default function Page() {
  return (
    <>
      <PublicHeader />
      <main id="main" className="analyzer-section">
          <div className="az-card">
            <span className="az-step-label"><span className="step-num">1</span> Upload prescription</span>
            <h2 className="az-h">Photo of your prescription</h2>
            <p className="az-sub">Clear, well-lit photos of printed or handwritten prescriptions work best.</p>

            <div className="upload-zone" id="upload-zone" role="button" tabIndex={0} aria-label="Upload or drop a prescription photo">
              <div className="upload-zone-icon">
                <span className="material-symbols-outlined">medical_information</span>
              </div>
              <h3>Drag &amp; drop your prescription here</h3>
              <p className="uz-hint">or take a photo / choose a file</p>
              <input type="file" id="rx-file" accept="image/*" hidden />
              <input type="file" id="rx-camera" accept="image/*" capture="environment" hidden />
              <div className="uz-actions">
                <button type="button" className="btn btn-secondary" id="btn-choose">
                  <span className="material-symbols-outlined">folder_open</span> Choose file
                </button>
                <button type="button" className="btn btn-ghost" id="btn-camera">
                  <span className="material-symbols-outlined">photo_camera</span> Use camera
                </button>
              </div>
              <div className="uz-thumb" id="uz-thumb">
                <img id="uz-img" alt="Selected prescription preview" hidden />
                <div className="uz-file-name" id="uz-file-name" hidden></div>
              </div>
            </div>

            <button type="button" className="btn btn-ai btn-lg" id="btn-analyze" disabled>
              <span className="material-symbols-outlined">auto_awesome</span> Analyze prescription
            </button>

            <div className="processing-panel" id="processing" aria-live="polite">
              <div className="processing-head">
                <span className="spinner" aria-hidden="true"></span>
                <span className="processing-status" id="proc-status">Reading prescription…</span>
              </div>
            </div>
          </div>

          {/*Results*/}
          <div className="az-card result-card" id="result" hidden>
            <div className="result-card-header">
              <div>
                <strong>Prescription decoded</strong>
                <div className="result-meta">
                  <span><span className="material-symbols-outlined" style={{ fontSize: "16px", verticalAlign: "-3px" }}>pill</span> <span id="rx-count">0</span> medicines</span>
                  <span id="result-date"></span>
                </div>
              </div>
              <span className="badge badge-ai"><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>auto_awesome</span> AI</span>
            </div>
            <div className="result-card-body">
              <div className="result-summary" id="result-summary"></div>

              <h3 className="result-section-title" style={{ marginTop: "var(--space-6)" }}>Medicines explained</h3>
              <div id="drug-list"></div>

              <h3 className="result-section-title" style={{ marginTop: "var(--space-8)" }}>Interaction warnings</h3>
              <div id="interaction-list"></div>

              <div className="card-footer" style={{ margin: "var(--space-6) calc(-1 * var(--space-6)) calc(-1 * var(--space-6))", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <button type="button" className="btn btn-ghost" id="btn-restart">
                  <span className="material-symbols-outlined">refresh</span> Analyze another
                </button>
              </div>
            </div>
          </div>
        </main>
      <PublicFooter />
    </>
  );
}
