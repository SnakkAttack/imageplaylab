// Shows the NxN weight matrix for convolution and morphology ops.
// Color-coded: amber = positive weight, sky = negative weight, gray = zero.
// Updates live as kernel size / sigma sliders move.
// Median and bilateral are non-linear (no fixed weights), so they are excluded.
// Sharpen shows the effective unsharp-mask kernel: (1+amount)*identity - amount*gaussian.

import { buildGaussianKernel } from "@/lib/image-processing/filtering";
import type { OperationParams } from "@/types/image";

export const KERNEL_OPS = new Set([
  "mean_blur", "gaussian_blur", "sharpen",
  "erosion", "dilation", "opening", "closing", "morph_gradient",
  "sobel", "prewitt", "scharr", "laplacian", "emboss",
]);

type KernelDef =
  | { type: "single"; matrix: number[][] }
  | { type: "pair"; labelA: string; matrixA: number[][]; labelB: string; matrixB: number[][] };

function oddClamped(raw: number): number {
  const k = Math.max(3, raw);
  return k % 2 === 0 ? k + 1 : k;
}

function buildKernel(operationId: string, params: OperationParams): KernelDef | null {
  const k = oddClamped(Number(params.kernelSize ?? 3));

  switch (operationId) {
    case "mean_blur": {
      const v = 1 / (k * k);
      return { type: "single", matrix: Array.from({ length: k }, () => Array(k).fill(v)) };
    }
    case "gaussian_blur": {
      const sigma = Number(params.sigma ?? 1.0);
      return { type: "single", matrix: buildGaussianKernel(k, sigma) };
    }
    case "erosion":
    case "dilation":
    case "opening":
    case "closing":
    case "morph_gradient":
      return { type: "single", matrix: Array.from({ length: k }, () => Array(k).fill(1)) };
    case "sobel":
      return {
        type: "pair",
        labelA: "Gx", matrixA: [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]],
        labelB: "Gy", matrixB: [[-1, -2, -1], [0, 0, 0], [1, 2, 1]],
      };
    case "prewitt":
      return {
        type: "pair",
        labelA: "Gx", matrixA: [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]],
        labelB: "Gy", matrixB: [[-1, -1, -1], [0, 0, 0], [1, 1, 1]],
      };
    case "scharr":
      return {
        type: "pair",
        labelA: "Gx", matrixA: [[-3, 0, 3], [-10, 0, 10], [-3, 0, 3]],
        labelB: "Gy", matrixB: [[-3, -10, -3], [0, 0, 0], [3, 10, 3]],
      };
    case "laplacian":
      return { type: "single", matrix: [[0, 1, 0], [1, -4, 1], [0, 1, 0]] };
    case "emboss":
      return { type: "single", matrix: [[-2, -1, 0], [-1, 1, 1], [0, 1, 2]] };
    case "sharpen": {
      // Unsharp mask effective kernel = (1+amount)*identity - amount*gaussian(5,1.0)
      const amount = Number(params.amount ?? 1.0);
      const gauss = buildGaussianKernel(5, 1.0);
      const matrix = gauss.map((row, ri) =>
        row.map((v, ci) => {
          const isCenter = ri === 2 && ci === 2;
          return (isCenter ? 1 + amount : 0) - amount * v;
        })
      );
      return { type: "single", matrix };
    }
    default:
      return null;
  }
}

function fmt(v: number): string {
  if (Math.abs(v) < 0.00005) return "0";
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

function cellStyle(v: number, maxAbs: number): string {
  if (Math.abs(v) < 0.00005) return "bg-night-600 text-night-300";
  const t = Math.abs(v) / maxAbs;
  if (v > 0) return t > 0.55 ? "bg-amber/25 text-amber" : "bg-amber/10 text-amber/60";
  return t > 0.55 ? "bg-sky-400/25 text-sky-300" : "bg-sky-400/10 text-sky-300/60";
}

function getCellCls(n: number, size: "sm" | "lg", pairMode: boolean): string {
  if (size === "lg") {
    if (pairMode) return n <= 3 ? "w-14 h-11 text-xl" : "w-10 h-9 text-sm";
    if (n <= 3) return "w-20 h-14 text-2xl";
    if (n <= 5) return "w-14 h-11 text-lg";
    return "w-12 h-9 text-xs";
  }
  if (pairMode) return "w-6 h-[18px] text-[7px]";
  if (n <= 3) return "w-8 h-[22px] text-[9px]";
  if (n <= 5) return "w-7 h-5 text-[8px]";
  return "w-[22px] h-4 text-[7px]";
}

function KernelGrid({
  matrix, label, pairMode = false, size = "sm",
}: {
  matrix: number[][];
  label?: string;
  pairMode?: boolean;
  size?: "sm" | "lg";
}) {
  const CAP = 7;
  const clipped = matrix.length > CAP;
  const rows = clipped ? matrix.slice(0, CAP).map((r) => r.slice(0, CAP)) : matrix;
  const n = rows.length;
  const maxAbs = Math.max(...rows.flat().map(Math.abs), 1e-9);
  const cellCls = getCellCls(n, size, pairMode);
  const gapCls = size === "lg" ? "gap-1" : "gap-px";
  const labelCls = size === "lg"
    ? "font-mono text-xs text-night-200 mb-1"
    : "font-mono text-3xs text-night-200 mb-0.5";

  return (
    <div className="flex flex-col items-center gap-0.5">
      {label && <p className={labelCls}>{label}</p>}
      <div className={`flex flex-col ${gapCls}`}>
        {rows.map((row, ri) => (
          <div key={ri} className={`flex ${gapCls}`}>
            {row.map((v, ci) => (
              <div
                key={ci}
                className={`flex items-center justify-center font-mono rounded leading-none overflow-hidden ${cellCls} ${cellStyle(v, maxAbs)}`}
              >
                {fmt(v)}
              </div>
            ))}
          </div>
        ))}
      </div>
      {clipped && (
        <p className={`font-mono text-night-300 mt-0.5 ${size === "lg" ? "text-xs" : "text-[7px]"}`}>
          {matrix.length}x{matrix.length} (showing 7x7)
        </p>
      )}
    </div>
  );
}

interface KernelVisualizerProps {
  operationId: string;
  params: OperationParams;
  size?: "sm" | "lg";
}

export function KernelVisualizer({ operationId, params, size = "sm" }: KernelVisualizerProps) {
  if (!KERNEL_OPS.has(operationId)) return null;
  const def = buildKernel(operationId, params);
  if (!def) return null;

  if (size === "lg") {
    return def.type === "single" ? (
      <KernelGrid matrix={def.matrix} size="lg" />
    ) : (
      <div className="flex gap-12">
        <KernelGrid matrix={def.matrixA} label={def.labelA} pairMode size="lg" />
        <KernelGrid matrix={def.matrixB} label={def.labelB} pairMode size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-3xs text-night-100 uppercase tracking-widest">Kernel</p>
      {def.type === "single" ? (
        <div className="flex justify-center overflow-x-auto">
          <KernelGrid matrix={def.matrix} />
        </div>
      ) : (
        <div className="flex justify-around">
          <KernelGrid matrix={def.matrixA} label={def.labelA} pairMode />
          <KernelGrid matrix={def.matrixB} label={def.labelB} pairMode />
        </div>
      )}
    </div>
  );
}
