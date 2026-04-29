"use client";
import type { ImageMetrics } from "@/types/image";

function psnrQ(v: number): "good" | "ok" | "poor" {
  if (!isFinite(v)) return "good";
  return v >= 30 ? "good" : v >= 20 ? "ok" : "poor";
}
function ssimQ(v: number): "good" | "ok" | "poor" {
  return v >= 0.95 ? "good" : v >= 0.8 ? "ok" : "poor";
}

const qColor = { good: "text-emerald-400", ok: "text-amber", poor: "text-red-400" };

function Row({ label, value, unit, q }: { label: string; value: string; unit?: string; q?: "good" | "ok" | "poor" }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-1.5 border-b border-night-400 last:border-0">
      <span className="font-mono text-3xs text-night-100 uppercase tracking-wider">{label}</span>
      <span className={`font-mono text-sm tabular-nums ${q ? qColor[q] : "text-night"}`}>
        {value}
        {unit && <span className="text-2xs text-night-100 ml-0.5 font-normal">{unit}</span>}
      </span>
    </div>
  );
}

export function MetricCard({ metrics, isProcessed }: { metrics: ImageMetrics | null; isProcessed: boolean }) {
  if (!isProcessed) return <p className="font-mono text-3xs text-night-100">apply an operation first</p>;
  if (!metrics) return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 border border-amber border-t-transparent rounded-full animate-spin" />
      <span className="font-mono text-3xs text-night-100">computing…</span>
    </div>
  );

  const psnrStr = isFinite(metrics.psnr) ? metrics.psnr.toFixed(1) : "∞";
  return (
    <div>
      <Row label="MSE"  value={metrics.mse.toFixed(2)} />
      <Row label="PSNR" value={psnrStr} unit="dB" q={psnrQ(metrics.psnr)} />
      {metrics.ssim !== undefined && (
        <Row label="SSIM" value={metrics.ssim.toFixed(4)} q={ssimQ(metrics.ssim)} />
      )}
      <p className="font-mono text-3xs text-night-200 mt-2 leading-relaxed">
        PSNR &gt;30 dB good · SSIM &gt;0.95 excellent
      </p>
    </div>
  );
}
