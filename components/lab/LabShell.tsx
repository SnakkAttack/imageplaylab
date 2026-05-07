// Top-level lab component. Owns all image state and wires the control panel
// to the processor. Processing runs in a setTimeout(0) so the UI doesn't freeze
// while the algorithm runs, and we debounce slider input at 60ms so we're not
// re-running Canny on every single drag tick.
// Gage + Sam

"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { ModuleTabs }      from "./ModuleTabs";
import { ImageUploader }   from "./ImageUploader";
import { ImageWorkspace }  from "./ImageWorkspace";
import { ControlPanel }    from "./ControlPanel";
import { ExplanationCard } from "./ExplanationCard";
import { HistogramView }   from "./HistogramView";
import { MetricCard }      from "./MetricCard";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { MODULE_DEFS }      from "@/data/modules";
import { processImage }     from "@/lib/image-processing/processor";
import { computeHistogram } from "@/lib/image-processing/histogram";
import { computeMetrics }   from "@/lib/image-processing/metrics";
import { applyOtsuThreshold } from "@/lib/image-processing/thresholding";
import { cloneImageData }   from "@/lib/image-processing/canvas-utils";
import type { ImageState, ModuleId, OperationParams, ImageMetrics, HistogramData, ActiveOperation } from "@/types/image";

const DEFAULT_MODULE: ModuleId = "basics";

function getDefaultOp(moduleId: ModuleId) {
  const mod = MODULE_DEFS.find((m) => m.id === moduleId)!;
  const op  = mod.operations[0];
  const params: OperationParams = {};
  for (const p of op.params) params[p.key] = p.defaultValue;
  return { operationId: op.id, params };
}

type HistMode = "luminance" | "rgb";

export function LabShell() {
  const [imageState, setImageState] = useState<ImageState>({
    original: null, processed: null, width: 0, height: 0,
    fileName: "", fileSize: 0, fileType: "",
  });
  const [activeModuleId, setActiveModuleId] = useState<ModuleId>(DEFAULT_MODULE);
  const [activeOp, setActiveOp]             = useState(() => getDefaultOp(DEFAULT_MODULE));
  const [metrics, setMetrics]               = useState<ImageMetrics | null>(null);
  const [histogram, setHistogram]           = useState<HistogramData | null>(null);
  const [histMode, setHistMode]             = useState<HistMode>("luminance");
  const [otsuThreshold, setOtsuThreshold]   = useState<number | undefined>(undefined);
  const [processing, setProcessing]         = useState(false);
  const [hasImage, setHasImage]             = useState(false);
  const [lastOpLabel, setLastOpLabel]       = useState("original");
  const debounce      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imageStateRef = useRef(imageState);
  useEffect(() => { imageStateRef.current = imageState; }, [imageState]);

  const activeModule   = MODULE_DEFS.find((m) => m.id === activeModuleId)!;
  const activeOpDef    = activeModule.operations.find((o) => o.id === activeOp.operationId);
  const operationLabel = activeOpDef?.label ?? activeModule.label;

  const runProcessing = useCallback((original: ImageData, op: ActiveOperation) => {
    setProcessing(true);
    setTimeout(() => {
      try {
        let processed: ImageData;
        let otsu: number | undefined;

        if (op.moduleId === "threshold" && op.operationId === "otsu") {
          const r = applyOtsuThreshold(original);
          processed = r.imageData;
          otsu = r.threshold;
        } else {
          processed = processImage(original, op);
        }

        setOtsuThreshold(otsu);
        setImageState((prev) => ({ ...prev, processed }));

        const trivial = ["original", "histogram_view"];
        if (!trivial.includes(op.operationId)) {
          setMetrics(computeMetrics(original, processed));
          setHistogram(computeHistogram(processed));
        } else {
          setMetrics(null);
          setHistogram(computeHistogram(original));
        }
      } finally {
        setProcessing(false);
      }
    }, 0);
  }, []);

  useEffect(() => {
    if (!imageState.original) return;
    if (activeModuleId === "metrics") return; // metrics reads last processed, never re-processes
    setLastOpLabel(operationLabel);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      runProcessing(imageState.original!, {
        moduleId: activeModuleId,
        operationId: activeOp.operationId,
        params: activeOp.params,
      });
    }, 60);
    return () => { if (debounce.current) clearTimeout(debounce.current); };
  }, [activeModuleId, activeOp, imageState.original, runProcessing, operationLabel]);

  const handleImageLoaded = useCallback((imageData: ImageData, meta: { name: string; size: number; type: string }) => {
    const original = cloneImageData(imageData);
    setImageState({
      original, processed: cloneImageData(original),
      width: original.width, height: original.height,
      fileName: meta.name, fileSize: meta.size, fileType: meta.type,
    });
    setHasImage(true);
    setHistogram(computeHistogram(original));
    setMetrics(null);
  }, []);

  const handleModuleChange = useCallback((id: ModuleId) => {
    setActiveModuleId(id);
    if (id === "metrics") {
      // freeze canvas at last processed image, compute metrics on it vs original
      setActiveOp(getDefaultOp("metrics"));
      const { original, processed } = imageStateRef.current;
      if (original && processed) {
        setMetrics(computeMetrics(original, processed));
        setHistogram(computeHistogram(processed));
      }
      return;
    }
    setActiveOp(getDefaultOp(id));
    setMetrics(null);
  }, []);

  const handleOpChange = useCallback((operationId: string, params: OperationParams) => {
    setActiveOp({ operationId, params });
  }, []);

  const handleParamChange = useCallback((key: string, value: number | string) => {
    setActiveOp((prev) => ({ ...prev, params: { ...prev.params, [key]: value } }));
  }, []);

  const handleReset = useCallback(() => setActiveOp(getDefaultOp(activeModuleId)), [activeModuleId]);

  const handleChangeImage = useCallback(() => {
    setHasImage(false);
    setImageState({ original: null, processed: null, width: 0, height: 0, fileName: "", fileSize: 0, fileType: "" });
    setMetrics(null);
    setHistogram(null);
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Module tabs strip */}
      <ModuleTabs
        modules={MODULE_DEFS}
        activeModuleId={activeModuleId}
        onSelect={handleModuleChange}
        hasImage={hasImage}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col md:grid md:grid-cols-[1fr_240px] min-h-0 divide-y md:divide-y-0 md:divide-x divide-night-400">

        {/* ── Center: image workspace + insights ───────────────── */}
        <main className="flex flex-col min-h-0 flex-1 md:flex-none">
          {hasImage ? (
            <>
              {/* Status bar */}
              <div className="h-8 shrink-0 flex items-center gap-2 px-3 bg-night-700 border-b border-night-400">
                <span className="font-mono text-3xs text-night-100">{activeModule.label}</span>
                <span className="text-night-300">·</span>
                <span className="font-mono text-3xs text-amber">{operationLabel}</span>
                {processing && (
                  <span className="flex items-center gap-1.5 ml-1">
                    <span className="w-2 h-2 border border-amber border-t-transparent rounded-full animate-spin" />
                    <span className="font-mono text-3xs text-night-100">processing</span>
                  </span>
                )}
                <div className="flex-1" />
                <button
                  onClick={handleChangeImage}
                  className="font-mono text-3xs text-night-100 hover:text-amber transition-colors"
                >
                  change image
                </button>
              </div>
              <ImageWorkspace
                imageState={imageState}
                operationLabel={operationLabel}
                processedLabel={activeModuleId === "metrics" ? lastOpLabel : operationLabel}
                operationId={activeOp.operationId}
                params={activeOp.params}
              />
            </>
          ) : (
            <ImageUploader onImageLoaded={handleImageLoaded} />
          )}

          {/* Insights panel: full width below the canvas */}
          <ExplanationCard explanation={activeModule.explanation} />
        </main>

        {/* ── Right: instrument panel ──────────────────────────── */}
        <aside className="flex flex-col overflow-y-auto scrollbar-dark bg-night-700 divide-y divide-night-400 h-72 md:h-auto shrink-0 md:shrink">

          {/* Controls */}
          <div className="p-4">
            <p className="font-mono text-3xs text-night-100 uppercase tracking-widest mb-3">
              {activeModule.label}
            </p>
            {hasImage ? (
              <ControlPanel
                module={activeModule}
                activeOperationId={activeOp.operationId}
                params={activeOp.params}
                onOperationChange={handleOpChange}
                onParamChange={handleParamChange}
                onReset={handleReset}
                otsuThreshold={otsuThreshold}
              />
            ) : (
              <p className="font-mono text-3xs text-night-200">load an image to begin</p>
            )}
          </div>

          {/* Histogram */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-3xs text-night-100 uppercase tracking-widest">Histogram</p>
              <SegmentedControl
                options={[{ value: "luminance", label: "Gray" }, { value: "rgb", label: "RGB" }]}
                value={histMode}
                onChange={setHistMode}
              />
            </div>
            <HistogramView
              histogramData={histogram}
              mode={histMode}
              threshold={
                activeModuleId === "threshold"
                  ? (activeOp.operationId === "otsu" ? otsuThreshold : Number(activeOp.params.threshold ?? 128))
                  : undefined
              }
            />
          </div>

          {/* Metrics: only visible in the metrics module */}
          {activeModuleId === "metrics" && (
            <div className="p-4">
              <p className="font-mono text-3xs text-night-100 uppercase tracking-widest mb-3">Quality</p>
              <MetricCard metrics={metrics} isProcessed={hasImage} />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
