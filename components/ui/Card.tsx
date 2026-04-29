import { HTMLAttributes } from "react";

// thin wrapper; prefer direct bg/border utilities in the dark UI
export function Card({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-night-600 border border-night-400 rounded-lg ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`font-mono text-2xs text-night-50 uppercase tracking-widest ${className}`} {...props}>
      {children}
    </h3>
  );
}
