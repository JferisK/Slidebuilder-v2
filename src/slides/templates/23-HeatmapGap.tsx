import * as React from "react";
import type { CodeSlide } from "../types";
import { WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Lücken-Analyse / Reifegrad"
    hint="z. B. Kompetenz-Matrix"
  />
);

const cellColor = (v: number) =>
  v === 3
    ? "bg-emerald-300"
    : v === 2
    ? "bg-emerald-100"
    : v === 1
    ? "bg-amber-100"
    : "bg-rose-200";

const rows = [
  { name: "Thema A", values: [3, 2, 1, 0, 2, 3] },
  { name: "Thema B", values: [2, 2, 3, 1, 0, 1] },
  { name: "Thema C", values: [0, 1, 1, 2, 2, 3] },
  { name: "Thema D", values: [1, 3, 2, 3, 3, 2] },
  { name: "Thema E", values: [3, 3, 0, 2, 1, 0] },
];

const ContentWire: React.FC = () => (
  <WireGrid>
    <div className="col-span-12 h-full border-2 border-dashed border-slate-400 rounded-md p-2 flex flex-col">
      <div className="grid grid-cols-7 gap-1 text-[9px] font-semibold text-slate-500 uppercase mb-1">
        <div />
        {["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"].map((q) => (
          <div key={q} className="text-center">
            {q}
          </div>
        ))}
      </div>
      {rows.map((r) => (
        <div key={r.name} className="grid grid-cols-7 gap-1 flex-1 mb-1">
          <div className="text-[10px] text-slate-600 flex items-center font-semibold">
            {r.name}
          </div>
          {r.values.map((v, i) => (
            <div
              key={i}
              className={`border border-dashed border-slate-400 rounded ${cellColor(v)}`}
            />
          ))}
        </div>
      ))}
      <div className="text-[9px] text-slate-500 italic mt-1">
        Legende: Rot = Gap · Amber = Teil-Reife · Grün = Erfüllt
      </div>
    </div>
  </WireGrid>
);

export const HeatmapGap: CodeSlide = {
  id: "heatmap-gap",
  name: "23 · Heatmap / Gap-Analyse",
  description:
    "Matrix-Tabelle mit farblich hinterlegten Zellen (Rot → Grün), um kritische Lücken sichtbar zu machen. Für Kompetenz-Matrizen, IT-Reifegrade und Risiko-Inventare.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "Heatmap-Tabelle mit Farb-Kodierung",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default HeatmapGap;
