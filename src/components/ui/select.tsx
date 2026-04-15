import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  options: SelectOption[];
  onValueChange?: (value: string) => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, onValueChange, value, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        className={cn(
          "flex h-8 w-full appearance-none rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] pl-2 pr-7 text-xs text-[var(--app-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--app-accent)]",
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            style={{ background: "#1c1c1c", color: "#e8e8e8" }}
          >
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--app-muted)]"
      />
    </div>
  ),
);
Select.displayName = "Select";
