export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded font-mono text-3xs text-amber bg-amber/10 border border-amber/20">
      {children}
    </span>
  );
}
