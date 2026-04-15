import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex w-full rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-2 py-1.5 text-xs text-[var(--app-text)] placeholder:text-[var(--app-muted)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--app-accent)] resize-y font-[inherit] leading-snug",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
