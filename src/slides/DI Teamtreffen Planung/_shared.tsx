import * as React from "react";
import { Badge } from "@/components/ui/badge";

const tint = (cssVar: string, percent: number) =>
  `color-mix(in srgb, var(${cssVar}) ${percent}%, transparent)`;

const blend = (color: string, base: string, percent: number) =>
  `color-mix(in srgb, ${color} ${percent}%, ${base})`;

export const TEMPLATE_COLORS = {
  panel: blend("var(--slide-secondary)", "var(--slide-bg)", 72),
  panelSoft: blend("var(--slide-secondary)", "var(--slide-bg)", 42),
  panelLift: blend("var(--slide-primary)", "var(--slide-bg)", 8),
  border: tint("--slide-primary", 16),
  borderMuted: tint("--slide-text-muted", 24),
  accentSoft: blend("var(--slide-accent)", "var(--slide-bg)", 12),
  accentLift: blend("var(--slide-accent)", "var(--slide-bg)", 20),
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
    className="border px-2.5 py-1 text-[8.5px] font-medium uppercase tracking-[0.18em]"
    style={{
      background:
        tone === "accent"
          ? blend("var(--slide-accent)", "var(--slide-bg)", 10)
          : tone === "muted"
            ? blend("var(--slide-secondary)", "var(--slide-bg)", 24)
            : blend("var(--slide-primary)", "var(--slide-bg)", 6),
      color:
        tone === "accent"
          ? TEMPLATE_COLORS.accent
          : tone === "muted"
            ? TEMPLATE_COLORS.textMuted
            : TEMPLATE_COLORS.primary,
      borderColor:
        tone === "accent"
          ? tint("--slide-accent", 38)
          : tone === "muted"
            ? TEMPLATE_COLORS.borderMuted
            : tint("--slide-primary", 22),
      borderRadius: 8,
      fontFamily: TEMPLATE_COLORS.body,
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
    className="flex h-full w-full items-start justify-between gap-5 border px-5 py-4"
    style={{
      background: `linear-gradient(180deg, ${blend("var(--slide-primary)", "var(--slide-bg)", 4)}, ${blend("var(--slide-bg)", "white", 98)})`,
      borderColor: tint("--slide-primary", 18),
      borderRadius: 14,
      boxShadow: `inset 0 4px 0 ${tint("--slide-primary", 76)}`,
    }}
  >
    <div className="min-w-0 flex-1">
      <div
        className="text-[9px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: TEMPLATE_COLORS.textMuted, fontFamily: TEMPLATE_COLORS.body }}
      >
        {eyebrow}
      </div>
      <div
        className="mt-2 max-w-[88%] text-[24px] font-semibold leading-[1.02]"
        style={{ color: TEMPLATE_COLORS.primary, fontFamily: TEMPLATE_COLORS.heading }}
      >
        {title}
      </div>
      <div
        className="mt-3 max-w-[78%] text-[10.5px] leading-[1.45]"
        style={{ color: TEMPLATE_COLORS.textMuted, fontFamily: TEMPLATE_COLORS.body }}
      >
        {subtitle}
      </div>
    </div>
    <div className="flex max-w-[30%] flex-wrap justify-end gap-1.5 pt-0.5">
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
    className={`grid h-full w-full gap-3.5 border p-4 ${className}`}
    style={{
      background: `linear-gradient(180deg, ${blend("var(--slide-secondary)", "var(--slide-bg)", 22)}, ${blend("var(--slide-bg)", "white", 99)})`,
      borderColor: tint("--slide-primary", 16),
      borderRadius: 16,
      boxShadow: `inset 0 1px 0 ${tint("--slide-bg", 70)}`,
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
    className={`flex h-full flex-col border px-4 py-3.5 ${className}`}
    style={{
      background:
        tone === "accent"
          ? `linear-gradient(180deg, ${blend("var(--slide-accent)", "var(--slide-bg)", 8)}, ${blend("var(--slide-bg)", "white", 99)})`
          : `linear-gradient(180deg, ${blend("var(--slide-secondary)", "var(--slide-bg)", 24)}, ${TEMPLATE_COLORS.bg})`,
      borderColor:
        tone === "accent" ? tint("--slide-accent", 26) : tint("--slide-text-muted", 18),
      borderRadius: 14,
      boxShadow:
        tone === "accent"
          ? `inset 4px 0 0 ${tint("--slide-accent", 72)}`
          : `inset 4px 0 0 ${tint("--slide-primary", 20)}`,
    }}
  >
    <div
      className="text-[9px] font-semibold uppercase tracking-[0.2em]"
      style={{
        color: tone === "accent" ? TEMPLATE_COLORS.accent : TEMPLATE_COLORS.textMuted,
        fontFamily: TEMPLATE_COLORS.body,
      }}
    >
      {label}
    </div>
    <div
      className="mt-2.5 text-[14px] font-semibold leading-[1.18]"
      style={{ color: TEMPLATE_COLORS.text, fontFamily: TEMPLATE_COLORS.heading }}
    >
      {prompt}
    </div>
    {hint ? (
      <div
        className="mt-3 border-t pt-3 text-[9.5px] leading-[1.45]"
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
    className="border px-4 py-3"
    style={{
      background: accent
        ? `linear-gradient(180deg, ${blend("var(--slide-accent)", "var(--slide-bg)", 7)}, ${blend("var(--slide-bg)", "white", 99)})`
        : `linear-gradient(180deg, ${blend("var(--slide-secondary)", "var(--slide-bg)", 18)}, ${TEMPLATE_COLORS.bg})`,
      borderColor: accent ? tint("--slide-accent", 22) : tint("--slide-text-muted", 18),
      borderRadius: 14,
    }}
  >
    <div
      className="text-[9px] font-semibold uppercase tracking-[0.2em]"
      style={{
        color: accent ? TEMPLATE_COLORS.accent : TEMPLATE_COLORS.textMuted,
        fontFamily: TEMPLATE_COLORS.body,
      }}
    >
      {title}
    </div>
    <div className="mt-3 flex flex-col gap-2.5">
      {items.map((item, index) => (
        <div
          key={item}
          className="grid grid-cols-[18px_1fr] gap-2.5 border-t px-0 pt-2.5 text-[10.5px] leading-[1.42]"
          style={{
            color: TEMPLATE_COLORS.text,
            fontFamily: TEMPLATE_COLORS.body,
          }}
        >
          <div
            className="flex h-[18px] w-[18px] items-center justify-center border text-[8px] font-semibold"
            style={{
              color: accent ? TEMPLATE_COLORS.accent : TEMPLATE_COLORS.primary,
              borderColor: accent ? tint("--slide-accent", 32) : tint("--slide-primary", 24),
              background: accent
                ? blend("var(--slide-accent)", "var(--slide-bg)", 8)
                : blend("var(--slide-primary)", "var(--slide-bg)", 5),
              borderRadius: 4,
              fontFamily: TEMPLATE_COLORS.heading,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
          <div>{item}</div>
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
    className="border px-3 py-1 text-[8.5px] font-semibold uppercase tracking-[0.16em]"
    style={{
      background:
        tone === "accent"
          ? blend("var(--slide-accent)", "var(--slide-bg)", 8)
          : blend("var(--slide-primary)", "var(--slide-bg)", 4),
      color: tone === "accent" ? TEMPLATE_COLORS.accent : TEMPLATE_COLORS.textMuted,
      borderColor: tone === "accent" ? tint("--slide-accent", 26) : tint("--slide-text-muted", 18),
      borderRadius: 6,
      fontFamily: TEMPLATE_COLORS.body,
    }}
  >
    {label}
  </div>
);
