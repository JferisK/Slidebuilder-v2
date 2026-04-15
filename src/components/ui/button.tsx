import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "ghost" | "destructive" | "outline";
type Size = "sm" | "md" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  default:
    "bg-[var(--app-accent)] text-white hover:bg-[var(--app-accent-hover)]",
  secondary:
    "bg-[var(--app-surface)] text-[var(--app-text)] hover:bg-[#262626] border border-[var(--app-border)]",
  ghost: "bg-transparent text-[var(--app-text)] hover:bg-[var(--app-surface)]",
  destructive:
    "bg-transparent text-[var(--app-destructive)] hover:bg-[rgba(239,68,68,0.1)]",
  outline:
    "bg-transparent border border-[var(--app-border)] text-[var(--app-text)] hover:bg-[var(--app-surface)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-7 px-2 text-xs",
  md: "h-8 px-3 text-xs",
  icon: "h-7 w-7 p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "md", type = "button", ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--app-accent)]",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
