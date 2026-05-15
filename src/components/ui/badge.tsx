import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium leading-none transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "",
        secondary: "",
        outline: "",
        destructive: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Styling is driven by the ambient slide theme CSS variables so the same badge
 * looks master-appropriate whether it renders on Corporate Blue, Startup Modern
 * or Executive Dark. Inline styles are used because theme colors live in CSS
 * vars (`--slide-*`) rather than Tailwind tokens.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", style, ...props }, ref) => {
    const variantStyle: React.CSSProperties =
      variant === "secondary"
        ? {
            background:
              "color-mix(in srgb, var(--slide-primary) 12%, transparent)",
            color: "var(--slide-primary)",
            borderColor:
              "color-mix(in srgb, var(--slide-primary) 30%, transparent)",
          }
        : variant === "outline"
          ? {
              background: "transparent",
              color: "var(--slide-text)",
              borderColor:
                "color-mix(in srgb, var(--slide-text) 25%, transparent)",
            }
          : variant === "destructive"
            ? {
                background: "var(--slide-accent)",
                color: "var(--slide-bg)",
                borderColor: "var(--slide-accent)",
              }
            : {
                background: "var(--slide-primary)",
                color: "var(--slide-bg)",
                borderColor: "var(--slide-primary)",
              };

    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        style={{ ...variantStyle, ...style }}
        {...props}
      />
    );
  },
);
Badge.displayName = "Badge";
