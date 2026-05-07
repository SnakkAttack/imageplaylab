"use client";
import { SliderControl } from "@/components/ui/SliderControl";
import { KernelVisualizer } from "./KernelVisualizer";
import type { ModuleDef, OperationDef, OperationParams, SliderParam, SelectParam } from "@/types/image";

function isSlider(p: SliderParam | SelectParam): p is SliderParam { return "min" in p; }

interface ControlPanelProps {
  module: ModuleDef;
  activeOperationId: string;
  params: OperationParams;
  onOperationChange: (operationId: string, defaultParams: OperationParams) => void;
  onParamChange: (key: string, value: number | string) => void;
  onReset: () => void;
  otsuThreshold?: number;
}

export function ControlPanel({ module, activeOperationId, params, onOperationChange, onParamChange, onReset, otsuThreshold }: ControlPanelProps) {
  const activeOp = module.operations.find((o) => o.id === activeOperationId);

  const handleOpChange = (op: OperationDef) => {
    const defaults: OperationParams = {};
    for (const p of op.params) defaults[p.key] = p.defaultValue;
    onOperationChange(op.id, defaults);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Operation selector */}
      {module.operations.length > 1 && (
        <div>
          <p className="font-mono text-3xs text-night-100 uppercase tracking-widest mb-2">Operation</p>
          <div className="flex flex-col gap-0.5">
            {module.operations.map((op) => (
              <button
                key={op.id}
                onClick={() => handleOpChange(op)}
                className={`w-full text-left px-2 py-1.5 rounded font-mono text-2xs transition-colors duration-100 ${
                  op.id === activeOperationId
                    ? "text-amber bg-amber/8"
                    : "text-night-50 hover:text-night hover:bg-night-500"
                }`}
              >
                {op.id === activeOperationId && (
                  <span className="inline-block w-1 h-1 rounded-full bg-amber mr-1.5 align-middle" />
                )}
                {op.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Parameters */}
      {activeOp && activeOp.params.length > 0 && (
        <div className="flex flex-col gap-4">
          <p className="font-mono text-3xs text-night-100 uppercase tracking-widest">Parameters</p>
          {activeOp.params.map((p) => {
            if (isSlider(p)) {
              return (
                <SliderControl
                  key={p.key}
                  label={p.label}
                  value={Number(params[p.key] ?? p.defaultValue)}
                  min={p.min} max={p.max} step={p.step}
                  unit={p.unit}
                  description={p.description}
                  onChange={(v) => onParamChange(p.key, v)}
                />
              );
            }
            const sp = p as SelectParam;
            return (
              <div key={sp.key} className="space-y-1.5">
                <p className="font-mono text-2xs text-night-50">{sp.label}</p>
                <select
                  value={String(params[sp.key] ?? sp.defaultValue)}
                  onChange={(e) => onParamChange(sp.key, e.target.value)}
                  className="w-full font-mono text-2xs bg-night-500 border border-night-300 rounded px-2 py-1.5 text-night focus:outline-none focus:border-amber/50"
                >
                  {sp.options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            );
          })}
        </div>
      )}

      {/* Kernel visualizer */}
      {activeOp && (
        <KernelVisualizer operationId={activeOperationId} params={params} />
      )}

      {/* Otsu result */}
      {activeOperationId === "otsu" && otsuThreshold !== undefined && (
        <div className="flex items-center justify-between py-2 px-2.5 bg-amber/8 border border-amber/20 rounded">
          <p className="font-mono text-3xs text-amber/70 uppercase tracking-wider">Otsu T</p>
          <span className="font-mono text-lg text-amber text-glow">{otsuThreshold}</span>
        </div>
      )}

      {/* Reset */}
      <button
        onClick={onReset}
        className="self-start flex items-center gap-1.5 font-mono text-3xs text-night-100 hover:text-amber transition-colors"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        reset
      </button>
    </div>
  );
}
