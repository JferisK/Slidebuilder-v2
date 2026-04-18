import * as React from "react";

type WireVariant = "default" | "title" | "metric" | "chart" | "accent" | "muted" | "dark";

const variantClasses: Record<WireVariant, string> = {
  default: "bg-slate-100/70 border-slate-400 text-slate-600",
  title: "bg-slate-50 border-slate-500 text-slate-800",
  metric: "bg-white border-slate-500 text-slate-700",
  chart: "bg-slate-50 border-slate-400 text-slate-500",
  accent: "bg-amber-50 border-amber-500 text-amber-800",
  muted: "bg-slate-50/60 border-slate-300 text-slate-400",
  dark: "bg-slate-700 border-slate-500 text-slate-100",
};

export const WireBlock: React.FC<{
  label: string;
  variant?: WireVariant;
  className?: string;
  hint?: string;
  children?: React.ReactNode;
}> = ({ label, variant = "default", className = "", hint, children }) => (
  <div
    className={`flex flex-col justify-center items-center text-center border-2 border-dashed rounded-md p-1.5 overflow-hidden ${variantClasses[variant]} ${className}`}
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
  <div className="flex flex-wrap gap-1 text-[9px] text-slate-500">
    {items.map((it, i) => (
      <span
        key={i}
        className="border border-slate-300 border-dashed rounded px-1 py-0.5"
      >
        {it}
      </span>
    ))}
  </div>
);
