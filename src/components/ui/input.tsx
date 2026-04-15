import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-8 w-full rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-2 py-1 text-xs text-[var(--app-text)] placeholder:text-[var(--app-muted)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--app-accent)]",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
