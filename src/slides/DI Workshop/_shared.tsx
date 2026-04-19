import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  DenseInsightRow,
  DenseLeadBand,
  DenseSlideCard,
  StatementStrip,
} from "@/components/ui/slide-primitives";

export const PALETTE = {
  bg: "var(--slide-bg)",
  text: "var(--slide-text)",
  muted: "var(--slide-text-muted)",
  heading: "var(--slide-font-heading)",
  body: "var(--slide-font-body)",
  primary: "var(--ppt-accent1, var(--slide-primary))",
  trust: "var(--ppt-accent2, var(--slide-accent))",
  deep: "var(--ppt-accent3, var(--slide-text))",
  signal: "var(--ppt-accent4, var(--slide-primary))",
  ai: "var(--ppt-accent5, var(--slide-primary))",
  risk: "var(--ppt-accent6, var(--slide-accent))",
  light: "var(--ppt-lt1, var(--slide-bg))",
  secondary: "var(--ppt-lt2, var(--slide-secondary))",
  darkText: "var(--ppt-dk1, var(--slide-text))",
  support: "var(--ppt-dk2, var(--slide-text-muted))",
  hyperlink: "var(--ppt-hlink, var(--slide-primary))",
} as const;

export function mix(color: string, base: string, amount: number) {
  return `color-mix(in srgb, ${color} ${amount}%, ${base})`;
}

export const SURFACE = {
  subtle: mix(PALETTE.primary, PALETTE.bg, 6),
  strong: mix(PALETTE.primary, PALETTE.bg, 12),
  dark: mix(PALETTE.deep, PALETTE.bg, 82),
  ai: mix(PALETTE.ai, PALETTE.bg, 14),
  signal: mix(PALETTE.signal, PALETTE.bg, 14),
  risk: mix(PALETTE.risk, PALETTE.bg, 14),
  trust: mix(PALETTE.trust, PALETTE.bg, 14),
};

export const BORDER = {
  primary: mix(PALETTE.primary, "transparent", 24),
  trust: mix(PALETTE.trust, "transparent", 28),
  deep: mix(PALETTE.deep, "transparent", 26),
  signal: mix(PALETTE.signal, "transparent", 28),
  ai: mix(PALETTE.ai, "transparent", 28),
  risk: mix(PALETTE.risk, "transparent", 28),
  muted: mix(PALETTE.text, "transparent", 16),
  light: mix(PALETTE.bg, "transparent", 20),
};

export const MetaBadge: React.FC<{
  children: React.ReactNode;
  tone?: "primary" | "trust" | "deep" | "signal" | "ai" | "risk" | "outline";
}> = ({ children, tone = "primary" }) => {
  const style: React.CSSProperties =
    tone === "outline"
      ? {
          background: "transparent",
          color: PALETTE.text,
          borderColor: BORDER.muted,
        }
      : {
          background:
            tone === "trust"
              ? SURFACE.trust
              : tone === "deep"
                ? SURFACE.dark
                : tone === "signal"
                  ? SURFACE.signal
                  : tone === "ai"
                    ? SURFACE.ai
                    : tone === "risk"
                      ? SURFACE.risk
                      : SURFACE.subtle,
          color:
            tone === "trust"
              ? PALETTE.trust
              : tone === "deep"
                ? PALETTE.deep
                : tone === "signal"
                  ? PALETTE.signal
                  : tone === "ai"
                    ? PALETTE.ai
                    : tone === "risk"
                      ? PALETTE.risk
                      : PALETTE.primary,
          borderColor:
            tone === "trust"
              ? BORDER.trust
              : tone === "deep"
                ? BORDER.deep
                : tone === "signal"
                  ? BORDER.signal
                  : tone === "ai"
                    ? BORDER.ai
                    : tone === "risk"
                      ? BORDER.risk
                      : BORDER.primary,
        };

  return (
    <Badge className="text-[9px]" style={style}>
      {children}
    </Badge>
  );
};

export const HeroBand: React.FC<{
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  kicker?: React.ReactNode;
  tone?: "primary" | "deep" | "trust" | "signal" | "ai" | "risk";
}> = ({ eyebrow, title, subtitle, kicker, tone = "primary" }) => {
  const bg =
    tone === "deep"
      ? `linear-gradient(135deg, ${mix(PALETTE.deep, PALETTE.bg, 90)}, ${mix(
          PALETTE.primary,
          PALETTE.deep,
          28,
        )})`
      : tone === "trust"
        ? `linear-gradient(135deg, ${mix(PALETTE.trust, PALETTE.bg, 16)}, ${mix(
            PALETTE.primary,
            PALETTE.bg,
            10,
          )})`
        : tone === "signal"
          ? `linear-gradient(135deg, ${mix(PALETTE.signal, PALETTE.bg, 14)}, ${mix(
              PALETTE.primary,
              PALETTE.bg,
              10,
            )})`
          : tone === "ai"
            ? `linear-gradient(135deg, ${mix(PALETTE.ai, PALETTE.bg, 14)}, ${mix(
                PALETTE.signal,
                PALETTE.bg,
                10,
              )})`
            : tone === "risk"
              ? `linear-gradient(135deg, ${mix(PALETTE.risk, PALETTE.bg, 16)}, ${mix(
                  PALETTE.deep,
                  PALETTE.bg,
                  8,
                )})`
              : `linear-gradient(135deg, ${mix(PALETTE.primary, PALETTE.bg, 16)}, ${mix(
                  PALETTE.secondary,
                  PALETTE.bg,
                  65,
                )})`;

  const titleColor = tone === "deep" ? PALETTE.bg : PALETTE.primary;
  const bodyColor = tone === "deep" ? "rgba(255,255,255,0.78)" : PALETTE.muted;

  return (
    <div
      className="rounded-[26px] px-5 py-4"
      style={{ background: bg, border: `1px solid ${BORDER.primary}` }}
    >
      <div
        className="text-[10px] uppercase tracking-[0.18em]"
        style={{ color: bodyColor }}
      >
        {eyebrow}
      </div>
      <div
        className="mt-1 text-[28px] font-semibold leading-[1.02]"
        style={{ color: titleColor, fontFamily: PALETTE.heading }}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          className="mt-2 max-w-[92%] text-[12px] leading-snug"
          style={{ color: bodyColor, fontFamily: PALETTE.body }}
        >
          {subtitle}
        </div>
      ) : null}
      {kicker ? <div className="mt-3">{kicker}</div> : null}
    </div>
  );
};

export const EvidenceStat: React.FC<{
  value: string;
  label: string;
  tone?: "primary" | "trust" | "deep" | "signal" | "ai" | "risk";
}> = ({ value, label, tone = "primary" }) => {
  const valueColor =
    tone === "trust"
      ? PALETTE.trust
      : tone === "deep"
        ? PALETTE.deep
        : tone === "signal"
          ? PALETTE.signal
          : tone === "ai"
            ? PALETTE.ai
            : tone === "risk"
              ? PALETTE.risk
              : PALETTE.primary;
  const bg =
    tone === "deep"
      ? mix(PALETTE.deep, PALETTE.bg, 88)
      : tone === "trust"
        ? SURFACE.trust
        : tone === "signal"
          ? SURFACE.signal
          : tone === "ai"
            ? SURFACE.ai
            : tone === "risk"
              ? SURFACE.risk
              : SURFACE.subtle;
  const border =
    tone === "deep"
      ? BORDER.deep
      : tone === "trust"
        ? BORDER.trust
        : tone === "signal"
          ? BORDER.signal
          : tone === "ai"
            ? BORDER.ai
            : tone === "risk"
              ? BORDER.risk
              : BORDER.primary;

  return (
    <div
      className="rounded-[22px] px-4 py-3"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <div
        className="text-[26px] font-semibold leading-none"
        style={{ color: valueColor, fontFamily: PALETTE.heading }}
      >
        {value}
      </div>
      <div
        className="mt-1 text-[10px] leading-snug"
        style={{ color: PALETTE.muted, fontFamily: PALETTE.body }}
      >
        {label}
      </div>
    </div>
  );
};

export const SignalPill: React.FC<{
  label: string;
  tone?: "primary" | "trust" | "deep" | "signal" | "ai" | "risk";
}> = ({ label, tone = "primary" }) => (
  <div
    className="rounded-full px-3 py-1.5 text-[10px] font-medium"
    style={{
      background:
        tone === "trust"
          ? SURFACE.trust
          : tone === "deep"
            ? SURFACE.dark
            : tone === "signal"
              ? SURFACE.signal
              : tone === "ai"
                ? SURFACE.ai
                : tone === "risk"
                  ? SURFACE.risk
                  : SURFACE.subtle,
      color:
        tone === "trust"
          ? PALETTE.trust
          : tone === "deep"
            ? PALETTE.bg
            : tone === "signal"
              ? PALETTE.signal
              : tone === "ai"
                ? PALETTE.ai
                : tone === "risk"
                  ? PALETTE.risk
                  : PALETTE.primary,
      border: `1px solid ${
        tone === "trust"
          ? BORDER.trust
          : tone === "deep"
            ? BORDER.deep
            : tone === "signal"
              ? BORDER.signal
              : tone === "ai"
                ? BORDER.ai
                : tone === "risk"
                  ? BORDER.risk
                  : BORDER.primary
      }`,
      fontFamily: PALETTE.body,
    }}
  >
    {label}
  </div>
);

export const PaletteRibbon: React.FC<{
  items: Array<{ label: string; tone: "primary" | "trust" | "deep" | "signal" | "ai" | "risk" }>;
}> = ({ items }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((item) => (
      <SignalPill key={`${item.label}-${item.tone}`} label={item.label} tone={item.tone} />
    ))}
  </div>
);

export const LayerStack: React.FC<{
  layers: Array<{
    key: string;
    title: string;
    text: string;
    tone: "primary" | "trust" | "deep" | "signal" | "ai" | "risk";
    icon?: React.ReactNode;
  }>;
}> = ({ layers }) => (
  <div className="flex flex-col gap-3">
    {layers.map((layer, index) => {
      const toneColor =
        layer.tone === "trust"
          ? PALETTE.trust
          : layer.tone === "deep"
            ? PALETTE.deep
            : layer.tone === "signal"
              ? PALETTE.signal
              : layer.tone === "ai"
                ? PALETTE.ai
                : layer.tone === "risk"
                  ? PALETTE.risk
                  : PALETTE.primary;
      const bg =
        layer.tone === "trust"
          ? SURFACE.trust
          : layer.tone === "deep"
            ? SURFACE.dark
            : layer.tone === "signal"
              ? SURFACE.signal
              : layer.tone === "ai"
                ? SURFACE.ai
                : layer.tone === "risk"
                  ? SURFACE.risk
                  : SURFACE.subtle;
      const border =
        layer.tone === "trust"
          ? BORDER.trust
          : layer.tone === "deep"
            ? BORDER.deep
            : layer.tone === "signal"
              ? BORDER.signal
              : layer.tone === "ai"
                ? BORDER.ai
                : layer.tone === "risk"
                  ? BORDER.risk
                  : BORDER.primary;

      return (
        <div key={layer.key} className="flex flex-col gap-2">
          <div
            className="grid grid-cols-[44px_1fr] gap-3 rounded-[22px] px-4 py-3"
            style={{ background: bg, border: `1px solid ${border}` }}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{
                background: mix(toneColor, PALETTE.bg, 16),
                color: toneColor,
              }}
            >
              {layer.icon ?? (
                <span
                  className="text-[12px] font-semibold"
                  style={{ fontFamily: PALETTE.heading }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}
            </div>
            <div>
              <div
                className="text-[14px] font-semibold leading-tight"
                style={{
                  color: toneColor,
                  fontFamily: PALETTE.heading,
                }}
              >
                {layer.title}
              </div>
              <div
                className="mt-1 text-[10px] leading-snug"
                style={{
                  color: layer.tone === "deep" ? "rgba(255,255,255,0.76)" : PALETTE.muted,
                  fontFamily: PALETTE.body,
                }}
              >
                {layer.text}
              </div>
            </div>
          </div>
          {index < layers.length - 1 ? (
            <div className="flex justify-center">
              <div
                className="h-4 w-[2px] rounded-full"
                style={{ background: mix(toneColor, "transparent", 55) }}
              />
            </div>
          ) : null}
        </div>
      );
    })}
  </div>
);

export const FlowConnector: React.FC<{
  orientation?: "horizontal" | "vertical";
  tone?: "primary" | "trust" | "deep" | "signal" | "ai" | "risk";
  length?: number | string;
}> = ({ orientation = "horizontal", tone = "primary", length }) => {
  const color =
    tone === "trust"
      ? PALETTE.trust
      : tone === "deep"
        ? PALETTE.deep
        : tone === "signal"
          ? PALETTE.signal
          : tone === "ai"
            ? PALETTE.ai
            : tone === "risk"
              ? PALETTE.risk
              : PALETTE.primary;

  return (
    <div
      style={{
        width: orientation === "horizontal" ? length ?? "100%" : 2,
        height: orientation === "vertical" ? length ?? "100%" : 2,
        background: mix(color, "transparent", 58),
        borderRadius: 999,
      }}
    />
  );
};

export const RiskSurface: React.FC<{
  center: React.ReactNode;
  nodes: Array<{
    key: string;
    label: string;
    x: string;
    y: string;
    size: number;
    tone: "primary" | "trust" | "deep" | "signal" | "ai" | "risk";
  }>;
}> = ({ center, nodes }) => (
  <div className="relative h-full w-full">
    <div
      className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[32px] text-center"
      style={{
        background: `linear-gradient(160deg, ${mix(PALETTE.risk, PALETTE.bg, 16)}, ${mix(
          PALETTE.deep,
          PALETTE.bg,
          92,
        )})`,
        border: `1px solid ${BORDER.risk}`,
        color: PALETTE.bg,
        boxShadow: `0 24px 48px ${mix(PALETTE.deep, "transparent", 22)}`,
      }}
    >
      {center}
    </div>
    {nodes.map((node) => {
      const toneColor =
        node.tone === "trust"
          ? PALETTE.trust
          : node.tone === "deep"
            ? PALETTE.deep
            : node.tone === "signal"
              ? PALETTE.signal
              : node.tone === "ai"
                ? PALETTE.ai
                : node.tone === "risk"
                  ? PALETTE.risk
                  : PALETTE.primary;
      const bg =
        node.tone === "trust"
          ? SURFACE.trust
          : node.tone === "deep"
            ? mix(PALETTE.deep, PALETTE.bg, 88)
            : node.tone === "signal"
              ? SURFACE.signal
              : node.tone === "ai"
                ? SURFACE.ai
                : node.tone === "risk"
                  ? SURFACE.risk
                  : SURFACE.subtle;
      const border =
        node.tone === "trust"
          ? BORDER.trust
          : node.tone === "deep"
            ? BORDER.deep
            : node.tone === "signal"
              ? BORDER.signal
              : node.tone === "ai"
                ? BORDER.ai
                : node.tone === "risk"
                  ? BORDER.risk
                  : BORDER.primary;

      return (
        <div
          key={node.key}
          className="absolute flex items-center justify-center rounded-[24px] px-3 text-center"
          style={{
            left: node.x,
            top: node.y,
            width: node.size,
            height: node.size,
            transform: "translate(-50%, -50%)",
            background: bg,
            border: `1px solid ${border}`,
            color: toneColor,
            fontFamily: PALETTE.heading,
            fontSize: node.size > 100 ? 16 : 12,
            lineHeight: 1.08,
            boxShadow: `0 10px 24px ${mix(toneColor, "transparent", 10)}`,
          }}
        >
          {node.label}
        </div>
      );
    })}
  </div>
);

export const GovernanceBoard: React.FC<{
  items: Array<{
    key: string;
    title: string;
    text: string;
    icon: React.ReactNode;
    tone: "primary" | "trust" | "deep" | "signal" | "ai" | "risk";
  }>;
}> = ({ items }) => (
  <div className="grid grid-cols-2 gap-3">
    {items.map((item) => {
      const toneColor =
        item.tone === "trust"
          ? PALETTE.trust
          : item.tone === "deep"
            ? PALETTE.deep
            : item.tone === "signal"
              ? PALETTE.signal
              : item.tone === "ai"
                ? PALETTE.ai
                : item.tone === "risk"
                  ? PALETTE.risk
                  : PALETTE.primary;
      const bg =
        item.tone === "trust"
          ? SURFACE.trust
          : item.tone === "deep"
            ? mix(PALETTE.deep, PALETTE.bg, 90)
            : item.tone === "signal"
              ? SURFACE.signal
              : item.tone === "ai"
                ? SURFACE.ai
                : item.tone === "risk"
                  ? SURFACE.risk
                  : SURFACE.subtle;
      const border =
        item.tone === "trust"
          ? BORDER.trust
          : item.tone === "deep"
            ? BORDER.deep
            : item.tone === "signal"
              ? BORDER.signal
              : item.tone === "ai"
                ? BORDER.ai
                : item.tone === "risk"
                  ? BORDER.risk
                  : BORDER.primary;

      return (
        <div
          key={item.key}
          className="rounded-[22px] p-4"
          style={{ background: bg, border: `1px solid ${border}` }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-9 w-9 flex-none items-center justify-center rounded-xl"
              style={{
                background: mix(toneColor, PALETTE.bg, 16),
                color: toneColor,
              }}
            >
              {item.icon}
            </div>
            <div className="min-w-0">
              <div
                className="text-[14px] font-semibold leading-tight"
                style={{ color: toneColor, fontFamily: PALETTE.heading }}
              >
                {item.title}
              </div>
              <div
                className="mt-1 text-[10px] leading-snug"
                style={{
                  color: item.tone === "deep" ? "rgba(255,255,255,0.76)" : PALETTE.muted,
                  fontFamily: PALETTE.body,
                }}
              >
                {item.text}
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export const LegendStrip: React.FC<{
  items: Array<{ label: string; tone: "primary" | "trust" | "deep" | "signal" | "ai" | "risk" }>;
}> = ({ items }) => (
  <div
    className="flex flex-wrap gap-3 rounded-[20px] px-4 py-3"
    style={{
      background: mix(PALETTE.secondary, PALETTE.bg, 72),
      border: `1px solid ${BORDER.muted}`,
    }}
  >
    {items.map((item) => (
      <div key={`${item.label}-${item.tone}`} className="flex items-center gap-2">
        <span
          className="h-3 w-3 rounded-full"
          style={{
            background:
              item.tone === "trust"
                ? PALETTE.trust
                : item.tone === "deep"
                  ? PALETTE.deep
                  : item.tone === "signal"
                    ? PALETTE.signal
                    : item.tone === "ai"
                      ? PALETTE.ai
                      : item.tone === "risk"
                        ? PALETTE.risk
                        : PALETTE.primary,
          }}
        />
        <span
          className="text-[10px]"
          style={{ color: PALETTE.muted, fontFamily: PALETTE.body }}
        >
          {item.label}
        </span>
      </div>
    ))}
  </div>
);

export const FooterBand: React.FC<{
  title: string;
  text: string;
  tone?: "primary" | "trust" | "deep" | "signal" | "ai" | "risk";
}> = ({ title, text, tone = "primary" }) => {
  const bg =
    tone === "trust"
      ? SURFACE.trust
      : tone === "deep"
        ? mix(PALETTE.deep, PALETTE.bg, 88)
        : tone === "signal"
          ? SURFACE.signal
          : tone === "ai"
            ? SURFACE.ai
            : tone === "risk"
              ? SURFACE.risk
              : SURFACE.strong;
  const titleColor =
    tone === "trust"
      ? PALETTE.trust
      : tone === "deep"
        ? PALETTE.deep
        : tone === "signal"
          ? PALETTE.signal
          : tone === "ai"
            ? PALETTE.ai
            : tone === "risk"
              ? PALETTE.risk
              : PALETTE.primary;

  return (
    <div
      className="flex items-center gap-3 rounded-[22px] px-4 py-3"
      style={{ background: bg, border: `1px solid ${BORDER.muted}` }}
    >
      <div
        className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em]"
        style={{ color: titleColor, fontFamily: PALETTE.heading }}
      >
        {title}
      </div>
      <div
        className="text-[11px] leading-snug"
        style={{ color: PALETTE.text, fontFamily: PALETTE.body }}
      >
        {text}
      </div>
    </div>
  );
};

type Tone = "primary" | "trust" | "deep" | "signal" | "ai" | "risk";

function toneColor(tone: Tone) {
  if (tone === "trust") return PALETTE.trust;
  if (tone === "deep") return PALETTE.deep;
  if (tone === "signal") return PALETTE.signal;
  if (tone === "ai") return PALETTE.ai;
  if (tone === "risk") return PALETTE.risk;
  return PALETTE.primary;
}

function toneSurface(tone: Tone) {
  if (tone === "trust") return SURFACE.trust;
  if (tone === "deep") return SURFACE.dark;
  if (tone === "signal") return SURFACE.signal;
  if (tone === "ai") return SURFACE.ai;
  if (tone === "risk") return SURFACE.risk;
  return SURFACE.subtle;
}

function toneBorder(tone: Tone) {
  if (tone === "trust") return BORDER.trust;
  if (tone === "deep") return BORDER.deep;
  if (tone === "signal") return BORDER.signal;
  if (tone === "ai") return BORDER.ai;
  if (tone === "risk") return BORDER.risk;
  return BORDER.primary;
}

export const StandardTitle: React.FC<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  tags?: Array<{ label: string; tone?: Tone | "outline" }>;
}> = ({ eyebrow, title, subtitle, tags = [] }) => (
  <div
    className="flex h-full w-full items-center justify-between gap-4"
    style={{ fontFamily: PALETTE.body }}
  >
    <div className="min-w-0 flex-1">
      {eyebrow ? (
        <div
          className="text-[10px] uppercase tracking-[0.18em]"
          style={{ color: PALETTE.muted }}
        >
          {eyebrow}
        </div>
      ) : null}
      <div
        className="text-[28px] font-semibold leading-[1.02]"
        style={{ color: PALETTE.primary, fontFamily: PALETTE.heading }}
      >
        {title}
      </div>
      {subtitle ? (
        <div className="mt-1 text-[12px]" style={{ color: PALETTE.muted }}>
          {subtitle}
        </div>
      ) : null}
    </div>
    {tags.length > 0 ? (
      <div className="flex flex-none flex-wrap justify-end gap-1.5">
        {tags.map((tag) => (
          <MetaBadge key={`${tag.label}-${tag.tone ?? "primary"}`} tone={tag.tone}>
            {tag.label}
          </MetaBadge>
        ))}
      </div>
    ) : null}
  </div>
);

export const SurfacePanel: React.FC<{
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}> = ({ children, tone = "primary", className }) => (
  <div
    className={`rounded-[24px] border p-4 ${className ?? ""}`}
    style={{
      background: toneSurface(tone),
      borderColor: toneBorder(tone),
    }}
  >
    {children}
  </div>
);

export const SectionLead: React.FC<{
  eyebrow?: string;
  title: string;
  text?: string;
  tone?: Tone;
}> = ({ eyebrow, title, text, tone = "primary" }) => (
  <div>
    {eyebrow ? (
      <div
        className="text-[10px] uppercase tracking-[0.16em]"
        style={{ color: PALETTE.muted }}
      >
        {eyebrow}
      </div>
    ) : null}
    <div
      className="text-[22px] font-semibold leading-[1.04]"
      style={{ color: toneColor(tone), fontFamily: PALETTE.heading }}
    >
      {title}
    </div>
    {text ? (
      <div className="mt-2 text-[12px] leading-snug" style={{ color: PALETTE.text }}>
        {text}
      </div>
    ) : null}
  </div>
);

export const KeyTakeawaysList: React.FC<{
  items: string[];
  tone?: Tone;
}> = ({ items, tone = "primary" }) => (
  <div className="flex flex-col gap-2">
    {items.map((item, index) => (
      <div
        key={`${item}-${index}`}
        className="grid grid-cols-[auto_1fr] gap-3 rounded-[20px] border px-4 py-3"
        style={{
          background: index % 2 === 0 ? toneSurface(tone) : mix(PALETTE.secondary, PALETTE.bg, 76),
          borderColor: toneBorder(tone),
        }}
      >
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold"
          style={{
            background: mix(toneColor(tone), PALETTE.bg, 14),
            color: toneColor(tone),
            fontFamily: PALETTE.heading,
          }}
        >
          {index + 1}
        </div>
        <div className="text-[12px] leading-snug" style={{ color: PALETTE.text }}>
          {item}
        </div>
      </div>
    ))}
  </div>
);

export const CardGrid: React.FC<{
  items: Array<{ title: string; text: string; tone?: Tone }>;
  columns?: 2 | 3;
}> = ({ items, columns = 3 }) => (
  <div className={`grid h-full gap-3 ${columns === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
    {items.map((item, index) => {
      const tone = item.tone ?? (index % 2 === 0 ? "primary" : "trust");
      return (
        <SurfacePanel key={`${item.title}-${index}`} tone={tone} className="flex flex-col">
          <div
            className="text-[10px] uppercase tracking-[0.14em]"
            style={{ color: toneColor(tone) }}
          >
            {item.title}
          </div>
          <div className="mt-2 text-[12px] leading-snug" style={{ color: PALETTE.text }}>
            {item.text}
          </div>
        </SurfacePanel>
      );
    })}
  </div>
);

export const ProcessSteps: React.FC<{
  steps: Array<{ title: string; text?: string }>;
  tone?: Tone;
}> = ({ steps, tone = "primary" }) => (
  <div className="grid h-full grid-cols-1 gap-3">
    <div className={`grid gap-3 ${steps.length <= 3 ? "grid-cols-3" : "grid-cols-6"}`}>
      {steps.map((step, index) => (
        <div key={`${step.title}-${index}`} className="flex min-w-0 items-stretch gap-3">
          <div className="flex flex-1 flex-col rounded-[22px] border px-4 py-4"
            style={{ background: index === 0 ? toneSurface(tone) : mix(PALETTE.secondary, PALETTE.bg, 78), borderColor: toneBorder(tone) }}
          >
            <div className="text-[10px] uppercase tracking-[0.15em]" style={{ color: toneColor(tone) }}>
              Schritt {index + 1}
            </div>
            <div className="mt-2 text-[14px] font-semibold leading-tight" style={{ color: PALETTE.primary, fontFamily: PALETTE.heading }}>
              {step.title}
            </div>
            {step.text ? (
              <div className="mt-2 text-[10px] leading-snug" style={{ color: PALETTE.muted }}>
                {step.text}
              </div>
            ) : null}
          </div>
          {index < steps.length - 1 ? (
            <div className="flex items-center">
              <div className="h-[2px] w-full rounded-full" style={{ background: mix(toneColor(tone), "transparent", 52) }} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  </div>
);

export const PrinciplePanel: React.FC<{
  definition: string;
  question: string;
  points: string[];
  risk: string;
  tone?: Tone;
}> = ({ definition, question, points, risk, tone = "primary" }) => (
  <div className="grid h-full grid-cols-[1.05fr_0.95fr] gap-4">
    <SurfacePanel tone={tone} className="flex flex-col gap-4">
      <SectionLead eyebrow="Prinzip" title={definition} tone={tone} />
      <div
        className="rounded-[20px] border px-4 py-4"
        style={{
          background: mix(PALETTE.bg, toneColor(tone), 8),
          borderColor: toneBorder(tone),
        }}
      >
        <div
          className="text-[10px] uppercase tracking-[0.16em]"
          style={{ color: PALETTE.muted }}
        >
          Leitfrage
        </div>
        <div
          className="mt-2 text-[18px] font-semibold leading-tight"
          style={{ color: PALETTE.primary, fontFamily: PALETTE.heading }}
        >
          {question}
        </div>
      </div>
    </SurfacePanel>
    <div className="grid grid-rows-[1fr_auto] gap-4">
      <SurfacePanel tone="trust">
        <div
          className="text-[10px] uppercase tracking-[0.16em]"
          style={{ color: PALETTE.trust }}
        >
          Wichtige Punkte
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {points.map((point, index) => (
            <div key={`${point}-${index}`} className="grid grid-cols-[auto_1fr] gap-3">
              <span style={{ color: PALETTE.trust }}>•</span>
              <span className="text-[11px] leading-snug" style={{ color: PALETTE.text }}>
                {point}
              </span>
            </div>
          ))}
        </div>
      </SurfacePanel>
      <FooterBand title="Risiko" text={risk} tone="risk" />
    </div>
  </div>
);

export const ComparisonColumns: React.FC<{
  left: { title: string; question: string; focus: string };
  right: { title: string; question: string; focus: string };
  takeaway: string;
}> = ({ left, right, takeaway }) => (
  <div className="grid h-full grid-rows-[1fr_auto] gap-4">
    <div className="grid grid-cols-2 gap-4">
      {[left, right].map((col, index) => {
        const tone: Tone = index === 0 ? "primary" : "trust";
        return (
          <SurfacePanel key={col.title} tone={tone} className="flex flex-col gap-4">
            <div
              className="text-[10px] uppercase tracking-[0.16em]"
              style={{ color: toneColor(tone) }}
            >
              {col.title}
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.15em]" style={{ color: PALETTE.muted }}>
                Leitfrage
              </div>
              <div
                className="mt-1 text-[20px] font-semibold leading-tight"
                style={{ color: PALETTE.primary, fontFamily: PALETTE.heading }}
              >
                {col.question}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.15em]" style={{ color: PALETTE.muted }}>
                Fokus
              </div>
              <div className="mt-1 text-[12px] leading-snug" style={{ color: PALETTE.text }}>
                {col.focus}
              </div>
            </div>
          </SurfacePanel>
        );
      })}
    </div>
    <FooterBand title="Merksatz" text={takeaway} tone="signal" />
  </div>
);

export const ReflectionGrid: React.FC<{
  items: string[];
}> = ({ items }) => (
  <div className="grid h-full grid-cols-3 gap-4">
    {items.map((item, index) => (
      <SurfacePanel key={`${item}-${index}`} tone={index === 1 ? "trust" : "primary"} className="flex items-center">
        <div className="text-[16px] font-semibold leading-tight" style={{ color: PALETTE.primary, fontFamily: PALETTE.heading }}>
          {item}
        </div>
      </SurfacePanel>
    ))}
  </div>
);

export const CenteredPrompt: React.FC<{
  title: string;
  subtitle?: string;
  points?: string[];
}> = ({ title, subtitle, points = [] }) => (
  <div className="flex h-full flex-col items-center justify-center text-center">
    <div
      className="text-[34px] font-semibold leading-[1.05]"
      style={{ color: PALETTE.primary, fontFamily: PALETTE.heading }}
    >
      {title}
    </div>
    {subtitle ? (
      <div className="mt-3 max-w-[68%] text-[13px] leading-snug" style={{ color: PALETTE.muted }}>
        {subtitle}
      </div>
    ) : null}
    {points.length > 0 ? (
      <div className="mt-6 flex max-w-[78%] flex-col gap-2">
        {points.map((point, index) => (
          <div key={`${point}-${index}`} className="text-[12px] leading-snug" style={{ color: PALETTE.text }}>
            {point}
          </div>
        ))}
      </div>
    ) : null}
  </div>
);

export const EditorialLeadBand = DenseLeadBand;
export const DenseEditorialCard = DenseSlideCard;
export const DenseBulletRow = DenseInsightRow;
export const DenseStatementStrip = StatementStrip;
