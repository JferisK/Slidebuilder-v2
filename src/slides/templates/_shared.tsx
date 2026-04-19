import * as React from "react";

// Theme-aware wireframe primitives.
//
// Colors come from CSS custom properties set by DynamicSlide (see
// `themeStyle = theme.cssVars` in src/components/DynamicSlide.tsx).
// That means any slide rendered inside DynamicSlide can reference:
//   --slide-bg, --slide-primary, --slide-secondary, --slide-accent,
//   --slide-text, --slide-text-muted, --slide-font-heading, --slide-font-body
//
// Rule (see AGENTS.md §3 — Theme Contract): never hardcode Tailwind color
// classes in a slide template. Tailwind is for layout/spacing only.

type WireVariant = "default" | "title" | "metric" | "chart" | "accent" | "muted" | "dark";

type WireStyle = {
  backgroundColor: string;
  borderColor: string;
  color: string;
};

// Tint helper — a transparent version of a CSS var, for soft fills.
const tint = (cssVar: string, percent: number) =>
  `color-mix(in srgb, var(${cssVar}) ${percent}%, transparent)`;

const variantStyles: Record<WireVariant, WireStyle> = {
  default: {
    backgroundColor: tint("--slide-secondary", 70),
    borderColor: "var(--slide-text-muted)",
    color: "var(--slide-text-muted)",
  },
  title: {
    backgroundColor: "var(--slide-bg)",
    borderColor: "var(--slide-primary)",
    color: "var(--slide-primary)",
  },
  metric: {
    backgroundColor: "var(--slide-bg)",
    borderColor: "var(--slide-primary)",
    color: "var(--slide-text)",
  },
  chart: {
    backgroundColor: tint("--slide-secondary", 50),
    borderColor: "var(--slide-text-muted)",
    color: "var(--slide-text-muted)",
  },
  accent: {
    backgroundColor: tint("--slide-accent", 15),
    borderColor: "var(--slide-accent)",
    color: "var(--slide-accent)",
  },
  muted: {
    backgroundColor: tint("--slide-secondary", 40),
    borderColor: tint("--slide-text-muted", 50),
    color: tint("--slide-text-muted", 70),
  },
  dark: {
    backgroundColor: "var(--slide-primary)",
    borderColor: "var(--slide-primary)",
    color: "var(--slide-bg)",
  },
};

export const WireBlock: React.FC<{
  label: string;
  variant?: WireVariant;
  className?: string;
  style?: React.CSSProperties;
  hint?: string;
  children?: React.ReactNode;
}> = ({ label, variant = "default", className = "", style, hint, children }) => (
  <div
    className={`flex flex-col justify-center items-center text-center border-2 border-dashed rounded-md p-1.5 overflow-hidden ${className}`}
    style={{ ...variantStyles[variant], ...style }}
  >
    <span className="text-[11px] leading-tight uppercase tracking-wide font-semibold">
      {label}
    </span>
    {hint ? (
      <span className="text-[9px] leading-tight opacity-70 mt-0.5">{hint}</span>
    ) : null}
    {children}
  </div>
);

export const WireGrid: React.FC<{
  className?: string;
  children: React.ReactNode;
  rows?: number;
}> = ({ className = "", children, rows }) => (
  <div
    className={`grid grid-cols-12 gap-2 h-full w-full p-2 ${className}`}
    style={rows ? { gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` } : undefined}
  >
    {children}
  </div>
);

export const WireTitle: React.FC<{ label: string; hint?: string }> = ({
  label,
  hint,
}) => <WireBlock label={label} hint={hint} variant="title" className="h-full w-full" />;

export const WireLegend: React.FC<{ items: string[] }> = ({ items }) => (
  <div
    className="flex flex-wrap gap-1 text-[9px]"
    style={{ color: "var(--slide-text-muted)" }}
  >
    {items.map((it, i) => (
      <span
        key={i}
        className="border border-dashed rounded px-1 py-0.5"
        style={{ borderColor: tint("--slide-text-muted", 50) }}
      >
        {it}
      </span>
    ))}
  </div>
);
