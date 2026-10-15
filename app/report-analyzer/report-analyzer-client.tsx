"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Markdown } from "@/components/shared/markdown";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB
const UPLOAD_BUCKET = "reports";
/** Hard stop so the processing panel can never spin forever on a stalled request. */
const REQUEST_TIMEOUT_MS = 90_000;

type Json = Record<string, unknown>;

type TestRow = {
  test: string;
  value: string;
  range: string;
  interpretation: string;
  status: string;
};

type Analysis = {
  summary: string;
  tests: TestRow[];
  recommendations: string;
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

function parseTests(value: unknown): TestRow[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const r = isRec(item) ? item : {};
    return {
      test: toText(r.test ?? r.name ?? r.testName ?? r.parameter) || "Unnamed test",
      value: toText(r.value ?? r.result) || "—",
      range: toText(r.normalRange ?? r.range ?? r.referenceRange) || "—",
      interpretation: toText(r.interpretation ?? r.insight) || "",
      status: toText(r.status ?? r.flag) || "",
    };
  });
}

function parseAnalysis(raw: string): Analysis {
  const parsed = tryParseJson(raw);
  if (isRec(parsed)) {
    return {
      summary: toText(parsed.summary ?? parsed.assessment ?? parsed.overview),
      tests: parseTests(parsed.tests ?? parsed.results),
      recommendations: toText(
        parsed.recommendations ?? parsed.nextSteps ?? parsed.suggestions,
      ),
    };
  }
  return { summary: raw.trim(), tests: [], recommendations: "" };
}

function isAbnormal(row: TestRow): boolean {
  const s = `${row.status} ${row.interpretation}`.toLowerCase();
  return /high|low|abnormal|critical|borderline|out of range/.test(s);
}

export default function ReportAnalyzerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Preparing…");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [resultError, setResultError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const tickRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      if (tickRef.current !== null) window.clearInterval(tickRef.current);
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
        toast.error("PDFs aren't supported yet — please upload a photo or screenshot of your report.");
        return;
      }
      if (!picked.type.startsWith("image/")) {
        toast.error("Unsupported file type — please upload a JPG or PNG image.");
        return;
      }
      if (picked.size > MAX_FILE_SIZE) {
        toast.error("That file is larger than 8 MB — please upload a smaller photo.");
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

  const runProgress = useCallback(() => {
    if (tickRef.current !== null) window.clearInterval(tickRef.current);
    setProgress(8);
    tickRef.current = window.setInterval(() => {
      setProgress((p) => (p >= 92 ? p : p + Math.max(1, Math.round((94 - p) / 10))));
    }, 300);
  }, []);

  const finishProgress = useCallback((completed: boolean) => {
    if (tickRef.current !== null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
    setProgress(completed ? 100 : 0);
    if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setProcessing(false), completed ? 350 : 250);
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
      toast.error("Choose a report photo first.");
      return;
    }
    setProcessing(true);
    setAnalysis(null);
    setShowResult(false);
    setResultError("");
    runProgress();
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      setStatusText("Uploading report…");
      const imageUrl = await uploadOrInline(file, UPLOAD_BUCKET, controller.signal);
      setStatusText("Analyzing report…");
      const res = await fetch("/api/analyze", {
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
            : `Analysis failed (${res.status})`;
        throw new Error(message);
      }
      const raw = isRec(data) && typeof data.analysis === "string" ? data.analysis : "";
      if (!raw) throw new Error("The analyzer returned an empty response.");
      setAnalysis(parseAnalysis(raw));
      setShowResult(true);
      finishProgress(true);
    } catch (err) {
      const message = isAbortError(err)
        ? "That took too long. Please try again."
        : err instanceof Error
          ? err.message
          : "Analysis failed. Please try again.";
      setResultError(message);
      setShowResult(true);
      toast.error(message);
      finishProgress(false);
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  return (
    <main id="main" className="analyzer-section">
          <div className="az-card">
            <span className="az-step-label"><span className="step-num">1</span> Upload your report</span>
            <h2 className="az-h">Drop a file or snap a photo</h2>
            <p className="az-sub">Supports images (JPG, PNG). For PDF reports, upload a photo of the page.</p>

            <div
              className={`upload-zone${dragging ? " drag-over" : ""}`}
              id="upload-zone"
              role="button"
              tabIndex={0}
              aria-label="Upload or drop a medical report file"
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
                <span className="material-symbols-outlined">upload_file</span>
              </div>
              <h3>Drag &amp; drop your report here</h3>
              <p className="uz-hint">or choose a file from your device</p>
              <input type="file" id="report-file" accept="image/*,application/pdf" hidden ref={fileInputRef} onChange={onInputChange} />
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
                <input type="file" id="report-camera" accept="image/*" capture="environment" hidden ref={cameraInputRef} onChange={onInputChange} />
              </div>
              <div className="uz-thumb" id="uz-thumb">
                <img id="uz-img" alt="Selected report preview" hidden={!previewUrl} src={previewUrl ?? undefined} />
                <div className="uz-file-name" id="uz-file-name" hidden={!!previewUrl || !file}>
                  {file && !previewUrl ? file.name : ""}
                </div>
              </div>
            </div>

            <button type="button" className="btn btn-ai btn-lg" id="btn-analyze" disabled={!file || processing} onClick={analyze}>
              <span className="material-symbols-outlined">auto_awesome</span> Analyze report
            </button>

            {processing && (
              <div className="processing-panel" id="processing" aria-live="polite">
                <div className="processing-head">
                  <span className="spinner" aria-hidden="true"></span>
                  <span className="processing-status" id="proc-status">{statusText}</span>
                </div>
                <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} id="ocr-bar">
                  <div className="progress-fill" id="ocr-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="progress-meta">
                  <span id="ocr-stage">{progress < 45 ? "Uploading" : "Analyzing"}</span>
                  <span id="ocr-pct">{progress}%</span>
                </div>
              </div>
            )}
          </div>

          {/*Results*/}
          {showResult && (
          <div className="az-card result-card" id="result">
            <div className="result-card-header">
              <div>
                <strong>{resultError ? "Analysis unavailable" : "Analysis complete"}</strong>
                <div className="result-meta">
                  <span><span className="material-symbols-outlined" style={{ fontSize: "16px", verticalAlign: "-3px" }}>description</span> Blood Test Panel</span>
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
                  <Markdown text={analysis?.summary || "No summary was generated."} />
                )}
              </div>

              {!resultError && analysis && analysis.tests.length > 0 && (
                <div className="report-table" id="report-table" role="table" aria-label="Extracted report values">
                  <div className="report-head" role="row">
                    <span role="columnheader">Test</span>
                    <span role="columnheader">Value</span>
                    <span role="columnheader">Normal range</span>
                    <span role="columnheader">Interpretation</span>
                    <span role="columnheader">Status</span>
                  </div>
                  {analysis.tests.map((row, i) => (
                    <div className={`report-row${isAbnormal(row) ? " is-abnormal" : ""}`} role="row" key={`${row.test}-${i}`}>
                      <span className="rc-test" role="cell">{row.test}</span>
                      <span className="rc-value" role="cell">{row.value}</span>
                      <span className="rc-range" role="cell">{row.range}</span>
                      <span className="rc-interp" role="cell">{row.interpretation || "—"}</span>
                      <span role="cell">{row.status || "—"}</span>
                    </div>
                  ))}
                </div>
              )}

              {!resultError && analysis?.recommendations && (
                <>
                  <h3 className="result-section-title" style={{ marginTop: "var(--space-6)" }}>Recommended next steps</h3>
                  <div className="result-summary" style={{ display: "block" }}><Markdown text={analysis.recommendations} /></div>
                </>
              )}

              <div className="card-footer" style={{ margin: "var(--space-6) calc(-1 * var(--space-6)) calc(-1 * var(--space-6))", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  id="btn-download"
                  onClick={() => window.print()}
                >
                  <span className="material-symbols-outlined">picture_as_pdf</span> Download PDF
                </button>
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
