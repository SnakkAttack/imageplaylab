// Canvas area: shows original vs processed in split, slider, or result-only modes.
// The slider mode was tricky, had to track drag state in a ref instead of state
// so mousemove handlers don't stale-close over old slider positions.
// Sam

"use client";
import { useRef, useEffect, useState } from "react";
import { imageDataToDataUrl } from "@/lib/image-processing/canvas-utils";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import type { ImageState } from "@/types/image";

type ViewMode = "split" | "slider" | "result";

const VIEW_OPTS: { value: ViewMode; label: string }[] = [
  { value: "split",  label: "Split" },
  { value: "slider", label: "Slider" },
  { value: "result", label: "Result" },
];

interface ImageWorkspaceProps {
  imageState: ImageState;
  operationLabel: string;
}

export function ImageWorkspace({ imageState, operationLabel }: ImageWorkspaceProps) {
  const { original, processed, width, height, fileName, fileSize, fileType } = imageState;
  const [mode, setMode]       = useState<ViewMode>("split");
  const [sliderX, setSliderX] = useState(0.5);
  const sliderRef  = useRef<HTMLDivElement>(null);
  const dragging   = useRef(false);

  const origUrl = original  ? imageDataToDataUrl(original)  : null;
  const procUrl = processed ? imageDataToDataUrl(processed) : null;

  const updateSlider = (clientX: number) => {
    if (!sliderRef.current) return;
    const r = sliderRef.current.getBoundingClientRect();
    setSliderX(Math.max(0.02, Math.min(0.98, (clientX - r.left) / r.width)));
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging.current) updateSlider(e.clientX); };
    const onUp   = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  const handleDownload = () => {
    if (!procUrl) return;
    const a = document.createElement("a");
    a.href = procUrl;
    a.download = `ipl_${(fileName || "image").replace(/\s+/g, "_")}.png`;
    a.click();
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Toolbar */}
      <div className="h-9 shrink-0 flex items-center gap-3 px-3 bg-night-700 border-b border-night-400">
        <SegmentedControl options={VIEW_OPTS} value={mode} onChange={setMode} />
        <div className="flex-1" />
        {width > 0 && (
          <div className="flex items-center gap-2 font-mono text-3xs text-night-100">
            <span>{width}×{height}</span>
            {fileSize > 0 && <span>·</span>}
            {fileSize > 0 && <span>{(fileSize / 1024).toFixed(0)}K</span>}
            {fileType && <span>· {fileType.split("/")[1]?.toUpperCase()}</span>}
          </div>
        )}
        <button
          onClick={handleDownload}
          disabled={!procUrl}
          className="flex items-center gap-1 font-mono text-3xs text-night-100 hover:text-amber transition-colors disabled:opacity-20"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          export
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-night-900 min-h-0 overflow-hidden">
        {mode === "split" && (
          <div className="h-full grid grid-cols-2 gap-px bg-night-400">
            <Pane label="original" url={origUrl} />
            <Pane label={operationLabel.toLowerCase()} url={procUrl} accent />
          </div>
        )}

        {mode === "slider" && (
          <div
            ref={sliderRef}
            className="relative h-full select-none cursor-col-resize"
            onMouseDown={(e) => { dragging.current = true; updateSlider(e.clientX); }}
          >
            {procUrl && <img src={procUrl} alt="processed" className="absolute inset-0 w-full h-full object-contain" draggable={false} />}
            {origUrl && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderX * 100}%` }}>
                <img src={origUrl} alt="original" className="absolute inset-0 h-full object-contain" draggable={false}
                  style={{ width: `${100 / sliderX}%`, maxWidth: "none" }} />
              </div>
            )}
            {/* Divider */}
            <div className="absolute top-0 bottom-0 w-px bg-amber/80" style={{ left: `${sliderX * 100}%` }}>
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-night-600 border border-amber/50 shadow-glow flex items-center justify-center">
                <svg className="w-3 h-3 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
                </svg>
              </div>
            </div>
            <Label text="original" position="left" />
            <Label text={operationLabel.toLowerCase()} position="right" accent />
          </div>
        )}

        {mode === "result" && (
          <div className="h-full flex items-center justify-center p-4">
            {procUrl
              ? <img src={procUrl} alt="result" className="max-w-full max-h-full object-contain animate-fade-in" draggable={false} />
              : <span className="font-mono text-2xs text-night-200">no output</span>
            }
          </div>
        )}
      </div>
    </div>
  );
}

function Pane({ label, url, accent = false }: { label: string; url: string | null; accent?: boolean }) {
  return (
    <div className="relative flex items-center justify-center p-3 bg-night-900">
      {url
        ? <img src={url} alt={label} className="max-w-full max-h-full object-contain animate-fade-in" draggable={false} />
        : <span className="font-mono text-3xs text-night-200">...</span>
      }
      <Label text={label} position="left" accent={accent} />
    </div>
  );
}

function Label({ text, position, accent = false }: { text: string; position: "left" | "right"; accent?: boolean }) {
  return (
    <span className={`
      absolute top-2 font-mono text-3xs px-1.5 py-0.5 rounded
      ${position === "left" ? "left-2" : "right-2"}
      ${accent ? "text-amber bg-amber/10 border border-amber/20" : "text-night-100 bg-night-700/80"}
    `}>
      {text}
    </span>
  );
}
