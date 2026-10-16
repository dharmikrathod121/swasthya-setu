"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Markdown } from "@/components/shared/markdown";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB
const UPLOAD_BUCKET = "reports";
/** Hard stop so the processing panel can never spin forever on a stalled request. */
const REQUEST_TIMEOUT_MS = 90_000;

type Json = Record<string, unknown>;

type Drug = {
  name: string;
  dosage: string;
  purpose: string;
  explain: string;
  simpleMeaning: string;
};

type Interaction = {
  severity: "severe" | "moderate" | "safe";
  title: string;
  detail: string;
  simpleMeaning: string;
};

type RxAnalysis = {
  summary: string;
  simpleExplanation: string;
  medicines: Drug[];
  interactions: Interaction[];
};

const isRec = (v: unknown): v is Json =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function toText(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return "";
}

function stripFences(raw: string): string {
  const s = raw.trim();
  const fence = s.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fence ? fence[1].trim() : s;
}

function tryParseJson(raw: string): unknown {
  const s = stripFences(raw);
  try {
    return JSON.parse(s);
  } catch {
    const start = s.indexOf("{");
    const end = s.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(s.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

function isPdf(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === "AbortError";
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.readAsDataURL(file);
  });
}

/** Upload to Supabase storage via /api/upload; fall back to an inline base64 data URL. */
async function uploadOrInline(file: File, bucket: string, signal?: AbortSignal): Promise<string> {
  try {
    const form = new FormData();
    form.append("file", file);
    form.append("bucket", bucket);
    const res = await fetch("/api/upload", { method: "POST", body: form, signal });
    if (res.ok) {
      const data: unknown = await res.json().catch(() => null);
      if (isRec(data) && typeof data.url === "string" && data.url) return data.url;
    }
  } catch {
    // fall through to the inline data URL
  }
  return readFileAsDataUrl(file);
}

function parseDrugs(value: unknown): Drug[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const r = isRec(item) ? item : {};
    const timing = toText(r.timing ?? r.frequency ?? r.schedule ?? r.when);
    const explanation = toText(r.explanation ?? r.purpose ?? r.description ?? r.uses);
    return {
      name: toText(r.name ?? r.medicine ?? r.drug) || "Unnamed medicine",
      dosage: toText(r.dosage ?? r.dose ?? r.strength),
      purpose: toText(r.purpose ?? r.category ?? r.usedFor),
      explain: [timing, explanation].filter(Boolean).join(" — "),
      simpleMeaning: toText(r.simpleMeaning ?? r.simpleExplanation ?? r.inSimpleWords ?? r.meaning),
    };
  });
}

function parseInteractions(value: unknown): Interaction[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const r = isRec(item) ? item : {};
    const raw = toText(r.severity ?? r.level ?? r.risk).toLowerCase();
    const severity: Interaction["severity"] =
      raw.includes("sev") || raw.includes("high") || raw.includes("danger")
        ? "severe"
        : raw.includes("safe") || raw.includes("none") || raw.includes("low")
          ? "safe"
          : "moderate";
    return {
      severity,
      title: toText(r.title ?? r.drugs ?? r.pair ?? r.name) || "Interaction note",
      detail: toText(r.detail ?? r.description ?? r.note ?? r.text),
      simpleMeaning: toText(r.simpleMeaning ?? r.simpleExplanation ?? r.inSimpleWords ?? r.meaning),
    };
  });
}

function parseAnalysis(raw: string): RxAnalysis {
  const parsed = tryParseJson(raw);
  if (isRec(parsed)) {
    return {
      summary: toText(parsed.summary ?? parsed.assessment ?? parsed.notes),
      simpleExplanation: toText(
        parsed.simpleExplanation ?? parsed.simpleSummary ?? parsed.inSimpleWords ?? parsed.whatItMeans,
      ),
      medicines: parseDrugs(parsed.medicines ?? parsed.drugs ?? parsed.prescription),
      interactions: parseInteractions(parsed.interactions ?? parsed.warnings),
    };
  }
  return { summary: raw.trim(), simpleExplanation: "", medicines: [], interactions: [] };
}

const RX_PROMPT =
  "This is a doctor's prescription. Extract EVERY medicine listed with its name, dosage/strength, timing/frequency, and what it is for in SIMPLE everyday words a 12-year-old can understand. Also add for the whole prescription: simpleExplanation (2-3 sentences: what the treatment is for overall and what matters most), and for each medicine: simpleMeaning (one line starting 'In simple words:' explaining what it does in the body + how/when to take it), and for each interaction: simpleMeaning (one line in simple words). Respond as JSON: { summary: string, simpleExplanation: string, medicines: [{ name, dosage, timing, purpose, explanation, simpleMeaning }], interactions: [{ severity: 'severe'|'moderate'|'safe', title, detail, simpleMeaning }] }.";

export default function PrescriptionAnalyzerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [statusText, setStatusText] = useState("Reading prescription…");
  const [analysis, setAnalysis] = useState<RxAnalysis | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [resultError, setResultError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
    };
  }, []);

  const resetPreview = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreviewUrl(null);
  }, []);

  const acceptFile = useCallback(
    (picked: File | undefined | null) => {
      if (!picked) return;
      if (isPdf(picked)) {
        toast.error("PDFs aren't supported yet — please upload a photo or screenshot of the prescription.");
        return;
      }
      if (!picked.type.startsWith("image/")) {
        toast.error("Unsupported file type — please upload a JPG or PNG photo.");
        return;
      }
      if (picked.size > MAX_FILE_SIZE) {
        toast.error("That photo is larger than 8 MB — please upload a smaller one.");
        return;
      }
      resetPreview();
      const url = URL.createObjectURL(picked);
      objectUrlRef.current = url;
      setPreviewUrl(url);
      setFile(picked);
      setAnalysis(null);
      setShowResult(false);
      setResultError("");
    },
    [resetPreview],
  );

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    acceptFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const openPicker = () => fileInputRef.current?.click();
  const openCamera = () => cameraInputRef.current?.click();

  const onZoneKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker();
    }
  };

  const finishProcessing = useCallback((completed: boolean) => {
    if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(
      () => setProcessing(false),
      completed ? 350 : 250,
    );
  }, []);

  const restart = () => {
    setAnalysis(null);
    setShowResult(false);
    setResultError("");
    setFile(null);
    resetPreview();
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const analyze = async () => {
    if (!file) {
      toast.error("Add a photo of the prescription first.");
      return;
    }
    setProcessing(true);
    setAnalysis(null);
    setShowResult(false);
    setResultError("");
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      setStatusText("Uploading prescription…");
      const imageUrl = await uploadOrInline(file, UPLOAD_BUCKET, controller.signal);
      setStatusText("Reading prescription…");
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: RX_PROMPT, imageUrl }),
        signal: controller.signal,
      });
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const message =
          isRec(data) && typeof data.error === "string"
            ? data.error
            : `Analysis failed (${res.status})`;
        throw new Error(message);
      }
      const raw = isRec(data) && typeof data.analysis === "string" ? data.analysis : "";
      if (!raw) throw new Error("The analyzer returned an empty response.");
      setAnalysis(parseAnalysis(raw));
      setShowResult(true);
      finishProcessing(true);
    } catch (err) {
      const message = isAbortError(err)
        ? "That took too long. Please try again."
        : err instanceof Error
          ? err.message
          : "Analysis failed. Please try again.";
      setResultError(message);
      setShowResult(true);
      toast.error(message);
      finishProcessing(false);
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  return (
    <main id="main" className="analyzer-section">
          <div className="az-card">
            <span className="az-step-label"><span className="step-num">1</span> Upload prescription</span>
            <h2 className="az-h">Photo of your prescription</h2>
            <p className="az-sub">Clear, well-lit photos of printed or handwritten prescriptions work best.</p>

            <div
              className={`upload-zone${dragging ? " drag-over" : ""}`}
              id="upload-zone"
              role="button"
              tabIndex={0}
              aria-label="Upload or drop a prescription photo"
              onClick={openPicker}
              onKeyDown={onZoneKeyDown}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                acceptFile(e.dataTransfer.files?.[0]);
              }}
            >
              <div className="upload-zone-icon">
                <span className="material-symbols-outlined">medical_information</span>
              </div>
              <h3>Drag &amp; drop your prescription here</h3>
              <p className="uz-hint">or take a photo / choose a file</p>
              <input type="file" id="rx-file" accept="image/*" hidden ref={fileInputRef} onChange={onInputChange} />
              <input type="file" id="rx-camera" accept="image/*" capture="environment" hidden ref={cameraInputRef} onChange={onInputChange} />
              <div className="uz-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  id="btn-choose"
                  onClick={(e) => {
                    e.stopPropagation();
                    openPicker();
                  }}
                >
                  <span className="material-symbols-outlined">folder_open</span> Choose file
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  id="btn-camera"
                  onClick={(e) => {
                    e.stopPropagation();
                    openCamera();
                  }}
                >
                  <span className="material-symbols-outlined">photo_camera</span> Use camera
                </button>
              </div>
              <div className="uz-thumb" id="uz-thumb">
                <img id="uz-img" alt="Selected prescription preview" hidden={!previewUrl} src={previewUrl ?? undefined} />
                <div className="uz-file-name" id="uz-file-name" hidden={!!previewUrl || !file}>
                  {file && !previewUrl ? file.name : ""}
                </div>
              </div>
            </div>

            <button type="button" className="btn btn-ai btn-lg" id="btn-analyze" disabled={!file || processing} onClick={analyze}>
              <span className="material-symbols-outlined">auto_awesome</span> Analyze prescription
            </button>

            {processing && (
              <div className="processing-panel" id="processing" aria-live="polite">
                <div className="processing-head">
                  <span className="spinner" aria-hidden="true"></span>
                  <span className="processing-status" id="proc-status">{statusText}</span>
                </div>
              </div>
            )}
          </div>

          {/*Results*/}
          {showResult && (
          <div className="az-card result-card" id="result">
            <div className="result-card-header">
              <div>
                <strong>{resultError ? "Analysis unavailable" : "Prescription decoded"}</strong>
                <div className="result-meta">
                  <span><span className="material-symbols-outlined" style={{ fontSize: "16px", verticalAlign: "-3px" }}>pill</span> <span id="rx-count">{resultError ? 0 : (analysis?.medicines.length ?? 0)}</span> medicines</span>
                  <span id="result-date">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              <span className="badge badge-ai"><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>auto_awesome</span> AI</span>
            </div>
            <div className="result-card-body">
              <div className="result-summary" id="result-summary">
                {resultError ? (
                  <span role="alert">{resultError} You can try again — your photo is still selected.</span>
                ) : (
                  <Markdown text={analysis?.summary || "The prescription was read, but no summary was generated."} />
                )}
              </div>

              {!resultError && analysis?.simpleExplanation && (
                <div
                  className="az-caution"
                  style={{ background: "var(--color-success-soft)", borderColor: "color-mix(in srgb, var(--color-success) 25%, transparent)", marginTop: 0, marginBottom: "var(--space-5)" }}
                >
                  <span className="material-symbols-outlined" style={{ color: "var(--color-success)" }}>lightbulb</span>
                  <span>
                    <strong style={{ display: "block", marginBottom: "4px" }}>In simple words — what this prescription means for you</strong>
                    {analysis.simpleExplanation}
                  </span>
                </div>
              )}

              {!resultError && analysis && analysis.medicines.length > 0 && (
                <>
                  <h3 className="result-section-title" style={{ marginTop: "var(--space-6)" }}>Medicines explained in simple words</h3>
                  <div id="drug-list">
                    {analysis.medicines.map((drug, i) => (
                      <div className="drug-card" key={`${drug.name}-${i}`}>
                        <div className="drug-icon">
                          <span className="material-symbols-outlined">medication</span>
                        </div>
                        <div className="drug-body">
                          {drug.purpose && <div className="drug-purpose">{drug.purpose}</div>}
                          <div>
                            <span className="drug-name">{drug.name}</span>
                            {drug.dosage && <span className="drug-dosage">{drug.dosage}</span>}
                          </div>
                          {drug.explain && <p className="drug-explain">{drug.explain}</p>}
                          {drug.simpleMeaning && (
                            <p className="drug-explain" style={{ marginTop: "6px", color: "var(--text-primary)", background: "var(--color-surface-elevated)", borderRadius: "8px", padding: "8px 10px" }}>
                              <strong>In simple words: </strong>{drug.simpleMeaning.replace(/^In simple words:\s*/i, "")}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {!resultError && analysis && analysis.interactions.length > 0 && (
                <>
                  <h3 className="result-section-title" style={{ marginTop: "var(--space-8)" }}>Interaction warnings — what to be careful about</h3>
                  <div id="interaction-list">
                    {analysis.interactions.map((item, i) => (
                      <div className={`interaction-card interaction-${item.severity}`} key={`${item.title}-${i}`}>
                        <div className="ic-icon">
                          <span className="material-symbols-outlined">
                            {item.severity === "safe" ? "check_circle" : "warning"}
                          </span>
                        </div>
                        <div>
                          <strong>{item.title}</strong>
                          {item.detail && <p>{item.detail}</p>}
                          {item.simpleMeaning && (
                            <p style={{ marginTop: "4px" }}><strong>In simple words: </strong>{item.simpleMeaning.replace(/^In simple words:\s*/i, "")}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {!resultError && analysis && (
                <div className="az-caution">
                  <span className="material-symbols-outlined">info</span>
                  <span>Simple tip: take medicines exactly as written (right time, right amount). If anything here is unclear, ask your doctor or pharmacist to explain it in your own words.</span>
                </div>
              )}

              <div className="card-footer" style={{ margin: "var(--space-6) calc(-1 * var(--space-6)) calc(-1 * var(--space-6))", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <button type="button" className="btn btn-ghost" id="btn-restart" onClick={restart}>
                  <span className="material-symbols-outlined">refresh</span> Analyze another
                </button>
              </div>
            </div>
          </div>
          )}
    </main>
  );
}
