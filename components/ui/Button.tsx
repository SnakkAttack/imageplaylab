"use client";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "amber" | "ghost-dark" | "ghost-light" | "ink";
  size?: "xs" | "sm";
}

const variants = {
  amber:       "bg-amber text-night-900 hover:bg-amber-100 font-mono",
  "ghost-dark":  "text-night-50 hover:text-night hover:bg-night-500 font-mono",
  "ghost-light": "text-ink-secondary hover:text-ink hover:bg-paper-100",
  ink:         "bg-ink text-paper hover:opacity-80",
};

const sizes = {
  xs: "h-6 px-2.5 text-2xs gap-1.5 rounded",
  sm: "h-7 px-3 text-xs gap-2 rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "ghost-dark", size = "xs", className = "", children, ...props }, ref) => (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center font-medium transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber/40
        disabled:opacity-30 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";
