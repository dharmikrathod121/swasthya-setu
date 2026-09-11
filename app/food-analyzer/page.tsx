export const metadata = {
  title: "Smart Food Ingredient Analyzer | Swasthya Setu",
  description: "Check a food or ingredient for allergens, additives and nutrition.",
};

export default function Page() {
  return (
    <>
      <main id="main" className="analyzer-section">
          {/*Input*/}
          <div className="az-card">
            <span className="az-step-label"><span className="step-num">1</span> Add the ingredients</span>
            <h2 className="az-h">Text or photo — your choice</h2>
            <p className="az-sub">Works best with the full ingredient list exactly as printed on the pack.</p>

            <div className="fa-tabs" role="tablist" aria-label="Input method">
              <button className="fa-tab active" id="tab-text" role="tab" aria-selected="true" aria-controls="panel-text">
                <span className="material-symbols-outlined" style={{ fontSize: "18px", verticalAlign: "-4px" }}>edit_note</span> Paste text
              </button>
              <button className="fa-tab" id="tab-photo" role="tab" aria-selected="false" aria-controls="panel-photo">
                <span className="material-symbols-outlined" style={{ fontSize: "18px", verticalAlign: "-4px" }}>photo_camera</span> Take photo
              </button>
            </div>

            <div id="panel-text" className="fa-panel" role="tabpanel" aria-labelledby="tab-text">
              <div className="input-group">
                <label className="input-label" htmlFor="ingredient-text">Ingredient list</label>
                <textarea id="ingredient-text" className="input-field" rows={5}
                  placeholder="e.g. Wheat flour, sugar, palm oil, salt, milk solids, soy lecithin, vanilla, raising agent (E500)"></textarea>
              </div>
            </div>

            <div id="panel-photo" className="fa-panel" role="tabpanel" aria-labelledby="tab-photo" hidden>
              <div className="upload-zone" id="food-upload" role="button" tabIndex={0} aria-label="Upload or drop a food label photo">
                <div className="upload-zone-icon" style={{ background: "var(--color-success-soft)", color: "var(--color-success)" }}>
                  <span className="material-symbols-outlined">nutrition</span>
                </div>
                <h3>Drag &amp; drop the label here</h3>
                <p className="uz-hint">or take a photo / choose a file</p>
                <input type="file" id="food-file" accept="image/*" hidden />
                <input type="file" id="food-camera" accept="image/*" capture="environment" hidden />
                <div className="uz-actions">
                  <button type="button" className="btn btn-secondary" id="btn-choose">
                    <span className="material-symbols-outlined">folder_open</span> Choose file
                  </button>
                  <button type="button" className="btn btn-ghost" id="btn-camera">
                    <span className="material-symbols-outlined">photo_camera</span> Use camera
                  </button>
                </div>
                <div className="uz-thumb" id="uz-thumb">
                  <img id="uz-img" alt="Selected food label preview" hidden />
                  <div className="uz-file-name" id="uz-file-name" hidden></div>
                </div>
              </div>
            </div>

            <button type="button" className="btn btn-ai btn-lg" id="btn-analyze" disabled>
              <span className="material-symbols-outlined">auto_awesome</span> Analyze ingredients
            </button>

            <div className="processing-panel" id="processing" hidden aria-live="polite">
              <div className="processing-head">
                <span className="spinner" aria-hidden="true"></span>
                <span className="processing-status" id="proc-status">Reading ingredients…</span>
              </div>
            </div>
          </div>

          {/*Result*/}
          <div className="az-card result-card" id="result" hidden>
            <div className="result-card-header">
              <div>
                <strong id="result-title">Analysis complete</strong>
                <div className="result-meta">
                  <span><span className="material-symbols-outlined" style={{ fontSize: "16px", verticalAlign: "-3px" }}>restaurant</span> <span id="result-product">Food item</span></span>
                  <span id="result-date"></span>
                </div>
              </div>
              <span className="badge badge-ai"><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>auto_awesome</span> AI</span>
            </div>
            <div className="result-card-body">
              <div className="result-summary" id="result-summary"></div>

              <div className="result-grid-2">
                <div className="donut-wrap">
                  <div className="donut" id="donut" aria-hidden="true"></div>
                  <div style={{ textAlign: "center" }}>
                    <div className="macro-grams" style={{ fontSize: "var(--text-lg)", color: "var(--color-primary)" }} id="cal-total">0 kcal</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>Estimated / serving</div>
                  </div>
                </div>
                <div className="macro-legend" id="macro-legend"></div>
              </div>

              <h3 className="result-section-title" style={{ marginTop: "var(--space-8)" }}>Allergen &amp; diet warnings</h3>
              <div className="tag-row" id="allergen-row"></div>

              <h3 className="result-section-title" style={{ marginTop: "var(--space-8)" }}>Health flags</h3>
              <div id="health-flags"></div>

              <div className="az-caution">
                <span className="material-symbols-outlined">info</span>
                <span>This is a demo based on keyword matching — not a substitute for the official label or a dietitian's advice.</span>
              </div>

              <div className="card-footer" style={{ margin: "var(--space-6) calc(-1 * var(--space-6)) calc(-1 * var(--space-6))", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <button type="button" className="btn btn-ghost" id="btn-restart">
                  <span className="material-symbols-outlined">refresh</span> Analyze another
                </button>
              </div>
            </div>
          </div>

          {/*History (only meaningful when logged in)*/}
          <div className="az-card" id="history-card">
            <div className="flex items-center justify-between" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--space-3)" }}>
              <h2 className="az-h" style={{ margin: "0" }}>Recent scans</h2>
              <span className="badge badge-primary" id="history-count">0 saved</span>
            </div>
            <p className="az-sub" id="history-note">Sign in to save your food scans to this device.</p>
            <div className="history-list" id="history-list"></div>
          </div>
        </main>
    </>
  );
}
