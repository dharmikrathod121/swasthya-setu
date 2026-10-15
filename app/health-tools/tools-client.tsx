"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/shared/auth-provider";

/* ---------------- BMI ---------------- */

function bmiCategory(bmi: number): { label: string; color: string; desc: string } {
  if (bmi < 18.5)
    return { label: "Underweight", color: "var(--color-accent)", desc: "Below the healthy range. Consider a balanced diet check with a doctor." };
  if (bmi < 25)
    return { label: "Healthy", color: "var(--color-success)", desc: "Great — your BMI is in the healthy range. Keep up balanced habits." };
  if (bmi < 30)
    return { label: "Overweight", color: "var(--color-warning, #d97706)", desc: "Slightly above the healthy range. Small daily activity helps." };
  return { label: "Obese", color: "var(--color-error)", desc: "Well above the healthy range. Please consult a doctor for guidance." };
}

function BmiTool() {
  const [ht, setHt] = useState("");
  const [wt, setWt] = useState("");
  const h = parseFloat(ht);
  const w = parseFloat(wt);
  const bmi = h > 0 && w > 0 ? w / Math.pow(h / 100, 2) : null;
  const cat = bmi != null ? bmiCategory(bmi) : null;
  // Gauge: clamp 12–40 across a 180° arc.
  const frac = bmi == null ? 0 : Math.min(1, Math.max(0, (bmi - 12) / (40 - 12)));
  const angle = Math.PI * (1 - frac);
  const nx = 100 - 78 * Math.cos(angle);
  const ny = 112 - 78 * Math.sin(angle);

  return (
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
        <form
          className="tool-form"
          aria-label="BMI calculator"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="form-row">
            <div className="input-group">
              <label className="input-label" htmlFor="ht">Height (cm)</label>
              <input id="ht" className="input-field" type="number" min={50} max={300} placeholder="175" inputMode="decimal" value={ht} onChange={(e) => setHt(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="wt">Weight (kg)</label>
              <input id="wt" className="input-field" type="number" min={10} max={500} placeholder="70" inputMode="decimal" value={wt} onChange={(e) => setWt(e.target.value)} />
            </div>
          </div>
          <p className="field-hint">BMI = weight (kg) ÷ height² (m). Updates live as you type.</p>
        </form>

        <div className="bmi-gauge-wrap">
          <svg className="bmi-gauge-svg" viewBox="0 0 200 132" role="img" aria-label="BMI gauge meter">
            <path d="M 22 112 A 78 78 0 0 1 178 112" fill="none" stroke="var(--border-default)" strokeWidth="14" strokeLinecap="round" />
            {bmi != null && (
              <line x1="100" y1="112" x2={nx} y2={ny} stroke={cat!.color} strokeWidth="4" strokeLinecap="round" />
            )}
            <circle cx="100" cy="112" r="7" fill="var(--text-primary)" />
          </svg>
          <div className="bmi-readout">
            <span className="badge" style={{ background: cat ? cat.color : "var(--border-default)", color: "#fff" }}>
              {bmi != null ? `${bmi.toFixed(1)} — ${cat!.label}` : "Enter your details"}
            </span>
            <p className="bmi-desc">
              {cat ? cat.desc : "Your BMI category and a short, friendly explanation will appear here."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Calories ---------------- */

function CalorieTool() {
  const [sex, setSex] = useState("Male");
  const [age, setAge] = useState("30");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [factor, setFactor] = useState("1.2");
  const [result, setResult] = useState<number | null>(null);

  function estimate(e: React.FormEvent) {
    e.preventDefault();
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const f = parseFloat(factor);
    if (!(a > 0 && w > 0 && h > 0 && f > 0)) {
      setResult(null);
      return;
    }
    const bmr = 10 * w + 6.25 * h - 5 * a + (sex === "Male" ? 5 : -161);
    setResult(Math.round(bmr * f));
  }

  return (
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

      <form className="tool-form" style={{ marginTop: "var(--space-2)" }} aria-label="Calorie estimator" onSubmit={estimate}>
        <div className="form-row">
          <div className="input-group">
            <label className="input-label" htmlFor="cal-gender">Sex</label>
            <select id="cal-gender" className="input-field" value={sex} onChange={(e) => setSex(e.target.value)}>
              <option>Male</option><option>Female</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="cal-age">Age</label>
            <input id="cal-age" className="input-field" type="number" min={1} max={120} placeholder="30" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="input-group">
            <label className="input-label" htmlFor="cal-weight">Weight (kg)</label>
            <input id="cal-weight" className="input-field" type="number" min={10} max={500} placeholder="70" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="cal-height">Height (cm)</label>
            <input id="cal-height" className="input-field" type="number" min={50} max={300} placeholder="175" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="cal-activity">Activity level</label>
          <select id="cal-activity" className="input-field" value={factor} onChange={(e) => setFactor(e.target.value)}>
            <option value="1.2">Sedentary (little/no exercise)</option>
            <option value="1.375">Light (1–3 days/week)</option>
            <option value="1.55">Moderate (3–5 days/week)</option>
            <option value="1.725">Active (6–7 days/week)</option>
            <option value="1.9">Very active (physical job)</option>
          </select>
        </div>
        <button className="btn btn-accent" type="submit">Estimate calories</button>
        <div className="cal-result" aria-live="polite">
          {result != null && (
            <p>
              About <strong>{result.toLocaleString("en-IN")} kcal/day</strong> to maintain weight.
              General guidance only — not medical advice.
            </p>
          )}
        </div>
      </form>
    </section>
  );
}

/* ---------------- Trackers (sign-in gated, localStorage) ---------------- */

type TrackerKey = "bp" | "period" | "water" | "steps";
interface Entry {
  d: string;
  a?: string;
  b?: string;
}

const TRACKER_META: Record<TrackerKey, { h: string; p: string; icon: string; wrap: string; text: string }> = {
  bp: { h: "Blood Pressure Logger", p: "Systolic & diastolic trends", icon: "favorite", wrap: "warn", text: "Log readings and chart your blood-pressure trend." },
  period: { h: "Period Tracker", p: "Log flow & see the pattern", icon: "calendar_month", wrap: "ai", text: "Track your cycle and view your history." },
  water: { h: "Water Intake Tracker", p: "Hydration vs. 2000 ml goal", icon: "water_drop", wrap: "primary", text: "Log glasses of water against your daily goal." },
  steps: { h: "Step Counter", p: "Manual logging vs. 10k goal", icon: "directions_walk", wrap: "success", text: "Log daily steps and chart your progress." },
};

function TrackerCard({ tool }: { tool: TrackerKey }) {
  const { user, loading, isLoggedIn } = useAuth();
  const meta = TRACKER_META[tool];
  const storeKey = `ss-tools-${user?.id ?? "guest"}-${tool}`;
  const [entries, setEntries] = useState<Entry[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [f1, setF1] = useState("");
  const [f2, setF2] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storeKey);
      setEntries(raw ? (JSON.parse(raw) as Entry[]) : []);
    } catch {
      setEntries([]);
    }
  }, [storeKey]);

  function persist(next: Entry[]) {
    setEntries(next);
    try {
      localStorage.setItem(storeKey, JSON.stringify(next));
    } catch {
      /* storage full/blocked — keep in-memory only */
    }
  }

  function addEntry(e: React.FormEvent) {
    e.preventDefault();
    if (tool === "bp" && !(parseFloat(f1) > 0 && parseFloat(f2) > 0)) return;
    if (tool === "water" && !(parseFloat(f1) > 0)) return;
    if (tool === "steps" && !(parseFloat(f1) >= 0 && f1 !== "")) return;
    if (tool === "period" && !date) return;
    persist([{ d: date, a: f1 || undefined, b: f2 || undefined }, ...entries].slice(0, 30));
    setF1("");
    setF2("");
    setFormOpen(false);
  }

  function removeAt(idx: number) {
    persist(entries.filter((_, i) => i !== idx));
  }

  const summary = useMemo(() => {
    if (entries.length === 0) return null;
    if (tool === "water") {
      const today = new Date().toISOString().slice(0, 10);
      const total = entries.filter((x) => x.d === today).reduce((s, x) => s + (parseFloat(x.a ?? "0") || 0), 0);
      return `Today: ${total} ml of 2000 ml goal`;
    }
    if (tool === "steps") {
      const today = new Date().toISOString().slice(0, 10);
      const total = entries.filter((x) => x.d === today).reduce((s, x) => s + (parseFloat(x.a ?? "0") || 0), 0);
      return `Today: ${total.toLocaleString("en-IN")} of 10,000 steps`;
    }
    if (tool === "bp") {
      const last = entries[0];
      return `Latest: ${last.a}/${last.b} mmHg (${last.d})`;
    }
    return `Last logged: ${entries[0].d}${entries[0].a ? ` — ${entries[0].a}` : ""}`;
  }, [entries, tool]);

  const locked = !loading && !isLoggedIn;

  return (
    <section className={`tool-card reveal ${locked ? "is-auth" : "is-public"}`} aria-labelledby={`${tool}-title`}>
      <div className="tool-head">
        <div className="tool-head-text">
          <h3 id={`${tool}-title`}>{meta.h}</h3>
          <p>{meta.p}</p>
        </div>
        <div className={`tool-icon-wrap ${meta.wrap}`}>
          <span className="material-symbols-outlined">{meta.icon}</span>
        </div>
      </div>
      {locked ? (
        <span className="badge badge-ai">Sign in</span>
      ) : (
        <span className="badge badge-success">Unlocked</span>
      )}
      <div className="tool-body">
        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Checking sign-in…</p>
        ) : locked ? (
          <div className="tool-locked">
            <span className="lock-icon material-symbols-outlined">lock</span>
            <p>Sign in to {meta.text.charAt(0).toLowerCase() + meta.text.slice(1)}</p>
            <Link className="btn btn-primary btn-sm" href="/login?redirect=%2Fhealth-tools">
              Sign in to unlock
            </Link>
          </div>
        ) : (
          <div>
            {summary && (
              <p className="field-hint" style={{ fontWeight: 600 }}>{summary}</p>
            )}
            {!formOpen ? (
              <button className="btn btn-primary btn-sm" type="button" onClick={() => setFormOpen(true)}>
                Add entry
              </button>
            ) : (
              <form className="tool-form" onSubmit={addEntry}>
                <div className="input-group">
                  <label className="input-label">Date</label>
                  <input className="input-field" type="date" value={date} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} />
                </div>
                {tool === "bp" && (
                  <div className="form-row">
                    <div className="input-group">
                      <label className="input-label">Systolic</label>
                      <input className="input-field" type="number" min={50} max={300} placeholder="120" value={f1} onChange={(e) => setF1(e.target.value)} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Diastolic</label>
                      <input className="input-field" type="number" min={30} max={200} placeholder="80" value={f2} onChange={(e) => setF2(e.target.value)} />
                    </div>
                  </div>
                )}
                {tool === "water" && (
                  <div className="input-group">
                    <label className="input-label">Water (ml)</label>
                    <input className="input-field" type="number" min={0} max={10000} placeholder="250" value={f1} onChange={(e) => setF1(e.target.value)} />
                  </div>
                )}
                {tool === "steps" && (
                  <div className="input-group">
                    <label className="input-label">Steps</label>
                    <input className="input-field" type="number" min={0} max={100000} placeholder="5000" value={f1} onChange={(e) => setF1(e.target.value)} />
                  </div>
                )}
                {tool === "period" && (
                  <div className="input-group">
                    <label className="input-label">Flow</label>
                    <select className="input-field" value={f1} onChange={(e) => setF1(e.target.value)}>
                      <option value="">Select…</option>
                      <option value="Light">Light</option>
                      <option value="Medium">Medium</option>
                      <option value="Heavy">Heavy</option>
                      <option value="Spotting">Spotting</option>
                    </select>
                  </div>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-primary btn-sm" type="submit">Save entry</button>
                  <button className="btn btn-ghost btn-sm" type="button" onClick={() => setFormOpen(false)}>Cancel</button>
                </div>
              </form>
            )}
            {entries.length > 0 && (
              <ul className="profile-list" style={{ marginTop: "var(--space-3)" }}>
                {entries.slice(0, 5).map((x, i) => (
                  <li key={`${x.d}-${i}`}>
                    <span className="material-symbols-outlined">check_circle</span>
                    <span style={{ flex: 1 }}>
                      {x.d}
                      {x.a ? ` — ${x.a}${x.b ? `/${x.b}` : ""}${tool === "water" ? " ml" : tool === "steps" ? " steps" : tool === "bp" ? " mmHg" : ""}` : ""}
                    </span>
                    <button type="button" className="btn btn-ghost btn-sm" aria-label="Delete entry" onClick={() => removeAt(i)}>✕</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- Page ---------------- */

export default function ToolsClient() {
  return (
    <>
      <div id="main">
        <section className="tools-hero">
          <div className="hero-inner">
            <span className="section-eyebrow">Wellness Toolkit</span>
            <h1>Everyday health tools, free &amp; private</h1>
            <p>Calculate your BMI on the spot, estimate your calories, and track your vitals. Calculators run free in your browser; tracker entries unlock after sign-in and stay on this device.</p>
          </div>
        </section>

        <div className="landing-section" style={{ paddingTop: "var(--space-10)" }}>
          <div className="section-header">
            <h2>Health Tools</h2>
            <p>The BMI gauge and calorie estimator are open to everyone; the trackers unlock once you sign in.</p>
          </div>

          <div className="tools-grid">
            <BmiTool />
            <CalorieTool />
            <TrackerCard tool="bp" />
            <TrackerCard tool="period" />
            <TrackerCard tool="water" />
            <TrackerCard tool="steps" />
          </div>
        </div>
      </div>
    </>
  );
}
