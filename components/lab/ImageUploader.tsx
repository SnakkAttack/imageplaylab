// Handles both file drop and the built-in sample images.
// Large images get downscaled to 800px on upload, otherwise Canny and median
// filter on a 4K image would block the main thread for several seconds.
// Sam

"use client";
import { useCallback, useRef, useState } from "react";

const SAMPLE_IMAGES = [
  { label: "Landscape",    src: "/samples/landscape.jpg" },
  { label: "Portrait",     src: "/samples/portrait.jpg" },
  { label: "Checkerboard", src: "/samples/checkerboard.png" },
  { label: "Gradient",     src: "/samples/gradient.png" },
];

const MAX_DIM = 800;

interface ImageUploaderProps {
  onImageLoaded: (imageData: ImageData, meta: { name: string; size: number; type: string }) => void;
}

export function ImageUploader({ onImageLoaded }: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) { setError("Not an image file."); return; }
    if (file.size > 20 * 1024 * 1024)   { setError("File exceeds 20 MB limit."); return; }

    setLoading(true);
    try {
      const url = URL.createObjectURL(file);
      const img = new Image();
      await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = url; });
      const { naturalWidth: w, naturalHeight: h } = img;
      const scale  = Math.max(w, h) > MAX_DIM ? MAX_DIM / Math.max(w, h) : 1;
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      onImageLoaded(canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height),
        { name: file.name, size: file.size, type: file.type });
      if (scale < 1) setError(`Resized to ${canvas.width}×${canvas.height} px for performance.`);
    } catch { setError("Failed to load. File may be corrupted."); }
    finally   { setLoading(false); }
  }, [onImageLoaded]);

  const loadSample = useCallback(async (src: string, label: string) => {
    setError(null); setLoading(true);
    try {
      const img = new Image();
      await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = src; });
      const canvas = document.createElement("canvas");
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      onImageLoaded(canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height),
        { name: `${label} (sample)`, size: 0, type: "image/png" });
    } catch { setError("Failed to load sample."); }
    finally   { setLoading(false); }
  }, [onImageLoaded]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-12 p-10 bg-night-900">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); }}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={`
          relative flex flex-col items-center justify-center
          w-full max-w-sm aspect-video rounded-xl cursor-pointer
          border transition-all duration-200 outline-none
          focus-visible:ring-1 focus-visible:ring-amber/40
          ${dragging
            ? "border-amber/60 bg-amber/5 scale-[1.01]"
            : "border-night-300 bg-night-700 hover:border-night-200"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); e.target.value = ""; }}
        />

        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-5 h-5 border border-amber border-t-transparent rounded-full animate-spin" />
            <p className="font-mono text-2xs text-night-50">loading…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center px-8">
            <div className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${
              dragging ? "border-amber/50 bg-amber/10" : "border-night-300 bg-night-500"
            }`}>
              <svg className={`w-5 h-5 transition-colors ${dragging ? "text-amber" : "text-night-50"}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div>
              <p className="font-mono text-2xs text-night">
                {dragging ? "drop to load" : "click or drag to upload"}
              </p>
              <p className="font-mono text-3xs text-night-100 mt-1.5">JPEG · PNG · WebP · max 20 MB</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="font-mono text-2xs text-amber/70 max-w-xs text-center">{error}</p>
      )}

      {/* Samples */}
      <div className="flex flex-col items-center gap-4">
        <p className="font-mono text-3xs text-night-100 uppercase tracking-widest">
          or load a sample
        </p>
        <div className="flex gap-3">
          {SAMPLE_IMAGES.map((s) => (
            <button
              key={s.src}
              onClick={() => loadSample(s.src, s.label)}
              className="group flex flex-col items-center gap-2"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden border border-night-300 bg-night-600 group-hover:border-night-200 transition-colors">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="font-mono text-3xs text-night-100 group-hover:text-amber transition-colors">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
