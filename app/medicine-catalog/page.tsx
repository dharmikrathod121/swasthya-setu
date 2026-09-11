export const metadata = {
  title: "Medicine Catalog | Swasthya Setu",
  description: "Look up common medicines by name, category or use.",
};

export default function Page() {
  return (
    <>
      <main id="main">
          {/*Intro + search*/}
          <section className="hero-gradient mc-intro">
            <div className="hero-inner">
              <span className="eyebrow">Medicine Catalog</span>
              <h1>Look up any <span className="hl">medicine</span> in seconds</h1>
              <p className="mc-sub">
                Search our public catalog of common medicines by name, category or use.
                Anyone can browse results freely — sign in to identify a pill with the AI camera tool.
              </p>

              <form className="mc-search" id="mc-search-form" role="search" autoComplete="off">
                <div className="mc-search-box">
                  <span className="search-bar-icon material-symbols-outlined">search</span>
                  <input
                    type="text"
                    id="mc-search-input"
                    className="search-bar-input"
                    placeholder="Search medicine by name, category or use…"
                    aria-label="Search medicines"
                    aria-autoComplete="list"
                    aria-controls="mc-autocomplete"
                    aria-expanded="false" />
                  <button
                    type="button"
                    className="mc-camera"
                    id="mc-camera"
                    aria-label="Identify a medicine with the AI camera (requires sign in)">
                    <span className="material-symbols-outlined">camera_alt</span>
                    <span className="mc-camera-tip">AI Identifier · sign in</span>
                  </button>
                  <ul className="mc-autocomplete" id="mc-autocomplete" role="listbox" aria-label="Medicine suggestions" hidden></ul>
                </div>
              </form>

              <div className="hero-chips" style={{ marginTop: "var(--space-5)" }}>
                <span className="hero-chip">Paracetamol</span>
                <span className="hero-chip">Amoxicillin</span>
                <span className="hero-chip">Metformin</span>
                <span className="hero-chip">Azithromycin</span>
                <span className="hero-chip">Cetirizine</span>
                <span className="hero-chip">Salbutamol</span>
              </div>
            </div>
          </section>

          {/*Results*/}
          <section className="mc-results-wrap" aria-label="Medicine results">
            <div className="mc-results-bar">
              <div className="mc-results-count" id="mc-results-count" aria-live="polite">Showing 3 of 11 medicines</div>
              <div className="filter-bar" id="mc-cat-filters" role="group" aria-label="Filter by category"><button type="button" className="filter-pill active">All</button><button type="button" className="filter-pill">Antibiotic</button><button type="button" className="filter-pill">Analgesic / Antipyretic</button><button type="button" className="filter-pill">Antihistamine</button></div>
            </div>

            <div className="mc-results" id="mc-results">{/*populated by JS*/}</div>
          </section>
        </main>
    </>
  );
}
