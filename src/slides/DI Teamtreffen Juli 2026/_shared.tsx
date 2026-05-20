import * as React from "react";
import {
  CanvasFrame,
  SegmentPill,
  TEMPLATE_COLORS,
  TemplateBadge,
} from "../DI Teamtreffen Planung/_shared";

const tint = (cssVar: string, percent: number) =>
  `color-mix(in srgb, var(${cssVar}) ${percent}%, transparent)`;

const blend = (color: string, base: string, percent: number) =>
  `color-mix(in srgb, ${color} ${percent}%, ${base})`;

export type IdeaGroup = {
  title: string;
  items: string[];
  kicker?: string;
  tone?: "default" | "accent";
  className?: string;
  emphasis?: "normal" | "strong";
};

export const UpdatePackTitle: React.FC<{
  eyebrow: string;
  title: string;
  subtitle: string;
  badges: string[];
}> = ({ eyebrow, title, subtitle, badges }) => (
  <div
    className="flex h-full w-full items-start justify-between gap-4 overflow-hidden border px-4 py-2.5"
    style={{
      background: `linear-gradient(180deg, ${blend("var(--slide-primary)", "var(--slide-bg)", 4)}, ${blend("var(--slide-bg)", "white", 98)})`,
      borderColor: tint("--slide-primary", 18),
      borderRadius: 6,
      boxShadow: `inset 0 3px 0 ${tint("--slide-primary", 76)}`,
    }}
  >
    <div className="min-w-0 flex-1">
      <div
        className="text-[8px] font-semibold uppercase tracking-[0.2em]"
        style={{ color: TEMPLATE_COLORS.textMuted, fontFamily: TEMPLATE_COLORS.body }}
      >
        {eyebrow}
      </div>
      <div
        className="mt-1 max-w-[92%] text-[20px] font-semibold leading-[1.02]"
        style={{ color: TEMPLATE_COLORS.primary, fontFamily: TEMPLATE_COLORS.heading }}
      >
        {title}
      </div>
      <div
        className="mt-1.5 max-w-[85%] text-[9px] leading-[1.35]"
        style={{ color: TEMPLATE_COLORS.textMuted, fontFamily: TEMPLATE_COLORS.body }}
      >
        {subtitle}
      </div>
    </div>
    <div className="flex max-w-[32%] flex-wrap justify-end gap-1 pt-0.5">
      {badges.map((badge, index) => (
        <TemplateBadge key={badge} tone={index === 0 ? "accent" : "primary"}>
          {badge}
        </TemplateBadge>
      ))}
    </div>
  </div>
);

export const GroupedIdeaGrid: React.FC<{
  groups: IdeaGroup[];
  intro: string;
  className?: string;
  headerLabel?: string;
  headerPill?: string;
}> = ({
  groups,
  intro,
  className = "",
  headerLabel = "Brain-Teaser-Boxen",
  headerPill = "Gruppiert fuer das Grid",
}) => (
  <div className={`grid h-full min-h-0 w-full grid-cols-12 grid-rows-12 gap-3 ${className}`}>
      {groups.map((group) => (
        <div
          key={group.title}
          className={`flex h-full min-h-0 flex-col overflow-hidden border px-3.5 py-3 ${group.className ?? ""}`}
          style={{
            background: TEMPLATE_COLORS.bg,
            borderColor:
              group.tone === "accent"
                ? tint("--slide-accent", 24)
                : tint("--slide-text-muted", 18),
            borderRadius: 4,
          }}
        >
          {group.kicker ? (
            <div
              className="mb-1 text-[9px]"
              style={{ color: TEMPLATE_COLORS.textMuted, fontFamily: TEMPLATE_COLORS.body }}
            >
              {group.kicker}
            </div>
          ) : null}
          <div
            className={group.emphasis === "strong" ? "text-[14px] font-semibold leading-[1.15]" : "text-[12px] font-semibold leading-[1.2]"}
            style={{ color: TEMPLATE_COLORS.text, fontFamily: TEMPLATE_COLORS.heading }}
          >
            {group.title}
          </div>
          <div className={group.emphasis === "strong" ? "mt-2.5 flex min-h-0 flex-col gap-2" : "mt-2 flex min-h-0 flex-col gap-1.5"}>
            {group.items.map((item, index) => (
              <div
                key={item}
                className={group.emphasis === "strong" ? "text-[10.5px] leading-[1.45]" : "text-[10px] leading-[1.45]"}
                style={{ color: TEMPLATE_COLORS.textMuted, fontFamily: TEMPLATE_COLORS.body }}
              >
                <div>{`- ${item}`}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
  </div>
);

export { CanvasFrame, SegmentPill, TEMPLATE_COLORS, TemplateBadge };