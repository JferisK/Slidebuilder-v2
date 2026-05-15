import * as React from "react";
import type { CodeSlide } from "../types";
import { WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Was zeigt die Zahl?"
    hint="Flash-Report / Executive Summary"
  />
);

const ContentWire: React.FC = () => (
  <div className="h-full w-full p-2 flex flex-col items-center justify-center gap-3">
    <div className="border-4 border-dashed border-slate-500 rounded-xl px-10 py-6 bg-white flex flex-col items-center">
      <span className="text-[50px] leading-none font-bold text-slate-700">
        ## %
      </span>
      <span className="text-[11px] uppercase tracking-widest text-slate-500 mt-2">
        Hero-Metrik
      </span>
    </div>
    <div className="border-2 border-dashed border-slate-400 rounded px-4 py-1 text-[10px] uppercase tracking-wide text-slate-500 bg-slate-50">
      Baseline / Vorjahr / Budget: xx · Delta +/-
    </div>
  </div>
);

export const MetricBaseline: CodeSlide = {
  id: "metric-baseline",
  name: "19 · Metric + Baseline (Answer Hero)",
  description:
    "Extrem reduzierte Folie: eine dominante Zahl in der Mitte, darunter klein Vergleichswert (Vorjahr / Budget). Für Keynote-Slides und Flash-Reports ans Board.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "Hero-Metrik zentriert + Baseline",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default MetricBaseline;
