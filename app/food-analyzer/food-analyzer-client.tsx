"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Markdown } from "@/components/shared/markdown";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB
/** Downscaled so the vision payload stays small and always reaches the AI. */
/** Hard stop so the processing panel can never spin forever on a stalled request. */
const REQUEST_TIMEOUT_MS = 90_000;

type Json = Record<string, unknown>;

type Macro = { name: string; grams: number; kcal: number; color: string };

type FoodAnalysis = {
  assessment: string;
  product: string;
  calories: number;
  macros: Macro[];
  allergens: { label: string; level: "contains" | "maybe" }[];
  flags: { level: "danger" | "warn"; title: string; detail: string }[];
};

const MACRO_COLORS = {
  Protein: "var(--color-primary)",
  Carbs: "var(--color-ai)",
  Fat: "var(--color-warning)",
} as const;

const isRec = (v: unknown): v is Json =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function toText(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return "";
}

function toNum(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v === "string") {
    // Models often add units ("12g", "8.5 g") or ranges ("12-15") —
    // take the first number instead of failing to 0.
    const m = v.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
    if (m) {
      const n = Number(m[0]);
      return Number.isFinite(n) ? n : 0;
    }
  }
  return 0;
}

/** Unwrap model variants like { value: 12, unit: "g" } down to a number. */
function numFrom(v: unknown): number {
  if (isRec(v)) {
    for (const k of ["value", "amount", "grams", "quantity", "g"]) {
      if (k in v) {
        const n = toNum(v[k]);
        if (n > 0) return n;
      }
    }
    return 0;
  }
  return toNum(v);
}

/** Read one macro from an object, accepting common key variants. */
function macroFrom(m: Json, keys: string[]): number {
  let fallback = 0;
  let seen = false;
  for (const k of keys) {
    if (!(k in m)) continue;
    seen = true;
    const n = numFrom(m[k]);
    if (n > 0) return n;
    fallback = n;
  }
  return seen ? fallback : 0;
}

/** Accept macros as an object ({ protein: 12 }) or a list ([{ name, grams }]). */
function macrosFrom(value: unknown): { protein: number; carbs: number; fat: number; calories: number } {
  const empty = { protein: 0, carbs: 0, fat: 0, calories: 0 };
  if (Array.isArray(value)) {
    const out = { ...empty };
    for (const item of value) {
      if (!isRec(item)) continue;
      const name = toText(item.name ?? item.nutrient ?? item.label).toLowerCase();
      const n = numFrom(item.grams ?? item.value ?? item.amount ?? item.quantity);
      if (/(protein)/.test(name)) out.protein = out.protein || n;
      else if (/(carb|sugar|starch)/.test(name)) out.carbs = out.carbs || n;
      else if (/(fat|lipid)/.test(name)) out.fat = out.fat || n;
      else if (/(calor|energy|kcal)/.test(name)) out.calories = out.calories || n;
    }
    return out;
  }
  if (!isRec(value)) return empty;
  return {
    protein: macroFrom(value, ["protein", "proteins", "protein_g", "proteinG"]),
    carbs: macroFrom(value, ["carbs", "carb", "carbohydrates", "carbohydrate", "carbs_g", "sugar", "sugars"]),
    fat: macroFrom(value, ["fat", "fats", "fat_g", "total_fat", "totalFat", "lipid", "lipids"]),
    calories: macroFrom(value, ["calories", "calorie", "kcal", "energy", "energy_kcal", "total_calories", "totalCalories"]),
  };
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

/** Downscale to max 1024px JPEG so the AI vision request stays small and
 * reliable. Falls back to the original file bytes when downscaling fails. */
function compressImageFile(file: File, maxDim = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        URL.revokeObjectURL(url);
        if (!ctx) {
          readFileAsDataUrl(file).then(resolve, reject);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err instanceof Error ? err : new Error("Could not process the photo."));
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      readFileAsDataUrl(file).then(resolve, reject);
    };
    img.src = url;
  });
}

function parseAllergens(value: unknown): FoodAnalysis["allergens"] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const r = isRec(item) ? item : {};
      const label = toText(r.name ?? r.allergen ?? r.text);
      if (!label) return null;
      const raw = toText(r.level ?? r.severity ?? r.status).toLowerCase();
      const level: "contains" | "maybe" =
        raw.includes("may") || raw.includes("trace") || raw.includes("possible")
          ? "maybe"
          : "contains";
      return { label, level };
    })
    .filter((x): x is FoodAnalysis["allergens"][number] => x !== null);
}

function parseFlags(value: unknown): FoodAnalysis["flags"] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const r = isRec(item) ? item : {};
      const title = toText(r.title ?? r.flag ?? r.name);
      const detail = toText(r.detail ?? r.description ?? r.note ?? r.text);
      if (!title && !detail) return null;
      const raw = `${toText(r.severity ?? r.level)} ${title} ${detail}`.toLowerCase();
      const level: "danger" | "warn" = /high|danger|severe|excess|avoid/.test(raw) ? "danger" : "warn";
      return { level, title: title || "Health note", detail };
    })
    .filter((x): x is FoodAnalysis["flags"][number] => x !== null);
}

function parseAnalysis(raw: string): FoodAnalysis | null {
  const parsed = tryParseJson(raw);
  if (!isRec(parsed)) return null;
  const m = macrosFrom(parsed.macros ?? parsed.macronutrients ?? parsed.nutrients);
  const protein = m.protein;
  const carbs = m.carbs;
  const fat = m.fat;
  const macros: Macro[] = [
    { name: "Protein", grams: protein, kcal: protein * 4, color: MACRO_COLORS.Protein },
    { name: "Carbs", grams: carbs, kcal: carbs * 4, color: MACRO_COLORS.Carbs },
    { name: "Fat", grams: fat, kcal: fat * 9, color: MACRO_COLORS.Fat },
  ];
  const totalKcal = macros.reduce((sum, x) => sum + x.kcal, 0);
  // Calories may also sit at the top level of the model reply.
  const topCalories = isRec(parsed) ? toNum(
    parsed.calories ?? parsed.totalCalories ?? parsed.total_calories ??
    parsed.energy_kcal ?? parsed.energy ?? parsed.kcal
  ) : 0;
  const calories = m.calories > 0 ? m.calories : topCalories > 0 ? topCalories : Math.round(totalKcal);
  return {
    assessment: toText(parsed.assessment ?? parsed.summary ?? parsed.analysis ?? parsed.overview ?? parsed.notes),
    product: toText(parsed.product ?? parsed.name ?? parsed.title ?? parsed.item),
    calories,
    macros,
    allergens: parseAllergens(parsed.allergens),
    flags: parseFlags(parsed.healthFlags ?? parsed.flags),
  };
}

const DONUT_R = 80;
const DONUT_C = 2 * Math.PI * DONUT_R;

function Donut({ macros, totalKcal }: { macros: Macro[]; totalKcal: number }) {
  let offset = 0;
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" role="img" aria-label="Macronutrient breakdown">
      <circle cx="100" cy="100" r={DONUT_R} fill="none" stroke="var(--color-base)" strokeWidth="26" />
      {totalKcal > 0 &&
        macros.map((m) => {
          const len = (m.kcal / totalKcal) * DONUT_C;
          const dash = `${len} ${DONUT_C - len}`;
          const el = (
            <circle
              key={m.name}
              cx="100"
              cy="100"
              r={DONUT_R}
              fill="none"
              stroke={m.color}
              strokeWidth="26"
              strokeDasharray={dash}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
    </svg>
  );
}

export default function FoodAnalyzerClient() {
  const [tab, setTab] = useState<"text" | "photo">("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [statusText, setStatusText] = useState("Reading ingredients…");
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [rawFallback, setRawFallback] = useState("");
  const [product, setProduct] = useState("Food item");
  const [showResult, setShowResult] = useState(false);
  const [resultError, setResultError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
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
        toast.error("PDFs aren't supported yet — please upload a photo of the label.");
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
      setRawFallback("");
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

  /** Open a live in-app camera. Falls back to the native file input
   * (which honors capture=environment where supported) when the camera
   * is unavailable, permission is denied, or the page is not on HTTPS. */
  const openCamera = async () => {
    setCameraError("");
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
    } catch {
      cameraInputRef.current?.click();
    }
  };

  const closeCamera = useCallback(() => {
    stopCamera();
    setCameraOpen(false);
    setCameraError("");
  }, [stopCamera]);

  // Attach the live stream once the viewfinder is mounted.
  useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraOpen]);

  /** Snap the viewfinder frame into a JPEG file and feed it to the analyzer. */
  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      setCameraError("Camera is not ready yet — hold steady and try again.");
      return;
    }
    const maxDim = 1600;
    const scale = Math.min(1, maxDim / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
    canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setCameraError("Could not capture — please try again.");
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError("Could not capture — please try again.");
          return;
        }
        closeCamera();
        acceptFile(new File([blob], `scan-${Date.now()}.jpg`, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.85,
    );
  };

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
    setRawFallback("");
    setShowResult(false);
    setResultError("");
    setText("");
    setFile(null);
    resetPreview();
    setTab("text");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const hasInput = text.trim().length > 0 || file !== null;

  const analyze = async () => {
    if (!hasInput) {
      toast.error("Add an ingredient list or a photo first.");
      return;
    }
    setProcessing(true);
    setAnalysis(null);
    setRawFallback("");
    setShowResult(false);
    setResultError("");
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      setStatusText("Reading label photo…");
      // Send a downscaled inline photo so the AI always receives viewable
      // image bytes (storage-bucket links are private and unreadable to it).
      const imageUrl = file
        ? await compressImageFile(file).catch(() => readFileAsDataUrl(file))
        : undefined;
      setStatusText("Reading ingredients…");
      const ingredients = text.trim() || undefined;
      const res = await fetch("/api/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, imageUrl }),
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
      const parsed = parseAnalysis(raw);
      setAnalysis(parsed);
      setRawFallback(parsed ? "" : raw.trim());
      setProduct(parsed?.product || (ingredients ? "Ingredient list" : "Photo scan"));
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

  const totalKcal = analysis ? analysis.macros.reduce((s, m) => s + m.kcal, 0) : 0;

  return (
    <main id="main" className="analyzer-section">
          {/*Input*/}
          <div className="az-card">
            <span className="az-step-label"><span className="step-num">1</span> Add the ingredients</span>
            <h2 className="az-h">Text or photo — your choice</h2>
            <p className="az-sub">Works best with the full ingredient list exactly as printed on the pack.</p>

            <div className="fa-tabs" role="tablist" aria-label="Input method">
              <button
                className={`fa-tab${tab === "text" ? " active" : ""}`}
                id="tab-text"
                role="tab"
                aria-selected={tab === "text"}
                aria-controls="panel-text"
                onClick={() => setTab("text")}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px", verticalAlign: "-4px" }}>edit_note</span> Paste text
              </button>
              <button
                className={`fa-tab${tab === "photo" ? " active" : ""}`}
                id="tab-photo"
                role="tab"
                aria-selected={tab === "photo"}
                aria-controls="panel-photo"
                onClick={() => setTab("photo")}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px", verticalAlign: "-4px" }}>photo_camera</span> Take photo
              </button>
            </div>

            <div id="panel-text" className="fa-panel" role="tabpanel" aria-labelledby="tab-text" hidden={tab !== "text"}>
              <div className="input-group">
                <label className="input-label" htmlFor="ingredient-text">Ingredient list</label>
                <textarea
                  id="ingredient-text"
                  className="input-field"
                  rows={5}
                  placeholder="e.g. Wheat flour, sugar, palm oil, salt, milk solids, soy lecithin, vanilla, raising agent (E500)"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div id="panel-photo" className="fa-panel" role="tabpanel" aria-labelledby="tab-photo" hidden={tab !== "photo"}>
              <div
                className={`upload-zone${dragging ? " drag-over" : ""}`}
                id="food-upload"
                role="button"
                tabIndex={0}
                aria-label="Upload or drop a food label photo"
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
                <div className="upload-zone-icon" style={{ background: "var(--color-success-soft)", color: "var(--color-success)" }}>
                  <span className="material-symbols-outlined">nutrition</span>
                </div>
                <h3>Drag &amp; drop the label here</h3>
                <p className="uz-hint">or take a photo / choose a file</p>
                <input type="file" id="food-file" accept="image/*" hidden ref={fileInputRef} onChange={onInputChange} />
                <input type="file" id="food-camera" accept="image/*" capture="environment" hidden ref={cameraInputRef} onChange={onInputChange} />
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
                  <img id="uz-img" alt="Selected food label preview" hidden={!previewUrl} src={previewUrl ?? undefined} />
                  <div className="uz-file-name" id="uz-file-name" hidden={!!previewUrl || !file}>
                    {file && !previewUrl ? file.name : ""}
                  </div>
                </div>
              </div>
            </div>

            <button type="button" className="btn btn-ai btn-lg" id="btn-analyze" disabled={!hasInput || processing} onClick={analyze}>
              <span className="material-symbols-outlined">auto_awesome</span> Analyze ingredients
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

          {/*Live camera viewfinder*/}
          {cameraOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Take a photo of the food label"
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 60,
                background: "rgba(0,0,0,0.85)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: 16,
              }}
            >
              <p style={{ color: "#fff", margin: 0, fontWeight: 600 }}>
                Point at the ingredient list, then capture
              </p>
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                style={{ width: "100%", maxWidth: 520, borderRadius: 12, background: "#000" }}
              />
              {cameraError && (
                <p role="alert" style={{ color: "#fca5a5", margin: 0 }}>
                  {cameraError}
                </p>
              )}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                <button type="button" className="btn btn-primary" onClick={capturePhoto}>
                  <span className="material-symbols-outlined">photo_camera</span> Capture
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ color: "#fff" }}
                  onClick={() => {
                    closeCamera();
                    fileInputRef.current?.click();
                  }}
                >
                  Choose file instead
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ color: "#fff" }}
                  onClick={closeCamera}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/*Result*/}
          {showResult && (
          <div className="az-card result-card" id="result">
            <div className="result-card-header">
              <div>
                <strong id="result-title">{resultError ? "Analysis unavailable" : "Analysis complete"}</strong>
                <div className="result-meta">
                  <span><span className="material-symbols-outlined" style={{ fontSize: "16px", verticalAlign: "-3px" }}>restaurant</span> <span id="result-product">{product}</span></span>
                  <span id="result-date">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              <span className="badge badge-ai"><span className="material-symbols-outlined" style={{ fontSize: "14px" }}>auto_awesome</span> AI</span>
            </div>
            <div className="result-card-body">
              <div className="result-summary" id="result-summary">
                {resultError ? (
                  <span role="alert">{resultError} You can try again — your input is still here.</span>
                ) : (
                  <Markdown text={analysis?.assessment || rawFallback || "No assessment was generated."} />
                )}
              </div>

              {!resultError && analysis && (
                <div className="result-grid-2">
                  <div className="donut-wrap">
                    <div className="donut" id="donut" aria-hidden="true">
                      <Donut macros={analysis.macros} totalKcal={totalKcal} />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div className="macro-grams" style={{ fontSize: "var(--text-lg)", color: "var(--color-primary)" }} id="cal-total">{analysis.calories} kcal</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>Estimated / serving</div>
                    </div>
                  </div>
                  <div className="macro-legend" id="macro-legend">
                    {analysis.macros.map((m) => (
                      <div className="macro-item" key={m.name}>
                        <span className="macro-dot" style={{ background: m.color }}></span>
                        <div className="macro-info">
                          <span className="macro-name">{m.name}</span>
                          <span className="macro-grams">{m.grams}g</span>
                          <span className="macro-pct">
                            {totalKcal > 0 ? `${Math.round((m.kcal / totalKcal) * 100)}%` : "0%"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!resultError && (
                <>
                  <h3 className="result-section-title" style={{ marginTop: "var(--space-8)" }}>Allergen &amp; diet warnings</h3>
                  <div className="tag-row" id="allergen-row">
                    {analysis && analysis.allergens.length > 0 ? (
                      analysis.allergens.map((a) => (
                        <span className={`allergen-item ${a.level}`} key={a.label}>
                          <span className="material-symbols-outlined">
                            {a.level === "contains" ? "dangerous" : "help"}
                          </span>
                          {a.label}
                        </span>
                      ))
                    ) : (
                      <span className="allergen-safe">
                        <span className="material-symbols-outlined">verified</span>
                        No common allergens detected in this list
                      </span>
                    )}
                  </div>

                  <h3 className="result-section-title" style={{ marginTop: "var(--space-8)" }}>Health flags</h3>
                  <div id="health-flags">
                    {analysis && analysis.flags.length > 0 ? (
                      analysis.flags.map((f, i) => (
                        <div className={`flag flag-${f.level}`} key={`${f.title}-${i}`}>
                          <span className="material-symbols-outlined">
                            {f.level === "danger" ? "error" : "warning"}
                          </span>
                          <div>
                            <b>{f.title}</b>
                            {f.detail && <p>{f.detail}</p>}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flag flag-warn">
                        <span className="material-symbols-outlined">info</span>
                        <div>
                          <b>No specific health flags</b>
                          <p>Nothing stood out for this ingredient list, but moderation is always best.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="az-caution">
                <span className="material-symbols-outlined">info</span>
                <span>This is a demo based on keyword matching — not a substitute for the official label or a dietitian&apos;s advice.</span>
              </div>

              <div className="card-footer" style={{ margin: "var(--space-6) calc(-1 * var(--space-6)) calc(-1 * var(--space-6))", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <button type="button" className="btn btn-ghost" id="btn-restart" onClick={restart}>
                  <span className="material-symbols-outlined">refresh</span> Analyze another
                </button>
              </div>
            </div>
          </div>
          )}

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
  );
}
