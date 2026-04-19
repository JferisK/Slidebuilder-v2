import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toneVars: Record<
  "primary" | "trust" | "signal" | "risk" | "deep",
  {
    bg: string;
    border: string;
    heading: string;
  }
> = {
  primary: {
    bg: "color-mix(in srgb, var(--slide-primary) 10%, var(--slide-bg))",
    border: "color-mix(in srgb, var(--slide-primary) 34%, transparent)",
    heading: "var(--slide-primary)",
  },
  trust: {
    bg: "color-mix(in srgb, var(--slide-accent) 10%, var(--slide-bg))",
    border: "color-mix(in srgb, var(--slide-accent) 32%, transparent)",
    heading: "var(--slide-accent)",
  },
  signal: {
    bg: "color-mix(in srgb, var(--ppt-accent4, var(--slide-primary)) 10%, var(--slide-bg))",
    border:
      "color-mix(in srgb, var(--ppt-accent4, var(--slide-primary)) 32%, transparent)",
    heading: "var(--ppt-accent4, var(--slide-primary))",
  },
  risk: {
    bg: "color-mix(in srgb, var(--ppt-accent6, var(--slide-accent)) 10%, var(--slide-bg))",
    border:
      "color-mix(in srgb, var(--ppt-accent6, var(--slide-accent)) 32%, transparent)",
    heading: "var(--ppt-accent6, var(--slide-accent))",
  },
  deep: {
    bg: "color-mix(in srgb, var(--slide-text) 14%, var(--slide-bg))",
    border: "color-mix(in srgb, var(--slide-text) 30%, transparent)",
    heading: "var(--slide-text)",
  },
};

const denseSlideCardVariants = cva(
  "rounded-[20px] border min-w-0",
  {
    variants: {
      tone: {
        primary: "",
        trust: "",
        signal: "",
        risk: "",
        deep: "",
      },
      density: {
        comfortable: "p-4",
        compact: "p-3",
        tight: "p-2.5",
      },
    },
    defaultVariants: {
      tone: "primary",
      density: "compact",
    },
  },
);

export interface DenseSlideCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof denseSlideCardVariants> {}

export const DenseSlideCard = React.forwardRef<HTMLDivElement, DenseSlideCardProps>(
  ({ className, tone = "primary", density = "compact", style, ...props }, ref) => {
    const palette = toneVars[tone ?? "primary"];
    return (
      <div
        ref={ref}
        className={cn(denseSlideCardVariants({ tone, density }), className)}
        style={{
          background: palette.bg,
          borderColor: palette.border,
          ...style,
        }}
        {...props}
      />
    );
  },
);
DenseSlideCard.displayName = "DenseSlideCard";

export const DenseLeadBand = React.forwardRef<
  HTMLDivElement,
  DenseSlideCardProps
>(({ className, tone = "deep", density = "compact", style, ...props }, ref) => {
  const palette = toneVars[tone ?? "deep"];
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[16px] border px-3 py-2.5 text-sm leading-snug",
        denseSlideCardVariants({ tone, density }),
        className,
      )}
      style={{
        background:
          tone === "deep"
            ? "color-mix(in srgb, var(--slide-primary) 70%, var(--slide-text))"
            : palette.bg,
        borderColor: palette.border,
        color: tone === "deep" ? "var(--slide-bg)" : "var(--slide-text)",
        fontFamily: "var(--slide-font-heading)",
        ...style,
      }}
      {...props}
    />
  );
});
DenseLeadBand.displayName = "DenseLeadBand";

const denseInsightRowVariants = cva(
  "grid grid-cols-[10px_1fr] gap-2.5 items-start py-2",
  {
    variants: {
      tone: {
        primary: "",
        trust: "",
        signal: "",
        risk: "",
        deep: "",
      },
      compact: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      tone: "primary",
      compact: true,
    },
  },
);

export interface DenseInsightRowProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof denseInsightRowVariants> {
  bullet?: React.ReactNode;
}

export const DenseInsightRow = React.forwardRef<HTMLDivElement, DenseInsightRowProps>(
  (
    {
      className,
      tone = "primary",
      compact = true,
      bullet,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const palette = toneVars[tone ?? "primary"];
    return (
      <div
        ref={ref}
        className={cn(denseInsightRowVariants({ tone, compact }), className)}
        style={{
          borderBottom:
            "1px solid color-mix(in srgb, var(--slide-text) 12%, transparent)",
          ...style,
        }}
        {...props}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            marginTop: compact ? 4 : 6,
            background: bullet ? undefined : palette.heading,
          }}
        >
          {bullet}
        </div>
        <div
          style={{
            color: "var(--slide-text)",
            fontFamily: "var(--slide-font-body)",
            fontSize: compact ? 14 : 15,
            lineHeight: compact ? 1.22 : 1.28,
          }}
        >
          {children}
        </div>
      </div>
    );
  },
);
DenseInsightRow.displayName = "DenseInsightRow";

export interface StatementStripProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof denseSlideCardVariants> {}

export const StatementStrip = React.forwardRef<HTMLDivElement, StatementStripProps>(
  ({ className, tone = "primary", density = "tight", style, ...props }, ref) => {
    const palette = toneVars[tone ?? "primary"];
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[14px] border px-3 py-2 text-center",
          denseSlideCardVariants({ tone, density }),
          className,
        )}
        style={{
          background:
            "color-mix(in srgb, var(--slide-secondary) 54%, var(--slide-bg))",
          borderColor: palette.border,
          color: "var(--slide-text)",
          fontFamily: "var(--slide-font-heading)",
          fontSize: 13,
          lineHeight: 1.2,
          ...style,
        }}
        {...props}
      />
    );
  },
);
StatementStrip.displayName = "StatementStrip";

