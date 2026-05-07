// Educational panel: Overview, Math, Params, Observe tabs.
// Moved below the canvas so it gets full width instead of being crammed into the 240px aside.
// Sam

"use client";
import { useState } from "react";
import type { ModuleExplanation } from "@/types/image";

type Tab = "plain" | "technical" | "params" | "cases";

const TABS: { value: Tab; label: string }[] = [
  { value: "plain",     label: "Overview" },
  { value: "technical", label: "Math"     },
  { value: "params",    label: "Params"   },
  { value: "cases",     label: "Observe"  },
];

export function ExplanationCard({ explanation }: { explanation: ModuleExplanation }) {
  const [open, setOpen] = useState(true);
  const [tab, setTab]   = useState<Tab>("plain");

  const content: Record<Tab, string> = {
    plain:     explanation.plainEnglish,
    technical: explanation.technical,
    params:    explanation.parameters,
    cases:     explanation.lookFor,
  };

  return (
    <div className="shrink-0 border-t border-night-400 bg-night-800">
      {/* Header row */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-night-400">
        <div className="flex items-center gap-4">
          <p className="font-mono text-3xs text-night-100 uppercase tracking-widest">Insights</p>
          <span className="font-mono text-2xs text-night font-bold">{explanation.title}</span>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 font-mono text-3xs text-night-100 hover:text-amber transition-colors"
        >
          {open ? "collapse" : "expand"}
          <svg className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="flex flex-col md:flex-row min-h-0">
          {/* Tab sidebar */}
          <div className="flex md:flex-col gap-0 border-b md:border-b-0 md:border-r border-night-400 shrink-0">
            {TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`px-4 py-2.5 font-mono text-2xs text-left whitespace-nowrap transition-colors duration-150 border-b-2 md:border-b-0 md:border-l-2 ${
                  tab === t.value
                    ? "text-amber border-amber bg-amber/5"
                    : "text-night-100 hover:text-night-50 border-transparent hover:bg-night-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content area */}
          <div className="flex-1 p-4 md:p-5 flex flex-col gap-3 min-h-[120px]">
            <p className="font-mono text-xs text-night-50 leading-relaxed">
              {content[tab]}
            </p>
            <div className="pt-3 border-t border-night-400 mt-auto">
              <span className="font-mono text-3xs text-amber/60 uppercase tracking-wider mr-2">Use cases</span>
              <span className="font-mono text-3xs text-night-100 leading-relaxed">{explanation.useCases}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
