export const metadata = {
  title: "AI Medicine Identifier | Swasthya Setu",
  description: "Photograph a pill to identify it and check uses and side effects.",
};

export default function Page() {
  return (
    <>
      <main id="main" className="analyzer-section">
          <div className="az-card">
            <span className="az-step-label"><span className="step-num">1</span> Photograph the medicine</span>
            <h2 className="az-h">Photo of the pill or tablet</h2>
            <p className="az-sub">Place it on a plain, well-lit background. Include any imprint or score line if visible.</p>

            <div className="upload-zone" id="upload-zone" role="button" tabIndex={0} aria-label="Upload or drop a medicine photo">
              <div className="upload-zone-icon">
                <span className="material-symbols-outlined">medication</span>
              </div>
              <h3>Drag &amp; drop your pill photo here</h3>
              <p className="uz-hint">or take a photo / choose a file</p>
              <input type="file" id="pill-file" accept="image/*" hidden />
              <input type="file" id="pill-camera" accept="image/*" capture="environment" hidden />
              <div className="uz-actions">
                <button type="button" className="btn btn-secondary" id="btn-choose">
                  <span className="material-symbols-outlined">folder_open</span> Choose file
                </button>
                <button type="button" className="btn btn-ghost" id="btn-camera">
                  <span className="material-symbols-outlined">photo_camera</span> Use camera
                </button>
              </div>
              <div className="uz-thumb" id="uz-thumb">
                <img id="uz-img" alt="Selected medicine preview" hidden />
                <div className="uz-file-name" id="uz-file-name" hidden></div>
              </div>
            </div>

            <button type="button" className="btn btn-ai btn-lg" id="btn-analyze" disabled>
              <span className="material-symbols-outlined">auto_awesome</span> Identify medicine
            </button>

            <div className="processing-panel" id="processing" aria-live="polite">
              <div className="processing-head">
                <span className="spinner" aria-hidden="true"></span>
                <span className="processing-status" id="proc-status">Analyzing shape &amp; imprint…</span>
              </div>
            </div>
          </div>

          {/*Results*/}
          <div className="az-card result-card" id="result" hidden>
            <div className="result-card-header">
              <div>
                <strong>Top matches</strong>
                <div className="result-meta">
                  <span><span className="material-symbols-outlined" style={{ fontSize: "16px", verticalAlign: "-3px" }}>search</span> Ranked by confidence</span>
                </div>
              </div>
              <span className="badge badge-ai"><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>auto_awesome</span> AI</span>
            </div>
            <div className="result-card-body">
              <div className="result-summary" id="result-summary"></div>
              <div className="grid-2" id="match-list" style={{ marginTop: "var(--space-5)" }}></div>

              <div className="card-footer" style={{ margin: "var(--space-6) calc(-1 * var(--space-6)) calc(-1 * var(--space-6))", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <button type="button" className="btn btn-ghost" id="btn-restart">
                  <span className="material-symbols-outlined">refresh</span> Identify another
                </button>
              </div>
            </div>
          </div>
        </main>
    </>
  );
}
