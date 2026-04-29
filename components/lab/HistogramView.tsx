// Renders the histogram directly to a <canvas> for performance.
// Using React state + SVG here would re-render 256 bars on every slider move,
// which is noticeably janky. Canvas drawRect in a useEffect is much smoother.
// Sam

"use client";
import { useEffect, useRef } from "react";
import type { HistogramData } from "@/types/image";

interface HistogramViewProps {
  histogramData: HistogramData | null;
  mode?: "luminance" | "rgb";
}

export function HistogramView({ histogramData, mode = "luminance" }: HistogramViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !histogramData) return;
    const ctx = canvas.getContext("2d")!;
    const { width: W, height: H } = canvas;

    ctx.clearRect(0, 0, W, H);

    const channels = mode === "rgb"
      ? [
          { data: histogramData.red,       color: "rgba(255,100,80,0.7)"  },
          { data: histogramData.green,     color: "rgba(80,220,120,0.7)"  },
          { data: histogramData.blue,      color: "rgba(100,160,255,0.7)" },
        ]
      : [{ data: histogramData.luminance, color: "rgba(255,170,0,0.75)"  }];

    const allMax = Math.max(...channels.flatMap((c) => c.data), 1);
    const bW = W / 256;

    for (const { data, color } of channels) {
      ctx.fillStyle = color;
      for (let i = 0; i < 256; i++) {
        const bH = (data[i] / allMax) * H;
        ctx.fillRect(i * bW, H - bH, Math.max(bW - 0.2, 0.5), bH);
      }
    }
  }, [histogramData, mode]);

  if (!histogramData) {
    return (
      <div className="h-14 flex items-end gap-px px-0.5">
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} className="flex-1 rounded-sm bg-night-400" style={{ height: `${20 + Math.sin(i) * 15}%` }} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <canvas
        ref={canvasRef}
        width={256}
        height={56}
        className="w-full rounded"
        style={{ background: "#0A0A0B" }}
        aria-label="histogram"
      />
      <div className="flex justify-between font-mono text-3xs text-night-200">
        <span>0</span>
        <span>128</span>
        <span>255</span>
      </div>
    </div>
  );
}
