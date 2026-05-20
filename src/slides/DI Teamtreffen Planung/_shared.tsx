import * as React from "react";
import { Badge } from "@/components/ui/badge";

const tint = (cssVar: string, percent: number) =>
  `color-mix(in srgb, var(${cssVar}) ${percent}%, transparent)`;

export const TEMPLATE_COLORS = {
  panel: tint("--slide-secondary", 62),
  panelSoft: tint("--slide-secondary", 34),
  border: tint("--slide-primary", 22),
  borderMuted: tint("--slide-text-muted", 40),
  accentSoft: tint("--slide-accent", 14),
  text: "var(--slide-text)",
  textMuted: "var(--slide-text-muted)",
  primary: "var(--slide-primary)",
  accent: "var(--slide-accent)",
  heading: "var(--slide-font-heading)",
  body: "var(--slide-font-body)",
  bg: "var(--slide-bg)",
} as const;

export const TemplateBadge: React.FC<{
  children: React.ReactNode;
  tone?: "primary" | "accent" | "muted";
}> = ({ children, tone = "primary" }) => (
  <Badge
    className="border text-[9px] uppercase tracking-[0.14em]"
    style={{
      background:
        tone === "accent"
          ? TEMPLATE_COLORS.accentSoft
          : tone === "muted"
            ? TEMPLATE_COLORS.panelSoft
            : TEMPLATE_COLORS.panel,
      color:
        tone === "accent"
          ? TEMPLATE_COLORS.accent
          : tone === "muted"
            ? TEMPLATE_COLORS.textMuted
            : TEMPLATE_COLORS.primary,
      borderColor:
        tone === "accent"
          ? TEMPLATE_COLORS.accent
          : tone === "muted"
            ? TEMPLATE_COLORS.borderMuted
            : TEMPLATE_COLORS.border,
    }}
  >
    {children}
  </Badge>
);

export const TemplateTitle: React.FC<{
  eyebrow: string;
  title: string;
  subtitle: string;
  badges: string[];
}> = ({ eyebrow, title, subtitle, badges }) => (
  <div
    className="flex h-full w-full items-center justify-between gap-4 rounded-[24px] border px-5 py-4"
    style={{
      background: `linear-gradient(135deg, ${TEMPLATE_COLORS.panel}, ${tint("--slide-bg", 94)})`,
      borderColor: TEMPLATE_COLORS.border,
    }}
  >
    <div className="min-w-0">
      <div
        className="text-[10px] uppercase tracking-[0.2em]"
        style={{ color: TEMPLATE_COLORS.textMuted, fontFamily: TEMPLATE_COLORS.body }}
      >
        {eyebrow}
      </div>
      <div
        className="mt-1 text-[27px] font-semibold leading-[1.04]"
        style={{ color: TEMPLATE_COLORS.primary, fontFamily: TEMPLATE_COLORS.heading }}
      >
        {title}
      </div>
      <div
        className="mt-2 max-w-[88%] text-[11px] leading-snug"
        style={{ color: TEMPLATE_COLORS.textMuted, fontFamily: TEMPLATE_COLORS.body }}
      >
        {subtitle}
      </div>
    </div>
    <div className="flex max-w-[34%] flex-wrap justify-end gap-1.5">
      {badges.map((badge, index) => (
        <TemplateBadge key={badge} tone={index === 0 ? "accent" : "primary"}>
          {badge}
        </TemplateBadge>
      ))}
    </div>
  </div>
);

export const CanvasFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div
    className={`grid h-full w-full gap-3 rounded-[28px] border p-4 ${className}`}
    style={{
      background: `linear-gradient(180deg, ${TEMPLATE_COLORS.panelSoft}, ${tint("--slide-bg", 96)})`,
      borderColor: TEMPLATE_COLORS.border,
    }}
  >
    {children}
  </div>
);

export const PromptCard: React.FC<{
  label: string;
  prompt: string;
  hint?: string;
  tone?: "default" | "accent";
  className?: string;
}> = ({ label, prompt, hint, tone = "default", className = "" }) => (
  <div
    className={`flex h-full flex-col rounded-[22px] border border-dashed px-4 py-3 ${className}`}
    style={{
      background:
        tone === "accent" ? TEMPLATE_COLORS.accentSoft : TEMPLATE_COLORS.bg,
      borderColor:
        tone === "accent" ? TEMPLATE_COLORS.accent : TEMPLATE_COLORS.borderMuted,
    }}
  >
    <div
      className="text-[10px] uppercase tracking-[0.18em]"
      style={{
        color: tone === "accent" ? TEMPLATE_COLORS.accent : TEMPLATE_COLORS.textMuted,
        fontFamily: TEMPLATE_COLORS.body,
      }}
    >
      {label}
    </div>
    <div
      className="mt-2 text-[15px] font-semibold leading-tight"
      style={{ color: TEMPLATE_COLORS.text, fontFamily: TEMPLATE_COLORS.heading }}
    >
      {prompt}
    </div>
    {hint ? (
      <div
        className="mt-2 text-[10px] leading-snug"
        style={{ color: TEMPLATE_COLORS.textMuted, fontFamily: TEMPLATE_COLORS.body }}
      >
        {hint}
      </div>
    ) : null}
  </div>
);

export const PromptList: React.FC<{
  title: string;
  items: string[];
  accent?: boolean;
}> = ({ title, items, accent = false }) => (
  <div
    className="rounded-[22px] border px-4 py-3"
    style={{
      background: accent ? TEMPLATE_COLORS.accentSoft : TEMPLATE_COLORS.bg,
      borderColor: accent ? TEMPLATE_COLORS.accent : TEMPLATE_COLORS.borderMuted,
    }}
  >
    <div
      className="text-[10px] uppercase tracking-[0.18em]"
      style={{
        color: accent ? TEMPLATE_COLORS.accent : TEMPLATE_COLORS.textMuted,
        fontFamily: TEMPLATE_COLORS.body,
      }}
    >
      {title}
    </div>
    <div className="mt-3 flex flex-col gap-2">
      {items.map((item) => (
        <div
          key={item}
          className="rounded-[16px] border border-dashed px-3 py-2 text-[11px] leading-snug"
          style={{
            borderColor: accent ? TEMPLATE_COLORS.accent : TEMPLATE_COLORS.borderMuted,
            color: TEMPLATE_COLORS.text,
            fontFamily: TEMPLATE_COLORS.body,
          }}
        >
          {item}
        </div>
      ))}
    </div>
  </div>
);

export const SegmentPill: React.FC<{ label: string; tone?: "default" | "accent" }> = ({
  label,
  tone = "default",
}) => (
  <div
    className="rounded-full border border-dashed px-3 py-1 text-[10px]"
    style={{
      background: tone === "accent" ? TEMPLATE_COLORS.accentSoft : TEMPLATE_COLORS.bg,
      color: tone === "accent" ? TEMPLATE_COLORS.accent : TEMPLATE_COLORS.textMuted,
      borderColor: tone === "accent" ? TEMPLATE_COLORS.accent : TEMPLATE_COLORS.borderMuted,
      fontFamily: TEMPLATE_COLORS.body,
    }}
  >
    {label}
  </div>
);
