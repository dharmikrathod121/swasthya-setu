"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB
const UPLOAD_BUCKET = "medicines";
/** Hard stop so the processing panel can never spin forever on a stalled request. */
const REQUEST_TIMEOUT_MS = 90_000;

type Json = Record<string, unknown>;

type Match = {
  name: string;
  sub: string;
  detailLines: { label: string; value: string }[];
  confidence: number | null;
  simpleExplanation: string;
  safetyNote: string;
};

const isRec = (v: unknown): v is Json =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function toText(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return "";
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

function toConfidence(v: unknown): number | null {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  if (!Number.isFinite(n) || n <= 0) return null;
  return n > 1 ? Math.round(n) : Math.round(n * 100);
}

function parseMatches(value: unknown): Match[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const r = isRec(item) ? item : {};
    const detailLines: { label: string; value: string }[] = [];
    const category = toText(r.category ?? r.type);
    const uses = toText(r.uses ?? r.description ?? r.usedFor);
    const generic = toText(r.generic ?? r.generic_name);
    if (category) detailLines.push({ label: "Category", value: category });
    if (uses) detailLines.push({ label: "Common uses", value: uses });
    const sideEffects = toText(r.side_effects ?? r.sideEffects);
    if (sideEffects) detailLines.push({ label: "Side effects (simple)", value: sideEffects });
    return {
      name: toText(r.name) || generic || "Unknown medicine",
      sub: generic && toText(r.name) !== generic ? generic : category,
      detailLines,
      confidence: toConfidence(r.confidence),
      simpleExplanation: toText(
        r.simpleExplanation ?? r.simpleMeaning ?? r.explanation ?? r.whatItDoes ?? r.plainSummary,
      ),
      safetyNote: toText(r.safetyNote ?? r.safety ?? r.warning),
    };
  });
}

export default function MedicineIdentifierClient() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [statusText, setStatusText] = useState("Analyzing shape & imprint…");
  const [matches, setMatches] = useState<Match[] | null>(null);
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
        toast.error("PDFs aren't supported yet — please upload a photo of the medicine.");
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
      setMatches(null);
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
    setMatches(null);
    setShowResult(false);
    setResultError("");
    setFile(null);
    resetPreview();
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const identify = async () => {
    if (!file) {
      toast.error("Add a photo of the medicine first.");
      return;
    }
    setProcessing(true);
    setMatches(null);
    setShowResult(false);
    setResultError("");
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      setStatusText("Uploading photo…");
      const imageUrl = await uploadOrInline(file, UPLOAD_BUCKET, controller.signal);
      setStatusText("Analyzing shape & imprint…");
      const res = await fetch("/api/medicine-identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
        signal: controller.signal,
      });
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const message =
          isRec(data) && typeof data.error === "string"
            ? data.error
            : `Identification failed (${res.status})`;
        throw new Error(message);
      }
      const medicines = isRec(data) ? data.medicines : null;
      setMatches(parseMatches(medicines));
      setShowResult(true);
      finishProcessing(true);
    } catch (err) {
      const message = isAbortError(err)
        ? "That took too long. Please try again."
        : err instanceof Error
          ? err.message
          : "Identification failed. Please try again.";
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
            <span className="az-step-label"><span className="step-num">1</span> Photograph the medicine</span>
            <h2 className="az-h">Photo of the pill or tablet</h2>
            <p className="az-sub">Place it on a plain, well-lit background. Include any imprint or score line if visible.</p>

            <div
              className={`upload-zone${dragging ? " drag-over" : ""}`}
              id="upload-zone"
              role="button"
              tabIndex={0}
              aria-label="Upload or drop a medicine photo"
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
                <span className="material-symbols-outlined">medication</span>
              </div>
              <h3>Drag &amp; drop your pill photo here</h3>
              <p className="uz-hint">or take a photo / choose a file</p>
              <input type="file" id="pill-file" accept="image/*" hidden ref={fileInputRef} onChange={onInputChange} />
              <input type="file" id="pill-camera" accept="image/*" capture="environment" hidden ref={cameraInputRef} onChange={onInputChange} />
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
                <img id="uz-img" alt="Selected medicine preview" hidden={!previewUrl} src={previewUrl ?? undefined} />
                <div className="uz-file-name" id="uz-file-name" hidden={!!previewUrl || !file}>
                  {file && !previewUrl ? file.name : ""}
                </div>
              </div>
            </div>

            <button type="button" className="btn btn-ai btn-lg" id="btn-analyze" disabled={!file || processing} onClick={identify}>
              <span className="material-symbols-outlined">auto_awesome</span> Identify medicine
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
                <strong>{resultError ? "Identification unavailable" : "Top matches"}</strong>
                <div className="result-meta">
                  <span><span className="material-symbols-outlined" style={{ fontSize: "16px", verticalAlign: "-3px" }}>search</span> Ranked by confidence</span>
                </div>
              </div>
              <span className="badge badge-ai"><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>auto_awesome</span> AI</span>
            </div>
            <div className="result-card-body">
              <div className="result-summary" id="result-summary">
                {resultError ? (
                  <span role="alert">{resultError} You can try again — your photo is still selected.</span>
                ) : matches && matches.length > 0 ? (
                  <span>
                    Found <strong>{matches.length}</strong> possible match{matches.length === 1 ? "" : "es"} for your photo. Always confirm with a pharmacist or doctor before taking any medicine.
                  </span>
                ) : (
                  <span role="alert">No matches found. Try a clearer, well-lit photo that shows the pill&apos;s imprint or color.</span>
                )}
              </div>
              {!resultError && matches && matches.length > 0 && matches[0]?.simpleExplanation && (
                <div
                  className="az-caution"
                  style={{ background: "var(--color-success-soft)", borderColor: "color-mix(in srgb, var(--color-success) 25%, transparent)", marginTop: 0, marginBottom: "var(--space-5)" }}
                >
                  <span className="material-symbols-outlined" style={{ color: "var(--color-success)" }}>lightbulb</span>
                  <span>
                    <strong style={{ display: "block", marginBottom: "4px" }}>In simple words — what is this medicine?</strong>
                    {matches[0].simpleExplanation}
                  </span>
                </div>
              )}
              {!resultError && matches && matches.length > 0 && (
                <div className="grid-2" id="match-list" style={{ marginTop: "var(--space-5)" }}>
                  {matches.map((m, i) => (
                    <div className="match-card" data-rank={i + 1} key={`${m.name}-${i}`}>
                      <span className="match-rank">#{i + 1}</span>
                      <div className="match-head">
                        <div className="match-pill-icon">
                          <span className="material-symbols-outlined">medication</span>
                        </div>
                        <div>
                          <div className="match-name">{m.name}</div>
                          {m.sub && <div className="match-brand">{m.sub}</div>}
                        </div>
                      </div>
                      {m.simpleExplanation && i > 0 && (
                        <p className="match-detail" style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>
                          <b>In simple words:</b> {m.simpleExplanation}
                        </p>
                      )}
                      {m.confidence !== null && (
                        <div className="match-confidence">
                          <div className="conf-track">
                            <div className="conf-fill" style={{ width: `${m.confidence}%` }}></div>
                          </div>
                          <div className="conf-meta">
                            <span>Match confidence</span>
                            <strong>{m.confidence}%</strong>
                          </div>
                        </div>
                      )}
                      {m.detailLines.length > 0 && (
                        <div className="match-detail">
                          {m.detailLines.map((d) => (
                            <div key={d.label}>
                              <b>{d.label}:</b> {d.value}
                            </div>
                          ))}
                        </div>
                      )}
                      {m.safetyNote && (
                        <p className="match-detail" style={{ color: "var(--color-warning)" }}>
                          <b>Please note:</b> {m.safetyNote}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {!resultError && matches && matches.length > 0 && (
                <div className="az-caution">
                  <span className="material-symbols-outlined">info</span>
                  <span>Simple tip: match the name on your strip with the name above. If the spelling is different, do NOT take it — ask your pharmacist what it means for you.</span>
                </div>
              )}

              <div className="card-footer" style={{ margin: "var(--space-6) calc(-1 * var(--space-6)) calc(-1 * var(--space-6))", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <button type="button" className="btn btn-ghost" id="btn-restart" onClick={restart}>
                  <span className="material-symbols-outlined">refresh</span> Identify another
                </button>
              </div>
            </div>
          </div>
          )}
    </main>
  );
}
