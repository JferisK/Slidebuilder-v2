// ★ CANONICAL REFERENCE — theme-aware slide template.
//
// This file is linked from AGENTS.md §3 (Theme Contract). When authoring a new
// CodeSlide, read this one first and mirror the pattern:
//   • colors come exclusively from var(--slide-*) inline styles
//   • tints use color-mix(in srgb, var(--slide-X) N%, transparent)
//   • widths use % (responsive), never fixed pixels
//   • Tailwind remains allowed for layout (flex, grid, spacing, font-size)
//
// If you replace/refactor this file, update the AGENTS.md reference too.

import * as React from "react";
import type { CodeSlide } from "../types";
import { WireGrid, WireTitle } from "./_shared";

const tint = (cssVar: string, percent: number) =>
  `color-mix(in srgb, var(${cssVar}) ${percent}%, transparent)`;

type LayerTone = "top" | "mid" | "base";

const toneStyles: Record<LayerTone, { bg: string; border: string; label: string; hint: string }> = {
  top: {
    bg: tint("--slide-accent", 20),
    border: "var(--slide-accent)",
    label: "var(--slide-accent)",
    hint: tint("--slide-accent", 70),
  },
  mid: {
    bg: tint("--slide-secondary", 70),
    border: "var(--slide-primary)",
    label: "var(--slide-primary)",
    hint: "var(--slide-text-muted)",
  },
  base: {
    bg: tint("--slide-secondary", 40),
    border: "var(--slide-text-muted)",
    label: "var(--slide-text-muted)",
    hint: tint("--slide-text-muted", 70),
  },
};

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Hierarchie / Wertemodell"
    hint="z. B. Maslow, Markenpyramide"
  />
);

const Layer: React.FC<{
  label: string;
  hint: string;
  widthPct: number;
  tone: LayerTone;
}> = ({ label, hint, widthPct, tone }) => {
  const s = toneStyles[tone];
  return (
    <div className="flex justify-center">
      <div
        className="border-2 border-dashed rounded-md px-3 py-2 flex flex-col items-center text-center"
        style={{
          width: `${widthPct}%`,
          backgroundColor: s.bg,
          borderColor: s.border,
        }}
      >
        <span
          className="text-[11px] uppercase tracking-wide font-semibold"
          style={{ color: s.label }}
        >
          {label}
        </span>
        <span className="text-[9px] mt-0.5" style={{ color: s.hint }}>
          {hint}
        </span>
      </div>
    </div>
  );
};

const ContentWire: React.FC = () => (
  <WireGrid>
    <div className="col-span-12 flex flex-col justify-between gap-2 h-full">
      <Layer label="Spitze" hint="Top-Priorität" widthPct={35} tone="top" />
      <Layer label="Oberes Segment" hint="Sekundäre Ebene" widthPct={55} tone="mid" />
      <Layer label="Mittleres Segment" hint="Kern-Elemente" widthPct={75} tone="mid" />
      <Layer label="Basis / Fundament" hint="Grundvoraussetzungen" widthPct={95} tone="base" />
    </div>
  </WireGrid>
);

export const PyramidHierarchy: CodeSlide = {
  id: "pyramid-hierarchy",
  name: "24 · Pyramid / Hierarchie",
  description:
    "Pyramidenförmig gestapelte Schichten (Spitze → Basis) für Wertehierarchien, organisatorische Prioritäten oder Markenpyramiden. Intuitive Darstellung von Wichtigkeit und Fundament.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "Schichten mit abnehmender Breite nach oben",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default PyramidHierarchy;
