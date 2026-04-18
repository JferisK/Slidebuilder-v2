import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SURFACE_SOFT =
  "color-mix(in srgb, var(--slide-primary) 6%, var(--slide-bg))";
export const SURFACE_STRONG =
  "color-mix(in srgb, var(--slide-primary) 12%, var(--slide-bg))";
export const SURFACE_BORDER =
  "color-mix(in srgb, var(--slide-primary) 18%, transparent)";
export const MUTED_BORDER =
  "color-mix(in srgb, var(--slide-text) 16%, transparent)";
export const ACCENT_SOFT =
  "color-mix(in srgb, var(--slide-accent) 10%, var(--slide-bg))";
export const ACCENT_BORDER =
  "color-mix(in srgb, var(--slide-accent) 32%, transparent)";

export const MetaBadge: React.FC<{
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "destructive";
}> = ({ children, variant = "secondary" }) => (
  <Badge variant={variant} className="text-[9px]">
    {children}
  </Badge>
);

export const SectionCard: React.FC<{
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  accent?: boolean;
  icon?: React.ReactNode;
}> = ({ eyebrow, title, children, accent = false, icon }) => (
  <Card
    className="flex h-full min-h-0 flex-col"
    style={
      {
        "--card-bg": accent ? ACCENT_SOFT : SURFACE_SOFT,
        "--card-border": accent ? ACCENT_BORDER : SURFACE_BORDER,
        "--card-fg": "var(--slide-text)",
      } as React.CSSProperties
    }
  >
    <CardHeader className="gap-2 p-4 pb-2">
      <div className="flex items-start gap-2.5">
        {icon ? (
          <div
            className="flex h-8 w-8 flex-none items-center justify-center rounded-lg"
            style={{
              background: accent
                ? "color-mix(in srgb, var(--slide-accent) 18%, transparent)"
                : "color-mix(in srgb, var(--slide-primary) 16%, transparent)",
              color: accent ? "var(--slide-accent)" : "var(--slide-primary)",
            }}
          >
            {icon}
          </div>
        ) : null}
        <div className="min-w-0">
          <div
            className="text-[9px] uppercase tracking-[0.16em]"
            style={{ color: "var(--slide-text-muted)" }}
          >
            {eyebrow}
          </div>
          <CardTitle
            className="mt-0.5 text-[16px] leading-tight"
            style={{
              fontFamily: "var(--slide-font-heading)",
              color: accent ? "var(--slide-accent)" : "var(--slide-primary)",
            }}
          >
            {title}
          </CardTitle>
        </div>
      </div>
    </CardHeader>
    <CardContent
      className="flex flex-1 flex-col gap-2 p-4 pt-0 text-[11px] leading-snug"
      style={{ fontFamily: "var(--slide-font-body)" }}
    >
      {children}
    </CardContent>
  </Card>
);

export const BulletList: React.FC<{
  items: string[];
  accent?: boolean;
}> = ({ items, accent = false }) => (
  <div className="flex flex-col gap-1.5">
    {items.map((item) => (
      <div key={item} className="flex gap-2">
        <span
          className="pt-[1px] text-[12px]"
          style={{ color: accent ? "var(--slide-accent)" : "var(--slide-primary)" }}
        >
          •
        </span>
        <span>{item}</span>
      </div>
    ))}
  </div>
);

export const FooterBand: React.FC<{
  title: string;
  text: string;
}> = ({ title, text }) => (
  <div
    className="flex items-center gap-3 rounded-xl px-4 py-3"
    style={{
      background: SURFACE_STRONG,
      border: `1px solid ${MUTED_BORDER}`,
      color: "var(--slide-text)",
      fontFamily: "var(--slide-font-body)",
    }}
  >
    <div
      className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em]"
      style={{ color: "var(--slide-primary)" }}
    >
      {title}
    </div>
    <div className="text-[11px] leading-snug">{text}</div>
  </div>
);

export const OrbCluster: React.FC<{
  items: Array<{
    label: string;
    size: number;
    x: string;
    y: string;
    tone?: "primary" | "accent" | "secondary";
  }>;
}> = ({ items }) => (
  <div className="relative h-full w-full">
    {items.map((item) => {
      const bg =
        item.tone === "accent"
          ? "color-mix(in srgb, var(--slide-accent) 18%, var(--slide-bg))"
          : item.tone === "secondary"
            ? "color-mix(in srgb, var(--slide-secondary) 20%, var(--slide-bg))"
            : "color-mix(in srgb, var(--slide-primary) 16%, var(--slide-bg))";
      const border =
        item.tone === "accent"
          ? "color-mix(in srgb, var(--slide-accent) 34%, transparent)"
          : item.tone === "secondary"
            ? "color-mix(in srgb, var(--slide-secondary) 34%, transparent)"
            : "color-mix(in srgb, var(--slide-primary) 26%, transparent)";
      const color =
        item.tone === "accent" ? "var(--slide-accent)" : "var(--slide-primary)";

      return (
        <div
          key={`${item.label}-${item.x}-${item.y}`}
          className="absolute flex items-center justify-center rounded-full text-center"
          style={{
            width: item.size,
            height: item.size,
            left: item.x,
            top: item.y,
            transform: "translate(-50%, -50%)",
            background: bg,
            border: `1px solid ${border}`,
            color,
            fontFamily: "var(--slide-font-heading)",
            fontSize: item.size > 110 ? 18 : item.size > 90 ? 13 : 11,
            lineHeight: 1.1,
            padding: 10,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          {item.label}
        </div>
      );
    })}
  </div>
);
