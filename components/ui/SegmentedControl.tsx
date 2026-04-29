"use client";

interface Option<T extends string> { value: T; label: string; }

interface SegmentedControlProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  dark?: boolean;
}

export function SegmentedControl<T extends string>({ options, value, onChange, dark = true }: SegmentedControlProps<T>) {
  if (dark) {
    return (
      <div className="inline-flex items-center bg-night-500 rounded p-0.5 gap-0.5">
        {options.map((opt) => (
          <button key={opt.value} onClick={() => onChange(opt.value)}
            className={`h-5 px-2 rounded font-mono text-3xs transition-all duration-150 ${
              value === opt.value
                ? "bg-night-300 text-night text-glow"
                : "text-night-50 hover:text-night"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="inline-flex items-center bg-paper-100 rounded-lg p-0.5 gap-0.5">
      {options.map((opt) => (
        <button key={opt.value} onClick={() => onChange(opt.value)}
          className={`h-6 px-2.5 rounded-md text-xs font-medium transition-all duration-150 ${
            value === opt.value
              ? "bg-white text-ink shadow-paper"
              : "text-ink-secondary hover:text-ink"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
