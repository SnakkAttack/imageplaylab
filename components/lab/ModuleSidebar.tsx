"use client";
import type { ModuleDef, ModuleId } from "@/types/image";

interface ModuleSidebarProps {
  modules: ModuleDef[];
  activeModuleId: ModuleId;
  onSelect: (id: ModuleId) => void;
  hasImage: boolean;
}

export function ModuleSidebar({ modules, activeModuleId, onSelect, hasImage }: ModuleSidebarProps) {
  return (
    <aside className="flex flex-col bg-parchment-50 border-r border-parchment-200 py-3 overflow-y-auto scrollbar-thin">
      <p className="px-4 mb-2 text-2xs font-semibold text-ink-400 uppercase tracking-widest">
        Modules
      </p>
      <div className="flex flex-col gap-0.5 px-2">
        {modules.map((mod) => {
          const isActive = mod.id === activeModuleId;
          const enabled = hasImage || mod.id === "basics";

          return (
            <button
              key={mod.id}
              onClick={() => enabled && onSelect(mod.id)}
              disabled={!enabled}
              aria-current={isActive ? "page" : undefined}
              className={`
                group relative flex items-center gap-2.5 w-full px-2 py-1.5 rounded-lg text-left
                transition-all duration-150
                ${isActive
                  ? "bg-accent-50 text-accent"
                  : enabled
                    ? "text-ink-600 hover:bg-parchment-100 hover:text-ink-900"
                    : "text-ink-200 cursor-not-allowed"
                }
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-accent" />
              )}

              <span className="text-base leading-none shrink-0">{mod.icon}</span>
              <div className="min-w-0">
                <div className={`text-2xs font-medium leading-snug ${isActive ? "text-accent" : ""}`}>
                  {mod.label}
                </div>
                {isActive && (
                  <div className="text-[10px] text-accent/70 leading-tight mt-0.5 truncate">
                    {mod.shortDescription}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
