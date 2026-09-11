import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export default function HealthToolsPage() {
  return (
    <>
      <PublicHeader />
      <main id="main">
        <section className="tools-hero">
          <div className="hero-inner">
            <span className="section-eyebrow">Wellness Toolkit</span>
            <h1>Everyday health tools, free &amp; private</h1>
            <p>Calculate your BMI on the spot, estimate your calories, and track your vitals. Everything runs in your browser — no account needed for the calculators, and your tracker data never leaves this device.</p>
          </div>
        </section>

        <div className="landing-section" style={{ paddingTop: "var(--space-10)" }}>
          <div className="section-header">
            <h2>Health Tools</h2>
            <p>Six lightweight tools to keep an eye on your everyday wellness. The BMI gauge and calorie estimator are open to everyone; the trackers unlock with a one-tap demo sign-in.</p>
          </div>

          <div className="tools-grid">
            <section className="tool-card is-public span-full reveal" aria-labelledby="bmi-title">
              <div className="tool-head">
                <div className="tool-head-text">
                  <h3 id="bmi-title">BMI Calculator</h3>
                  <p>Body Mass Index with a live gauge</p>
                </div>
                <div className="tool-icon-wrap primary">
                  <span className="material-symbols-outlined">monitor_weight</span>
                </div>
              </div>
              <span className="badge badge-success">Public</span>

              <div className="bmi-layout" style={{ marginTop: "var(--space-2)" }}>
                <form id="bmiToolForm" className="tool-form" aria-label="BMI calculator" action="#">
                  <div className="form-row">
                    <div className="input-group">
                      <label className="input-label" htmlFor="ht">Height (cm)</label>
                      <input id="ht" className="input-field" type="number" min={50} max={300} placeholder="175" inputMode="decimal" />
                    </div>
                    <div className="input-group">
                      <label className="input-label" htmlFor="wt">Weight (kg)</label>
                      <input id="wt" className="input-field" type="number" min={10} max={500} placeholder="70" inputMode="decimal" />
                    </div>
                  </div>
                  <p className="field-hint">BMI = weight (kg) ÷ height² (m). Updates live as you type.</p>
                  <button className="btn btn-primary" type="submit">Calculate BMI</button>
                </form>

                <div className="bmi-gauge-wrap">
                  <svg className="bmi-gauge-svg" id="bmiGauge" viewBox="0 0 200 132" role="img" aria-label="BMI gauge meter"></svg>
                  <div className="bmi-zones-legend" id="bmiLegend"></div>
                  <div className="bmi-readout">
                    <span className="badge" id="bmiCatBadge" style={{ background: "var(--border-default)", color: "var(--text-secondary)" }}>Enter your details</span>
                    <p className="bmi-desc" id="bmiDesc">Your BMI category and a short, friendly explanation will appear here.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="tool-card is-public reveal" aria-labelledby="cal-title">
              <div className="tool-head">
                <div className="tool-head-text">
                  <h3 id="cal-title">Calorie Estimator</h3>
                  <p>Daily energy needs (Mifflin–St Jeor)</p>
                </div>
                <div className="tool-icon-wrap accent">
                  <span className="material-symbols-outlined">restaurant</span>
                </div>
              </div>
              <span className="badge badge-success">Public</span>

              <form id="calForm" className="tool-form" style={{ marginTop: "var(--space-2)" }} aria-label="Calorie estimator" action="#">
                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label" htmlFor="cal-gender">Sex</label>
                    <select id="cal-gender" className="input-field" defaultValue="Male">
                      <option>Male</option><option>Female</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="cal-age">Age</label>
                    <input id="cal-age" className="input-field" type="number" min={1} max={120} placeholder="30" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label" htmlFor="cal-weight">Weight (kg)</label>
                    <input id="cal-weight" className="input-field" type="number" min={10} max={500} placeholder="70" />
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="cal-height">Height (cm)</label>
                    <input id="cal-height" className="input-field" type="number" min={50} max={300} placeholder="175" />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="cal-activity">Activity level</label>
                  <select id="cal-activity" className="input-field" defaultValue="1.2">
                    <option value="1.2">Sedentary (little/no exercise)</option>
                    <option value="1.375">Light (1–3 days/week)</option>
                    <option value="1.55">Moderate (3–5 days/week)</option>
                    <option value="1.725">Active (6–7 days/week)</option>
                    <option value="1.9">Very active (physical job)</option>
                  </select>
                </div>
                <button className="btn btn-accent" type="submit">Estimate calories</button>
                <div className="cal-result" id="calResult" aria-live="polite"></div>
              </form>
            </section>

            {[
              { id: "card-bp", title: "bp-title", h: "Blood Pressure Logger", p: "Systolic & diastolic trends", icon: "favorite", wrap: "warn", text: "Sign in to log readings and chart your blood-pressure trend.", tool: "bp" },
              { id: "card-period", title: "period-title", h: "Period Tracker", p: "Log flow & see the pattern", icon: "calendar_month", wrap: "ai", text: "Sign in to track your cycle and view your history chart.", tool: "period" },
              { id: "card-water", title: "water-title", h: "Water Intake Tracker", p: "Hydration vs. 2000 ml goal", icon: "water_drop", wrap: "primary", text: "Sign in to log glasses of water and track against your daily goal.", tool: "water" },
              { id: "card-steps", title: "steps-title", h: "Step Counter", p: "Manual logging vs. 10k goal", icon: "directions_walk", wrap: "success", text: "Sign in to log daily steps and chart your progress.", tool: "steps" },
            ].map((t) => (
              <section key={t.id} className="tool-card is-auth reveal" id={t.id} aria-labelledby={t.title}>
                <div className="tool-head">
                  <div className="tool-head-text">
                    <h3 id={t.title}>{t.h}</h3>
                    <p>{t.p}</p>
                  </div>
                  <div className={`tool-icon-wrap ${t.wrap}`}>
                    <span className="material-symbols-outlined">{t.icon}</span>
                  </div>
                </div>
                <span className="badge badge-ai">Sign in</span>
                <div className="tool-body">
                  <div className="tool-locked">
                    <span className="lock-icon material-symbols-outlined">lock</span>
                    <p>{t.text}</p>
                    <button className="btn btn-primary btn-sm" data-action="unlock" data-tool={t.tool}>Add entry</button>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />

      <div className="entry-overlay" id="entryOverlay" role="dialog" aria-modal="true" aria-labelledby="entryTitle" inert={true}>
        <div className="entry-modal">
          <div className="entry-modal-head">
            <h3 id="entryTitle">Add entry</h3>
            <button className="entry-modal-close" id="entryClose" aria-label="Close">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="entry-modal-body" id="entryBody"></div>
          <div className="entry-modal-foot">
            <button className="btn btn-ghost" id="entryCancel">Cancel</button>
            <button className="btn btn-primary" id="entrySave">Save entry</button>
          </div>
        </div>
      </div>

      <div className="toast" id="toast" role="status" aria-live="polite"></div>
    </>
  );
}
