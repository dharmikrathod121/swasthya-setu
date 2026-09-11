import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export const metadata = {
  title: "AI Medical Report Analyzer | Swasthya Setu",
  description: "Upload a lab report and get plain-language explanations of your results.",
};

export default function Page() {
  return (
    <>
      <PublicHeader />
      <main id="main" className="analyzer-section">
          <div className="az-card">
            <span className="az-step-label"><span className="step-num">1</span> Upload your report</span>
            <h2 className="az-h">Drop a file or snap a photo</h2>
            <p className="az-sub">Supports PDF and images (JPG, PNG). Works best with clear, well-lit scans.</p>

            <div className="upload-zone" id="upload-zone" role="button" tabIndex={0} aria-label="Upload or drop a medical report file">
              <div className="upload-zone-icon">
                <span className="material-symbols-outlined">upload_file</span>
              </div>
              <h3>Drag &amp; drop your report here</h3>
              <p className="uz-hint">or choose a file from your device</p>
              <input type="file" id="report-file" accept="image/*,application/pdf" hidden />
              <div className="uz-actions">
                <button type="button" className="btn btn-secondary" id="btn-choose">
                  <span className="material-symbols-outlined">folder_open</span> Choose file
                </button>
                <button type="button" className="btn btn-ghost" id="btn-camera">
                  <span className="material-symbols-outlined">photo_camera</span> Use camera
                </button>
                <input type="file" id="report-camera" accept="image/*" capture="environment" hidden />
              </div>
              <div className="uz-thumb" id="uz-thumb">
                <img id="uz-img" alt="Selected report preview" hidden />
                <div className="uz-file-name" id="uz-file-name" hidden></div>
              </div>
            </div>

            <button type="button" className="btn btn-ai btn-lg" id="btn-analyze" disabled>
              <span className="material-symbols-outlined">auto_awesome</span> Analyze report
            </button>

            <div className="processing-panel" id="processing" aria-live="polite">
              <div className="processing-head">
                <span className="spinner" aria-hidden="true"></span>
                <span className="processing-status" id="proc-status">Preparing…</span>
              </div>
              <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} id="ocr-bar">
                <div className="progress-fill" id="ocr-fill"></div>
              </div>
              <div className="progress-meta">
                <span id="ocr-stage">OCR engine</span>
                <span id="ocr-pct">0%</span>
              </div>
            </div>
          </div>

          {/*Results*/}
          <div className="az-card result-card" id="result" hidden>
            <div className="result-card-header">
              <div>
                <strong>Analysis complete</strong>
                <div className="result-meta">
                  <span><span className="material-symbols-outlined" style={{ fontSize: "16px", verticalAlign: "-3px" }}>description</span> Blood Test Panel</span>
                  <span id="result-date"></span>
                </div>
              </div>
              <span className="badge badge-ai"><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>auto_awesome</span> AI</span>
            </div>
            <div className="result-card-body">
              <div className="result-summary" id="result-summary"></div>

              <div className="report-table" id="report-table" role="table" aria-label="Extracted report values">
                <div className="report-head" role="row">
                  <span role="columnheader">Test</span>
                  <span role="columnheader">Value</span>
                  <span role="columnheader">Normal range</span>
                  <span role="columnheader">Interpretation</span>
                  <span role="columnheader">Status</span>
                </div>
                {/*rows injected*/}
              </div>

              <div className="card-footer" style={{ margin: "var(--space-6) calc(-1 * var(--space-6)) calc(-1 * var(--space-6))", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <button type="button" className="btn btn-secondary" id="btn-download">
                  <span className="material-symbols-outlined">picture_as_pdf</span> Download PDF
                </button>
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
