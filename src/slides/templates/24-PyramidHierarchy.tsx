import * as React from "react";
import type { CodeSlide } from "../types";
import { WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Hierarchie / Wertemodell"
    hint="z. B. Maslow, Markenpyramide"
  />
);

const Layer: React.FC<{ label: string; hint: string; widthPct: number; variant: "top" | "mid" | "base" }> = ({
  label,
  hint,
  widthPct,
  variant,
}) => {
  const color =
    variant === "top"
      ? "bg-amber-100 border-amber-500"
      : variant === "mid"
      ? "bg-slate-100 border-slate-500"
      : "bg-slate-50 border-slate-400";
  return (
    <div className="flex justify-center">
      <div
        className={`border-2 border-dashed rounded-md px-3 py-2 flex flex-col items-center text-center ${color}`}
        style={{ width: `${widthPct}%` }}
      >
        <span className="text-[11px] uppercase tracking-wide font-semibold text-slate-700">
          {label}
        </span>
        <span className="text-[9px] text-slate-500 mt-0.5">{hint}</span>
      </div>
    </div>
  );
};

const ContentWire: React.FC = () => (
  <WireGrid>
    <div className="col-span-12 flex flex-col justify-between gap-2 h-full">
      <Layer label="Spitze" hint="Top-Priorität" widthPct={35} variant="top" />
      <Layer label="Oberes Segment" hint="Sekundäre Ebene" widthPct={55} variant="mid" />
      <Layer label="Mittleres Segment" hint="Kern-Elemente" widthPct={75} variant="mid" />
      <Layer label="Basis / Fundament" hint="Grundvoraussetzungen" widthPct={95} variant="base" />
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
