"use client";
import type { ModuleDef, ModuleId } from "@/types/image";

interface ModuleTabsProps {
  modules: ModuleDef[];
  activeModuleId: ModuleId;
  onSelect: (id: ModuleId) => void;
  hasImage: boolean;
}

export function ModuleTabs({ modules, activeModuleId, onSelect, hasImage }: ModuleTabsProps) {
  return (
    <div className="flex items-center h-9 shrink-0 bg-night-700 border-b border-night-400 px-2 gap-0.5 overflow-x-auto scrollbar-none">
      {modules.map((mod) => {
        const isActive  = mod.id === activeModuleId;
        const enabled   = hasImage || mod.id === "basics";

        return (
          <button
            key={mod.id}
            onClick={() => enabled && onSelect(mod.id)}
            disabled={!enabled}
            aria-current={isActive ? "page" : undefined}
            className={`
              relative h-7 px-3 rounded text-2xs font-mono whitespace-nowrap
              transition-colors duration-150 shrink-0 select-none
              ${isActive
                ? "text-amber"
                : enabled
                  ? "text-night-50 hover:text-night"
                  : "text-night-200 cursor-not-allowed"
              }
            `}
          >
            {mod.label}
            {/* Amber underline for active tab */}
            {isActive && (
              <span className="absolute bottom-0.5 left-3 right-3 h-px bg-amber rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
