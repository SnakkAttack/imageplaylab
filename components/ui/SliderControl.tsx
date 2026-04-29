"use client";
import { useEffect, useRef } from "react";

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  description?: string;
  onChange: (value: number) => void;
}

export function SliderControl({ label, value, min, max, step, unit, description, onChange }: SliderControlProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--range-pct", `${((value - min) / (max - min)) * 100}%`);
  }, [value, min, max]);

  const display = step < 1 ? value.toFixed(2) : String(value);

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <label className="font-mono text-2xs text-night-50 leading-none">{label}</label>
        <span className="font-mono text-2xs text-amber tabular-nums leading-none">
          {display}{unit && <span className="text-night-100 ml-0.5">{unit}</span>}
        </span>
      </div>
      <input
        ref={ref}
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
      {description && (
        <p className="font-mono text-3xs text-night-100 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
