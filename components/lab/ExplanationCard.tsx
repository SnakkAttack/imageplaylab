// Collapsible insight panel with four tabs (Overview, Math, Params, Observe).
// Keeps all the educational content out of modules.ts and lets the user
// drill into as much or as little detail as they want.
// Sam

"use client";
import { useState } from "react";
import type { ModuleExplanation } from "@/types/image";

type Tab = "plain" | "technical" | "params" | "cases";

const TABS: { value: Tab; label: string }[] = [
  { value: "plain",     label: "Overview"  },
  { value: "technical", label: "Math"      },
  { value: "params",    label: "Params"    },
  { value: "cases",     label: "Observe"   },
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
    <div className="flex flex-col">
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between px-4 py-3 group"
      >
        <p className="font-mono text-3xs text-night-100 uppercase tracking-widest">Insights</p>
        <svg className={`w-3 h-3 text-night-100 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="flex flex-col gap-3 px-4 pb-4 animate-fade-up">
          <p className="font-mono text-2xs text-night">{explanation.title}</p>

          {/* Tab row */}
          <div className="flex items-center gap-0 border-b border-night-400">
            {TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`pb-1.5 px-0 mr-3 font-mono text-3xs transition-colors duration-150 border-b ${
                  tab === t.value
                    ? "text-amber border-amber"
                    : "text-night-100 hover:text-night-50 border-transparent"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <p className="font-mono text-3xs text-night-50 leading-relaxed min-h-[56px]">
            {content[tab]}
          </p>

          <div className="pt-2 border-t border-night-400">
            <p className="font-mono text-3xs text-night-100 uppercase tracking-wider mb-1.5">Use cases</p>
            <p className="font-mono text-3xs text-night-50 leading-relaxed">{explanation.useCases}</p>
          </div>
        </div>
      )}
    </div>
  );
}
